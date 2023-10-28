import { toMetricUnits } from '@/lib/helpers/number'
import { NumericFormat } from 'react-number-format'

export const ProposalsItem = (props: any) => {
  const { menu } = props

  let classnamesState =
    'rounded-[6px] bg-[#ff9c4155] px-[12px] py-[7px] text-[12px] font-[500] uppercase text-[#1EB26B]'
  if (menu.state === 'active') {
    classnamesState =
      'rounded-[6px] bg-[#1eb26b55] px-[12px] py-[7px] text-[12px] font-[500] uppercase text-[#1EB26B]'
  } else if (menu.state === 'pending') {
    classnamesState =
      'rounded-[6px] bg-[#ff9c4155] px-[12px] py-[7px] text-[12px] font-[500] uppercase text-[#FF9C41]'
  } else if (menu.state === 'failed') {
    classnamesState =
      'rounded-[6px] bg-[#ff3e3e55] px-[12px] py-[7px] text-[12px] font-[500] uppercase text-[#F05858]'
  } else if (menu.state === 'passed') {
    classnamesState =
      'rounded-[6px] bg-[#aa5bff55] px-[12px] py-[7px] text-[12px] font-[500] uppercase text-[#C38BFF]'
  }
  return (
    <div className="mt-[14px]">
      <div className="flex items-center justify-between">
        <div className="w-[60%]">
          <h4>{menu.title}</h4>
          <div className="flex items-center gap-[13px]">
            <div className={classnamesState}>{menu.state}</div>
            <p className="font-[500] text-[#959595]">{menu.tip}</p>
            <div className="h-[5px] w-[5px] rounded-full bg-[#959595]"></div>
            <p className="font-[500] text-[#959595]">{menu.timeVote}</p>
          </div>
        </div>

        <div className="w-[40%]">
          <div className="flex w-full items-center justify-end gap-[8px]">
            <p className="text-[14px] font-[500] text-[#F05858]">
              {toMetricUnits(menu.voteRed, 1).toLocaleLowerCase()}
            </p>
            <div className="relative h-[4px] w-full max-w-[160px] rounded-[12px]">
              {menu.voteGreen === 0 && menu.voteRed === 0 ? (
                <>
                  <div className="absolute left-0 h-[4px] w-[50%] rounded-[12px] bg-[#F05858]"></div>
                  <div className="absolute right-0 h-[4px] w-[50%] rounded-[12px] bg-[#1EB26B]"></div>
                </>
              ) : (
                <>
                  <div
                    className="absolute left-0 h-[4px] rounded-[12px] bg-[#F05858]"
                    style={{
                      width:
                        Math.round(
                          (menu.voteRed / (menu.voteGreen + menu.voteRed)) * 100
                        ) + '%',
                    }}
                  ></div>
                  <div
                    className="absolute right-0 h-[4px] rounded-[12px] bg-[#1EB26B]"
                    style={{
                      width:
                        Math.round(
                          (menu.voteGreen / (menu.voteGreen + menu.voteRed)) *
                            100
                        ) + '%',
                    }}
                  ></div>
                </>
              )}
            </div>
            <p className="text-[14px] font-[500] text-[#1EB26B]">
              {toMetricUnits(menu?.voteGreen).toLocaleLowerCase()}
            </p>
          </div>
          <p className="text-right font-[500] leading-[24px] text-[#959595]">
            <NumericFormat
              displayType="text"
              value={menu.voteGreen + menu.voteRed}
              thousandSeparator
              suffix=".00 total votes"
            />
          </p>
        </div>
      </div>
      <div className="gradient-border mt-2 hidden h-[1px] w-full md:block"></div>
    </div>
  )
}
