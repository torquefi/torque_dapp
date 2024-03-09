import React, { useEffect, useMemo, useState } from 'react'
import { FaCheck } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { AppStore } from '@/types/store'
import MyMarkdown from '../../../../../test.mdx'
import { useAppSelector } from '@/lib/redux/store'
import Popover from '@/components/common/Popover'
import { useRouter } from 'next/router'
import Link from 'next/link'

export const Description = () => {
  const theme = useSelector((store: AppStore) => store.theme.theme)
  const [tipDetails, setTipDetails] = useState(null)
  const { tipData } = useAppSelector((state) => state.tips)
  const router = useRouter()
  const { id } = router?.query

  const TipDescription = useMemo(() => tipDetails?.description, [tipDetails])

  useEffect(() => {
    try {
      const data = tipData.find((tip) => tip.id.toString() === id)
      console.log(data)
      if (data) {
        setTipDetails(data)
      } else {
      }
    } catch (error) { }
  }, [id])

  return (
    <>
      <div className="h-full rounded-[12px] border border-[#E6E6E6]  bg-[#ffffff] from-[#0d0d0d] to-[#0d0d0d]/0 px-[18px] py-[12px] text-[#030303] dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-br dark:text-white md:px-[24px]">
        <div className="flex items-center justify-between">
          <h1 className="font-larken mt-2 text-[24px] font-[400] text-[#030303] dark:text-white">
            Description
          </h1>
          <Popover
            trigger="hover"
            placement="bottom-right"
            className={`font-mona mt-[8px] w-[230px] border border-[#e5e7eb] bg-[#fff] text-center text-sm leading-tight text-[#030303] dark:border-[#1A1A1A] dark:bg-[#0d0d0d] dark:text-white`}
            content="Community-driven proposals guide the future of Torque."
          >
            <button>
              <img src="/assets/pages/vote/ic-info.svg" alt="information" />
            </button>
          </Popover>
        </div>
        <div
          className={
            `mt-4 block h-[1px] w-full` +
            `
      ${theme === 'light' ? 'bg-gradient-divider-light' : 'bg-gradient-divider'
            }`
          }
        ></div>
        {tipDetails && tipDetails.description && (
          <article className="prose mt-4 block max-w-[765px] text-left">
            <TipDescription />
          </article>
        )}
        <div
          className={
            `mt-8 block h-[1px] w-full` +
            `
      ${theme === 'light' ? 'bg-gradient-divider-light' : 'bg-gradient-divider'
            }`
          }
        ></div>
        <Link href="https://forum.torque.fi" legacyBehavior>
          <a target='_blank'>
            <div className="mt-[12px] cursor-pointer text-center text-[13px] font-[500] uppercase text-[#959595]">
              view on forum
            </div>
          </a>
        </Link>
      </div>
    </>
  )
}
