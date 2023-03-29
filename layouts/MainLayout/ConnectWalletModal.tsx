import HoverIndicator from '@/components/common/HoverIndicator'
import Modal from '@/components/common/Modal'
import { useEffect, useRef, useState } from 'react'
import { useMoralis } from 'react-moralis'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { useAccount, useConnect, useSignMessage, useDisconnect } from 'wagmi'
import { useAuthRequestChallengeEvm } from '@moralisweb3/next'
import { useDispatch } from 'react-redux'
import { updateAddress } from '@/lib/redux/auth/auth'

interface ConnectWalletModalProps {
  open: boolean
  handleClose: () => void
}

export default function ConnectWalletModal({
  open,
  handleClose,
}: ConnectWalletModalProps) {
  const dispath = useDispatch()
  const { authenticate } = useMoralis()
  const { connectAsync } = useConnect()
  const { disconnectAsync } = useDisconnect()
  const { isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const { requestChallengeAsync } = useAuthRequestChallengeEvm()

  const onConnectWallet = async () => {
    try {
      const { account, chain } = await connectAsync({
        connector: new MetaMaskConnector(),
      })
      console.log('account, chain', account, chain)
      dispath(updateAddress(account as any))
      handleClose()
      const { message } = await requestChallengeAsync({
        address: account,
        chainId: chain.id,
      })

      const signature = await signMessageAsync({ message })
    } catch (e) {
      console.log(e)
    }
  }

  const connectors = [
    {
      name: 'MetaMask',
      icon: '/assets/wallet/metamask.svg',
      action: async () => {
        await onConnectWallet()
      },
      message: 'Connect to your MetaMask wallet',
    },
    {
      name: 'WalletConnect',
      icon: '/assets/wallet/wallet-connect.svg',
      action: async () => {
        await authenticate({
          signingMessage: 'Welcome to Torque',
          provider: 'walletconnect',
        })
        handleClose()
      },
      message: 'Scan with WalletConnect to connect',
    },
  ]

  return (
    <>
      <Modal
        className="w-full max-w-[500px] p-[12px]"
        open={open}
        handleClose={handleClose}
        hideCloseIcon
      >
        <HoverIndicator
          direction="vertical"
          divider
          indicatorClassName="!rounded-[18px]"
        >
          {connectors.map((item, i) => (
            <div
              className="flex h-[200px] cursor-pointer flex-col items-center justify-center space-y-2 text-center"
              key={i}
              onClick={item.action}
            >
              <img className="w-[64px]" src={item.icon} alt="" />
              <p className="font-larken text-[20px]">{item.name}</p>
              <p className="text-[12px] text-[#959595] xs:text-[14px] sm:text-[16px]">
                {item.message}
              </p>
            </div>
          ))}
        </HoverIndicator>
      </Modal>
    </>
  )
}
