export const polygonChainId = 137;
//export const bscChainId = 97;

export const mainChainId = polygonChainId;

export const isSupported = chainId => {
  return chainId === polygonChainId;
      //|| chainId === bscChainId;
}
