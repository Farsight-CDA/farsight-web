import { polygonChainId, bscChainId } from "./chain-ids";

export const getRegistrarAddress = (chainId) => {
  switch (chainId) {
    case polygonChainId:
      return "0x25a511f904b7855d4FaCdBb0294f73788f4427a8";
    case bscChainId:
      return "0xc9d871542fdA15F320CA63E6Fd349a9aF083E39b";
    default:
      return null;
  }
}

export const getControllerAddress = (chainId) => {
  switch (chainId) {
    case polygonChainId:
      return "0xf089F11e3abc5D8964787925E924a7B7619f54E4";
    case bscChainId:
      return "0x21d49d1f71127b4EBb4d7C09CA9417376A202396";
    default:
      return null;
  }
}
