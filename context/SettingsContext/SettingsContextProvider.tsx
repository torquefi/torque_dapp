import { SUPPORTED_CHAIN_IDS } from '@/config/chains'
import { ORACLE_KEEPER_INSTANCES_CONFIG_KEY } from '@/constants/localStorage'
import { getOracleKeeperRandomIndex } from '@/constants/oracleKeeper'
import { useLocalStorageSerializeKey } from '@/lib/localStorage'
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useMemo,
} from 'react'

export type SettingsContextType = {
  oracleKeeperInstancesConfig: { [chainId: number]: number }
  setOracleKeeperInstancesConfig: Dispatch<
    SetStateAction<{ [chainId: number]: number } | undefined>
  >
}

export const SettingsContext = createContext({})

export function useSettings() {
  return useContext(SettingsContext) as SettingsContextType
}

export function SettingsContextProvider({ children }: { children: ReactNode }) {
  const [oracleKeeperInstancesConfig, setOracleKeeperInstancesConfig] =
    useLocalStorageSerializeKey(
      ORACLE_KEEPER_INSTANCES_CONFIG_KEY,
      SUPPORTED_CHAIN_IDS.reduce((acc, chainId) => {
        acc[chainId] = getOracleKeeperRandomIndex(chainId)
        return acc
      }, {} as { [chainId: number]: number })
    )

  const contextState: SettingsContextType = useMemo(() => {
    return {
      oracleKeeperInstancesConfig: oracleKeeperInstancesConfig!,
      setOracleKeeperInstancesConfig,
    }
  }, [oracleKeeperInstancesConfig, setOracleKeeperInstancesConfig])

  return (
    <SettingsContext.Provider value={contextState}>
      {children}
    </SettingsContext.Provider>
  )
}
