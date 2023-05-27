import HoverIndicator from '@/components/common/HoverIndicator'
import Modal from '@/components/common/Modal'
import { Injected, WalletConnect } from '@/configs/connector'
import { useWeb3React } from '@web3-react/core'
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
  const { activate } = useWeb3React()

  const onConnectMetamaskWallet = async () => {
    try {
      // await enableWeb3({ provider: 'metamask' })
      // const { account, chainId } = Moralis

      // const { message } = await Moralis.Cloud.run('requestMessage', {
      //   address: account,
      //   chain: parseInt(chainId, 16),
      //   networkType: 'evm',
      // })
      try {
        await activate(Injected)
        await authenticate({
          signingMessage: 'Welcome to Torque',
          throwOnError: true,
        })
      } catch (e) {
        console.log(e)
      }
      handleClose()
    } catch (e) {
      console.log(e)
    }
  }

  const onConnectWalletConnect = async () => {
    try {
      await activate(WalletConnect)
    } catch (e) {
      console.log(e)
    }
  }

  const connectors = [
    {
      name: 'MetaMask',
      icon: '/assets/wallet/metamask.svg',
      action: async () => {
        await onConnectMetamaskWallet()
      },
      message: 'Connect to your MetaMask wallet',
    },
    {
      name: 'WalletConnect',
      icon: '/assets/wallet/wallet-connect.svg',
      action: async () => {
        await onConnectWalletConnect()
        handleClose()
      },
      message: 'Scan with WalletConnect to connect',
    },
  ]

  return (
    <>
      <Modal
        className="w-full max-w-[500px]  bg-[#FCFAFF] p-[12px] dark:bg-[#030303]"
        open={open}
        handleClose={handleClose}
        hideCloseIcon
      >
        <HoverIndicator
          direction="vertical"
          divider
          indicatorClassName="!rounded-[18px] "
        >
          {connectors.map((item, i) => (
            <div
              className="flex h-[200px] cursor-pointer flex-col items-center justify-center space-y-2 text-center text-[#404040] dark:text-white"
              key={i}
              onClick={item.action}
            >
              <img className="w-[64px]" src={item.icon} alt="" />
              <p className="font-larken  text-[20px]">{item.name}</p>
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
