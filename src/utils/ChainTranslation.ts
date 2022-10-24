import { secondsInWeek } from "date-fns/fp";
import { EvmChain, GasToken } from "@axelar-network/axelarjs-sdk";
import { polygonChainId, fantomChainId, fantomTestnetChainId, polygonTestnetChainId } from "./chain-ids";

export function getChainNameByChainId(chainId: number): string {
  switch (chainId) {
    case polygonChainId: return "Polygon";
    case fantomChainId: return "Fantom";

    case fantomTestnetChainId: return "Fantom TestNet";
    case polygonTestnetChainId: return "Mumbai Test Network";
  }

  throw new Error("Unknown chainId for ChainName: " + chainId);
};

export function getLogoNameByChainId(chainId: number): string {
  switch (chainId) {
    case polygonChainId: return "polygon-matic.svg";
    case fantomChainId: return "fantom-ftm-logo.svg";

    case fantomTestnetChainId: return "fantom-ftm-logo.svg";
    case polygonTestnetChainId: return "polygon-matic.svg";
  }

  throw new Error("Unknown chainId for LogoName: " + chainId);
}

export function getEVMChainByChainId(chainId: number): EvmChain {
  switch (chainId) {
    case polygonChainId: return EvmChain.POLYGON;
    case fantomChainId: return EvmChain.FANTOM;

    case fantomTestnetChainId: return EvmChain.FANTOM;
    case polygonTestnetChainId: return EvmChain.POLYGON;
  }


  throw new Error("Unknown chainId for EvmChain: " + chainId); 
}

export function getBridgeTargetNameByChainId(chainId: number): string {
  switch (chainId) {
    case polygonChainId: return "Polygon";
    case fantomChainId: return "Fantom";

    case fantomTestnetChainId: return "Fantom";
    case polygonTestnetChainId: return "Polygon";
  }

  throw new Error("Unknown chainId for BridgeTargetName: " + chainId);
}

export function getNativeAssetByChainId(chainId: number): GasToken {
  switch (chainId) {
    case polygonChainId: return GasToken.MATIC;
    case fantomChainId: return GasToken.FTM;

    case fantomTestnetChainId: return GasToken.FTM;
    case polygonTestnetChainId: return GasToken.MATIC;
  }

  throw new Error("Unknown chainId for GasToken: " + chainId);
}
