import { Environment } from "@axelar-network/axelarjs-sdk";
import { environment } from "./environment";

export const polygonChainId = 137;
export const fantomChainId = 250;

const mainnetChainIds = [
  polygonChainId,
  fantomChainId
];

export const fantomTestnetChainId = 4002;
export const polygonTestnetChainId = 80001;

const testnetChainIds = [
  fantomTestnetChainId,
  polygonTestnetChainId
];

export const mainChainId = environment == Environment.MAINNET
                            ? polygonChainId
                            : fantomTestnetChainId;

export const supportedChains = environment == Environment.MAINNET
  ? mainnetChainIds
  : testnetChainIds;

export function isSupportedChainId(chainId: number) {
  return supportedChains.includes(chainId);
}
