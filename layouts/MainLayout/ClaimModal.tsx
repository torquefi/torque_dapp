import HoverIndicator from '@/components/common/HoverIndicator'
import Modal from '@/components/common/Modal'
import { AppStore } from '@/types/store'
import { useWeb3Modal, useWeb3ModalTheme } from '@web3modal/react'
import { useEffect, useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { useConnect } from 'wagmi'

interface ClaimModalProps {
  openModal: boolean
  handleClose: () => void
}

export default function ClaimModal({
  openModal,
  handleClose,
}: ClaimModalProps) {

  const [torqPrice, setTorqPrice] = useState('0.00');
  const [torqMarketCap, setTorqMarketCap] = useState('0.00m');

  const circulatingSupply = 11121512940; // 11.1 billion

  useEffect(() => {
    const fetchTorqData = async () => {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=torque&vs_currencies=usd');
        const price = parseFloat(response.data.torque.usd);
        
        setTorqPrice(price.toFixed(2));
        
        const marketCap = parseFloat((price * circulatingSupply).toFixed(2));
        const marketCapInMillions = parseFloat((marketCap / 1e6).toFixed(3));
        const trimmedMarketCap = marketCapInMillions.toString();
        setTorqMarketCap(`${trimmedMarketCap}m`);

      } catch (error) {
        console.error('Error fetching TORQ data:', error);
      }
    };

    fetchTorqData();
  }, []);

  const rewards = [
    {
      title: '0.00 TORQ',
      content: 'Claimable',
    },
    {
      title: '$0.00',
      content: 'Dollar value',
    },
    {
      title: `$${torqPrice}`,
      content: 'Current price',
    },
    {
      title: `$${torqMarketCap}`,
      content: 'Market cap',
    },
  ]

  return (
    <Modal
      className="w-full max-w-[420px]  bg-[#FCFAFF] p-[10px] dark:bg-[#030303]"
      open={openModal}
      handleClose={handleClose}
      hideCloseIcon
    >
      <div className="flex items-center justify-between">
        <div className="font-larken text-[18px] text-[22px] dark:text-white">
          Rewards
        </div>
        <AiOutlineClose
          className=" cursor-pointer text-[#ffff]"
          onClick={handleClose}
        />
      </div>
      <div className="gradient-border mt-2 hidden h-[1px] w-full md:block"></div>
      <div className="grid h-auto w-full  grid-cols-2 gap-[12px] overflow-y-auto py-[18px]">
        {rewards.map((item) => (
          <div className="flex bg-claim-reward h-[102px] flex-col items-center justify-center rounded-[8px] border-[1px] border-[#1A1A1A]">
            <div className="font-larken text-[24px] text-[#404040] dark:text-white">
              {item.title}
            </div>
            <div className="mt-1 text-[15px] text-[#959595]">
              {item?.content}
            </div>
          </div>
        ))}
      </div>
      <button
        className={`font-mona w-full rounded-full border border-[#AA5BFF] bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] py-1 uppercase text-white transition-all hover:border hover:border-[#AA5BFF] hover:from-transparent hover:to-transparent hover:text-[#AA5BFF]
        `}
      >
        CLAIM TORQ
      </button>
    </Modal>
  )
}
