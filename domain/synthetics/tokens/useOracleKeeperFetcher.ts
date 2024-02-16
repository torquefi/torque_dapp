import { getOracleKeeperNextIndex, getOracleKeeperUrl } from "@/constants/oracleKeeper";
import { useSettings } from "@/context/SettingsContext/SettingsContextProvider";
import { buildUrl } from "@/lib/buildUrl";
import { useLocalStorageSerializeKey } from "@/lib/localStorage";
import { useMemo } from "react";

export type TickersResponse = {
  minPrice: string;
  maxPrice: string;
  oracleDecimals: number;
  tokenSymbol: string;
  tokenAddress: string;
  updatedAt: number;
}[];

export type DayPriceCandle = {
  tokenSymbol: string;
  high: number;
  low: number;
  open: number;
  close: number;
};

export type RawIncentivesStats = {
  lp: {
    isActive: boolean;
    totalRewards: string;
    period: number;
    rewardsPerMarket: Record<string, string>;
  };
  migration: {
    isActive: boolean;
    maxRebateBps: number;
    period: number;
  };
  trading:
    | {
        isActive: true;
        rebatePercent: number;
        allocation: string;
        period: number;
      }
    | {
        isActive: false;
      };
};

export type OracleKeeperFetcher = ReturnType<typeof useOracleKeeperFetcher>;

// function parseOracleCandle(rawCandle: number[]): Bar {
//   const [timestamp, open, high, low, close] = rawCandle;

//   return {
//     time: timestamp + timezoneOffset,
//     open,
//     high,
//     low,
//     close,
//   };
// }

let fallbackThrottleTimerId: any;

export function useOracleKeeperFetcher(chainId: number) {
  const { oracleKeeperInstancesConfig, setOracleKeeperInstancesConfig } = useSettings();
  const oracleKeeperIndex = oracleKeeperInstancesConfig[chainId];
  const oracleKeeperUrl = getOracleKeeperUrl(chainId, oracleKeeperIndex);
  const [forceIncentivesActive] = useLocalStorageSerializeKey("forceIncentivesActive", false);

  return useMemo(() => {
    const switchOracleKeeper = () => {
      if (fallbackThrottleTimerId) {
        return;
      }

      const nextIndex = getOracleKeeperNextIndex(chainId, oracleKeeperIndex);

      if (nextIndex === oracleKeeperIndex) {
        // eslint-disable-next-line no-console
        console.error(`no available oracle keeper for chain ${chainId}`);
        return;
      }

      // eslint-disable-next-line no-console
      console.log(`switch oracle keeper to ${getOracleKeeperUrl(chainId, nextIndex)}`);

      setOracleKeeperInstancesConfig((old) => {
        return { ...old, [chainId]: nextIndex };
      });

      fallbackThrottleTimerId = setTimeout(() => {
        fallbackThrottleTimerId = undefined;
      }, 5000);
    };

    function fetchTickers(): Promise<TickersResponse> {
      return fetch(buildUrl(oracleKeeperUrl!, "/prices/tickers"))
        .then((res) => res.json())
        .then((res) => {
          if (!res.length) {
            throw new Error("Invalid tickers response");
          }

          return res;
        })
        .catch((e) => {
          // eslint-disable-next-line no-console
          console.error(e);
          switchOracleKeeper();

          throw e;
        });
    }


    return {
      oracleKeeperUrl,
      fetchTickers,
    };
  }, [chainId, forceIncentivesActive, oracleKeeperIndex, oracleKeeperUrl, setOracleKeeperInstancesConfig]);
}
