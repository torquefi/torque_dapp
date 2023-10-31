import React from 'react'
import { FaCheck } from 'react-icons/fa'

export const Description = () => {
  return (
    <div className="w-full rounded-[12px] border-[1px] border-solid border-[#1a1a1a] bg-[#0d0d0d] px-[10px] py-[9px] md:w-[55%] md:px-[50px]">
      <div className="flex items-center justify-between">
        <h2 className="text-[24px] font-[400] leading-[60px]">Description</h2>
        <button>
          <img src="/assets/pages/vote/ic-info.svg" alt="" />
        </button>
      </div>
      <div className="gradient-border mt-[27px] hidden h-[1px] w-full md:block"></div>
      <div className="mt-[24px] text-left">
        <h4 className="text-[18px] font-[400] leading-[24px]">Introduction</h4>
        <p className="mt-[15px] w-full max-w-[720px] font-[500] text-[#959595]">
          Maecenas vitae rutrum diam. Phasellus nibh massa, rutrum eget placerat
          ut, lacinctus. Proin aliquet et lacus rhoncus blandit. Nullam
          tristique, diam et laoreet gravida, dolor tortor tincidunt urna, nec
          congue dolor sapien quis nisi. Proin at nulla turpis. Morbi accumsan
          leo aem rutrum vestibulum at non nunc. Praesent eget diam ex. Sed et
          fringilla lorem ipsum loorci. Moimsan leo at sem rutrum vestibulum at
          non nunc. Praesent eget diam ex. Sed et fringilla orci.
        </p>
      </div>
      <div className="mt-[24px] text-left">
        <h4 className="text-[18px] font-[400] leading-[24px]">Motivation</h4>
        <p className="mt-[15px] w-full max-w-[720px] font-[500] text-[#959595]">
          Maecenas vitae rutrum diam. Phasellus nibh massa, rutrum eget placerat
          ut, lacinctus. Proin aliquet et lacus rhoncus blandit. Nullam
          tristique, diam et laoreet gravida, dolor tortor tincidunt urna, nec
          congue dolor sapien quis nisi. Proin at nulla turpis. Morbi accumsan
          leo aem.
        </p>
      </div>
      <div className="mt-[24px] text-left">
        <h4 className="text-[18px] font-[400] leading-[24px]">Specification</h4>
        <p className="mt-[15px] w-full max-w-[720px] font-[500] text-[#959595]">
          Maecenas vitae rutrum diam. Phasellus nibh massa, rutrum eget placerat
          ut, lacinctus. Proin aliquet et lacus rhoncus blandit. Nullam
          tristique, diam et laoreet gravida, dolor tortor tincidunt urna, nec
          congue dolor sapien quis nisi. Proin at nulla turpis. Morbi accumsan
          leo aem ru. Proin at nulla turpis. Morbi accumsan leo aem rutrum
          vestibulum at non nunc. Praesent eget diam.
        </p>
      </div>
      <div className="gradient-border mt-[40px] hidden h-[1px] w-full md:block"></div>
      <div className="mt-[18px] cursor-pointer text-center text-[14px] font-[500] uppercase text-[#959595]">
        view on forum
      </div>
    </div>
  )
}
