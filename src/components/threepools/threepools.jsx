import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import PoolSeedingCTA from "../poolSeedingCTA/poolSeedingCTA";
import { Typography, TextField, MenuItem, Button } from "@material-ui/core";
import { colors } from '../../theme';
import { Alert } from "@material-ui/lab";
import TransactionInfo from "../transactionInfo/transactionInfo";

import Loader from "../loader/loader";
import SlippageInfo from "../slippageInfo/slippageInfo";
import { floatToFixed } from "../../utils/numbers";

import {
  ERROR,
  BASE_POOL_CONFIGURE_RETURNED,
  BALANCES_RETURNED,
  DEPOSIT_RETURNED,
  WITHDRAW_BASE,
  WITHDRAW_RETURNED,
  GET_BASE_DEPOSIT_AMOUNT,
  GET_BASE_DEPOSIT_AMOUNT_RETURNED,
  GET_WITHDRAW_AMOUNT_RETURNED,
  SLIPPAGE_INFO_RETURNED,
  DEPOSIT_BASE_POOL,
} from '../../constants';

import Store from "../../stores/store";
const emitter = Store.emitter;
const dispatcher = Store.dispatcher;
const store = Store.store;

const styles = (theme) => ({
  root: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    maxWidth: "1200px",
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  inputContainer: {
    display: "flex",
    padding: "30px",
    borderRadius: "1rem",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    margin: "40px 0px",
    // border: '1px solid '+colors.borderBlue,
    boxShadow:
      "0 10px 15px -3px rgba(56,189,248,0.1),0 4px 6px -2px rgba(56,189,248,0.05)",
    maxWidth: "500px",
    width: "80%",
    background: colors.mmfGray,
  },
  inputCardHeading: {
    width: "100%",
    color: colors.darkGray,
    paddingLeft: "12px",
  },
  valContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    marginBottom: "24px",
  },
  balances: {
    textAlign: "right",
    paddingRight: "2px",
    cursor: "pointer",
  },
  multiAssetSelectIcon: {
    display: "inline-block",
    verticalAlign: "middle",
    height: "30px",
    width: "30px",
    textAlign: "center",
    cursor: "pointer",
    marginRight: "8px",
    marginLeft: "4px",
  },
  assetSelectMenu: {
    padding: "15px 15px 15px 20px",
    minWidth: "300px",
    display: "flex",
    width: "100%",
  },
  assetSelectIcon: {
    display: "inline-block",
    verticalAlign: "middle",
    borderRadius: "25px",
    // background: "#dedede",
    height: "30px",
    width: "30px",
    textAlign: "center",
    cursor: "pointer",
    marginRight: "12px",
  },
  assetSelectIconName: {
    display: "inline-block",
    verticalAlign: "middle",
    flex: 1,
  },
  assetSelectBalance: {
    paddingLeft: "24px",
  },
  assetAdornment: {
    color: colors.text + " !important",
  },
  assetContainer: {
    minWidth: "120px",
  },
  actionButton: {
    "&:hover": {
      backgroundColor: "#c6a276",
    },
    marginTop: "24px",
    padding: "12px",
    backgroundColor: "#c6a276",
    borderRadius: "1rem",
    border: "1px solid #E1E1E1",
    fontWeight: 500,
    [theme.breakpoints.up("md")]: {
      padding: "15px",
    },
  },
  buttonText: {
    fontWeight: "700",
    color: "white",
  },
  priceContainer: {
    display: "flex",
    justifyContent: "space-evenly",
    width: "100%",
    background: "#dedede",
    borderRadius: "24px",
    padding: "24px",
  },
  priceHeading: {
    paddingBottom: "12px",
  },
  priceConversion: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  conversionDirection: {
    color: colors.darkGray,
  },
  toggleContainer: {
    width: "100%",
    display: "flex",
  },
  toggleHeading: {
    flex: 1,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: "24px",
    color: colors.darkGray,
  },
  toggleHeadingActive: {
    flex: 1,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: "24px",
    color: colors.text,
  },
  flexy: {
    width: "100%",
    display: "flex",
  },
  label: {
    flex: 1,
    paddingLeft: "2px",
    paddingBottom: "8px",
  },
  assetSelectRoot: {},
  space: {
    height: "24px",
  },
  version1: {
    // border: '1px solid '+colors.borderBlue,
    padding: "6px",
    width: "fit-content",
    borderRadius: "12px",
    background: colors.lightBlue,
    fontSize: "12px",
  },
  version2: {
    // border: '1px solid '+colors.borderBlue,
    padding: "6px",
    width: "fit-content",
    borderRadius: "12px",
    background: colors.lightBlue,
    fontSize: "12px",
  },
  poolSelectOption: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    minWidth: "300px",
    padding: "12px 12px",
  },
  gray: {
    color: colors.darkGray,
  },
});

class ThreePools extends Component {
  constructor(props) {
    super();

    const account = store.getStore("account");

    const basePools = store.getStore("basePools");
    console.log(basePools)
    const selectedBasePool =
      basePools && basePools.length > 0 ? basePools[0] : null;

    // const preSelectedPoolMatches = window.location.hash.match(/pool=([a-z0-9/-]+)/i);
    // const preSelectedPool = preSelectedPoolMatches === null ? null : preSelectedPoolMatches[1];

    let selectedPool = selectedBasePool;
    // if(pools && pools.length > 0) {
    //   const v2PoolsArr = pools.filter((pool) => {
    //     return pool.version === 2
    //   })
    //   if(v2PoolsArr.length > 0) {
    //     selectedPool = (
    //       !v2PoolsArr || v2PoolsArr.length === 0 ? null :
    //       preSelectedPool !== null ? v2PoolsArr.find(({ id }) => id === preSelectedPool) :
    //       v2PoolsArr[0]
    //     );
    //   }
    // }

    this.state = {
      account: account,
      basePools: basePools,
      pools: basePools,
      basePool: selectedBasePool ? selectedBasePool.name : "",
      pool: selectedPool ? selectedPool.id : "",
      selectedPool: selectedPool,
      poolAmount: "",
      poolAmountError: false,
      loading: !(
        basePools &&
        basePools.length > 0 &&
        basePools[0].assets.length > 0
      ),
      activeTab: "deposit",
    };

    // if(account && account.address) {
    // dispatcher.dispatch({ type: GET_BALANCES, content: {} })
    // }
  }
  componentWillMount() {
    emitter.on(ERROR, this.errorReturned);
    emitter.on(BALANCES_RETURNED, this.balancesReturned);
    emitter.on(BASE_POOL_CONFIGURE_RETURNED, this.configureReturned);
    emitter.on(DEPOSIT_RETURNED, this.depositReturned);
    emitter.on(WITHDRAW_RETURNED, this.withdrawReturned);
    emitter.on(GET_BASE_DEPOSIT_AMOUNT_RETURNED, this.getDepositAmountReturned);
    emitter.on(GET_WITHDRAW_AMOUNT_RETURNED, this.getWithdrawAmountReturned);
    emitter.on(SLIPPAGE_INFO_RETURNED, this.slippageInfoReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(ERROR, this.errorReturned);
    emitter.removeListener(BALANCES_RETURNED, this.balancesReturned);
    emitter.removeListener(
      BASE_POOL_CONFIGURE_RETURNED,
      this.configureReturned
    );
    emitter.removeListener(DEPOSIT_RETURNED, this.depositReturned);
    emitter.removeListener(WITHDRAW_RETURNED, this.withdrawReturned);
    emitter.removeListener(
      GET_BASE_DEPOSIT_AMOUNT_RETURNED,
      this.getDepositAmountReturned
    );
    emitter.removeListener(
      GET_WITHDRAW_AMOUNT_RETURNED,
      this.getWithdrawAmountReturned
    );
    emitter.removeListener(SLIPPAGE_INFO_RETURNED, this.slippageInfoReturned);
  }

  configureReturned = () => {
    const pools = store.getStore("basePools");

    let selectedPool = pools && pools.length > 0 ? pools[0] : null;

    const newStateSlice = {
      account: store.getStore("account"),
      pools: pools,
      pool: selectedPool ? selectedPool.id : "",
      selectedPool,
      loading: false,
      ...this.getStateSliceUserBalancesForSelectedPool(selectedPool),
    };
    console.log("configure returned");
    this.setState(newStateSlice);

    if (!selectedPool) return;

    this.getDepositAmount(newStateSlice);
  };

  // Returns hash map of user balances for selected pool, e.g. { BACAmount: '2.00', USDTAmount: '3.00', … }
  getStateSliceUserBalancesForSelectedPool = (selectedPool) => {
    // Repurposed this function to maintain current select value
    // Initialised it to 0
    if (!selectedPool) return {};

    return Object.assign(
      {},
      ...selectedPool.assets.map(({ symbol, balance, decimals }) => ({
        [`${symbol}Amount`]: floatToFixed(balance, decimals),
      }))
    );
  };

  getDepositAmount = (newStateSlice = {}) => {
    const futureState = {
      ...this.state,
      ...newStateSlice,
    };

    const { selectedPool } = futureState;
    if (!selectedPool) return;

    this.setState({
      depositAmount: "",
    });

    if (!selectedPool.isPoolSeeded) return;

    const amounts = selectedPool.assets
      .map(({ symbol }) => futureState[`${symbol}Amount`]) // Gather balances for that pool from state
      .map((amount) => (amount === "" || isNaN(amount) ? 0 : amount)); // Sanitize

    dispatcher.dispatch({
      type: GET_BASE_DEPOSIT_AMOUNT,
      content: { pool: selectedPool, amounts },
    });
  };

  getDepositAmountReturned = (val) => {
    this.setState({ depositAmount: val });
  };

  getWithdrawAmountReturned = (vals) => {
    this.setState({ withdrawAmounts: vals });
  };

  balancesReturned = (balances) => {
    const pools = store.getStore("pools");

    this.setState({
      pools: pools,
      pool: pools && pools.length > 0 ? pools[0].id : "",
    });
  };

  slippageInfoReturned = ({ slippagePcent }) => {
    this.setState({ slippagePcent });
  };

  depositReturned = () => {
    this.setState({ loading: false });
  };

  withdrawReturned = () => {
    this.setState({ loading: false });
  };

  errorReturned = (error) => {
    this.setState({ loading: false });
  };

  render() {
    const { classes } = this.props;
    const { loading, account, activeTab } = this.state;

    if (!account || !account.address) {
      return <div></div>;
    }

    return (
      <div className={classes.root}>
        <div className={classes.inputContainer}>
          <div>
            <Typography
              variant="h2"
              align="center"
              className={classes.poolInfoHeader}
            >
              Create LP
            </Typography>
            <div style={{ marginBottom: 10 }}></div>
            <Alert icon={false} className={classes.infoAlert}>
              Select a pool that you wish to add liquidity into. You can stake these LPs for high APR at{" "}
              <a
                href="https://mm.finance/farms"
                target="_blank"
                rel="noopener noreferrer"
              >
                MM Finance
              </a>
            </Alert>
            <div style={{ marginBottom: 20 }}></div>
          </div>
          <div className={classes.toggleContainer}>
            <Typography
              variant="h3"
              className={
                activeTab === "deposit"
                  ? classes.toggleHeadingActive
                  : classes.toggleHeading
              }
              onClick={() => {
                this.toggleDeposit();
              }}
            >
              Deposit
            </Typography>
            <Typography
              variant="h3"
              className={
                activeTab === "withdraw"
                  ? classes.toggleHeadingActive
                  : classes.toggleHeading
              }
              onClick={() => {
                this.toggleWithdraw();
              }}
            >
              Withdraw
            </Typography>
          </div>
          {activeTab === "deposit" && this.renderDeposit()}
          {activeTab === "withdraw" && this.renderWithdraw()}
          <TransactionInfo />
        </div>
        {loading && <Loader />}
      </div>
    );
  }

  renderPoolSelectInput = () => {
    const { classes } = this.props;

    const { loading, poolAmount, poolAmountError, selectedPool } =
      this.state;
    console.log({ selectedPool })
    return (
      <div className={classes.valContainer}>
        <div className={classes.flexy}>
          <div className={classes.label}>
            <Typography variant="h4">Pool</Typography>
          </div>
          <div className={classes.balances}>
            {selectedPool ? (
              <Typography
                variant="h4"
                onClick={() => {
                  this.setAmount(
                    "pool",
                    selectedPool
                      ? floatToFixed(
                        selectedPool.balance,
                        selectedPool.decimals
                      )
                      : "0"
                  );
                }}
                className={classes.value}
                noWrap
              >
                {"" +
                  (selectedPool && selectedPool.balance
                    ? floatToFixed(selectedPool.balance, 4)
                    : "0.0000")}{" "}
                {selectedPool ? selectedPool.id : ""}
              </Typography>
            ) : (
              <Typography variant="h4" className={classes.value} noWrap>
                Balance: -
              </Typography>
            )}
          </div>
        </div>
        <div>
          <TextField
            fullWidth
            disabled={loading}
            className={classes.actionInput}
            id={"poolAmount"}
            value={poolAmount}
            error={poolAmountError}
            onChange={this.onChange}
            placeholder="0.00"
            variant="outlined"
            InputProps={{
              endAdornment: (
                <div className={classes.assetContainer}>
                  {this.renderPoolSelectAsset("pool")}
                </div>
              ),
            }}
          />
        </div>
      </div>
    );
  };

  renderPoolSelectAsset = (id) => {
    const { loading, pools } = this.state;
    const { classes } = this.props;
    console.log({ loading, pools })
    return (
      <TextField
        id={id}
        name={id}
        select
        value={this.state[id]}
        onChange={this.onPoolSelectChange}
        SelectProps={{
          native: false,
          renderValue: (option) => {
            return (
              <div className={classes.assetSelectIconName}>
                {id}
                <Typography variant="h4">{option}</Typography>
              </div>
            );
          },
        }}
        fullWidth
        disabled={loading}
        placeholder={"Select"}
        className={classes.assetSelectRoot}
      >
        {pools ? pools.map(this.renderPoolSelectAssetOptions) : null}
      </TextField>
    );
  };

  renderPoolSelectAssetOptions = (option) => {
    const { classes } = this.props;
    console.log({ option })
    return (
      <MenuItem
        key={option.id}
        value={option.id}
        className={classes.poolSelectOption}
      >
        <div>
          <Typography variant="h4">{option.name}</Typography>
          {option.balance > 0 ? (
            <Typography variant="h5" className={classes.gray}>
              Bal: {option.balance ? parseFloat(option.balance).toFixed(4) : ""}
            </Typography>
          ) : (
            ""
          )}
        </div>
        {/* <Typography
          variant="h5"
          className={`${
            option.version === 1 ? classes.version1 : classes.version2
          }`}
        >
          version {option.version}
        </Typography> */}
      </MenuItem>
    );
  };

  renderPoolSelect = (id) => {
    const { loading, pools, basePool, selectedPool } = this.state;
    const { classes } = this.props;
    return (
      <div className={classes.valContainer}>
        <div className={classes.flexy}>
          <div className={classes.label}>
            <Typography variant="h4">Base Pool</Typography>
          </div>
          <div className={classes.balances}></div>
        </div>
        <div>
          <TextField
            id={"basePool"}
            name={"basePool"}
            select
            value={basePool}
            onChange={this.onPoolSelectChange}
            SelectProps={{
              native: false,
              renderValue: (option) => {
                return (
                  <div>
                    {/* <img
                      alt=""
                      src={require(`../../assets/tokens/${option?.replaceAll(
                        "/",
                        "-"
                      )}-logo.png`)}
                      className={classes.multiAssetSelectIcon}
                    /> */}
                    <div className={classes.assetSelectIconName}>
                      <Typography variant="h4">{selectedPool ? selectedPool.name : option}</Typography>
                    </div>
                  </div>
                );
              },
            }}
            fullWidth
            variant="outlined"
            disabled={loading}
            className={classes.actionInput}
            placeholder={"Select"}
          >
            {pools
              ? pools.map((basePool) => {
                return this.renderPoolOption(basePool);
              })
              : null}
          </TextField>
        </div>
      </div>
    );
  };

  renderPoolOption = (option) => {
    const { classes } = this.props;

    return (
      <MenuItem
        key={option.id}
        value={option.id}
        className={classes.assetSelectMenu}
      >
        <React.Fragment>
          <div className={classes.poolSelectOption}>
            <div className={classes.assetSelectIcon}>
              <img alt="" src={this.getLogoForAsset(option)} height="30px" />
            </div>
            <div className={classes.assetSelectIconName}>
              <Typography variant="h4">{option.name}</Typography>
              {/* <Typography variant='h5' className={`${ option.version === 1 ? classes.version1 : classes.version2 }`}>version { option.version }</Typography> */}
            </div>
          </div>
        </React.Fragment>
      </MenuItem>
    );
  };

  renderDeposit = () => {
    const { classes } = this.props;
    const { loading, selectedPool } = this.state;
    console.log("loading", loading);
    return (
      <React.Fragment>
        {this.renderPoolSelect("deposit")}
        {selectedPool && !selectedPool.isPoolSeeded && (
          <PoolSeedingCTA pool={selectedPool} isDepositForm />
        )}
        <div className={classes.space}></div>
        {selectedPool &&
          selectedPool.assets &&
          selectedPool.assets.length > 0 &&
          selectedPool.assets.map((p) => {
            return this.renderAssetInput(p, "deposit");
          })}
        {selectedPool && selectedPool.assets && (
          <div className={classes.space}></div>
        )}
        {selectedPool && selectedPool.assets && this.renderDepositAmount()}
        <Button
          className={classes.actionButton}
          variant="outlined"
          color="primary"
          disabled={loading}
          onClick={this.onDeposit}
          fullWidth
        >
          <Typography
            className={classes.buttonText}
            variant={"h4"}
            color="secondary"
          >
            {"Deposit"}
          </Typography>
        </Button>
      </React.Fragment>
    );
  };

  renderDepositAmount = () => {
    const { classes } = this.props;

    const { depositAmount = 0, slippagePcent, selectedPool } = this.state;
    // console.log(depositAmount)
    if (selectedPool && !selectedPool.isPoolSeeded) return null;

    return (
      <div className={classes.valContainer}>
        <div className={classes.flexy}>
          <div className={classes.label}>
            <Typography variant="h4">Receive</Typography>
          </div>
          <div className={classes.balances}>
            <Typography variant="h4" className={classes.value} noWrap>
              {"" +
                (selectedPool && selectedPool.balance
                  ? floatToFixed(selectedPool.balance, 4)
                  : "0.0000")}{" "}
              {selectedPool ? selectedPool.id : ""}
            </Typography>
          </div>
        </div>
        <div>
          <TextField
            fullWidth
            disabled={true}
            className={classes.actionInput}
            id={"depositAmount"}
            value={depositAmount}
            placeholder="0.00"
            variant="outlined"
            type="number"
            InputProps={{
              startAdornment: (
                <div className={classes.assetSelectIcon}>
                  <img
                    alt=""
                    src={this.getLogoForAsset(selectedPool)}
                    height="30px"
                  />
                </div>
              ),
              endAdornment: (
                <Typography
                  variant="h5"
                  style={{ minWidth: "90px", textAlign: "right" }}
                >
                  {selectedPool ? selectedPool.symbol : ""}
                </Typography>
              ),
            }}
          />
        </div>
        <SlippageInfo slippagePcent={slippagePcent} />
      </div>
    );
  };

  renderWithdraw = () => {
    const { classes } = this.props;
    const { loading } = this.state;

    return (
      <React.Fragment>
        {this.renderPoolSelectInput()}
        <Button
          className={classes.actionButton}
          variant="outlined"
          color="primary"
          disabled={loading}
          onClick={this.onWithdraw}
          fullWidth
        >
          <Typography
            className={classes.buttonText}
            variant={"h4"}
            color="secondary"
          >
            {"Withdraw"}
          </Typography>
        </Button>
      </React.Fragment>
    );
  };

  startLoading = () => {
    this.setState({ loading: true });
  };

  renderAssetInput = (asset, DorW) => {
    const { classes } = this.props;

    const { loading } = this.state;

    let type = asset.symbol;

    const amount = this.state?.[type + "Amount"] ?? 0;
    const amountError = this.state[type + "AmountError"];
    // console.log(amount);

    return (
      <div
        key={`${asset.symbol}-${asset.index}-${asset.erc20address}`}
        className={classes.valContainer}
      >
        <div className={classes.flexy}>
          <div className={classes.label}>
            <Typography variant="h4">{asset.name}</Typography>
          </div>
          <div className={classes.balances}>
            {asset ? (
              <Typography
                variant="h4"
                onClick={() => {
                  if (DorW === "withdraw") {
                    return false;
                  }
                  this.setAmount(
                    type,
                    asset ? floatToFixed(asset.balance, asset.decimals) : "0"
                  );
                }}
                className={classes.value}
                noWrap
              >
                {"" +
                  (asset && asset.balance
                    ? floatToFixed(asset.balance, 4)
                    : "0.0000")}{" "}
                {asset ? asset.symbol : ""}
              </Typography>
            ) : (
              <Typography variant="h4" className={classes.value} noWrap>
                Balance: -
              </Typography>
            )}
          </div>
        </div>
        <div>
          <TextField
            fullWidth
            disabled={loading || DorW === "withdraw"}
            className={classes.actionInput}
            id={type + "Amount"}
            value={amount}
            error={amountError}
            onChange={this.onChange}
            placeholder="0.00"
            variant="outlined"
            type="number"
            InputProps={{
              startAdornment: (
                <div className={classes.assetSelectIcon}>
                  <img alt="" src={this.getLogoForAsset(asset)} height="30px" />
                </div>
              ),
            }}
          />
        </div>
      </div>
    );
  };

  getLogoForAsset = (asset) => {
    try {
      return require("../../assets/tokens/" + asset.symbol + "-logo.png");
    } catch {
      return require("../../assets/tokens/unknown-logo.png");
    }
  };

  onPoolSelectChange = (event) => {
    const selectedPool = this.state.pools.find((pool) => {
      return pool.id === event.target.value
    })
    const newStateSlice = {
      [event.target.name]: event.target.value,
      // basePool: event.target.value,
      selectedPool,
      ...this.getStateSliceUserBalancesForSelectedPool(selectedPool),
    };
    this.setState(newStateSlice);
    this.getDepositAmount(newStateSlice);
    // If an url fragment was used to auto-select a pool, remove that
    // fragment when we change pool to revert to the naked /liquidity url.
    if (this.props.history.location.hash !== '') {
      this.props.history.replace('/liquidity');
    }
  };

  onChange = (event) => {
    const newStateSlice = {
      [event.target.id]: event.target.value,
    };
    this.setState(newStateSlice);
    this.getDepositAmount(newStateSlice);
  };

  setAmount = (symbol, balance) => {
    const newStateSlice = {
      [`${symbol}Amount`]: balance,
    };

    this.setState(newStateSlice);
    this.getDepositAmount(newStateSlice);
  };

  toggleDeposit = () => {
    if (this.state.loading) {
      return;
    }

    this.setState({ activeTab: "deposit", poolAmount: "" });

    let { pools, selectedPool } = this.state;

    if (!selectedPool) {
      return false;
    }
    if (selectedPool.version === 1) {
      selectedPool = null;

      if (pools && pools.length > 0) {
        const v2PoolsArr = pools.filter((pool) => {
          return pool.version === 2;
        });
        if (v2PoolsArr.length > 0) {
          selectedPool = v2PoolsArr[0];
        }
      }

      this.setState({
        selectedPool: selectedPool,
        pool: selectedPool ? selectedPool.id : "",
      });

      if (!selectedPool) {
        return;
      }
    }

    const val = [];
    val[selectedPool.assets[0].symbol + "Amount"] = floatToFixed(
      selectedPool.assets[0].balance,
      selectedPool.assets[0].decimals
    );
    val[selectedPool.assets[1].symbol + "Amount"] = floatToFixed(
      selectedPool.assets[1].balance,
      selectedPool.assets[1].decimals
    );
    this.setState(val);
  };

  toggleWithdraw = () => {
    if (this.state.loading) {
      return;
    }

    this.setState({ activeTab: "withdraw", poolAmount: "" });

    let { pools, pool, selectedPool } = this.state;

    if (!pools) {
      return;
    }

    if (!selectedPool) {
      selectedPool = pools[0];
      pool = pools[0].id;

      this.setState({
        selectedPool: selectedPool,
        pool: pool,
      });
    }

    const val = [];
    val[selectedPool.assets[0].symbol + "Amount"] = "";
    val[selectedPool.assets[1].symbol + "Amount"] = "";
    this.setState(val);
  };

  onDeposit = () => {
    const { selectedPool } = this.state;

    let error = false;

    let amounts = [];

    console.log(selectedPool);

    for (let i = 0; i < selectedPool.assets.length; i++) {
      amounts.push(this.state[selectedPool.assets[i].symbol + "Amount"]);
    }

    if (!error) {
      this.setState({ loading: true });
      dispatcher.dispatch({
        type: DEPOSIT_BASE_POOL,
        content: { pool: selectedPool, amounts: amounts },
      });
    }
  };

  onWithdraw = () => {
    this.setState({ poolAmountError: false });

    const { poolAmount, selectedPool } = this.state;

    if (
      !poolAmount ||
      isNaN(poolAmount) ||
      poolAmount <= 0 ||
      poolAmount > selectedPool.balance
    ) {
      this.setState({ poolAmountError: true });
      return false;
    }

    this.setState({ loading: true });
    dispatcher.dispatch({
      type: WITHDRAW_BASE,
      content: { amount: poolAmount, pool: selectedPool },
    });
  };
}

export default withRouter(withStyles(styles)(ThreePools));
