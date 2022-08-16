// TODO PCS refactor ternaries
/* eslint-disable no-nested-ternary */
import React, { useCallback, useState, useMemo, useEffect } from 'react'
import moment from 'moment'
import { withStyles } from '@material-ui/core/styles'
import Web3 from 'web3'
import { Skeleton } from '@material-ui/lab'

import { formatAmount } from '../utils/formatInfoNumbers'
import { getBscScanLink, truncateHash } from '../utils/getTransactionLink'

const ITEMS_PER_INFO_TABLE_PAGE = 10

const styles = (theme) => ({
  tableWrapper: {
    display: 'flex',
    width: '100%',
    paddingTop: '16px',
    flexDirection: 'column',
    gap: '16px',
    backgroundColor: 'rgb(39, 38, 44)',
    borderRadius: '24px',
    border: '1px solid rgb(56, 50, 65)',
    marginTop: '20px',
    minHeight: '687px'
  },
  responsiveGrid: {
    display: 'grid',
    gap: '1em',
    alignItems: 'center',
    gridTemplateColumns: '2fr 0.8fr repeat(2, 1fr)',
    padding: '0px 24px',
    [theme.breakpoints.down(800)]: {
      gridTemplateColumns: '2fr 0.8fr repeat(1, 1fr)'
    },
    [theme.breakpoints.down(575)]: {
      gridTemplateColumns: '2fr 0.8fr repeat(1, 0fr)'
    }
  },
  emptyData: {
    display: 'flex',
    alignSelf: 'center',
    padding: '20px',
    margin: 'auto'
  },
  text: {
    color: 'rgb(255, 255, 255)',
    fontWeight: '600',
    lineHeight: '1.5',
    textTransform: 'uppercase',
    fontSize: '12px'
  },
  textClickable: {
    color: 'rgb(255, 255, 255)',
    fontWeight: '600',
    lineHeight: '1.5',
    textTransform: 'uppercase',
    fontSize: '12px',
    cursor: 'pointer',
    [theme.breakpoints.down(800)]: {
      '&:nth-child(3)': {
        display: 'none'
      }
    },
    [theme.breakpoints.down(575)]: {
      '&:nth-child(4)': {
        display: 'none'
      }
    }
  },
  break: {
    height: '1px',
    width: '100%',
    backgroundColor: 'rgb(56, 50, 65)'
  },
  externalLink: {
    color: 'rgb(255, 255, 255)',
    display: 'flex',
    alignItems: 'center',
    width: 'fit-content',
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '1.5',
    textDecoration: 'none',
    [theme.breakpoints.down(800)]: {
      '&:nth-child(3)': {
        display: 'none'
      }
    }
  },
  normalText: {
    fontSize: '16px',
    fontWeight: '400',
    lineHeight: '1.5',
    [theme.breakpoints.down(575)]: {
      '&:nth-child(4)': {
        display: 'none'
      }
    }
  },
  externalIcon: {
    fill: 'rgb(255, 255, 255)',
    alignSelf: 'center',
    flexShrink: '0',
    marginLeft: '4px'
  },
  txnShorten: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '20vw'
  },
  pagination: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.2em',
    marginTop: 'auto'
  },
  arrow: {
    padding: '0 20px',
    '&:hover': {
      cursor: 'pointer'
    }
  },
  skeleton: {
    height: '45px',
    [theme.breakpoints.down(800)]: {
      '&:nth-child(3)': {
        display: 'none'
      }
    },
    [theme.breakpoints.down(575)]: {
      '&:nth-child(4)': {
        display: 'none'
      }
    }
  }
})

const SORT_FIELD = {
  tokensBought: 'tokensBought',
  boughtId: 'boughtId',
  tokensSold: 'tokensSold',
  timestamp: 'timestamp',
  buyer: 'buyer'
}

const TableLoader = ({ classes }) => {
  const loadingRow = (
    <div className={classes.responsiveGrid}>
      <Skeleton className={classes.skeleton}/>
      <Skeleton className={classes.skeleton}/>
      <Skeleton className={classes.skeleton}/>
      <Skeleton className={classes.skeleton}/>
    </div>
  )
  return (
    <>
      {loadingRow}
      {loadingRow}
      {loadingRow}
      {loadingRow}
      {loadingRow}
      {loadingRow}
      {loadingRow}
      {loadingRow}
      {loadingRow}
      {loadingRow}
    </>
  )
}

const DataRow = ({transaction, classes}) => {
  return (
    <div className={classes.responsiveGrid}>
      <a className={classes.externalLink} target="_blank" rel="noreferrer noopener"
         href={getBscScanLink(transaction.transaction, 'transaction')}>
        <div className={`${classes.normalText} ${classes.txnShorten}`}>
          {transaction.transaction}
        </div>
        <svg viewBox="0 0 24 24" color="primary" width="20px" xmlns="http://www.w3.org/2000/svg"
             className={classes.externalIcon}>
          <path
            d="M18 19H6C5.45 19 5 18.55 5 18V6C5 5.45 5.45 5 6 5H11C11.55 5 12 4.55 12 4C12 3.45 11.55 3 11 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V13C21 12.45 20.55 12 20 12C19.45 12 19 12.45 19 13V18C19 18.55 18.55 19 18 19ZM14 4C14 4.55 14.45 5 15 5H17.59L8.46 14.13C8.07 14.52 8.07 15.15 8.46 15.54C8.85 15.93 9.48 15.93 9.87 15.54L19 6.41V9C19 9.55 19.45 10 20 10C20.55 10 21 9.55 21 9V4C21 3.45 20.55 3 20 3H15C14.45 3 14 3.45 14 4Z"></path>
        </svg>
      </a>
      <div
        className={classes.normalText}>{formatAmount(parseFloat(Web3.utils.fromWei(transaction.tokensBought, 'ether')))}</div>
      <a className={classes.externalLink} target="_blank" rel="noreferrer noopener"
         href={getBscScanLink(transaction.buyer, 'address')}>
        {truncateHash(transaction.buyer)}
        <svg viewBox="0 0 24 24" color="primary" width="20px" xmlns="http://www.w3.org/2000/svg"
             className={classes.externalIcon}>
          <path
            d="M18 19H6C5.45 19 5 18.55 5 18V6C5 5.45 5.45 5 6 5H11C11.55 5 12 4.55 12 4C12 3.45 11.55 3 11 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V13C21 12.45 20.55 12 20 12C19.45 12 19 12.45 19 13V18C19 18.55 18.55 19 18 19ZM14 4C14 4.55 14.45 5 15 5H17.59L8.46 14.13C8.07 14.52 8.07 15.15 8.46 15.54C8.85 15.93 9.48 15.93 9.87 15.54L19 6.41V9C19 9.55 19.45 10 20 10C20.55 10 21 9.55 21 9V4C21 3.45 20.55 3 20 3H15C14.45 3 14 3.45 14 4Z"></path>
        </svg>
      </a>
      <div className={classes.normalText}>{moment(new Date(parseInt(transaction.timestamp) * 1000)).fromNow()}</div>
    </div>
  )
}

const TransactionTable = ({transactions, classes}) => {
  const [sortField, setSortField] = useState(SORT_FIELD.timestamp)
  const [sortDirection, setSortDirection] = useState(true)

  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)

  const sortedTransactions = useMemo(() => {
    if (transactions) {
      return transactions
        .slice()
        .sort((a, b) => {
          if (a && b) {
            if (sortField === 'tokensBought') {
              return parseFloat(Web3.utils.fromWei(a[sortField], 'ether')) > parseFloat(Web3.utils.fromWei(b[sortField], 'ether'))
                ? (sortDirection ? -1 : 1) * 1
                : (sortDirection ? -1 : 1) * -1
            }
            return a[sortField] > b[sortField]
              ? (sortDirection ? -1 : 1) * 1
              : (sortDirection ? -1 : 1) * -1
          }
          return -1
        })
        .slice(ITEMS_PER_INFO_TABLE_PAGE * (page - 1), page * ITEMS_PER_INFO_TABLE_PAGE)
    }
  }, [transactions, page, sortField, sortDirection])

  // Update maxPage based on amount of items & applied filtering
  useEffect(() => {
    if (transactions) {
      if (transactions.length % ITEMS_PER_INFO_TABLE_PAGE === 0) {
        setMaxPage(Math.floor(transactions.length / ITEMS_PER_INFO_TABLE_PAGE))
      } else {
        setMaxPage(Math.floor(transactions.length / ITEMS_PER_INFO_TABLE_PAGE) + 1)
      }
    }
  }, [transactions])

  const handleSort = useCallback(
    (newField) => {
      setSortField(newField)
      setSortDirection(sortField !== newField ? true : !sortDirection)
    },
    [sortDirection, sortField]
  )

  const arrow = useCallback(
    (field) => {
      const directionArrow = !sortDirection ? '↑' : '↓'
      return sortField === field ? directionArrow : ''
    },
    [sortDirection, sortField]
  )

  return (
    <div className={classes.tableWrapper}>
      <div className={classes.responsiveGrid}>
        <div className={classes.text}>
          Txn
        </div>
        <div
          className={classes.textClickable}
          onClick={() => handleSort(SORT_FIELD.tokensBought)}
        >
          Token Bought {arrow(SORT_FIELD.tokensBought)}
        </div>
        <div
          className={classes.textClickable}
          onClick={() => handleSort(SORT_FIELD.buyer)}
        >
          Account {arrow(SORT_FIELD.buyer)}
        </div>
        <div
          className={classes.textClickable}
          onClick={() => handleSort(SORT_FIELD.timestamp)}
        >
          Time {arrow(SORT_FIELD.timestamp)}
        </div>
      </div>
      <div className={classes.break}/>

      {transactions ? (
        <>
          {sortedTransactions.length === 0 ? (
            <div className={classes.emptyData}>
              <div className={classes.normalText}>No Transactions</div>
            </div>
          ) : sortedTransactions.map((transaction, index) => (
            <React.Fragment key={index}>
              <DataRow transaction={transaction} classes={classes}/>
              <div className={classes.break}/>
            </React.Fragment>
          ))}
          {
            maxPage > 0 && (
              <div className={classes.pagination}>
                <div className={classes.arrow}
                     onClick={() => {
                       setPage(page === 1 ? page : page - 1)
                     }}
                >
                  <svg viewBox="0 0 24 24" fill={page === 1 ? 'rgb(102, 97, 113)' : 'rgb(255, 255, 255)'} color="text"
                       width="20px"
                       xmlns="http://www.w3.org/2000/svg" className="sc-bczRLJ hIWZfT">
                    <path
                      d="M19 11H7.82998L12.71 6.12C13.1 5.73 13.1 5.09 12.71 4.7C12.32 4.31 11.69 4.31 11.3 4.7L4.70998 11.29C4.31998 11.68 4.31998 12.31 4.70998 12.7L11.3 19.29C11.69 19.68 12.32 19.68 12.71 19.29C13.1 18.9 13.1 18.27 12.71 17.88L7.82998 13H19C19.55 13 20 12.55 20 12C20 11.45 19.55 11 19 11Z"></path>
                  </svg>
                </div>
                <div className={classes.normalText}>{`Page ${page} of ${maxPage}`}</div>
                <div className={classes.arrow}
                     onClick={() => {
                       setPage(page === maxPage ? page : page + 1)
                     }}
                >
                  <svg viewBox="0 0 24 24" fill={page === maxPage ? 'rgb(102, 97, 113)' : 'rgb(255, 255, 255)'}
                       width="20px" xmlns="http://www.w3.org/2000/svg"
                       className="sc-bczRLJ hHHyze">
                    <path
                      d="M5 13H16.17L11.29 17.88C10.9 18.27 10.9 18.91 11.29 19.3C11.68 19.69 12.31 19.69 12.7 19.3L19.29 12.71C19.68 12.32 19.68 11.69 19.29 11.3L12.71 4.7C12.32 4.31 11.69 4.31 11.3 4.7C10.91 5.09 10.91 5.72 11.3 6.11L16.17 11H5C4.45 11 4 11.45 4 12C4 12.55 4.45 13 5 13Z"></path>
                  </svg>
                </div>
              </div>
            )
          }
        </>
      ) : (
        <TableLoader classes={classes}/>
      )}
    </div>
  )
}

export default withStyles(styles)(TransactionTable)
