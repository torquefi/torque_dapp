import HoverIndicator from '@/components/common/HoverIndicator'
import Modal from '@/components/common/Modal'
import { AppStore } from '@/types/store'
import { useWeb3Modal, useWeb3ModalTheme } from '@web3modal/react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useConnect } from 'wagmi'

interface ConnectWalletModalProps {
  openModal: boolean
  handleClose: () => void
}

export default function ConnectWalletModal({
  openModal,
  handleClose,
}: ConnectWalletModalProps) {
  const { setTheme } = useWeb3ModalTheme()
  const { open } = useWeb3Modal()
  const { connect, connectors } = useConnect()

  const theme = useSelector((store: AppStore) => store.theme.theme)

  useEffect(() => {
    setTheme({
      themeMode: theme === 'light' ? 'light' : 'dark',
      themeVariables: {
        '--w3m-accent-color': '#AA5BFF',
        '--w3m-background-color': '#AA5BFF',
        '--w3m-overlay-backdrop-filter': 'blur(4px)',
        '--w3m-z-index': '999'
      },
    })
  }, [theme])

  const CONNECTORS = [
    {
      name: 'MetaMask',
      icon: '/assets/wallet/metamask.svg',
      action: async () => {
        await connect({ connector: connectors[1] })
        handleClose()
      },
      message: 'Connect to your MetaMask wallet',
    },
    {
      name: 'WalletConnect',
      icon: '/assets/wallet/wallet-connect.svg',
      action: async () => {
        await open()
        handleClose()
      },
      message: 'Scan with WalletConnect to connect',
    },
  ]

  return (
    <Modal
      className="w-full max-w-[500px] bg-[#FFFFFF] p-[12px] dark:bg-[#030303]"
      open={openModal}
      handleClose={handleClose}
      hideCloseIcon
    >
      <HoverIndicator
        direction="vertical"
        divider
        indicatorClassName="!rounded-[18px] "
      >
        {CONNECTORS.map((item, i) => (
          <div
            className="flex h-[200px] cursor-pointer  flex-col items-center justify-center space-y-2 text-center text-[#030303] dark:text-white"
            key={i}
            onClick={item.action}
          >
            <img className="w-[64px]" src={item.icon} alt="" />
            <p className="font-rogan  text-[20px]">{item.name}</p>
            <p className="text-[12px] text-[#959595] xs:text-[14px] sm:text-[16px]">
              {item.message}
            </p>
            {i == 0 && (
              <div
                className={
                  ` absolute bottom-0 left-0 h-[1px] w-full` +
                  `
              ${theme === 'light'
                    ? 'bg-gradient-divider-light'
                    : 'bg-gradient-divider'
                  }
               `
                }
              />
            )}
          </div>
        ))}
      </HoverIndicator>
    </Modal>
  )
}
