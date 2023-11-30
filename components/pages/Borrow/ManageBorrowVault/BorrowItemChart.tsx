// @ts-nocheck

import axiosInstance from '@/configs/axios.config'
import { toMetricUnits } from '@/lib/helpers/number'
import dayjs from 'dayjs'
import { ethers } from 'ethers'
import { FC, useEffect, useRef, useState } from 'react'
import { NumericFormat } from 'react-number-format'
import {
  Bar,
  Cell,
  ComposedChart,
  LabelList,
  Line,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

interface BorrowItemChartProps {
  label?: string
  tokenAddress?: string
  tokenDecimals?: number
  tokenPrice?: number
  aprPercent?: any
}

export const BorrowItemChart: FC<BorrowItemChartProps> = (props) => {
  const { label, tokenAddress, tokenPrice, tokenDecimals, aprPercent } = props
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState<any[]>([])
  const chartContainerRef = useRef<HTMLDivElement>(null)

  const CustomTooltip = (props: any) => {
    const { active, payload, label } = props

    if (active && payload && payload.length) {
      return (
        <div className="z-10 rounded border-2 border-[#1C1C1C] bg-[#0E0E0E] px-4 py-2 text-left">
          <div className="text-24 font-semibold text-[#AA5BFF] ">
            <NumericFormat
              displayType="text"
              value={+payload?.[1]?.payload?.value || 0}
              thousandSeparator
              decimalScale={5}
              prefix="$"
            />
          </div>
          <div className="text-14 text-[#BCBBCA]">
            {new Date(payload?.[1]?.payload?.time)
              .toISOString()
              .substring(0, 10)}
          </div>
        </div>
      )
    }

    return null
  }

  const renderCustomizedLabel = (props) => {
    const { x, y, width, height, index, value } = props

    if (index !== chartData?.length - 1) {
      return <></>
    }

    return (
      <g>
        <text
          x={x + width / 2}
          y={y - 30}
          fill="#fff"
          textAnchor="middle"
          dominantBaseline="middle"
          fontWeight={800}
        >
          ${toMetricUnits(value)}
        </text>
      </g>
    )
  }

  useEffect(() => {
    const handleGetChartDataTransaction = async () => {
      try {
        const path = '/api/transaction-arbitrum/list-transaction-arbitrum'
        const res = await axiosInstance.post(path, {
          address: tokenAddress,
          functionName: 'borrow',
          txreceipt_status: '1',
        })
        const transactions: any[] = res?.data?.data || []

        let chartDataObj: any = {}

        for (let i = -14; i <= 0; i++) {
          const key = dayjs().add(i, 'd').format('YYYY-MM-DD')
          chartDataObj[key] = {
            time: key,
            valueBar: 0,
          }
        }

        let lineValue = 50
        transactions?.forEach((item) => {
          const key = dayjs(+item?.timeStamp * 1000).format('YYYY-MM-DD')
          if (chartDataObj[key]) {
            const value = +ethers.utils.formatUnits(item?.value, tokenDecimals)
            chartDataObj[key].valueBar += value
            lineValue = Math.max(lineValue, value)
          }
        })

        let chartData = Object.values(chartDataObj)?.map((item, i) => ({
          ...item,
          value: item?.valueBar * tokenPrice,
          valueBar: 1 + item?.valueBar * tokenPrice,
          valueLine: lineValue * 1.5,
        }))

        // console.log(tokenAddress, tokenPrice, tokenDecimals, aprPercent, chartData)
        setChartData(chartData)
      } catch (error) {
        console.log(
          'Borrow.ManageBorrowVault.BorrowItemChart.handleGetChartDataTransaction',
          error
        )
      }
    }
    handleGetChartDataTransaction()
  }, [tokenAddress])

  return (
    <>
      <div id="home-chart-wrapper" ref={chartContainerRef} className="relative">
        <div className="text-center font-body text-[10px] font-extrabold">
          <NumericFormat
            displayType="text"
            value={+aprPercent}
            decimalScale={2}
            suffix="%"
          />
          <p className="uppercase text-[#959595]">{label}</p>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <ComposedChart data={chartData}>
            <Tooltip content={CustomTooltip} />
            <Line
              type="monotone"
              dataKey="valueLine"
              strokeWidth={2}
              fillOpacity={1}
              dot={false}
              stroke="#AA5BFF"
              fill="url(#colorUv)"
            />
            <Bar isAnimationActive={false} dataKey="valueBar" fill="#AA5BFF">
              <LabelList
                dataKey="value"
                position="top"
                content={renderCustomizedLabel}
              />
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === chartData?.length - 1 ? '#AA5BFF' : '#959595'}
                />
              ))}
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </>
  )
}
