import Multicall from '@/abis/Multicall.json'
import Token from '@/abis/Token.json'
import { getContract } from '@/configs/contracts'
import { getV2Tokens, NATIVE_TOKEN_ADDRESS } from '@/configs/tokens'
import { useMulticall } from '@/lib/multicall'
import { TokenBalancesData } from './types'
import { BigNumber } from 'ethers'
import { useAccount } from 'wagmi'

type BalancesDataResult = {
  balancesData?: TokenBalancesData
}

export function useTokenBalances(
  chainId: number,
  overrideAccount?: string | undefined
): BalancesDataResult {
  const { address: currentAccount } = useAccount()
  const account = overrideAccount ?? currentAccount

  const { data } = useMulticall(chainId, 'useTokenBalances', {
    key: account ? [account] : null,
    request: () =>
      getV2Tokens(chainId)?.reduce((acc: any, token) => {
        // Skip synthetic tokens
        if (token.isSynthetic) return acc

        const address = token.address

        if (address === NATIVE_TOKEN_ADDRESS) {
          acc[address] = {
            contractAddress: getContract(chainId, 'Multicall'),
            abi: Multicall.abi,
            calls: {
              balance: {
                methodName: 'getEthBalance',
                params: [account],
              },
            },
          }
        } else {
          acc[address] = {
            contractAddress: address,
            abi: Token.abi,
            calls: {
              balance: {
                methodName: 'balanceOf',
                params: [account],
              },
            },
          }
        }

        return acc
      }, {}),
    parseResponse: (res) =>
      Object.keys(res.data).reduce(
        (tokenBalances: TokenBalancesData, tokenAddress) => {
          tokenBalances[tokenAddress] = BigNumber.from(
            res.data[tokenAddress].balance.returnValues[0]
          )

          return tokenBalances
        },
        {} as TokenBalancesData
      ),
  })

  return {
    balancesData: data,
  }
}
