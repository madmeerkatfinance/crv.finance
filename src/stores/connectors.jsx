import { InjectedConnector } from "@web3-react/injected-connector";
// import { MetaMask } from "@web3-react/metamask";
// import { NetworkConnector } from "@web3-react/network-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { LedgerConnector } from "@web3-react/ledger-connector";
import { TrezorConnector } from "@web3-react/trezor-connector";
import { FrameConnector } from "@web3-react/frame-connector";
import { FortmaticConnector } from "@web3-react/fortmatic-connector";
import { PortisConnector } from "@web3-react/portis-connector";
import { SquarelinkConnector } from "@web3-react/squarelink-connector";
import { TorusConnector } from "@web3-react/torus-connector";
import { AuthereumConnector } from "@web3-react/authereum-connector";
import { DeFiWeb3Connector } from "deficonnect";

const POLLING_INTERVAL = 12000;
const RPC_URLS = {
  // 1: "https://eth-mainnet.alchemyapi.io/v2/k2--UT_xVVXMOvAyoxJYqtKhlmyBbqnX",
  // 4: "https://rinkeby.infura.io/v3/bd80ce1ca1f94da48e151bb6868bb150"
  25: "https://rpc.xstaking.sg",
};

export const injected = new InjectedConnector({
  supportedChainIds: [25],
});

// export const metamask = new MetaMask({
//   supportedChainIds: [25],
// });

// export const network = new NetworkConnector({
//   urls: { 25: RPC_URLS[25] },
//   defaultChainId: 25
// })

export const walletconnect = new WalletConnectConnector({
  rpc: { 25: RPC_URLS[25] },
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
});

export const deficonnect = new DeFiWeb3Connector({
  supportedChainIds: [25],
  rpc: { 25: "https://rpc.xstaking.sg" },
  pollingInterval: POLLING_INTERVAL,
});

export const walletlink = new WalletLinkConnector({
  url: RPC_URLS[25],
  appName: "iearn.financaae",
});

export const ledger = new LedgerConnector({
  chainId: 25,
  url: RPC_URLS[25],
  pollingInterval: POLLING_INTERVAL,
});

export const trezor = new TrezorConnector({
  chainId: 25,
  url: RPC_URLS[25],
  pollingInterval: POLLING_INTERVAL,
  manifestEmail: "dummy@abc.xyz",
  manifestAppUrl: "https://8rg3h.csb.app/",
});

export const frame = new FrameConnector({ supportedChainIds: [1] });

export const fortmatic = new FortmaticConnector({
  apiKey: "pk_live_F95FEECB1BE324B5",
  chainId: 1,
});

export const portis = new PortisConnector({
  dAppId: "5dea304b-33ed-48bd-8f00-0076a2546b60",
  networks: [1, 100],
});

export const squarelink = new SquarelinkConnector({
  clientId: "5f2a2233db82b06b24f9",
  networks: [1, 100],
});

export const torus = new TorusConnector({ chainId: 25 });

export const authereum = new AuthereumConnector({ chainId: 25 });
