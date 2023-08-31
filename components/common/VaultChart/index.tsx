// @ts-nocheck

import SkeletonDefault from '@/components/skeleton'
import { toMetricUnits } from '@/lib/helpers/number'
import { format, parseISO } from 'date-fns'
import { FC, useEffect, useRef, useState } from 'react'
import NumberFormat, { NumericFormat } from 'react-number-format'
import {
  Area,
  AreaChart,
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  ComposedChart,
  Cell,
  LabelList,
} from 'recharts'

interface VaultChartProps {
  label?: string
  percent?: number
  value?: number
}

export const VaultChart: FC<VaultChartProps> = (props) => {
  const { label, percent, value } = props
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState<any[]>([])
  const chartContainerRef = useRef<HTMLDivElement>(null)

  const CustomTooltip = (props: any) => {
    const { active, payload, label } = props
    if (active && payload && payload.length && label === 10) {
      return (
        <div className="z-10 rounded border-2 border-[#1C1C1C] bg-[#0E0E0E] px-4 py-2 text-left">
          <div className="text-24 font-semibold text-[#AA5BFF] ">
            <NumericFormat
              displayType="text"
              value={+value}
              thousandSeparator
              prefix="$"
            />
          </div>
          <div className="text-14 text-[#BCBBCA]">
            {/* {new Date(label).toISOString().substring(0, 10)} */}
          </div>
        </div>
      )
    }

    return null
  }

  const CustomizedAxisTick = (props) => {
    let { x, y, index, visibleTicksCount, width, height, payload } = props
    let x1 = width / (visibleTicksCount / (index + 1))
    let x2 = x1 - (0.5 * width) / visibleTicksCount
    let timeDisplay = ''
    if (payload.value) {
      timeDisplay = format(parseISO(payload.value), 'MMM dd').toUpperCase()
    }
    return (
      <g transform={`translate(${x2},${y})`}>
        <text
          x={0}
          y={0}
          dy={13}
          textAnchor="end"
          fill="#77838F"
          fontSize={16}
          fontFamily="MonaSansRegular"
        >
          {timeDisplay}
        </text>
      </g>
    )
  }

  const randomValue = () => {
    const fromDate = new Date()
    fromDate.setDate(fromDate.getDate() - 10)
    const toDate = new Date()
    toDate.setDate(toDate.getDate() + 10)
    let step = 15
    const data = []
    const start = new Date(fromDate)
    const end = new Date(toDate)
    while (start <= end) {
      const amount = 100 + Math.floor(Math.random() * 200)
      data.push({
        time:
          start.getDate() === new Date().getDate() ? start.toISOString() : '',
        line: amount + 500,
        bar: amount,
        amount: amount,
      })
      start.setDate(start.getDate() + 1)
    }
    return data
  }

  useEffect(() => {
    setChartData(randomValue())
  }, [])

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="mb-1">
        <SkeletonDefault height={'200px'} borderRadius={20} />
      </div>
    )
  }

  const renderCustomizedLabel = (props) => {
    const { x, y, width, height, index } = props

    if (index !== 10) {
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

  return (
    <>
      <div id="home-chart-wrapper" ref={chartContainerRef} className="relative">
        <div className="text-center font-body text-[14px] font-extrabold">
          <NumericFormat
            displayType="text"
            value={+percent}
            decimalScale={2}
            suffix="%"
          />
          <p className="uppercase text-[#788D9F]">{label}</p>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <ComposedChart data={chartData}>
            {/* <XAxis
                axisLine={{ color: '#77838F', opacity: 0.3 }}
                tickLine={false}
                tick={<CustomizedAxisTick />}
                // tick={{
                //   fontSize: 16,
                //   color: '#77838F',
                //   fontFamily: 'BrinnanRegular',
                // }}
                padding={{ left: 10, right: 10 }}
                dataKey="time"
                minTickGap={80}
                stroke="#77838F"
                // tickFormatter={(timestamp: any) =>
                //   format(parseISO(timestamp), 'MMM dd').toUpperCase()
                // }
              /> */}
            <Tooltip content={CustomTooltip} />
            <Line
              type="monotone"
              dataKey="line"
              strokeWidth={2}
              fillOpacity={1}
              dot={false}
              stroke="#AA5BFF"
              fill="url(#colorUv)"
            />
            <Bar dataKey="bar" fill="#AA5BFF" onMouseEnter={console.log}>
              <LabelList dataKey="name" content={renderCustomizedLabel} />
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === 10 ? '#AA5BFF' : '#273A48'}
                />
              ))}
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
        <div className="text-center text-[14px]">
          <p className="font-body font-extrabold text-[#788D9F]">
            {format(new Date(), 'MMM dd')}
          </p>
        </div>
      </div>
    </>
  )
}
