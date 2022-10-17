import { polygonChainId, bscChainId } from "./chain-ids";

export const getRegistrarAddress = (chainId) => {
  switch (chainId) {
    case polygonChainId:
      return "0xF72d1fFa07431a128DCA758d00D85B8e9f28E909";
    //case bscChainId:
    //  return "0x0347679F63316a351c6213A32c04C593b72b9B83";
    default:
      return null;
  }
}

export const getControllerAddress = (chainId) => {
  switch (chainId) {
    case polygonChainId:
      return "0x055F3434A4bB939b6d6866B946270568e899d9DE";
    //case bscChainId:
    //  return "0xc2fe0Cc282BD149748e7bF42A5f67407CF978824";
    default:
      return null;
  }
}
