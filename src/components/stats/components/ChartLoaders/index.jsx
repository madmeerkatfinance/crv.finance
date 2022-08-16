import React from 'react'
import { withStyles } from '@material-ui/core/styles'

import LineChartLoaderSVG from './LineChartLoaderSVG'
import BarChartLoaderSVG from './BarChartLoaderSVG'
import CandleChartLoaderSVG from './CandleChartLoaderSVG'

const styles = () => ({
  loadingText: {
    position: 'absolute',
    marginLeft: 'auto',
    marginRight: 'auto',
    top: '50%',
    left: '0',
    right: '0',
    textAlign: 'center'
  },
  loadingIndicator: {
    height: '100%',
    position: 'relative'
  },
  text: {
    fontSize: '20px',
    fontWeight: '400',
    lineHeight: '1.5'
  }
})

export const BarChartLoader = withStyles(styles)(({ classes }) => {
  return (
    <div className={classes.loadingIndicator}>
      <BarChartLoaderSVG />
      <div className={classes.loadingText}>
        <div className={classes.text}>
          Loading chart data...
        </div>
      </div>
    </div>
  )
})

export const LineChartLoader = withStyles(styles)(({ classes }) => {
  return (
    <div className={classes.loadingIndicator}>
      <LineChartLoaderSVG />
      <div className={classes.loadingText}>
        <div className={classes.text}>
          Loading chart data...
        </div>
      </div>
    </div>
  )
})

export const CandleChartLoader = withStyles(styles)(({ classes }) => {
  return (
    <div className={classes.loadingIndicator}>
      <CandleChartLoaderSVG />
      <div className={classes.loadingText}>
        <div className={classes.text}>
          Loading chart data...
        </div>
      </div>
    </div>
  )
})
