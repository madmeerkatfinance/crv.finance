import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import { colors } from '../../theme'
import Liquidity from './liquidity'
import ThreePools from './threepools'

import Store from '../../stores/store'

const store = Store.store

const styles = () => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '1200px',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  inputContainer: {
    display: 'flex',
    padding: '0px',
    borderRadius: '1rem',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    margin: '40px 0px 0px',
    // border: '1px solid '+colors.borderBlue,
    boxShadow:
      '0 10px 15px -3px rgba(56,189,248,0.1),0 4px 6px -2px rgba(56,189,248,0.05)',
    maxWidth: '500px',
    width: '80%',
    background: colors.mmfGray
  },
  toggleContainer: {
    width: '100%',
    display: 'flex'
  },
  toggleHeading: {
    flex: 1,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: '24px',
    paddingTop: '24px',
    color: colors.darkGray
  },
  toggleHeadingActive: {
    flex: 1,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: '24px',
    paddingTop: '24px',
    color: colors.text,
    backgroundColor: '#362F45'
  },
  leftItem: {
    borderTopLeftRadius: '1rem',
    borderBottomLeftRadius: '1rem',
  },
  rightItem: {
    borderTopRightRadius: '1rem',
    borderBottomRightRadius: '1rem',
  }
})

class PageSwitcher extends Component {
  constructor(props) {
    super(props)

    const account = store.getStore('account')

    this.state = {
      account: account,
      activeTab: 'deposit'
    }
  }

  render() {
    const { classes } = this.props
    const { account, activeTab } = this.state

    if (!account || !account.address) {
      return <div></div>
    }

    return (
      <React.Fragment>
        <div className={classes.root}>
          <div className={classes.inputContainer}>
            <div className={classes.toggleContainer}>
              <Typography
                variant="h3"
                className={
                  activeTab === 'deposit'
                    ? `${classes.toggleHeadingActive} ${classes.leftItem}`
                    : classes.toggleHeading
                }
                onClick={() => {
                  this.toggleDeposit()
                }}
              >
                3MM
              </Typography>
              <Typography
                variant="h3"
                className={
                  activeTab === 'withdraw'
                    ? `${classes.toggleHeadingActive} ${classes.rightItem}`
                    : classes.toggleHeading
                }
                onClick={() => {
                  this.toggleWithdraw()
                }}
              >
                Liquidity
              </Typography>
            </div>
          </div>
        </div>
        {activeTab === 'deposit' && <Liquidity/>}
        {activeTab === 'withdraw' && <ThreePools/>}
      </React.Fragment>
    )
  }

  toggleDeposit = () => {
    this.setState({ activeTab: 'deposit' })
  }

  toggleWithdraw = () => {
    this.setState({ activeTab: 'withdraw' })
  }
}

export default withRouter(withStyles(styles)(PageSwitcher))
