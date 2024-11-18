import { EXECUTION_FEE_CONFIG_V2, SUPPORTED_CHAIN_IDS } from '@/configs/chains'
import {
  getExecutionFeeBufferBpsKey,
  ORACLE_KEEPER_INSTANCES_CONFIG_KEY,
} from '@/constants/localStorage'
import { getOracleKeeperRandomIndex } from '@/constants/oracleKeeper'
import { useLocalStorageSerializeKey } from '@/lib/localStorage'
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
} from 'react'
import { useChainId } from 'wagmi'

export type SettingsContextType = {
  executionFeeBufferBps: number | undefined
  setExecutionFeeBufferBps: (val: number) => void
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
  const chainId = useChainId()

  const [executionFeeBufferBps, setExecutionFeeBufferBps] =
    useLocalStorageSerializeKey(
      getExecutionFeeBufferBpsKey(chainId),
      EXECUTION_FEE_CONFIG_V2[chainId]?.defaultBufferBps
    )
  const shouldUseExecutionFeeBuffer = Boolean(
    EXECUTION_FEE_CONFIG_V2[chainId].defaultBufferBps
  )

  const [oracleKeeperInstancesConfig, setOracleKeeperInstancesConfig] =
    useLocalStorageSerializeKey(
      ORACLE_KEEPER_INSTANCES_CONFIG_KEY,
      SUPPORTED_CHAIN_IDS.reduce((acc, chainId) => {
        acc[chainId] = getOracleKeeperRandomIndex(chainId)
        return acc
      }, {} as { [chainId: number]: number })
    )

  useEffect(() => {
    if (shouldUseExecutionFeeBuffer && executionFeeBufferBps === undefined) {
      setExecutionFeeBufferBps(
        EXECUTION_FEE_CONFIG_V2[chainId].defaultBufferBps
      )
    }
  }, [
    chainId,
    executionFeeBufferBps,
    setExecutionFeeBufferBps,
    shouldUseExecutionFeeBuffer,
  ])

  const contextState: SettingsContextType = useMemo(() => {
    return {
      executionFeeBufferBps,
      setExecutionFeeBufferBps,
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
