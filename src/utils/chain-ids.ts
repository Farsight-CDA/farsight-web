import { Environment } from "@axelar-network/axelarjs-sdk";
import { environment } from "./environment";

export const polygonChainId = 137;
export const fantomChainId = 250;

const mainnetChainIds = [
  polygonChainId,
  fantomChainId
];

export const fantomTestnetChainId = 4002;

const testnetChainIds = [
  fantomTestnetChainId
];

export const mainChainId = environment == Environment.MAINNET
                            ? polygonChainId
                            : fantomTestnetChainId;

export function isSupportedChainId(chainId: number) {
  if (environment == Environment.MAINNET){
    return mainnetChainIds.includes(chainId);
  }
  if (environment == Environment.TESTNET) {
    return testnetChainIds.includes(chainId);
  }

  return false;
}
