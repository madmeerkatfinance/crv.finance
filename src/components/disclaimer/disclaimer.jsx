import React from 'react'
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from "react-router-dom";
import { colors } from '../../theme'

const styles = theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '100%',
    marginTop: '40px',
    [theme.breakpoints.up('md')]: {
      minWidth: '900px',
    }
  },
  disclaimer: {
    padding: '12px',
    border: '1px solid rgb(174, 174, 174)',
    borderRadius: '0.75rem',
    lineHeight: '1.2',
    background: colors.white,
  }
});

const Disclaimer = ({ classes }) => {
  return (
    <div className={ classes.root }>
      {/* <Typography variant={'h5'} className={ classes.disclaimer }>This project is in beta. Use at your own risk.</Typography> */}
    </div>
  )
}

export default withRouter(withStyles(styles)(Disclaimer));
