import { format, parseISO } from 'date-fns'
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export function Chart(props: any) {
  const { chartData } = props
  const CustomTooltip = ({ active, payload, label }: any) => {
    let formatCurrency = new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: 'USD',
      // minimumFractionDigits: 5,
    })
    if (active && payload && payload.length) {
      return (
        <div className="z-10 rounded border-2 border-[#1C1C1C] bg-[#0E0E0E] px-4 py-2 text-left">
          <div className="text-24 font-semibold text-[#AA5BFF] ">
            {formatCurrency.format(0)}
          </div>
          <div className="text-14 text-[#959595]">
            {new Date(label).toISOString().substring(0, 10)}
          </div>
        </div>
      )
    }

    return null
  }

  const CustomizedAxisTick = (props: any) => {
    let { x, y, index, visibleTicksCount, width, height, payload } = props
    let x1 = width / (visibleTicksCount / (index + 1))
    let x2 = x1 - (0.5 * width) / visibleTicksCount

    let timeDisplay = format(parseISO(payload.value), 'MMM dd').toUpperCase()

    return (
      <g transform={`translate(${x2},${y})`}>
        <text
          x={0}
          y={0}
          dy={13}
          textAnchor="end"
          fill="#959595"
          fontSize={16}
          fontFamily="MonaSansRegular"
        >
          {timeDisplay}
        </text>
      </g>
    )
  }

  const dataFake = chartData || [
    {
      time: new Date().toISOString(),
      balanceUsd: 24,
    },
    {
      time: new Date().toISOString(),
      balanceUsd: 24,
    },
    {
      time: new Date().toISOString(),
      balanceUsd: 24,
    },
    {
      time: new Date().toISOString(),
      balanceUsd: 24,
    },
  ]

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart
          data={chartData}
          margin={{ left: -10, right: -10, bottom: 20 }}
        >
          <XAxis
            axisLine={{ color: '#77838F', opacity: 0.3 }}
            tickLine={false}
            tick={<CustomizedAxisTick />}
            padding={{ left: 10, right: 10 }}
            dataKey="time"
            minTickGap={80}
            stroke="#77838F"
            tickFormatter={(timestamp: any) =>
              format(parseISO(timestamp), 'MMM dd').toUpperCase()
            }
          />
          <YAxis domain={[0, 50]} hide />
          <Tooltip content={CustomTooltip} />

          <defs>
            <linearGradient id="balanceUsd" x1="0" y1="0" x2="0" y2="1">
              <stop offset="15%" stopColor="#AA5BFF" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#AA5BFF" stopOpacity={0.05} />
              <stop offset="100%" stopColor="#AA5BFF" stopOpacity={0} />
            </linearGradient>
            {/* <linearGradient id="colorUvNegative" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#AA5BFF" stopOpacity={0.05} />
              <stop offset="20%" stopColor="#AA5BFF" stopOpacity={0.01} />
              <stop offset="100%" stopColor="#AA5BFF" stopOpacity={0} />
            </linearGradient> */}
          </defs>
          <Area
            type="monotone"
            dataKey="balanceUsd"
            name="area"
            strokeWidth={2}
            fillOpacity={1}
            stroke="#AA5BFF"
            fill="url(#balanceUsd)"
          />
          {/* <Area
            type="monotone"
            dataKey="balanceUsd"
            name="area"
            strokeWidth={0}
            fillOpacity={1}
            stroke="transparent"
            fill="url(#colorUvNegative)"
          /> */}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
