import React, { useEffect } from 'react'
import moment from 'moment'
import { BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Bar } from 'recharts'
import { formatAmount } from '../utils/formatInfoNumbers'
import { BarChartLoader } from './ChartLoaders'
import { colors } from '../../../theme'

const CustomBar = ({
  x,
  y,
  width,
  height,
  fill,
}) => {
  return (
    <g>
      <rect x={x} y={y} fill={fill} width={width} height={height} rx="2" />
    </g>
  )
}

// Calls setHoverValue and setHoverDate when part of chart is hovered
// Note: this NEEDs to be wrapped inside component and useEffect, if you plug it as is it will create big render problems (try and see console)
const HoverUpdater = ({ payload, setHoverValue, setHoverDate }) => {
  useEffect(() => {
    setHoverValue(payload.value)
    setHoverDate(moment(payload.time).format('MMM DD, yyyy'))
  }, [payload.value, payload.time, setHoverValue, setHoverDate])

  return null
}

const Chart = ({ data, setHoverValue, setHoverDate }) => {
  if (!data || data.length === 0) {
    return <BarChartLoader />
  }
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 15,
          left: 0,
          bottom: 5,
        }}
        onMouseLeave={() => {
          setHoverDate(undefined)
          setHoverValue(undefined)
        }}
      >
        <XAxis
          dataKey="time"
          axisLine={false}
          tickLine={false}
          tickFormatter={(time) => moment(time).format('DD')}
          minTickGap={10}
        />
        <YAxis
          dataKey="value"
          tickCount={6}
          scale="linear"
          axisLine={false}
          tickLine={false}
          color={colors.white}
          fontSize="12px"
          tickFormatter={(val) => `$${formatAmount(val)}`}
          orientation="right"
          tick={{ dx: 10, fill: colors.white }}
        />
        <Tooltip
          cursor={{ fill: colors.white }}
          contentStyle={{ display: 'none' }}
          formatter={(tooltipValue, name, props) => (
            <HoverUpdater payload={props.payload} setHoverValue={setHoverValue} setHoverDate={setHoverDate} />
          )}
        />
        <Bar
          dataKey="value"
          fill={colors.gray}
          shape={(props) => (
            <CustomBar height={props.height} width={props.width} x={props.x} y={props.y} fill={'#71d0c6'} />
          )}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default Chart
