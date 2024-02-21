import React from 'react'
import { FaCheck } from 'react-icons/fa'
import { useSelector } from 'react-redux'

export const Description = () => {
  const theme = useSelector((store: AppStore) => store.theme.theme)

  return (
    <div className="rounded-[12px] border border-[#E6E6E6] bg-[#ffffff]  from-[#0d0d0d] to-[#0d0d0d]/0 text-[#030303] dark:border-[#1A1A1A] dark:bg-transparent dark:bg-gradient-to-br dark:text-white px-[10px] py-[9px] md:w-[55%] md:px-[24px] h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-[24px] text-[#030303] dark:text-white font-[400] font-larken mt-2">Description</h2>
        <button>
          <img src="/assets/pages/vote/ic-info.svg" alt="" />
        </button>
      </div>
      <div className={`mt-4 h-[1px] w-full block` + `
      ${theme === 'light' ? 'bg-gradient-divider-light' : 'bg-gradient-divider'}`
        }></div>
      <div className="mt-[12px] text-left">
        <h4 className="text-[18px] text-[#030303] dark:text-white font-[400] font-larken leading-[24px]">Introduction</h4>
        <p className="mt-[8px] w-full max-w-[720px] font-[500] text-[#959595]">
          Maecenas vitae rutrum diam. Phasellus nibh massa, rutrum eget placerat
          ut, lacinctus. Proin aliquet et lacus rhoncus blandit. Nullam
          tristique, diam et laoreet gravida, dolor tortor tincidunt urna, nec
          congue dolor sapien quis nisi. Proin at nulla turpis. Morbi accumsan
          leo aem rutrum vestibulum.
        </p>
      </div>
      <div className="mt-[12px] text-left">
        <h4 className="text-[18px] text-[#030303] dark:text-white font-[400] font-larken leading-[24px]">Motivation</h4>
        <p className="mt-[8px] w-full max-w-[720px] font-[500] text-[#959595]">
          Maecenas vitae rutrum diam. Phasellus nibh massa, rutrum eget placerat
          ut, lacinctus. Proin aliquet et lacus rhoncus blandit. Nullam
          tristique, diam et laoreet gravida, dolor tortor tincidunt urna, nec
          congue dolor sapien quis.
        </p>
      </div>
      <div className="mt-[12px] text-left">
        <h4 className="text-[18px] text-[#030303] dark:text-white font-[400] font-larken leading-[24px]">Specification</h4>
        <p className="mt-[8px] w-full max-w-[720px] font-[500] text-[#959595]">
          Maecenas vitae rutrum diam. Phasellus nibh massa, rutrum eget placerat
          ut, lacinctus. Proin aliquet et lacus rhoncus blandit. Nullam
          tristique, diam et laoreet gravida, dolor tortor tincidunt urna, nec
          congue dolor sapien quis.
        </p>
      </div>
      <div className={`mt-4 h-[1px] w-full block` + `
      ${theme === 'light' ? 'bg-gradient-divider-light' : 'bg-gradient-divider'}`
        }></div>
      <div className="mt-[12px] cursor-pointer text-center text-[14px] font-[500] uppercase text-[#959595]">
        view on forum
      </div>
    </div>
  )
}
