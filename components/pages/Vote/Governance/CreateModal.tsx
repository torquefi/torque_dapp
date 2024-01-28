import HoverIndicator from '@/components/common/HoverIndicator'
import Modal from '@/components/common/Modal'
import { AppStore } from '@/types/store'
import { Menu, Transition } from '@headlessui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Fragment, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineClose } from 'react-icons/ai'
import { FaAngleDown } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import * as yup from 'yup'

const validationSchema = yup.object({
  title: yup.string().trim(),
  link: yup.string().trim(),
  description: yup.string().trim(),
  action: yup.string().trim(),
  amount: yup.number().nullable(),
  asset: yup.string().trim().nullable(),
  pool: yup.string().trim().nullable(),
})

const defaultValues = {
  title: '',
  link: '',
  description: '',
  action: '',
  amount: null as number | null,
  asset: '', 
  pool: '',
}

interface FormData {
  title: string;
  link: string;
  description: string;
  action: string;
  amount: number | null; // Include the new fields
  asset: string | null;
  pool: string | null;
}


export const CreateModal = (props: any) => {
  const { openModal, handleCLose } = props
  const theme = useSelector((store: AppStore) => store.theme.theme)
  const [showAmountInput, setShowAmountInput] = useState(false);
  const [showAssetInput, setShowAssetInput] = useState(false);
  const [showPoolInput, setShowPoolInput] = useState(false);

  const form = useForm<FormData>({
    defaultValues: defaultValues,
    resolver: yupResolver(validationSchema),
  })
  const values = form.watch()

  const options = [
    { value: 'TransferFromTreasury', label: 'Transfer from treasury' },
    { value: 'SetPoolRewardSpeed', label: 'Set pool reward speed' },
  ]
  const optionLabel = options?.find(
    (item) => item?.value === values?.action
  )?.label
  let optionIndex = options?.findIndex((item) => item?.value === values?.action)
  if (optionIndex < 0) {
    optionIndex = undefined
  }

  useEffect(() => {
    if (openModal) {
      form.reset();
      setShowAmountInput(false); 
    }
  }, [openModal])

  useEffect(() => {
    if (values.action === 'TransferFromTreasury') {
      setShowAmountInput(true);
      setShowAssetInput(true);
      setShowPoolInput(false);
    } else if (values.action === 'SetPoolRewardSpeed') {
      setShowAmountInput(true);
      setShowAssetInput(false);
      setShowPoolInput(true);
    } else {
      setShowAmountInput(false);
      setShowAssetInput(false);
      setShowPoolInput(false);
    }
  }, [values.action]);

  return (
    <div>
      <Modal
        open={openModal}
        handleClose={handleCLose}
        className="no-scrollbar mx-auto max-h-[420px] w-[90%] max-w-[380px] overflow-hidden bg-[#FCFAFF] px-[24px] hover:overflow-y-auto dark:bg-[#030303]"
        hideCloseIcon
      >
        <div className="flex items-center justify-between py-2">
          <div className="font-larken text-[16px] font-[400] text-[#030303] dark:text-white md:text-[28px]">
            Create
          </div>
          <AiOutlineClose
            className="cursor-pointer text-[#030303] dark:text-[#ffff]"
            onClick={handleCLose}
          />
        </div>
        <div
          className={
            `mt-2 hidden h-[1px] w-full md:block` +
            ` ${
              theme === 'light'
                ? 'bg-gradient-divider-light'
                : 'bg-gradient-divider'
            }`
          }
        ></div>
        <div className="mt-[22px]">
          <div>
            <input
              className="focus:outline-none focus:bg-transparent w-full rounded-[12px] border-[1px] border-solid border-[#E6E6E6] bg-transparent px-[21px] py-[16px] text-[14px] font-[500] text-[#959595] dark:border-[#1a1a1a]"
              type="text"
              placeholder="Title*"
              {...form.register('title')}
            />
          </div>
          <div className="mt-[14px]">
            <input
              className="focus:outline-none focus:bg-transparent w-full rounded-[12px] border-[1px] border-solid border-[#E6E6E6] bg-transparent px-[21px] py-[16px] text-[14px] font-[500] text-[#959595] dark:border-[#1a1a1a]"
              type="text"
              placeholder="Forum link*"
              {...form.register('link')}
            />
          </div>
          <div className="mt-[14px]">
            <input
              className="focus:outline-none focus:bg-transparent w-full rounded-[12px] border-[1px] border-solid border-[#E6E6E6] bg-transparent px-[21px] pb-[190px] pt-[20px] text-[14px] font-[500] text-[#959595] dark:border-[#1a1a1a]"
              type="text"
              placeholder="Description*"
              {...form.register('description')}
            />
          </div>
          <div>
            <Menu as="div" className="relative block text-left">
              {({ open }) => (
                <>
                  <div>
                    <Menu.Button className="mt-[14px] flex w-full items-center text-[14px] justify-between rounded-[8px] border-[1px] border-solid border-[#E6E6E6] px-[21px] py-[12px] text-[#959595] dark:border-[#1a1a1a]">
                      {optionLabel || 'Add action'}
                      <FaAngleDown
                        className={
                          'h-[24px] cursor-pointer text-[#959595] transition-all duration-200' +
                          ` ${open ? 'rotate-180' : ''}`
                        }
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute bottom-[108%] right-0 mt-2 w-full origin-bottom-right rounded-md border bg-[#FCFAFF] p-[6px] py-[8px] shadow-sm dark:border-[#1D1D1D] dark:bg-[#090909]">
                      <HoverIndicator
                        direction="vertical"
                        activeIndex={optionIndex}
                        divider
                      >
                        {options.map((item, i) => (
                          /* Use the `active` state to conditionally style the active item. */
                          <Menu.Item key={i}>
                            {({ active }) => (
                              <button
                                className={`group flex h-[48px] w-full items-center rounded-md px-2 py-2 text-sm text-[#959595]`}
                                onClick={() =>
                                  form.setValue('action', item?.value, {
                                    shouldValidate: true,
                                  })
                                }
                              >
                                {item?.label}
                              </button>
                            )}
                          </Menu.Item>
                        ))}
                      </HoverIndicator>
                    </Menu.Items>
                  </Transition>
                </>
              )}
            </Menu>
          </div>
        <div className="mt-[14px]">
        {showAmountInput && (
            <div className="mt-[14px]">
              <input
                className="focus:outline-none focus:bg-transparent w-full rounded-[12px] border-[1px] border-solid border-[#E6E6E6] bg-transparent px-[21px] py-[16px] text-[14px] font-[500] text-[#959595] dark:border-[#1a1a1a]"
                type="number"
                placeholder="Amount"
                {...form.register('amount')}
              />
            </div>
          )}
        {showAssetInput && (
            <div className="mt-[14px]">
              <input
                className="focus:outline-none focus:bg-transparent w-full rounded-[12px] border-[1px] border-solid border-[#E6E6E6] bg-transparent px-[21px] py-[16px] text-[14px] font-[500] text-[#959595] dark:border-[#1a1a1a]"
                type="text"
                placeholder="Asset"
                {...form.register('asset')}
              />
            </div>
          )}
        {showPoolInput && (
            <div className="mt-[14px]">
              <input
                className="focus:outline-none focus:bg-transparent w-full rounded-[12px] border-[1px] border-solid border-[#E6E6E6] bg-transparent px-[21px] py-[16px] text-[14px] font-[500] text-[#959595] dark:border-[#1a1a1a]"
                type="text"
                placeholder="Pool"
                {...form.register('pool')}
              />
            </div>
          )}
        </div>
        </div>
        <button
          className={`font-mona text-[14px] mt-[16px] w-full rounded-full border border-[#AA5BFF] bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] py-1 uppercase text-white transition-all hover:border hover:border-[#AA5BFF] hover:from-transparent hover:to-transparent hover:text-[#AA5BFF]
        `}
        >
          submit proposal
        </button>
      </Modal>
    </div>
  )
}
