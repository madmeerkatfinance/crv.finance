import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache
} from '@apollo/client/core'
import fetch from 'cross-fetch'

const stableSwapCROLink = new HttpLink({
  fetch,
  uri: 'https://graph.mm.finance/subgraphs/name/madmeerkat-finance/stableswapCRO'
})

const threeMMLink = new HttpLink({
  fetch,
  uri: 'https://graph.mm.finance/subgraphs/name/madmeerkat-finance/stableswap'
})

const mmfExchangeGraphQLink = new HttpLink({
  fetch,
  uri: 'https://graph.mm.finance/subgraphs/name/madmeerkat-finance/exchange'
})

const mmfExchangeLink = ApolloLink.split(
  (operation) => operation.getContext().subgraph === 'mmf-exchange',
  mmfExchangeGraphQLink,
  stableSwapCROLink
)

export const bscClient = new ApolloClient({
  link: ApolloLink.split(
    (operation) => operation.getContext().subgraph === '3mm',
    threeMMLink,
    mmfExchangeLink
  ),
  cache: new InMemoryCache()
})
