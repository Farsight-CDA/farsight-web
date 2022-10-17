export const polygonChainId = 137;
export const fantomChainId = 250;
export const bscChainId = 56;

export const mainChainId = polygonChainId;

export const isSupported = chainId => {
  return chainId === polygonChainId
    || chainId === fantomChainId
    || chainId === bscChainId;
}
