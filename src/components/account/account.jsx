import React from 'react'
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import { Typography, Button } from '@material-ui/core'
import { colors } from '../../theme'

import UnlockModal from '../unlock/unlockModal.jsx'

const styles = () => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundImage: 'linear-gradient(to bottom right, #b08653, #c6a276)',

    // background: colors.purple,
    minWidth: '100vw',
    padding: '36px 24px'
  },
  connectHeading: {
    maxWidth: '300px',
    textAlign: 'center',
    color: colors.white
  },
  connectContainer: {
    padding: '20px'
  },
  actionButton: {
    color: colors.white,
    borderColor: colors.white
  },
  notConnectedRoot: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  connectedRoot: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%'
  },
  address: {
    color: colors.white,
    width: '100%',
    paddingBottom: '24px',
    display: 'flex',
    justifyContent: 'space-between'
  },
  balances: {
    color: colors.white,
    width: '100%',
    padding: '12px'
  },
  balanceContainer: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between'
  },
  accountHeading: {
    paddingBottom: '6px'
  },
  icon: {
    cursor: 'pointer'
  },
  disclaimer: {
    padding: '12px',
    border: '1px solid ' + colors.white,
    borderRadius: '0.75rem',
    marginBottom: '24px',
    fontWeight: 1,
    color: colors.white
  }
})

const Account = ({ classes }) => {
  const [modalOpen, setModalOpen] = React.useState(false)

  const unlockClicked = () => {
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(true)
  }

  const renderNotConnected = () => {
    return (
      <div className={classes.notConnectedRoot}>
        {/* <Typography variant={'h5'} className={ classes.disclaimer }>This project is in beta. Use at your own risk.</Typography> */}
        <div className={classes.connectHeading}>
          <Typography variant="h3">Connect your Wallet to Continue</Typography>
        </div>
        <div className={classes.connectContainer}>
          <Button
            className={classes.actionButton}
            variant="outlined"
            color="primary"
            onClick={unlockClicked}
            disabled={modalOpen}
          >
            <Typography>Connect</Typography>
          </Button>
        </div>
      </div>
    )
  }

  const renderModal = () => {
    return (
      <UnlockModal
        closeModal={closeModal}
        modalOpen={modalOpen}
      />
    )
  }

  return (
    <div className={classes.root}>
      {renderNotConnected()}
      {modalOpen && renderModal()}
    </div>
  )
}

export default withRouter(withStyles(styles)(Account))
