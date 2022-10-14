import { ethers } from "ethers";

export const namehash = name => {
  return ethers.utils.solidityKeccak256([ "string" ], [ name ]);
}
