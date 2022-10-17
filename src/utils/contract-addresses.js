import { polygonChainId, bscChainId, fantomChainId } from "./chain-ids";

export const getRegistrarAddress = (chainId) => {
  switch (chainId) {
    case polygonChainId:
      return "0xF72d1fFa07431a128DCA758d00D85B8e9f28E909";
    case fantomChainId:
      return "0xcB30AEfbe26142fb7f6cd8Ec32C1c3e1763bca07";
    default:
      return null;
  }
}

export const getControllerAddress = (chainId) => {
  switch (chainId) {
    case polygonChainId:
      return "0x055F3434A4bB939b6d6866B946270568e899d9DE";
    case fantomChainId:
      return "0x4bb685e913c8503B6d9c8b4979BbC759D6e94C79";
    default:
      return null;
  }
}
