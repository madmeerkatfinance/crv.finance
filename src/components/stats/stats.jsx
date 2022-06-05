import React, { useEffect, useState, useMemo } from 'react'
import { withStyles } from '@material-ui/core/styles'
import moment from 'moment'
import {
  useLazyQuery,
  gql
} from '@apollo/client'
import Web3 from 'web3'
import { Skeleton } from '@material-ui/lab'

import LineChart from './components/LineChart'
import BarChart from './components/BarChart'
import TransactionsTable from './components/TransactionsTable'
import { formatAmount } from './utils/formatInfoNumbers'

const styles = (theme) => ({
  root: {
    width: '100%',
    maxWidth: '1200px',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  chartContainer: {
    lineHeight: '1',
    margin: '0px',
    border: '0px',
    verticalAlign: 'baseline',
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    padding: '0px',
    gap: '1em',
    flexDirection: 'column',
    [theme.breakpoints.up(800)]: {
      flexDirection: 'row'
    }
  },
  card: {
    lineHeight: '1',
    margin: '0px',
    border: '0px',
    verticalAlign: 'baseline',
    background: 'rgb(56, 50, 65)',
    borderRadius: '24px',
    color: 'rgb(244, 238, 255)',
    overflow: 'hidden',
    position: 'relative',
    padding: '1px 1px 3px',
    width: '100%'
  },
  wrapCard: {
    width: '100%',
    height: '100%',
    overflow: 'inherit',
    background: 'rgb(39, 38, 44)',
    borderRadius: '24px',
    padding: '16px'
  },
  title: {
    color: 'rgb(255, 255, 255)',
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '1.5'
  },
  valueHover: {
    color: 'rgb(255, 255, 255)',
    fontSize: '24px',
    fontWeight: '600',
    lineHeight: '1.5'
  },
  dateHover: {
    color: 'rgb(255, 255, 255)',
    fontSize: '16px',
    fontWeight: '400',
    lineHeight: '1.5'
  },
  wrapChart: {
    height: '250px'
  }
})

const STATS_DATA = gql`
    query GetStatsDayDatas {
        ssdayDatas {
            date
            totalVolumeUSD
            totalLiquidityUSD
            totalTransactions
        }
    }
`

const TRANSACTIONS_QUERY = gql`
    query GetUnderlyingTokenExchanges {
        underlyingTokenExchanges(subgraphError: allow, first: 100) {
            pool {
                id
            }
            buyer
            tokensBought
            boughtId
            transaction
            timestamp
            tokensSold
        }
    }
`

const Overview = ({classes}) => {
  const [liquidityHover, setLiquidityHover] = useState()
  const [liquidityDateHover, setLiquidityDateHover] = useState()
  const [volumeHover, setVolumeHover] = useState()
  const [volumeDateHover, setVolumeDateHover] = useState()
  const [getStatsData, {data: statsData}] = useLazyQuery(STATS_DATA)
  const [getTransactions, {data: transactions}] = useLazyQuery(TRANSACTIONS_QUERY)

  useEffect(() => {
    getStatsData()
    getTransactions()
  }, [])

  useEffect(() => {
    if (volumeHover == null && statsData && statsData.ssdayDatas) {
      setVolumeHover(parseFloat(Web3.utils.fromWei(statsData.ssdayDatas[statsData.ssdayDatas.length - 1].totalVolumeUSD, 'ether')))
    }
  }, [statsData, volumeHover])

  const currentDate = moment(new Date()).format('MMM DD, yyyy')

  useEffect(() => {
    if (volumeHover == null && statsData && statsData.ssdayDatas) {
      setVolumeHover(parseFloat(Web3.utils.fromWei(statsData.ssdayDatas[statsData.ssdayDatas.length - 1].totalVolumeUSD, 'ether')))
    }
  }, [statsData, volumeHover])
  useEffect(() => {
    if (liquidityHover == null && statsData && statsData.ssdayDatas) {
      setLiquidityHover(parseFloat(Web3.utils.fromWei(statsData.ssdayDatas[statsData.ssdayDatas.length - 1].totalLiquidityUSD, 'ether')))
    }
  }, [liquidityHover, statsData])

  const formattedLiquidityData = useMemo(() => {
    if (statsData && statsData.ssdayDatas && statsData.ssdayDatas.length > 0) {
      return statsData.ssdayDatas.map((day) => {
        return {
          time: new Date(day.date * 1000),
          value: parseFloat(Web3.utils.fromWei(day.totalLiquidityUSD, 'ether'))
        }
      })
    }
    return []
  }, [statsData])

  const formattedVolumeData = useMemo(() => {
    if (statsData && statsData.ssdayDatas) {
      return statsData.ssdayDatas.map((day) => {
        return {
          time: new Date(day.date * 1000),
          value: parseFloat(Web3.utils.fromWei(day.totalVolumeUSD, 'ether'))
        }
      })
    }
    return []
  }, [statsData])

  return (
    <div className={classes.root}>
      <div className={classes.chartContainer}>
        <div className={classes.card}>
          <div className={classes.wrapCard}>
            <div className={classes.title}>
              Liquidity
            </div>
            {
              liquidityHover ? (
                <div className={classes.valueHover}>
                  ${formatAmount(liquidityHover)}
                </div>
              ) : <Skeleton width={120} height={36}/>
            }
            <div className={classes.dateHover}>{liquidityDateHover ?? currentDate}</div>
            <div className={classes.wrapChart}>
              <LineChart
                data={formattedLiquidityData}
                setHoverValue={setLiquidityHover}
                setHoverDate={setLiquidityDateHover}
              />
            </div>
          </div>
        </div>
        <div className={classes.card}>
          <div className={classes.wrapCard}>
            <div className={classes.title}>
              Volume 24H
            </div>
            {
              volumeHover ? (
                <div className={classes.valueHover}>
                  ${formatAmount(volumeHover)}
                </div>
              ) : <Skeleton width={120} height={36}/>
            }
            <div className={classes.dateHover}>{volumeDateHover ?? currentDate}</div>
            <div className={classes.wrapChart}>
              <BarChart
                data={formattedVolumeData}
                setHoverValue={setVolumeHover}
                setHoverDate={setVolumeDateHover}
              />
            </div>
          </div>
        </div>
      </div>
      <TransactionsTable transactions={(transactions && transactions.underlyingTokenExchanges)} />
    </div>
  )
}

export default withStyles(styles)(Overview)
