
const BASE_EXPLORER_URLS = {
  [25]: 'https://cronoscan.com/',
  [338]: 'https://cronos.crypto.org/explorer/testnet3',
}

export function getBscScanLink(
  data,
  type,
  chainId = 25,
) {
  switch (type) {
    case 'transaction': {
      return `${BASE_EXPLORER_URLS[chainId]}/tx/${data}`
    }
    case 'token': {
      return `${BASE_EXPLORER_URLS[chainId]}/token/${data}`
    }
    case 'block': {
      return `https://cronoscan.com/block/${data}`
    }
    case 'countdown': {
      return `https://cronoscan.com/block/${data}`
    }
    default: {
      return `${BASE_EXPLORER_URLS[chainId]}/address/${data}`
    }
  }
}

export const truncateHash = (address, startLength = 4, endLength = 4) => {
  return `${address.substring(0, startLength)}...${address.substring(address.length - endLength)}`
}
