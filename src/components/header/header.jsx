import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import { colors } from "../../theme";
import logo from "../../assets/logo.svg";
import logoWord from "../../assets/logo-word.svg";
import twitter from "../../assets/socials/twitter.svg";
import discord from "../../assets/socials/discord.svg";
import medium from "../../assets/socials/medium.svg";
import telegram from "../../assets/socials/telegram.svg";

import { CONNECTION_CONNECTED, CONNECTION_DISCONNECTED } from "../../constants";

import UnlockModal from "../unlock/unlockModal.jsx";

import Store from "../../stores";
const emitter = Store.emitter;
const store = Store.store;

const styles = (theme) => ({
  root: {
    verticalAlign: "top",
    width: "100%",
    display: "flex",
    [theme.breakpoints.down("sm")]: {
      marginBottom: "40px",
    },
  },
  headerV2: {
    background: colors.mmfGray,
    // border: '1px solid '+colors.borderBlue,
    boxShadow:
      "0 10px 15px -3px rgba(56,189,248,0.1),0 4px 6px -2px rgba(56,189,248,0.05)",

    borderTop: "none",
    width: "100%",
    // borderRadius: '0px 0px 50px 50px',
    borderRadius: "0px 0px 0px 0px",
    display: "flex",
    padding: "24px 32px",
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.down("sm")]: {
      justifyContent: "space-between",
      padding: "16px 24px",
    },
  },
  icon: {
    display: "flex",
    alignItems: "center",
    flex: 1,
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  links: {
    display: "flex",
  },
  link: {
    padding: "12px 0px",
    margin: "0px 12px",
    cursor: "pointer",
    "&:hover": {
      paddingBottom: "9px",
      borderBottom: "3px solid " + colors.borderBlue,
    },
  },
  mmfLink: {
    padding: "12px 0px",
    margin: "0px 12px",
    cursor: "pointer",
    "&:hover": {
      paddingBottom: "9px",
      borderBottom: "3px solid " + colors.borderBlue,
    },
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  title: {
    textTransform: "capitalize",
  },
  linkActive: {
    padding: "12px 0px",
    margin: "0px 12px",
    cursor: "pointer",
    paddingBottom: "9px",
    borderBottom: "3px solid " + colors.borderBlue,
  },
  account: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1,
    [theme.breakpoints.down("sm")]: {
      flex: "0",
    },
  },
  socials: {
    cursor: "pointer",
    marginLeft: "8px",
    marginRight: "8px",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  walletAddress: {
    padding: "12px",
    // border: '2px solid rgb(174, 174, 174)',
    borderRadius: "5px",
    background: "linear-gradient(90deg, #b08653 0%, #c6a276 100%)",
    color: "white",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    "&:hover": {
      // border: "2px solid "+colors.borderBlue,
      // background: 'rgba(47, 128, 237, 0.1)'
    },
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      position: "absolute",
      top: "90px",
      border: "1px solid " + colors.borderBlue,
      // background: colors.white
      background: "linear-gradient(90deg, #b08653 0%, #c6a276 100%)",
    },
  },
  walletTitle: {
    flex: 1,
    color: colors.darkGray,
  },
  connectedDot: {
    background: colors.compoundGreen,
    opacity: "1",
    borderRadius: "10px",
    width: "10px",
    height: "10px",
    marginRight: "3px",
    marginLeft: "6px",
  },
  name: {
    paddingLeft: "24px",
    [theme.breakpoints.down("sm")]: {
      display: "block",
    },
  },
});

class Header extends Component {
  constructor(props) {
    super();

    this.state = {
      account: store.getStore("account"),
      modalOpen: false,
    };
  }

  componentWillMount() {
    emitter.on(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.on(CONNECTION_DISCONNECTED, this.connectionDisconnected);
  }

  componentWillUnmount() {
    emitter.removeListener(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.removeListener(
      CONNECTION_DISCONNECTED,
      this.connectionDisconnected
    );
  }

  connectionConnected = () => {
    this.setState({ account: store.getStore("account") });
  };

  connectionDisconnected = () => {
    this.setState({ account: store.getStore("account") });
  };

  render() {
    const { classes } = this.props;

    const { account, modalOpen } = this.state;

    var address = null;
    if (account.address) {
      address =
        account.address.substring(0, 6) +
        "..." +
        account.address.substring(
          account.address.length - 4,
          account.address.length
        );
    }

    return (
      <div className={classes.root}>
        <div className={classes.headerV2}>
          <div className={classes.icon}>
            {/* <img
              alt=""
              src={ require('../../assets/YFI-logo.png') }
              height={ '40px' }
              onClick={ () => { this.nav('') } }
            /> */}
            <img src={logo} alt="logo" height="50px" />
            <img src={logoWord} alt="logo-word" height="50px" />
          </div>
          <div className={classes.links} style={{ color: colors.white }}>
            <div
              className={classes.mmfLink}
              onClick={() => {
                window.open("https://mm.finance/farms", "_blank");
              }}
            >
              <Typography variant={"h4"} className={`title`}>
                MM.Finance
              </Typography>
            </div>
            {this.renderLink("Swap")}
            {/*{this.renderLink("3MM")}*/}
            {this.renderLink("Liquidity")}
            {this.renderLink("Create")}
            {this.renderLink("Stats")}
            <div
              className={classes.link}
              onClick={() => {
                window.open(
                  "https://mmfinance.gitbook.io/mmf-money/pages/stable-swap",
                  "_blank"
                );
              }}
            >
              <Typography variant={"h4"} className={`title`}>
                Doc
              </Typography>
            </div>
          </div>

          <div className={classes.account}>
            <div style={{ marginRight: "24px" }}>
              <img
                src={twitter}
                alt="twitter"
                height="28px"
                className={classes.socials}
                onClick={() => {
                  window.open("https://twitter.com/MMFcrypto", "_blank");
                }}
              />
              <img
                src={discord}
                alt="discord"
                height="28px"
                className={classes.socials}
                onClick={() => {
                  window.open("https://discord.gg/madmeerkatnft", "_blank");
                }}
              />
              <img
                src={telegram}
                alt="telegram"
                height="28px"
                className={classes.socials}
                onClick={() => {
                  window.open("https://t.me/MMFcrypto", "_blank");
                }}
              />
              <img
                src={medium}
                alt="medium"
                height="26px"
                className={classes.socials}
                onClick={() => {
                  window.open("https://medium.com/@MMFinance", "_blank");
                }}
              />
            </div>
            {address && (
              <Typography
                variant={"h4"}
                className={classes.walletAddress}
                noWrap
              >
                {address}
                <div className={classes.connectedDot}></div>
              </Typography>
            )}
            {!address && (
              <Typography
                variant={"h4"}
                className={classes.walletAddress}
                noWrap
                onClick={this.addressClicked}
              >
                Connect your wallet
              </Typography>
            )}
          </div>
        </div>
        {modalOpen && this.renderModal()}
      </div>
    );
  }

  renderLink = (screen) => {
    const { classes } = this.props;
    return (
      <div
        className={
          window.location.pathname === "/" + screen?.toLowerCase() ||
          (screen === "swap" && window.location.pathname === "/")
            ? classes.linkActive
            : classes.link
        }
        onClick={() => {
          this.nav(screen);
        }}
      >
        <Typography variant={"h4"} className={`title`}>
          {screen}
        </Typography>
      </div>
    );
  };

  nav = (screen) => {
    this.props.history.push("/" + screen.toLowerCase());
  };

  addressClicked = () => {
    this.setState({ modalOpen: true });
  };

  closeModal = () => {
    this.setState({ modalOpen: false });
  };

  renderModal = () => {
    return (
      <UnlockModal
        closeModal={this.closeModal}
        modalOpen={this.state.modalOpen}
      />
    );
  };
}

export default withRouter(withStyles(styles)(Header));
