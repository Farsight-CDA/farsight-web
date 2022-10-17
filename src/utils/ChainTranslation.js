import { secondsInWeek } from "date-fns/fp";
import { EvmChain, GasToken } from "@axelar-network/axelarjs-sdk";
import { polygonChainId, fantomChainId, bscChainId } from "./chain-ids";

export function getChainNameByChainId(chainId) {
  switch (chainId) {
    case 1: return "Ethereum";
    case 3: return "Ropsten Test Network";
    case 4: return "Rinkeby Test Network";
    case 5: return "Goerli Test Network";
    case 42: return "Kovan Test Network";
    case polygonChainId: return "Polygon";
    case 80001: return "Mumbai Test Network";
    case 43114: return "Avalanche C-Chain Main Network";
    case 43113: return  "Fuji Test Network";
    case 1088: return "Metis Andromeda Main Network";
    case 588: return "Metis Stardust Test Network";
    case 1313161554: return "Aurora Main Network";
    case 1313161555: return "Aurora Test Network";
    case bscChainId: return "Binance Smart Chain";
    case 97: return "Binance Smart Chain Test Network";
    case fantomChainId: return "Fantom";
    case 4002: return "Fantom Test Network";
  }

  return null;
};

export function getLogoNameByChainId(chainId) {
  switch (chainId) {
    case polygonChainId: return "polygon-matic.svg";
    case 80001: return "polygon-matic.svg";
    case bscChainId: return "binance-smart-chain.svg";
    case 97: return "binance-smart-chain.svg";
    case fantomChainId: return "fantom-ftm-logo.svg"
  }

  return null;
}

export function getEVMChainByChainId(chainId) {
  switch (chainId) {
    case polygonChainId: return EvmChain.POLYGON;
    case fantomChainId: return EvmChain.FANTOM;
    case bscChainId: return EvmChain.BINANCE;
  }

  return null;
}

export function getNativeAssetByChainId(chainId) {
  switch (chainId) {
    case polygonChainId: return GasToken.MATIC;
    case fantomChainId: return GasToken.FTM;
    case bscChainId: return GasToken.BINANCE;
  }

  return null;
}
