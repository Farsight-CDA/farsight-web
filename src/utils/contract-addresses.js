import { polygonChainId, bscChainId, fantomChainId } from "./chain-ids";

export const getRegistrarAddress = (chainId) => {
  switch (chainId) {
    case polygonChainId:
      return "0xF72d1fFa07431a128DCA758d00D85B8e9f28E909";
    case fantomChainId:
      return "0xcB30AEfbe26142fb7f6cd8Ec32C1c3e1763bca07";
    //case bscChainId:
    //  return "0xD15188379c8B290A86E45107bB6223fE9EBd0Da3";
    default:
      return null;
  }
}

export const getControllerAddress = (chainId) => {
  switch (chainId) {
    case polygonChainId:
      return "0x055F3434A4bB939b6d6866B946270568e899d9DE";
    case fantomChainId:
      return "0xd44091A3db5D286539507ab01D89849bB75EA537";
    //case bscChainId:
    //  return "0xC3C043B8F44Cd63673250Be4Ba775d8FcFF7115A";
    default:
      return null;
  }
}
