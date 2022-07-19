import config from '../config'
import async from 'async'
import memoize from 'memoizee'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { bnToFixed, multiplyBnToFixed, sumArray } from '../utils/numbers'

import {
  ADD_POOL,
  ADD_POOL_RETURNED,
  BALANCES_RETURNED,
  BASE_POOL_CONFIGURE_RETURNED,
  CONFIGURE,
  CONFIGURE_RETURNED,
  DEPOSIT,
  DEPOSIT_BASE_POOL,
  DEPOSIT_RETURNED,
  ERROR,
  GET_ASSET_INFO,
  GET_ASSET_INFO_RETURNED,
  GET_BALANCES,
  GET_BASE_DEPOSIT_AMOUNT,
  GET_BASE_DEPOSIT_AMOUNT_RETURNED,
  GET_DEPOSIT_AMOUNT,
  GET_DEPOSIT_AMOUNT_RETURNED,
  GET_SWAP_AMOUNT,
  GET_WITHDRAW_AMOUNT,
  MAX_UINT256,
  SLIPPAGE_INFO_RETURNED,
  SNACKBAR_ERROR,
  SNACKBAR_TRANSACTION_HASH,
  SWAP,
  SWAP_AMOUNT_RETURNED,
  SWAP_RETURNED,
  WCRO_TOKEN,
  WITHDRAW,
  WITHDRAW_BASE,
  WITHDRAW_RETURNED,
  ZERO_ADDRESS
} from '../constants'
import Web3 from 'web3'

import { deficonnect, injected } from './connectors'

const rp = require('request-promise')

const Dispatcher = require('flux').Dispatcher
const Emitter = require('events').EventEmitter

const dispatcher = new Dispatcher()
const emitter = new Emitter()

class Store {
  constructor() {
    this.store = {
      pools: [],
      basePools: [
        {
          id: '3MM',
          name: 'DAI/USDC/USDT Pool',
          address: '0x61bB2F4a4763114268a47fB990e633Cb40f045F8',
          tokenAddress: '0x74759c8BCb6787ef25eD2ff432FE33ED57CcCB0D', // MM DAI-USDC-USDT
          balance: 0,
          decimals: 18,
          assets: [
            {
              index: 0,
              id: 'DAI',
              name: 'DAI',
              symbol: 'DAI',
              description: 'DAI',
              erc20address: '0xF2001B145b43032AAF5Ee2884e456CCd805F677D',
              balance: 0,
              decimals: 18
            },
            {
              index: 1,
              id: 'USDC',
              name: 'USD Coin',
              symbol: 'USDC',
              description: 'USDC',
              erc20address: '0xc21223249CA28397B4B6541dfFaEcC539BfF0c59',
              balance: 0,
              decimals: 6
            },
            {
              index: 2,
              id: 'USDT',
              name: 'USDT Coin',
              symbol: 'USDT',
              description: 'USDT',
              erc20address: '0x66e428c3f67a68878562e79A0234c1F83c208770',
              balance: 0,
              decimals: 6
            }
          ]
        },
        {
          id: 'bcroMM',
          name: 'CRO/bCRO Pool',
          address: '0xbF369D9c0Ab3107F4823a39B2fD2Ca0Ff5310425',
          tokenAddress: '0xB996cE5bd3551C3A95A39AFb7dfdDD552657e38e', // MM bCRO
          balance: 0,
          decimals: 18,
          assets: [
            {
              index: 0,
              id: 'CRO',
              name: 'CRO',
              symbol: 'CRO',
              description: 'CRO',
              erc20address: WCRO_TOKEN,
              balance: 0,
              decimals: 18
            },
            {
              index: 1,
              id: 'bCRO',
              name: 'Bonded CRO',
              symbol: 'bCRO',
              description: 'bCRO',
              erc20address: '0xeBAceB7F193955b946cC5dd8f8724a80671a1F2F',
              balance: 0,
              decimals: 18
            }
          ]
        }
        // {
        //   id: 'BTC',
        //   name: 'renBTC/wBTC/sBTC Pool',
        //   erc20address: '0x7fC77b5c7614E1533320Ea6DDc2Eb61fa00A9714',
        //   balance: 0,
        //   decimals: 18,
        //   assets: [
        //     {
        //       index: 0,
        //       id: 'renBTC',
        //       name: 'renBTC',
        //       symbol: 'renBTC',
        //       description: 'renBTC',
        //       erc20address: '0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D',
        //       balance: 0,
        //       decimals: 8,
        //     },
        //     {
        //       index: 1,
        //       id: 'WBTC',
        //       name: 'Wrapped BTC',
        //       symbol: 'WBTC',
        //       description: 'Wrapped BTC',
        //       erc20address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
        //       balance: 0,
        //       decimals: 8,
        //     },
        //     {
        //       id: 'sBTC',
        //       name: 'Synth sBTC',
        //       symbol: 'sBTC',
        //       description: 'Synth sBTC',
        //       erc20address: '0xfE18be6b3Bd88A2D2A7f928d00292E7a9963CfC6',
        //       balance: 0,
        //       decimals: 18,
        //     },
        //   ]
        // }
      ],
      connectorsByName: {
        MetaMask: injected,
        'Crypto.com Defi': deficonnect,
        TrustWallet: injected
        // WalletConnect: walletconnect,
        // WalletLink: walletlink,
        // Ledger: ledger,
        // Trezor: trezor,
        // Frame: frame,
        // Fortmatic: fortmatic,
        // Portis: portis,
        // Squarelink: squarelink,
        // Torus: torus,
        // Authereum: authereum
      },
      account: {},
      web3context: null
    }

    dispatcher.register(
      function (payload) {
        switch (payload.type) {
          case CONFIGURE:
            this.configure(payload)
            break
          case GET_BALANCES:
            this.getBalances(payload)
            break
          case DEPOSIT:
            this.deposit(payload)
            break
          case DEPOSIT_BASE_POOL:
            this.depositBasePool(payload)
            break
          case WITHDRAW:
            this.withdraw(payload)
            break
          case WITHDRAW_BASE:
            this.withdrawBasePool(payload)
            break
          case SWAP:
            this.swap(payload)
            break
          case GET_SWAP_AMOUNT:
            this.getSwapAmount(payload)
            break
          case GET_ASSET_INFO:
            this.getAssetInfo(payload)
            break
          case ADD_POOL:
            this.addPool(payload)
            break
          case GET_DEPOSIT_AMOUNT:
            this.getDepositAmount(payload)
            break
          case GET_BASE_DEPOSIT_AMOUNT:
            this.getBaseDepositAmount(payload)
            break
          default:
            break
        }
      }.bind(this)
    )
  }

  getStore(index) {
    return this.store[index]
  }

  setStore(obj) {
    this.store = { ...this.store, ...obj }
    return emitter.emit('StoreUpdated')
  }

  _checkApproval2 = async (asset, account, amount, contract) => {
    try {
      // console.log(asset)
      const web3 = await this._getWeb3Provider()
      const erc20Contract = new web3.eth.Contract(
        config.erc20ABI,
        asset.erc20address
      )
      console.log("address", asset.erc20address)
      console.log("account", account.address)
      console.log("contract", contract)
      const allowance = await erc20Contract.methods
        .allowance(account.address, contract)
        .call({ from: account.address })
      console.log(allowance);
      let ethAllowance = web3.utils.fromWei(allowance, 'ether')
      if (asset.decimals !== 18) {
        ethAllowance = (allowance * 10 ** asset.decimals).toFixed(0)
      }
      console.log('allowance', ethAllowance)
      if (parseFloat(ethAllowance) < parseFloat(amount)) {
        await erc20Contract.methods
          .approve(contract, MAX_UINT256)
          .send({ from: account.address })

        return true
      } else {
        return true
      }
    } catch (error) {
      console.log(error)
      if (error.message) {
        return false
      }
      return false
    }
  }

  _checkApproval = async (asset, account, amount, contract, callback) => {
    try {
      const web3 = await this._getWeb3Provider()
      const erc20Contract = new web3.eth.Contract(
        config.erc20ABI,
        asset.erc20address
      )
      const allowance = await erc20Contract.methods
        .allowance(account.address, contract)
        .call({ from: account.address })

      let ethAllowance = web3.utils.fromWei(allowance, 'ether')
      if (asset.decimals !== 18) {
        ethAllowance = (allowance * 10 ** asset.decimals).toFixed(0)
      }

      if (parseFloat(ethAllowance) < parseFloat(amount)) {
        await erc20Contract.methods
          .approve(contract, MAX_UINT256)
          .send({ from: account.address })
        callback()
      } else {
        callback()
      }
    } catch (error) {
      if (error.message) {
        return callback(error.message)
      }
      callback(error)
    }
  }

  configure = async () => {
    const account = store.getStore('account')
    const basePools = store.getStore('basePools')

    if (!account || !account.address) {
      return false
    }

    const web3 = await this._getWeb3Provider()
    // let poolsV1 = await this._getPools(web3)
    let poolsV2 = await this._getPoolsV2(web3)

    if (!poolsV2) {
      poolsV2 = []
    }
    // if(!poolsV1) {
    //   poolsV1 = []
    // }

    const pools = [...poolsV2]

    async.map(
      basePools,
      (pool, callback) => {
        this._getBasePoolData(web3, pool, account, callback)
      },
      (err, basePoolData) => {
        if (err) {
          emitter.emit(ERROR, err)
          return emitter.emit(SNACKBAR_ERROR, err)
        }

        store.setStore({ basePools: basePoolData })
        console.log(BASE_POOL_CONFIGURE_RETURNED)
        return emitter.emit(BASE_POOL_CONFIGURE_RETURNED)
      }
    )

    async.map(
      pools,
      (pool, callback) => {
        this._getPoolData(web3, pool, account, callback)
      },
      (err, poolData) => {
        if (err) {
          emitter.emit(ERROR, err)
          return emitter.emit(SNACKBAR_ERROR, err)
        }

        store.setStore({ pools: poolData })
        return emitter.emit(CONFIGURE_RETURNED)
      }
    )
  }

  // _getPools = async (web3) => {
  //   try {
  //     const curveFactoryContract = new web3.eth.Contract(
  //       config.curveFactoryABI,
  //       config.curveFactoryAddress
  //     );
  //
  //     const poolCount = await curveFactoryContract.methods.pool_count().call();
  //
  //     const pools = await Promise.all(
  //       [...Array(parseInt(poolCount)).keys()].map((i) =>
  //         curveFactoryContract.methods.pool_list(i).call()
  //       )
  //     );
  //
  //     return pools.map((poolAddress) => {
  //       return {
  //         version: 1,
  //         address: poolAddress,
  //       };
  //     });
  //   } catch (ex) {
  //     emitter.emit(ERROR, ex);
  //     emitter.emit(SNACKBAR_ERROR, ex);
  //   }
  // };

  _getPoolsV2 = async (web3) => {
    try {
      const curveFactoryContract = new web3.eth.Contract(
        config.curveFactoryV2ABI,
        config.curveFactoryV2Address
      )
      const poolCount = await curveFactoryContract.methods.pool_count().call()

      const pools = await Promise.all(
        [...Array(parseInt(poolCount)).keys()].map((i) =>
          curveFactoryContract.methods.pool_list(i).call()
        )
      )
      // console.log("pools", pools, poolCount)

      return pools.map((poolAddress) => {
        return {
          version: 2,
          address: poolAddress
        }
      })
    } catch (ex) {
      emitter.emit(ERROR, ex)
      emitter.emit(SNACKBAR_ERROR, ex)
    }
  }

  getBalances = async () => {
    const account = store.getStore('account')

    if (!account || !account.address) {
      return false
    }

    await this._getWeb3Provider()
    return emitter.emit(BALANCES_RETURNED)
  }

  _getCoinData = memoize(
    async ({ web3, filteredCoins, pool, coinAddress, accountAddress }) => {
      const erc20Contract = new web3.eth.Contract(
        config.erc20ABI,
        coinAddress
      )
      const calls = ['symbol', 'decimals', 'name'].map((method) => ({
        name: method,
        address: coinAddress
      }))

      let [[symbol], [decimalsResp], [name]] = await this._multicall(config.erc20ABI, calls)



      let balance
      if (pool.id === 'bcroMM' && coinAddress === WCRO_TOKEN) {
        balance = await web3.eth.getBalance(accountAddress)
        symbol = "CRO";
        name = "CRO";
      } else {
        balance = await erc20Contract.methods
          .balanceOf(accountAddress)
          .call()
      }

      const decimals = parseInt(decimalsResp)
      const bnDecimals = new BigNumber(10).pow(decimals)

      balance = new BigNumber(balance)
        .dividedBy(bnDecimals)
        .toFixed(decimals, BigNumber.ROUND_DOWN)

      // console.log(filteredCoins, coinAddress, filteredCoins.indexOf(coinAddress))
      return {
        index: filteredCoins.indexOf(coinAddress),
        erc20address: coinAddress,
        symbol,
        decimals,
        name,
        balance
      }
    },
    {
      promise: true,
      normalizer: ([{ coinAddress, accountAddress, filteredCoins }]) =>
        `${coinAddress}-${accountAddress}-${filteredCoins.length}`
    }
  )

  _getPoolData = async (web3, pool, account, callback) => {
    try {
      const erc20Contract = new web3.eth.Contract(
        config.erc20ABI,
        pool.address
      )
      const calls = ['symbol', 'decimals', 'name'].map((method) => ({
        name: method,
        address: pool.address
      }))

      let [[symbol], [decimalsResp], [name]] = await this._multicall(config.erc20ABI, calls)

      let balance
      if (pool.id === 'bcroMM' && pool.address === WCRO_TOKEN) {
        balance = await web3.eth.getBalance(account.address)
        symbol = "CRO";
        name = "CRO";
      } else {
        balance = await erc20Contract.methods
          .balanceOf(account.address)
          .call()
      }

      // let balance = await erc20Contract.methods
      //   .balanceOf(account.address)
      //   .call()
      const decimals = parseInt(decimalsResp)
      const bnDecimals = new BigNumber(10).pow(decimals)

      balance = new BigNumber(balance)
        .dividedBy(bnDecimals)
        .toFixed(decimals, BigNumber.ROUND_DOWN)

      const curveFactoryCalls = ['get_balances', 'get_underlying_coins'].map((method) => ({
        name: method,
        address: config.curveFactoryV2Address,
        params: [pool.address]
      }))

      const [[poolBalances], [coins]] = await this._multicall(config.curveFactoryV2ABI, curveFactoryCalls)
      const isPoolSeeded = sumArray(poolBalances) !== 0

      const filteredCoins = coins.filter((coin) => {
        return coin !== ZERO_ADDRESS
      })

      async.map(
        filteredCoins,
        async (coin, callbackInner) => {
          try {
            const returnCoin = await this._getCoinData({
              web3,
              filteredCoins,
              coinAddress: coin,
              accountAddress: account.address,
              pool
            })

            if (callbackInner) {
              callbackInner(null, returnCoin)
            } else {
              return returnCoin
            }
          } catch (ex) {
            console.log(ex)

            if (callbackInner) {
              callbackInner(ex)
            } else {
              throw ex
            }
          }
        },
        (err, assets) => {
          if (err) {
            emitter.emit(ERROR, err)
            return emitter.emit(SNACKBAR_ERROR, err)
          }

          let liquidityAddress = config.usdDepositerAddress
          let liquidityABI = config.usdDepositerABI

          // console.log(assets)
          // const basePools = store.getStore('basePools')

          // if(assets[1].erc20address.toLowerCase() === '0x6B175474E89094C44Da98b954EedeAC495271d0F'.toLowerCase()) {
          //   liquidityAddress = config.usdDepositerAddress
          //   liquidityABI = config.usdDepositerABI
          // } else {
          //   liquidityAddress = config.btcDepositerAddress
          //   liquidityABI = config.btcDepositerABI
          // }
          callback(null, {
            version: pool.version,
            address: pool.address,
            liquidityAddress: liquidityAddress,
            liquidityABI: liquidityABI,
            symbol: symbol,
            decimals: decimals,
            name: name,
            balance: balance.toString(),
            isPoolSeeded,
            id: `${symbol}-${pool.version}`,
            assets: assets
          })
        }
      )
    } catch (ex) {
      console.log(ex)
      return callback(ex)
    }
  }

  _getBasePoolData = async (web3, pool, account, callback) => {
    try {
      const erc20Contract = new web3.eth.Contract(
        config.erc20ABI,
        pool.tokenAddress
      )

      const calls = ['symbol', 'decimals', 'name'].map((method) => ({
        name: method,
        address: pool.tokenAddress
      }))

      let [[symbol], [decimalsResp], [name]] = await this._multicall(config.erc20ABI, calls)

      let balance
      if (pool.id === 'bcroMM' && pool.tokenAddress === WCRO_TOKEN) {
        balance = await web3.eth.getBalance(account.address)
        symbol = "CRO";
        name = "CRO";
      } else {
        balance = await erc20Contract.methods
          .balanceOf(account.address)
          .call()
      }

      // let balance = await erc20Contract.methods
      //   .balanceOf(account.address)
      //   .call()
      const decimals = parseInt(decimalsResp)
      const bnDecimals = new BigNumber(10).pow(decimals)

      balance = new BigNumber(balance)
        .dividedBy(bnDecimals)
        .toFixed(decimals, BigNumber.ROUND_DOWN)
      console.log(pool.assets)
      async.map(
        pool.assets,
        async (coin, callbackInner) => {
          try {
            const returnCoin = await this._getCoinData({
              web3,
              filteredCoins: pool.assets.map((x) => x.erc20address),
              coinAddress: coin.erc20address,
              accountAddress: account.address,
              pool
            })

            if (callbackInner) {
              callbackInner(null, returnCoin)
            } else {
              return returnCoin
            }
          } catch (ex) {
            console.log(ex)

            if (callbackInner) {
              callbackInner(ex)
            } else {
              throw ex
            }
          }
        },
        (err, assets) => {
          if (err) {
            emitter.emit(ERROR, err)
            return emitter.emit(SNACKBAR_ERROR, err)
          }
          // debugger
          // let liquidityAddress = ''
          // let liquidityABI = ''

          // if(assets[1].erc20address.toLowerCase() === '0x6B175474E89094C44Da98b954EedeAC495271d0F'.toLowerCase()) {
          //   liquidityAddress = config.usdDepositerAddress
          //   liquidityABI = config.usdDepositerABI
          // } else {
          //   liquidityAddress = config.btcDepositerAddress
          //   liquidityABI = config.btcDepositerABI
          // }

          callback(null, {
            address: pool.address,
            tokenAddress: pool.tokenAddress,
            symbol: symbol,
            decimals: decimals,
            name: name,
            balance: balance.toString(),
            isPoolSeeded: true,
            id: pool.id,
            assets: assets
          })
        }
      )
    } catch (ex) {
      console.log(ex)
      return callback(ex)
    }
  }

  deposit = async (payload) => {
    try {
      const { pool, amounts } = payload.content
      const account = store.getStore('account')
      const web3 = await this._getWeb3Provider()

      await Promise.all(
        pool.assets.map((asset, index) => {
          return this._checkApproval2(
            asset,
            account,
            amounts[index],
            pool.liquidityAddress
          );
        })
      );

      const amountsBN = amounts.map((amount, index) => {
        let amountToSend = web3.utils.toWei(amount.toString(), 'ether')
        if (pool.assets[index].decimals !== 18) {
          const decimals = new BigNumber(10).pow(pool.assets[index].decimals)

          amountToSend = new BigNumber(amount).times(decimals).toFixed(0)
        }

        return amountToSend
      })

      console.log(amountsBN)

      this._callAddLiquidity(web3, account, pool, amountsBN, (err, a) => {
        if (err) {
          emitter.emit(ERROR, err)
          return emitter.emit(SNACKBAR_ERROR, err)
        }

        emitter.emit(DEPOSIT_RETURNED)
      })
    } catch (ex) {
      emitter.emit(ERROR, ex)
      emitter.emit(SNACKBAR_ERROR, ex)
    }
  }

  depositBasePool = async (payload) => {
    try {
      console.log(payload)
      const { pool, amounts } = payload.content
      const account = store.getStore('account')
      const web3 = await this._getWeb3Provider()

      const approvals = await Promise.all(
        pool.assets.map((asset, index) => {
          return this._checkApproval2(
            asset,
            account,
            amounts[index],
            pool.address
          )
        })
      )

      console.log(approvals)

      const amountsBN = amounts.map((amount, index) => {
        let amountToSend = web3.utils.toWei(amount, 'ether')
        if (pool.assets[index].decimals !== 18) {
          const decimals = new BigNumber(10).pow(pool.assets[index].decimals)

          amountToSend = new BigNumber(amount).times(decimals).toFixed(0)
        }

        return amountToSend
      })

      console.log(amountsBN)

      this._callAddLiquidityBasePool(
        web3,
        account,
        pool,
        amountsBN,
        (err, a) => {
          if (err) {
            emitter.emit(ERROR, err)
            return emitter.emit(SNACKBAR_ERROR, err)
          }

          emitter.emit(DEPOSIT_RETURNED)
        }
      )
    } catch (ex) {
      emitter.emit(ERROR, ex)
      emitter.emit(SNACKBAR_ERROR, ex)
    }
  }

  _callAddLiquidityBasePool = async (
    web3,
    account,
    pool,
    amounts,
    callback
  ) => {
    const basePoolContract = new web3.eth.Contract(
      pool.id === 'bcroMM' ? config.basePool2TokenABI : config.basePoolABI,
      pool.address
    )
    let receive = '0'
    try {
      const amountToReceive = await basePoolContract.methods
        .calc_token_amount(amounts, true)
        .call()
      console.log({ amountToReceive })
      receive = new BigNumber(amountToReceive)
        .times(95)
        .dividedBy(100)
        .toFixed(0)
    } catch (ex) {
      console.log('_callAddLiquidityBasePool', pool.address, ex)
      // if we can't calculate, we need to check the totalSupply
      // if 0, we just set receive to 0
      // if not 0, we throw an exception because it shouldn't be.
      // const tokenContract = new web3.eth.Contract(
      //   config.erc20ABI,
      //   pool.address
      // );
      // const totalSupply = await tokenContract.methods.totalSupply().call();
      receive = '0'
      // if (totalSupply == 0) {
      //   receive = "0";
      // } else {
      //   return callback(ex);
      // }
    }

    console.log(pool.address, amounts, receive)
    // There's a UI bug in the amounts passed as well.

    basePoolContract.methods
      .add_liquidity(amounts, receive)
      .send({ from: account.address, ...pool.id === 'bcroMM' ? { value: amounts[0] } : {} })
      .on('transactionHash', function (hash) {
        emitter.emit(SNACKBAR_TRANSACTION_HASH, hash)
        callback(null, hash)
      })
      .on('confirmation', function (confirmationNumber, receipt) {
        if (confirmationNumber === 1) {
          dispatcher.dispatch({ type: CONFIGURE, content: {} })
        }
      })
      .on('receipt', function (receipt) {
      })
      .on('error', function (error) {
        if (error.message) {
          return callback(error.message)
        }
        callback(error)
      })
  }

  _callAddLiquidity = async (web3, account, pool, amounts, callback) => {
    const metapoolContract = new web3.eth.Contract(
      pool.liquidityABI,
      pool.liquidityAddress
    )

    console.log(pool.liquidityAddress)
    let receive = '0'
    try {
      const amountToReceive = await metapoolContract.methods
        .calc_token_amount(pool.address, amounts, true)
        .call()
      receive = new BigNumber(amountToReceive)
        .times(95)
        .dividedBy(100)
        .toFixed(0)
    } catch (ex) {
      console.log(ex)
      //if we can't calculate, we need to check the totalSupply
      // if 0, we just set receive to 0
      // if not 0, we throw an exception because it shouldn't be.
      const tokenContract = new web3.eth.Contract(
        config.erc20ABI,
        pool.address
      )
      const totalSupply = await tokenContract.methods.totalSupply().call()
      console.log(totalSupply)
      if (totalSupply === 0) {
        receive = '0'
      } else {
        return callback(ex)
      }
    }

    console.log(pool.address, amounts, receive)

    metapoolContract.methods
      .add_liquidity(pool.address, amounts, receive)
      .send({ from: account.address })
      .on('transactionHash', function (hash) {
        emitter.emit(SNACKBAR_TRANSACTION_HASH, hash)
        callback(null, hash)
      })
      .on('confirmation', function (confirmationNumber, receipt) {
        if (confirmationNumber === 1) {
          dispatcher.dispatch({ type: CONFIGURE, content: {} })
        }
      })
      .on('receipt', function (receipt) {
      })
      .on('error', function (error) {
        if (error.message) {
          return callback(error.message)
        }
        callback(error)
      })
  }

  withdraw = async (payload) => {
    try {
      const { pool, amount } = payload.content
      const account = store.getStore('account')
      const web3 = await this._getWeb3Provider()

      let amountToSend = web3.utils.toWei(amount, 'ether')
      if (pool.decimals !== 18) {
        const decimals = new BigNumber(10).pow(pool.decimals)

        amountToSend = new BigNumber(amount).times(decimals).toFixed(0)
      }

      console.log(pool)

      await this._checkApproval2(
        { erc20address: pool.address, decimals: 18 },
        account,
        amountToSend,
        pool.liquidityAddress
      )

      this._callRemoveLiquidity(web3, account, pool, amountToSend, (err, a) => {
        if (err) {
          emitter.emit(ERROR, err)
          return emitter.emit(SNACKBAR_ERROR, err)
        }

        emitter.emit(WITHDRAW_RETURNED)
      })
    } catch (ex) {
      emitter.emit(ERROR, ex)
      emitter.emit(SNACKBAR_ERROR, ex)
    }
  }

  _callRemoveLiquidity = async (
    web3,
    account,
    pool,
    amountToSend,
    callback
  ) => {

    //calcualte minimum amounts ?

    if (pool.id === 'MUSD3MM-2') {
      const metapoolContract = new web3.eth.Contract(
        pool.liquidityABI,
        pool.liquidityAddress
      )
      metapoolContract.methods
        .remove_liquidity(pool.address, amountToSend, [0, 0, 0, 0])
        .send({ from: account.address })
        .on('transactionHash', function (hash) {
          emitter.emit(SNACKBAR_TRANSACTION_HASH, hash)
          callback(null, hash)
        })
        .on('confirmation', function (confirmationNumber, receipt) {
          if (confirmationNumber === 1) {
            dispatcher.dispatch({ type: CONFIGURE, content: {} })
          }
        })
        .on('receipt', function (receipt) {
        })
        .on('error', function (error) {
          if (error.message) {
            return callback(error.message)
          }
          callback(error)
        })
    } else {
      const metapoolContract = new web3.eth.Contract(
        pool.id === 'bcroMM' ? config.basePool2TokenABI : config.basePoolABI,
        pool.address
      )
      metapoolContract.methods
        .remove_liquidity(amountToSend, [0, 0])
        .send({ from: account.address })
        .on('transactionHash', function (hash) {
          emitter.emit(SNACKBAR_TRANSACTION_HASH, hash)
          callback(null, hash)
        })
        .on('confirmation', function (confirmationNumber, receipt) {
          if (confirmationNumber === 1) {
            dispatcher.dispatch({ type: CONFIGURE, content: {} })
          }
        })
        .on('receipt', function (receipt) {
        })
        .on('error', function (error) {
          if (error.message) {
            return callback(error.message)
          }
          callback(error)
        })
    }

    // metapoolContract.methods
    //   .remove_liquidity(pool.address, amountToSend, [0, 0, 0, 0])
    //   .send({ from: account.address })
    //   .on('transactionHash', function (hash) {
    //     emitter.emit(SNACKBAR_TRANSACTION_HASH, hash)
    //     callback(null, hash)
    //   })
    //   .on('confirmation', function (confirmationNumber, receipt) {
    //     if (confirmationNumber === 1) {
    //       dispatcher.dispatch({ type: CONFIGURE, content: {} })
    //     }
    //   })
    //   .on('receipt', function (receipt) {
    //   })
    //   .on('error', function (error) {
    //     if (error.message) {
    //       return callback(error.message)
    //     }
    //     callback(error)
    //   })
  }

  withdrawBasePool = async (payload) => {
    try {
      const { pool, amount } = payload.content
      const account = store.getStore('account')
      const web3 = await this._getWeb3Provider()

      let amountToSend = web3.utils.toWei(amount, 'ether')
      if (pool.decimals !== 18) {
        const decimals = new BigNumber(10).pow(pool.decimals)

        amountToSend = new BigNumber(amount).times(decimals).toFixed(0)
      }

      console.log(pool)

      await this._checkApproval2(
        { erc20address: pool.tokenAddress, decimals: 18 },
        account,
        amountToSend,
        pool.address
      )

      this._callRemoveLiquidityBasePool(
        web3,
        account,
        pool,
        amountToSend,
        (err, a) => {
          if (err) {
            emitter.emit(ERROR, err)
            return emitter.emit(SNACKBAR_ERROR, err)
          }

          emitter.emit(WITHDRAW_RETURNED)
        }
      )
    } catch (ex) {
      emitter.emit(ERROR, ex)
      emitter.emit(SNACKBAR_ERROR, ex)
    }
  }

  _callRemoveLiquidityBasePool = async (
    web3,
    account,
    pool,
    amountToSend,
    callback
  ) => {
    // If it is bcroMM token, we will use the ABI that utillises 2 tokens
    console.log("Base pool remove")
    console.log({ pool })
    const basePoolContract = new web3.eth.Contract(
      pool.id === 'bcroMM' ? config.basePool2TokenABI : pool.id === 'MUSD3MM-2' ? config.metapoolABI : config.basePoolABI,
      pool.address
    )

    // remove all ??
    basePoolContract.methods
      .remove_liquidity(amountToSend, pool.id === 'bcroMM' || pool.id === "MUSD3MM-2" ? [0, 0] : [0, 0, 0])
      .send({ from: account.address })
      .on('transactionHash', function (hash) {
        emitter.emit(SNACKBAR_TRANSACTION_HASH, hash)
        callback(null, hash)
      })
      .on('confirmation', function (confirmationNumber, receipt) {
        if (confirmationNumber === 1) {
          dispatcher.dispatch({ type: CONFIGURE, content: {} })
        }
      })
      .on('receipt', function (receipt) {
      })
      .on('error', function (error) {
        if (error.message) {
          return callback(error.message)
        }
        callback(error)
      })
  }

  getSwapAmount = async (payload) => {
    try {
      const { pool, from, to, amount } = payload.content
      // const account = store.getStore('account')
      const web3 = await this._getWeb3Provider()

      let amountToSend = web3.utils.toWei(amount, 'ether')
      if (from.decimals !== 18) {
        const decimals = new BigNumber(10).pow(from.decimals)

        amountToSend = new BigNumber(amount).times(decimals).toFixed(0)
      }
      const metapoolContract = new web3.eth.Contract(
        pool.id === 'bcroMM' ? config.basePool2TokenABI : config.metapoolABI,
        pool.address
      )
      // const metapoolContract = new web3.eth.Contract(
      //   config.metapoolABI,
      //   pool.address
      // )
      // console.log(from.index, to.index, amountToSend)
      const amountToReceive = await metapoolContract.methods
      [pool.id === 'bcroMM' ? "get_dy" : "get_dy_underlying"](from.index, to.index, amountToSend)
        .call()

      const receiveAmount = amountToReceive / 10 ** to.decimals

      const returnObj = {
        sendAmount: amount,
        receiveAmount,
        receivePerSend: receiveAmount / amount,
        sendPerReceive: amount / receiveAmount
      }

      emitter.emit(SWAP_AMOUNT_RETURNED, returnObj)
    } catch (ex) {
      console.log(ex)
      emitter.emit(ERROR, ex)
      emitter.emit(SNACKBAR_ERROR, ex)
    }
  }

  swap = async (payload) => {
    try {
      const { from, to, pool, amount } = payload.content
      const account = store.getStore('account')
      const web3 = await this._getWeb3Provider()

      this._checkApproval(from, account, amount, pool.address, async (err) => {
        if (err) {
          emitter.emit(ERROR, err)
          return emitter.emit(SNACKBAR_ERROR, err)
        }

        let amountToSend = web3.utils.toWei(amount, 'ether')
        if (from.decimals !== 18) {
          const decimals = new BigNumber(10).pow(from.decimals)

          amountToSend = new BigNumber(amount).times(decimals).toFixed(0)
        }

        const metapoolContract = new web3.eth.Contract(
          config.metapoolABI,
          pool.address
        )
        const amountToReceive = await metapoolContract.methods
        [pool.id === 'bcroMM' ? "get_dy" : "get_dy_underlying"](from.index, to.index, amountToSend)
          .call()

        this._callExchange(
          web3,
          account,
          from,
          to,
          pool,
          amountToSend,
          amountToReceive,
          (err, a) => {
            if (err) {
              emitter.emit(ERROR, err)
              return emitter.emit(SNACKBAR_ERROR, err)
            }

            emitter.emit(SWAP_RETURNED)
          }
        )
      })
    } catch (ex) {
      emitter.emit(ERROR, ex)
      emitter.emit(SNACKBAR_ERROR, ex)
    }
  }

  _callExchange = async (
    web3,
    account,
    from,
    to,
    pool,
    amountToSend,
    amountToReceive,
    callback
  ) => {
    const metapoolContract = new web3.eth.Contract(
      pool.id === 'bcroMM' ? config.basePool2TokenABI : config.metapoolABI,
      pool.address
    )

    const receive = new BigNumber(amountToReceive)
      .times(95)
      .dividedBy(100)
      .toFixed(0)

    // console.log(from.index, to.index, amountToSend, receive);
    metapoolContract.methods
    [pool.id === 'bcroMM' ? "exchange" : "exchange_underlying"](from.index, to.index, amountToSend, receive)
      .send({ from: account.address, ...(pool.id === 'bcroMM' && from.erc20address === WCRO_TOKEN ? { value: amountToSend } : {}) })
      .on('transactionHash', function (hash) {
        emitter.emit(SNACKBAR_TRANSACTION_HASH, hash)
        callback(null, hash)
      })
      .on('confirmation', function (confirmationNumber, receipt) {
        if (confirmationNumber === 1) {
          dispatcher.dispatch({ type: CONFIGURE, content: {} })
        }
      })
      .on('receipt', function (receipt) {
      })
      .on('error', function (error) {
        if (error.message) {
          return callback(error.message)
        }
        callback(error)
      })
  }

  getAssetInfo = async (payload) => {
    try {
      const { address, id } = payload.content
      const account = store.getStore('account')
      const web3 = await this._getWeb3Provider()

      const erc20Contract = new web3.eth.Contract(config.erc20ABI, address)

      const calls = ['symbol', 'decimals', 'name'].map((method) => ({
        name: method,
        address
      }))

      let [[symbol], [decimalsResp], [name]] = await this._multicall(config.erc20ABI, calls)

      let balance
      if (id === 'bcroMM' && address === WCRO_TOKEN) {
        balance = await web3.eth.getBalance(account.address)
        symbol = "CRO";
        name = "CRO";
      } else {
        balance = await erc20Contract.methods
          .balanceOf(account.address)
          .call()
      }

      // let balance = await erc20Contract.methods
      //   .balanceOf(account.address)
      //   .call()
      const decimals = parseInt(decimalsResp)
      const bnDecimals = new BigNumber(10).pow(decimals)

      balance = new BigNumber(balance)
        .dividedBy(bnDecimals)
        .toFixed(decimals, BigNumber.ROUND_DOWN)

      const returnObj = {
        address: address,
        symbol: symbol,
        decimals: decimals,
        name: name,
        balance: balance
      }

      emitter.emit(GET_ASSET_INFO_RETURNED, returnObj)
    } catch (ex) {
      console.log(ex)
      emitter.emit(ERROR, ex)
      emitter.emit(SNACKBAR_ERROR, ex)
    }
  }

  addPool = async (payload) => {
    try {
      const { basePool, address, name, symbol, a, fee } = payload.content
      const account = store.getStore('account')
      const web3 = await this._getWeb3Provider()

      this._callDeployMetapool(
        web3,
        account,
        basePool,
        address,
        name,
        symbol,
        a,
        fee,
        (err, a) => {
          if (err) {
            emitter.emit(ERROR, err)
            return emitter.emit(SNACKBAR_ERROR, err)
          }

          emitter.emit(ADD_POOL_RETURNED)
        }
      )
    } catch (ex) {
      emitter.emit(ERROR, ex)
      emitter.emit(SNACKBAR_ERROR, ex)
    }
  }

  _callDeployMetapool = async (
    web3,
    account,
    basePool,
    address,
    name,
    symbol,
    a,
    fee,
    callback
  ) => {
    const curveFactoryContract = new web3.eth.Contract(
      config.curveFactoryV2ABI,
      config.curveFactoryV2Address
    )

    curveFactoryContract.methods
      .deploy_metapool(basePool.address, name, symbol, address, '10', '4000000')
      .send({ from: account.address })
      .on('transactionHash', function (hash) {
        emitter.emit(SNACKBAR_TRANSACTION_HASH, hash)
        callback(null, hash)
      })
      .on('confirmation', function (confirmationNumber, receipt) {
        if (confirmationNumber === 1) {
          dispatcher.dispatch({ type: CONFIGURE, content: {} })
        }
      })
      .on('receipt', function (receipt) {
      })
      .on('error', function (error) {
        if (error.message) {
          return callback(error.message)
        }
        callback(error)
      })
  }

  getDepositAmount = async (payload) => {
    try {
      const { pool, amounts } = payload.content
      const web3 = await this._getWeb3Provider()

      const amountsBN = amounts.map((amount, index) => {
        let amountToSend = web3.utils.toWei(amount || '0', 'ether')
        if (pool.assets[index].decimals !== 18) {
          const decimals = new BigNumber(10).pow(pool.assets[index].decimals)

          amountToSend = new BigNumber(amount).times(decimals).toFixed(0)
        }

        return amountToSend
      })

      const zapContract = new web3.eth.Contract(
        pool.liquidityABI,
        pool.liquidityAddress
      )
      const poolContract = new web3.eth.Contract(
        config.metapoolABI,
        pool.address
      )

      const [receiveAmountBn, virtPriceBn] = await Promise.all([
        zapContract.methods
          .calc_token_amount(pool.address, amountsBN, true)
          .call(),
        poolContract.methods.get_virtual_price().call()
      ])

      const receiveAmount = bnToFixed(receiveAmountBn, 18)
      let slippage

      if (Number(receiveAmount)) {
        const virtualValue = multiplyBnToFixed(
          virtPriceBn,
          receiveAmountBn,
          18
        )
        const realValue = sumArray(amounts) // Assuming each component is at peg

        slippage = virtualValue / realValue - 1
      }

      emitter.emit(GET_DEPOSIT_AMOUNT_RETURNED, parseFloat(receiveAmount))
      emitter.emit(SLIPPAGE_INFO_RETURNED, {
        slippagePcent:
          typeof slippage !== 'undefined' ? slippage * 100 : slippage
      })
    } catch (ex) {
      console.log(ex)
      emitter.emit(ERROR, ex)
      emitter.emit(SNACKBAR_ERROR, ex)
    }
  }

  getBaseDepositAmount = async (payload) => {
    try {
      const { pool, amounts } = payload.content
      const web3 = await this._getWeb3Provider()

      const amountsBN = amounts.map((amount, index) => {
        let amountToSend = web3.utils.toWei(amount.toString(), 'ether')
        if (pool.assets[index].decimals !== 18) {
          const decimals = new BigNumber(10).pow(pool.assets[index].decimals)

          amountToSend = new BigNumber(amount).times(decimals).toFixed(0)
        }

        return amountToSend
      })

      const poolContract = new web3.eth.Contract(
        pool.id === 'bcroMM' ? config.basePool2TokenABI : config.basePoolABI,
        pool.address
      )
      const [receiveAmountBn, virtPriceBn] = await Promise.all([
        poolContract.methods.calc_token_amount(amountsBN, true).call(),
        poolContract.methods.get_virtual_price().call()
      ])
      const receiveAmount = bnToFixed(receiveAmountBn, 18)
      let slippage

      if (Number(receiveAmount)) {
        const virtualValue = multiplyBnToFixed(
          virtPriceBn,
          receiveAmountBn,
          18
        )
        const realValue = sumArray(amounts) // Assuming each component is at peg

        slippage = virtualValue / realValue - 1
      }

      // console.log(receiveAmount)
      emitter.emit(GET_BASE_DEPOSIT_AMOUNT_RETURNED, parseFloat(receiveAmount))
      emitter.emit(SLIPPAGE_INFO_RETURNED, {
        slippagePcent:
          typeof slippage !== 'undefined' ? slippage * 100 : slippage
      })
    } catch (ex) {
      console.log(ex)
      emitter.emit(ERROR, ex)
      emitter.emit(SNACKBAR_ERROR, ex)
    }
  }

  _getGasPrice = async () => {
    try {
      const url = 'https://gasprice.poa.network/'
      const priceString = await rp(url)
      const priceJSON = JSON.parse(priceString)
      if (priceJSON) {
        return priceJSON.fast.toFixed(0)
      }
      return store.getStore('universalGasPrice')
    } catch (e) {
      console.log(e)
      return store.getStore('universalGasPrice')
    }
  }

  _getWeb3Provider = async () => {
    const web3context = store.getStore('web3context')

    if (!web3context) {
      return null
    }
    const provider = web3context.library.provider
    if (!provider) {
      return null
    }
    return new Web3(provider)
  }

  _multicall = async (abi, calls, options = { requireSuccess: true }) => {
    try {
      const { requireSuccess } = options
      const web3 = await this._getWeb3Provider()
      const multi = new web3.eth.Contract(
        config.multicallABI,
        config.multicallAddress
      )
      const itf = new ethers.utils.Interface(abi)

      const callData = calls.map((call) => [call.address.toLowerCase(), itf.encodeFunctionData(call.name, call.params)])
      const returnData = await multi.methods.tryAggregate(requireSuccess, callData).call()

      return returnData.map((call, i) => {
        const [result, data] = call
        return result ? itf.decodeFunctionResult(calls[i].name, data) : null
      })
    } catch (e) {
      console.log(e)
      return []
    }
  }
}

const store = new Store()

export default {
  store: store,
  dispatcher: dispatcher,
  emitter: emitter
}
