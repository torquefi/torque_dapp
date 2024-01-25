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
import * as yup from 'yup'

const validationSchema = yup.object({
  title: yup.string().trim(),
  link: yup.string().trim(),
  description: yup.string().trim(),
  action: yup.string().trim(),
})

const defaultValues = {
  title: '',
  link: '',
  description: '',
  action: '',
}

export const CreateModal = (props: any) => {
  const { openModal, handleCLose } = props
  const theme = useSelector((store: AppStore) => store.theme.theme)

  const form = useForm({
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
      form.reset()
    }
  }, [])

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
            `
      ${theme === 'light' ? 'bg-gradient-divider-light' : 'bg-gradient-divider'
            }`
          }
        ></div>
        <div className="mt-[22px]">
          <div>
            <input
              className="w-full rounded-[12px] border-[1px] border-solid border-[#E6E6E6] bg-transparent px-[21px] py-[16px] text-[16px] font-[500] text-[#959595] dark:border-[#1a1a1a]"
              type="text"
              placeholder="Title*"
              {...form.register('title')}
            />
          </div>
          <div className="mt-[14px]">
            <input
              className="w-full rounded-[12px] border-[1px] border-solid border-[#E6E6E6] bg-transparent px-[21px] py-[16px] text-[16px] font-[500] text-[#959595] dark:border-[#1a1a1a]"
              type="text"
              placeholder="Forum link*"
              {...form.register('link')}
            />
          </div>
          <div className="mt-[14px]">
            <input
              className="w-full rounded-[12px] border-[1px] border-solid border-[#E6E6E6] bg-transparent px-[21px] pb-[190px] pt-[20px] text-[16px] font-[500] text-[#959595] dark:border-[#1a1a1a]"
              type="text"
              placeholder="Description*"
              {...form.register('description')}
            />
          </div>
          <div>
            <Menu as="div" className="relative block text-left">
              <div>
                <Menu.Button className="mt-[14px] flex w-full items-center  justify-between rounded-[8px] border-[1px] border-solid border-[#E6E6E6] px-[21px] py-[12px] text-[#959595] dark:border-[#1a1a1a]">
                  {optionLabel || 'Add action'}
                  <FaAngleDown className="h-[24px] cursor-pointer text-[#959595]" />
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
            </Menu>
          </div>
        </div>
        <button
          className={`font-mona mt-[16px] w-full rounded-full border border-[#AA5BFF] bg-gradient-to-b from-[#AA5BFF] to-[#912BFF] py-1 uppercase text-white transition-all hover:border hover:border-[#AA5BFF] hover:from-transparent hover:to-transparent hover:text-[#AA5BFF]
        `}
        >
          submit proposal
        </button>
      </Modal>
    </div>
  )
}
