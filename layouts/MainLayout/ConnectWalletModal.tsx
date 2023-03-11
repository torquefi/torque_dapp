import HoverIndicator from '@/components/common/HoverIndicator'
import Modal from '@/components/common/Modal'
import { useEffect, useRef, useState } from 'react'
import { useMoralis } from 'react-moralis'

interface ConnectWalletModalProps {
  open: boolean
  handleClose: () => void
}

export default function ConnectWalletModal({
  open,
  handleClose,
}: ConnectWalletModalProps) {
  const { authenticate } = useMoralis()

  const connectors = [
    {
      name: 'MetaMask',
      icon: '/assets/wallet/metamask.svg',
      action: async () => {
        await authenticate({ signingMessage: 'Welcome to Torque' })
        handleClose()
      },
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
                Connect to your {item.name} wallet
              </p>
            </div>
          ))}
        </HoverIndicator>
      </Modal>
    </>
  )
}
