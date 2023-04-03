import Modal from '@/components/common/Modal'
import { Dialog } from '@/components/shared/dialog/dialog'
import useNetwork from '@/lib/hooks/useNetwork'
import { useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { useMoralis } from 'react-moralis'
import DepositModal from './Deposit'
// import Deposit from './Deposit'
// import Withdrawal from './Withdrawal'

interface StakeDepositModalProps {
  open: boolean
  handleClose: () => any
  coin: any
}

export default function StakeDepositModal({
  open,
  handleClose,
  coin,
}: StakeDepositModalProps) {
  const { Moralis } = useMoralis()
  const { network } = useNetwork()
  const { user } = useMoralis()
  const [openTab, setOpenTab] = useState(1)

  return (
    <Modal open={open} handleClose={handleClose} className="max-w-[500px]">
      <div className="relative flex justify-between border-b border-[#1A1A1A] px-4 py-4 text-24 font-bold">
        <div className="flex items-center justify-start">
          {/* <img src={coin?.url} className="h-[40px] w-[40px]" /> */}
          <p className="ml-2 text-[25px] font-bold md:ml-3">{coin?.label}</p>
          {/* <div className="">
            <ul className="mb-0 flex list-none flex-nowrap" role="tablist">
              <li className="ml-[10px] flex items-center md:ml-[15px]">
                <a
                  className={
                    'text-12 leading-4 xs:text-14 ' +
                    (openTab === 1 ? 'text-white' : 'text-[#77838F]')
                  }
                  onClick={(e) => {
                    e.preventDefault()
                    setOpenTab(1)
                  }}
                  data-toggle="tab"
                  href="#link1"
                  role="tablist"
                >
                  Deposit
                </a>
              </li>
              <li className="ml-[10px] flex items-center md:ml-[15px]">
                <a
                  className={
                    'text-12 leading-4 xs:text-14 ' +
                    (openTab === 2 ? 'text-white' : 'text-[#77838F]')
                  }
                  onClick={(e) => {
                    e.preventDefault()
                    setOpenTab(2)
                  }}
                  data-toggle="tab"
                  href="#link3"
                  role="tablist"
                >
                  Borrow
                </a>
              </li>
            </ul>
          </div> */}
        </div>
      </div>
      <div className="p-4 sm:p-6">
        {openTab === 1 && <DepositModal coin={coin} onSuccess={handleClose} />}
      </div>
    </Modal>
  )
}
