import BigNumber from 'bignumber.js'


export const ERROR = 'ERROR'


// #SNACKBAR
export const SNACKBAR_ERROR = 'SNACKBAR_ERROR'
export const SNACKBAR_TRANSACTION_HASH = 'SNACKBAR_TRANSACTION_HASH'
export const SNACKBAR_TRANSACTION_RECEIPT = 'SNACKBAR_TRANSACTION_RECEIPT'
export const SNACKBAR_TRANSACTION_CONFIRMED = 'SNACKBAR_TRANSACTION_CONFIRMED'
export const SNACKBAR_MESSAGE = 'SNACKBAR_MESSAGE'


// #Accounts
export const CONNECTION_CONNECTED = 'CONNECTION_CONNECTED'
export const CONNECTION_DISCONNECTED = 'CONNECTION_DISCONNECTED'

export const CONFIGURE = 'CONFIGURE'
export const CONFIGURE_RETURNED = 'CONFIGURE_RETURNED'
export const BASE_POOL_CONFIGURE_RETURNED = 'BASE_POOL_CONFIGURE_RETURNED'


export const GET_BALANCES = 'GET_BALANCES'
export const BALANCES_RETURNED = 'BALANCES_RETURNED'

export const SWAP = 'SWAP'
export const SWAP_RETURNED = 'SWAP_RETURNED'

export const GET_SWAP_AMOUNT = 'GET_SWAP_AMOUNT'
export const SWAP_AMOUNT_RETURNED = 'SWAP_AMOUNT_RETURNED'

export const CREATE_POOL = 'CREATE_POOL'
export const CREATE_POOL_RETURNED = 'CREATE_POOL_RETURNED'

export const DEPOSIT = 'DEPOSIT'
export const DEPOSIT_BASE_POOL = 'DEPOSIT_BASE_POOL'
export const DEPOSIT_RETURNED = 'DEPOSIT_RETURNED'

export const GET_DEPOSIT_AMOUNT = 'GET_DEPOSIT_AMOUNT'
export const GET_DEPOSIT_AMOUNT_RETURNED = 'GET_DEPOSIT_AMOUNT_RETURNED'


export const GET_BASE_DEPOSIT_AMOUNT = 'GET_BASE_DEPOSIT_AMOUNT'
export const GET_BASE_DEPOSIT_AMOUNT_RETURNED = 'GET_BASE_DEPOSIT_AMOUNT_RETURNED'


export const SLIPPAGE_INFO_RETURNED = 'SLIPPAGE_INFO_RETURNED'

export const WITHDRAW = 'WITHDRAW'
export const WITHDRAW_RETURNED = 'WITHDRAW_RETURNED'

export const GET_WITHDRAW_AMOUNT = 'GET_WITHDRAW_AMOUNT'
export const GET_WITHDRAW_AMOUNT_RETURNED = 'GET_WITHDRAW_AMOUNT_RETURNED'

export const GET_ASSET_INFO = 'GET_ASSET_INFO'
export const GET_ASSET_INFO_RETURNED = 'GET_ASSET_INFO_RETURNED'

export const ADD_POOL = 'ADD_POOL'
export const ADD_POOL_RETURNED = 'ADD_POOL_RETURNED'


// #GENERAL
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
export const MAX_UINT256 = new BigNumber(2)
  .pow(256)
  .minus(1)
  .toFixed(0);
