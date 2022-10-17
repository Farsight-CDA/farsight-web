export const polygonChainId = 137;
export const fantomChainId = 250;
export const bscChainId = 56;

export const isSupported = chainId => {
  return chainId === polygonChainId
    || chainId === fantomChainId;
}


export const fantomTestnetChainId = 4002;

//export const isSupported = chainId => {
//  return chainId === fantomTestnetChainId;
//}


export const mainChainId = polygonChainId;
