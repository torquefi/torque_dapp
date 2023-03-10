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
  const [activeTabIndex, setActiveTabIndex] = useState(null)
  const menuContainer = useRef<HTMLDivElement>(null)
  const menuIndicator = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    const handleUpdateIndicatorPosition = () => {
      if (menuIndicator.current && menuContainer.current) {
        if (activeTabIndex === null) {
          menuIndicator.current.style.opacity = '0'
        } else {
          const menuRect = menuContainer.current.getBoundingClientRect()
          const top = (menuRect.height / connectors.length) * activeTabIndex
          menuIndicator.current.style.top = `${top}px`
          menuIndicator.current.style.opacity = '1'
        }
      }
    }
    handleUpdateIndicatorPosition()
    window.addEventListener('resize', handleUpdateIndicatorPosition)
    return () => {
      window.removeEventListener('resize', handleUpdateIndicatorPosition)
    }
  }, [activeTabIndex])

  return (
    <>
      <Modal
        className="w-full max-w-[500px] p-[12px]"
        open={open}
        handleClose={handleClose}
        hideCloseIcon
      >
        <div ref={menuContainer} className="relative">
          <div
            className="absolute left-0 h-[200px] w-full rounded-[18px] bg-gradient-to-br from-[#1c1c1c] to-[#101010] transition-all duration-300"
            ref={menuIndicator}
          ></div>
          <div className="bg-gradient-divider absolute inset-x-0 top-1/2 h-[1px]" />
          {connectors.map((item, i) => (
            <div
              className="relative flex h-[200px] cursor-pointer flex-col items-center justify-center space-y-2 text-center"
              key={i}
              onClick={item.action}
              onMouseEnter={() => setActiveTabIndex(i)}
              onMouseLeave={() => setActiveTabIndex(null)}
            >
              <img className="w-[64px]" src={item.icon} alt="" />
              <p className="font-larken text-[20px]">{item.name}</p>
              <p className="text-[12px] text-[#959595] xs:text-[14px] sm:text-[16px]">
                Connect to your {item.name} wallet
              </p>
            </div>
          ))}
        </div>
      </Modal>
    </>
  )
}
