import React, { useEffect, useState, useMemo } from 'react'
import { withStyles } from '@material-ui/core/styles'
import moment from 'moment'
import {
  useLazyQuery, gql
} from '@apollo/client'
import Web3 from 'web3'
import { Skeleton } from '@material-ui/lab'

import LineChart from './components/LineChart'
import BarChart from './components/BarChart'
import TransactionsTable from './components/TransactionsTable'
import { formatAmount } from './utils/formatInfoNumbers'

const styles = (theme) => ({
  root: {
    width: '100%', maxWidth: '1200px', marginLeft: 'auto', marginRight: 'auto', marginTop: '30px'
  }, chartContainer: {
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
  }, card: {
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
  }, wrapCard: {
    width: '100%',
    height: '100%',
    overflow: 'inherit',
    background: 'rgb(39, 38, 44)',
    borderRadius: '24px',
    padding: '16px'
  }, title: {
    color: 'rgb(255, 255, 255)', fontSize: '16px', fontWeight: '600', lineHeight: '1.5'
  }, valueHover: {
    color: 'rgb(255, 255, 255)', fontSize: '24px', fontWeight: '600', lineHeight: '1.5'
  }, dateHover: {
    color: 'rgb(255, 255, 255)', fontSize: '16px', fontWeight: '400', lineHeight: '1.5'
  }, wrapChart: {
    height: '250px'
  }
})

const STABLESWAP_STATS_QUERY = gql`
    query GetStatsDayDatas {
        ssdayDatas(orderBy: date, orderDirection: asc) {
            date
            dailyVolumeUSD
            totalLiquidityUSD
            totalTransactions
        }
    }
`

const CRO_PRICES_QUERY = gql`
    query GetPairDayData {
        pairDayDatas(
            orderDirection: desc
            orderBy: date
            where: {
                pairAddress: "0xa68466208f1a3eb21650320d2520ee8eba5ba623"
            }
        ) {
            date
            reserve0
            reserve1
        }
    }
`

const STABLESWAP_STATS_CRO_QUERY = gql`
    query GetStableSwapData {
        ssdayDatas(
            orderDirection: desc
            orderBy: date
        ) {
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

const Overview = ({ classes }) => {
  const [liquidityHover, setLiquidityHover] = useState()
  const [liquidityDateHover, setLiquidityDateHover] = useState()
  const [volumeHover, setVolumeHover] = useState()
  const [volumeDateHover, setVolumeDateHover] = useState()
  const [getStatsData, { data: statsData }] = useLazyQuery(STABLESWAP_STATS_QUERY)
  const [getTransactions, { data: transactions }] = useLazyQuery(TRANSACTIONS_QUERY)
  const [getCROPrices, { data: croPrices }] = useLazyQuery(CRO_PRICES_QUERY)
  const [getStableSwapCroStats, { data: stableSwapCroStats }] = useLazyQuery(STABLESWAP_STATS_CRO_QUERY)

  useEffect(() => {
    getCROPrices({
      context: {
        subgraph: 'mmf-exchange'
      }
    })
    getStableSwapCroStats({
      context: {
        subgraph: 'stableSwap'
      }
    })
    getStatsData({
      context: {
        subgraph: '3mm'
      }
    })
    getTransactions({
      context: {
        subgraph: '3mm'
      }
    })
  }, [getStatsData, getTransactions, getCROPrices, getStableSwapCroStats])

  useEffect(() => {
    if (volumeHover == null && statsData && statsData.ssdayDatas) {
      setVolumeHover(parseFloat(Web3.utils.fromWei(statsData.ssdayDatas[statsData.ssdayDatas.length - 1].dailyVolumeUSD, 'ether')))
    }
  }, [statsData, volumeHover])

  const currentDate = moment(new Date()).format('MMM DD, yyyy')

  useEffect(() => {
    if (liquidityHover == null && statsData && statsData.ssdayDatas) {
      setLiquidityHover(parseFloat(statsData.ssdayDatas[statsData.ssdayDatas.length - 1].totalLiquidityUSD))
    }
  }, [liquidityHover, statsData])

  const formattedCROPrice = useMemo(() => {
    if (croPrices && croPrices.pairDayDatas) {
      return croPrices.pairDayDatas.reduce((result, price) => ({
        ...result,
        [price.date]: parseFloat(price.reserve0) / parseFloat(price.reserve1)
      }), {})
    }
    return {}
  }, [croPrices])

  const formattedStableSwapCro = useMemo(() => {
    if (stableSwapCroStats && stableSwapCroStats.ssdayDatas) {
      return stableSwapCroStats.ssdayDatas.reduce((result, ssdayData) => ({
        ...result,
        [ssdayData.date]: ssdayData
      }), {})
    }
    return {}
  }, [stableSwapCroStats])

  const formattedLiquidityData = useMemo(() => {
    if (statsData && statsData.ssdayDatas && Object.keys(formattedCROPrice || {}).length > 0 && Object.keys(formattedStableSwapCro || {}).length > 0) {
      return statsData.ssdayDatas.map((day) => {
        let liquidityStableSwapCro = 0
        if (formattedStableSwapCro[day.date] && formattedCROPrice[day.date]) {
          liquidityStableSwapCro = parseFloat(formattedStableSwapCro[day.date].totalLiquidityUSD) * formattedCROPrice[day.date]
        }
        return {
          time: new Date(day.date * 1000),
          value: parseFloat(day.totalLiquidityUSD) + parseFloat(liquidityStableSwapCro.toFixed(2))
        }
      })
    }
    return []
  }, [statsData, formattedCROPrice, formattedStableSwapCro])

  const formattedVolumeData = useMemo(() => {
    if (statsData && statsData.ssdayDatas && Object.keys(formattedCROPrice || {}).length > 0 && Object.keys(formattedStableSwapCro || {}).length > 0) {
      return statsData.ssdayDatas.map((day) => {
        let volumeStableSwapCro = 0
        if (formattedStableSwapCro[day.date] && formattedCROPrice[day.date]) {
          volumeStableSwapCro = parseFloat(Web3.utils.fromWei(formattedStableSwapCro[day.date].totalVolumeUSD, 'ether')) * formattedCROPrice[day.date]
        }
        return {
          time: new Date(day.date * 1000),
          value: parseFloat(Web3.utils.fromWei(day.dailyVolumeUSD, 'ether')) + parseFloat(volumeStableSwapCro.toFixed(2))
        }
      })
    }
    return []
  }, [statsData, formattedCROPrice, formattedStableSwapCro])

  return (<div className={classes.root}>
    <div className={classes.chartContainer}>
      <div className={classes.card}>
        <div className={classes.wrapCard}>
          <div className={classes.title}>
            Liquidity
          </div>
          {liquidityHover ? (<div className={classes.valueHover}>
            ${formatAmount(liquidityHover)}
          </div>) : <Skeleton width={120} height={36}/>}
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
          {volumeHover ? (<div className={classes.valueHover}>
            ${formatAmount(volumeHover)}
          </div>) : <Skeleton width={120} height={36}/>}
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
    <TransactionsTable transactions={(transactions && transactions.underlyingTokenExchanges)}/>
  </div>)
}

export default withStyles(styles)(Overview)
