import { polygonChainId, bscChainId } from "./chain-ids";

export const getRegistrarAddress = (chainId) => {
  switch (chainId) {
    case polygonChainId:
      return "0x388a13e27D9a768e4d057a25045B7261AAE63745";
    case bscChainId:
      return "0x0347679F63316a351c6213A32c04C593b72b9B83";
    default:
      return null;
  }
}

export const getControllerAddress = (chainId) => {
  switch (chainId) {
    case polygonChainId:
      return "0xB31e1744bEb49Dce964714bC0BCF56Cb599af677";
    case bscChainId:
      return "0xc2fe0Cc282BD149748e7bF42A5f67407CF978824";
    default:
      return null;
  }
}
