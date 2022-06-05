import { ApolloClient, InMemoryCache } from '@apollo/client'

const client = new ApolloClient({
  uri: 'https://graph.mm.finance/subgraphs/name/madmeerkat-finance/stableswap',
  cache: new InMemoryCache()
})

export default client
