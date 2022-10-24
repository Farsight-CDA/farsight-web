import { polygonChainId, fantomChainId, fantomTestnetChainId } from "./chain-ids";

export function getRegistrarAddress(chainId: number) {
  switch (chainId) {
    case polygonChainId:
      return "0xF72d1fFa07431a128DCA758d00D85B8e9f28E909";
    case fantomChainId:
      return "0x56725E47BcD0796619E4a63B8FA4Ed3bb46FF6F2";

    //Testnet
    case fantomTestnetChainId:
      return "0xc9d871542fdA15F320CA63E6Fd349a9aF083E39b";
    default:
      return null;
  }
}

export function getControllerAddress(chainId: number) {
  switch (chainId) {
    case polygonChainId:
      return "0x055F3434A4bB939b6d6866B946270568e899d9DE";
    case fantomChainId:
      return "0x481e141083C4fC3125277F1139464eF28BD6de3F";

    //Testnet
    case fantomTestnetChainId:
      return "0x21d49d1f71127b4EBb4d7C09CA9417376A202396";
    default:
      return null;
  }
}
