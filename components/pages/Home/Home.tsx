import NumberFormat from '@/components/common/NumberFormat'

const HomePageFilter = () => {
  return (
    <div className="relative flex h-[400px] w-full flex-wrap items-center justify-center rounded-[10px] border-[1px] border-[#1A1A1A] bg-gradient-to-br from-[#25252566]">
      <div className="gradient-border  flex h-[50%] w-full items-center">
        <div className="w-[50%]">
          <div className="flex h-full w-full flex-col items-center justify-center gap-2   text-[#404040]   dark:text-white">
            <div className="text-[15px] text-[#959595]">Total Supply</div>
            <div className="font-larken flex w-full items-center justify-center text-[32px]">
              <NumberFormat
                displayType="text"
                thousandSeparator
                value={0}
                decimalScale={2}
                fixedDecimalScale
                prefix={"$"}
              />
            </div>
          </div>
        </div>
        <div className="w-[50%]">
          <div className="flex h-full w-full flex-col items-center justify-center gap-2   text-[#404040]   dark:text-white">
            <div className="text-[15px] text-[#959595]">Total Borrow</div>
            <div className="font-larken flex w-full items-center justify-center text-[32px]">
              <NumberFormat
                displayType="text"
                thousandSeparator
                value={0}
                decimalScale={2}
                fixedDecimalScale
                prefix={"$"}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="relative flex h-[50%] w-full flex-wrap items-center">
        <div className="flex w-full items-center">
          <div className="w-[50%]">
            <div className="flex h-full w-full flex-col items-center justify-center gap-2   text-[#404040]   dark:text-white">
              <div className="text-[15px] text-[#959595]">Your Supply</div>
              <div className="font-larken flex w-full items-center justify-center text-[32px]">
                <NumberFormat
                  displayType="text"
                  thousandSeparator
                  value={0}
                  decimalScale={2}
                  fixedDecimalScale
                  prefix={"$"}
                />
              </div>
            </div>
          </div>
          <div className="w-[50%]">
            <div className="flex h-full w-full flex-col items-center justify-center gap-2   text-[#404040]   dark:text-white">
              <div className="text-[15px] text-[#959595]">Your Borrow</div>
              <div className="font-larken flex w-full items-center justify-center text-[32px]">
                <NumberFormat
                  displayType="text"
                  thousandSeparator
                  value={0}
                  decimalScale={2}
                  fixedDecimalScale
                  prefix={"$"}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute  bottom-[-16px] w-full ">
          <div className=" flex items-center justify-between">
            <span className=" text-xs font-semibold text-teal-600">
              <div className="flex flex-col items-center gap-[1px] pb-2  pl-2   text-[#404040]   dark:text-white">
                <div className="text-[12px] text-[#959595]">Net APY</div>
                <div className="font-larken flex w-full items-center justify-center text-[16px]">
                  <NumberFormat
                    displayType="text"
                    thousandSeparator
                    value={0}
                    decimalScale={2}
                    fixedDecimalScale
                    suffix={"%"}
                  />
                </div>
              </div>
            </span>
            <div className="text-right">
              <span className=" text-xs font-semibold text-teal-600">
                <div className="flex flex-col items-center gap-[1px] pb-2  pr-2   text-[#404040]   dark:text-white">
                  <div className="text-[12px] text-[#959595]">Borrow Max</div>
                  <div className="font-larken flex w-full items-center justify-center text-[16px]">
                    <NumberFormat
                      displayType="text"
                      thousandSeparator
                      value={82}
                      decimalScale={2}
                      fixedDecimalScale
                      suffix={"%"}
                    />
                  </div>
                </div>
              </span>
            </div>
          </div>
          <div className="mb-4 flex h-2 overflow-hidden rounded bg-[#1A1A1A] text-xs">
            <div
              style={{ width: '70%' }}
              className="flex flex-col justify-center whitespace-nowrap bg-[#1F1F1F] text-center text-white shadow-none"
            ></div>
          </div>
        </div>
      </div>
      <div className="absolute z-100000  h-[160px] w-[160px] rounded-full border-2 border-[#25252566] bg-[#1A1A1A] p-2">
        <div className="h-full w-full rounded-full border-2 border-[#C38BFF] bg-[#0D0D0D66]">
          <div className="flex h-full w-full flex-col items-center justify-center gap-2   text-[#404040]   dark:text-white">
            <div className="text-[14px] text-[#959595]">NET APY</div>
            <div className="font-larken flex w-full items-center justify-center text-[32px]">
              <NumberFormat
                displayType="text"
                thousandSeparator
                value={0}
                decimalScale={2}
                fixedDecimalScale
                suffix={"%"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default HomePageFilter
