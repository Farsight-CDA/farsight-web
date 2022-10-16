import { ethers } from "ethers";

export const namehash = name => {
  return ethers.utils.solidityKeccak256([ "string" ], [ name ]);
}

export const commitment = (name, owner, duration, secret) => {
  return ethers.utils.solidityKeccak256(["uint256", "address", "uint256", "bytes32"], [name, owner, duration, secret]);
} 
