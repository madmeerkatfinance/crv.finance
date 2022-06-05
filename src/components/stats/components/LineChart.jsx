import React, { useEffect } from 'react'
import moment from 'moment'
import { ResponsiveContainer, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts'
import { formatAmount } from '../utils/formatInfoNumbers'
import { LineChartLoader } from './ChartLoaders'
import { colors } from '../../../theme'

// Calls setHoverValue and setHoverDate when part of chart is hovered
// Note: this NEEDs to be wrapped inside component and useEffect, if you plug it as is it will create big render problems (try and see console)
const HoverUpdater = ({ payload, setHoverValue, setHoverDate }) => {
  useEffect(() => {
    setHoverValue(payload.value)
    setHoverDate(moment(payload.time).format('MMM DD, yyyy'))
  }, [payload.value, payload.time, setHoverValue, setHoverDate])

  return null
}

/**
 * Note: remember that it needs to be mounted inside the container with fixed height
 */
const LineChart = ({ data, setHoverValue, setHoverDate }) => {
  if (!data || data.length === 0) {
    return <LineChartLoader />
  }
  return (
    <ResponsiveContainer>
      <AreaChart
        data={data}
        width={300}
        height={308}
        margin={{
          top: 5,
          right: 15,
          left: 0,
          bottom: 5,
        }}
        onMouseLeave={() => {
          if (setHoverDate) setHoverDate(undefined)
          if (setHoverValue) setHoverValue(undefined)
        }}
      >
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={'#71d0c6'} stopOpacity={0.5} />
            <stop offset="100%" stopColor={'#71d0c6'} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="time"
          axisLine={false}
          tickLine={false}
          tickFormatter={(time) => moment(time).format('DD')}
          minTickGap={10}
        />
        <YAxis
          dataKey="value"
          tickCount={10}
          scale="linear"
          axisLine={false}
          tickLine={false}
          fontSize="12px"
          tickFormatter={(val) => `$${formatAmount(val)}`}
          orientation="right"
          tick={{ dx: 10, fill: colors.white }}
          domain={['auto', 'auto']}
        />
        <Tooltip
          cursor={{ stroke: '#71d0c6' }}
          contentStyle={{ display: 'none' }}
          formatter={(tooltipValue, name, props) => (
            <HoverUpdater payload={props.payload} setHoverValue={setHoverValue} setHoverDate={setHoverDate} />
          )}
        />
        <Area dataKey="value" type="monotone" stroke={'#71d0c6'} fill="url(#gradient)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export default LineChart
