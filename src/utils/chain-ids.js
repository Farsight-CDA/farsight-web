export const polygonChainId = 80001;
export const bscChainId = 97;

export const mainChainId = polygonChainId;

export const isSupported = chainId => {
  return chainId === polygonChainId ||
         chainId === bscChainId;
}
