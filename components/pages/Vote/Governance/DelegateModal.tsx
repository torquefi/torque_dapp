import Modal from '@/components/common/Modal'
import { AiOutlineClose } from 'react-icons/ai'
import { FaAngleDown } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { AppStore } from '@/types/store'
import { NumericFormat } from 'react-number-format'
import { useAccount } from 'wagmi'
import { useMemo, useState } from 'react'
import Web3 from 'web3'
import { torqContract } from '@/constants/contracts'
import { toast } from 'sonner'
import LoadingCircle from '@/components/common/Loading/LoadingCircle'
import BigNumber from 'bignumber.js'

export const DelegateModal = (props: any) => {
  const { openModal, handleClose, balance } = props
  const { address } = useAccount()
  const theme = useSelector((store: AppStore) => store.theme.theme)

  const [loading, setLoading] = useState(false)
  const [addressInput, setAddressInput] = useState('')

  const tokenContract = useMemo(() => {
    const web3 = new Web3(Web3.givenProvider)
    const contract = new web3.eth.Contract(
      JSON.parse(torqContract.abi),
      torqContract.address
    )
    return contract
  }, [Web3.givenProvider, torqContract])

  const handleDelegate = async () => {
    if (!addressInput) {
      toast.error('Please input address')
      return
    }
    if (!address || !tokenContract) {
      return
    }
    try {
      setLoading(true)
      const tx = await tokenContract.methods
        .delegates(addressInput)
        .send({ from: address })
      if (tx.status) {
        toast.success('Delegation Successful')
        handleClose()
        setAddressInput('')
      }

      console.log('tx :>> ', tx)
    } catch (error) {
      toast.error('Delegation Failed')
      console.log('error :>> ', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Modal
        open={openModal}
        handleClose={handleClose}
        className="mx-auto w-[90%] max-w-[360px] bg-[#FCFAFF] px-[24px] dark:bg-[#030303]"
        hideCloseIcon
      >
        <div className="flex items-center justify-between py-2">
          <div className="font-larken text-[16px] font-[400] text-[#030303] md:text-[28px] dark:text-white">
            Delegate
          </div>
          <AiOutlineClose
            className="cursor-pointer text-[#030303] dark:text-[#ffff]"
            onClick={handleClose}
          />
        </div>
        <div
          className={
            `mt-2 hidden h-[1px] w-full md:block` +
            `
      ${theme === 'light' ? 'bg-gradient-divider-light' : 'bg-gradient-divider'
            }`
          }
        ></div>
        <div className="mt-[18px]">
          <input
            className="w-full rounded-[12px] border-[1px] border-solid border-[#E6E6E6] bg-transparent px-[21px] py-[12px] text-[14px] font-[500] text-[#959595] dark:border-[#1a1a1a]"
            type="text"
            placeholder="Address*"
            value={addressInput}
            onChange={(event: any) => setAddressInput(event.target.value)}
          />
        </div>
        <div
          className={
            `mt-[18px] hidden h-[1px] w-full md:block` +
            `
      ${theme === 'light' ? 'bg-gradient-divider-light' : 'bg-gradient-divider'
            }`
          }
        ></div>
        <div className="mt-[22px]">
          <div className="flex justify-between font-[500] leading-[20px] text-[#959595]">
            <p>Wallet balance</p>
            <p>
              <NumericFormat
                value={address ? balance || '0' : '0'}
                displayType="text"
                thousandSeparator
                decimalScale={2}
                suffix=" "
              />
              TORQ
            </p>
          </div>
        </div>
        <button
          onClick={handleDelegate}
          disabled={loading}
          className={`font-mona mt-[16px] w-full rounded-full border border-[#AA5BFF] bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] py-1 uppercase text-white transition-all hover:border hover:border-[#AA5BFF] hover:from-transparent hover:to-transparent hover:text-[#AA5BFF]
        ${loading ? ' cursor-not-allowed opacity-50' : ''}`}
        >
          {loading && <LoadingCircle />}
          delegate votes
        </button>
      </Modal>
    </div>
  )
}
