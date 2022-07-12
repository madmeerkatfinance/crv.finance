import ABI from './abi'

const config = {
  ...ABI,
  infuraProvider: "https://rpc.xstaking.sg",
  // curveFactoryAddress: '0xfD6f33A0509ec67dEFc500755322aBd9Df1bD5B8',
  curveFactoryV2Address: "0x3DeFB1183e8931353A8407A89A0Bc864B018953A",
  // curveFactoryV2Address: '0x0959158b6040D32d04c301A72CBFD6b39E21c9AE',
  usdDepositerAddress: "0x5a9a0c9152a70A5fE37Ce9EAD6f64785d5a9915d",
  // usdDepositerAddress: '0xa79828df1850e8a3a3064576f380d90aecdd3359',
  // btcDepositerAddress: '0x7abdbaf29929e7f8621b757d2a7c04d78d633834',
  multicallAddress: '0x5e954f5972EC6BFc7dECd75779F10d848230345F'
};

export default config;
