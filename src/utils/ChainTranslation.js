export function getChainNameByChainId(chainId) {
  switch (chainId) {
    case 1: return "Ethereum Main Network (Mainnet)";
    case 3: return "Ropsten Test Network";
    case 4: return "Rinkeby Test Network";
    case 5: return "Goerli Test Network";
    case 42: return "Kovan Test Network";
    case 137: return "Polygon Main Network";
    case 80001: return "Mumbai Test Network";
    case 43114: return "Avalanche C-Chain Main Network";
    case 43113: return  "Fuji Test Network";
    case 1088: return "Metis Andromeda Main Network";
    case 588: return "Metis Stardust Test Network";
    case 1313161554: return "Aurora Main Network";
    case 1313161555: return "Aurora Test Network";
    case 56: return "Binance Smart Chain Main Network";
    case 97: return "Binance Smart Chain Test Network";
    case 250: return "Fantom Opera Main Network";
    case 4002: return "Fantom Test Network";
  }

  return null;
};

export function getLogoNameByChainId(chainId) {
  switch (chainId) {
    case 137: return "polygon-matic.svg";
    case 80001: return "polygon-matic.svg";
    case 56: return "binance-smart-chain.svg";
    case 97: return "binance-smart-chain.svg";
  }

  return null;
}
