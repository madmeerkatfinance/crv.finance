import React from "react";
import PropTypes from "prop-types";
import { Alert } from "@material-ui/lab";
import { withStyles } from "@material-ui/core/styles";
import { colors } from "../../theme";

const styles = () => ({
  infoAlert: {
    backgroundColor: "transparent",
    color: colors.lightBlue,
    textAlign: "center",
  },
});

const TransactionInfo = ({ classes }) => {
  return (
    <Alert icon={false} className={classes.infoAlert}>
      Do make sure to follow through the transactions by approving the assets
      that you will be utilizing followed by executing the action
    </Alert>
  );
};

TransactionInfo.propTypes = {
  classes: PropTypes.object.isRequired,
  slippagePcent: PropTypes.number,
};

TransactionInfo.defaultProps = {
  slippagePcent: undefined,
};

export default withStyles(styles)(TransactionInfo);
