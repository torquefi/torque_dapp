export default function TitleDecorator() {
  return (
    <div className="mb-[-1px] flex justify-center">
      <div className="relative h-[16px] w-[16px] overflow-hidden">
        <div className="absolute bottom-0 right-0 h-[16px] w-[16px] translate-x-[50%] translate-y-[50%] rotate-[-45deg] border-t border-[#E6E6E6] bg-[#F9F9F9] dark:border-[#1D1D1D] dark:bg-[#141414]"></div>
      </div>
      <div className="h-[16px] w-[200px] border-t border-[#E6E6E6] bg-[#F9F9F9] dark:border-[#1D1D1D] dark:bg-[#141414]"></div>
      <div className="relative h-[16px] w-[16px] overflow-hidden">
        <div className="absolute bottom-0 left-0 h-[16px] w-[16px] translate-x-[-50%] translate-y-[50%] rotate-[45deg] border-t border-[#E6E6E6] bg-[#F9F9F9] dark:border-[#1D1D1D] dark:bg-[#141414]"></div>
      </div>
    </div>
  )
}
