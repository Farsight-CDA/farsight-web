import { ethers } from "ethers";

export function namehash(name: string) {
  return ethers.utils.solidityKeccak256([ "string" ], [ name ]);
}

export function commitment(name: BigInt, owner: string, duration: number, secret: string) {
  return ethers.utils.solidityKeccak256(["uint256", "address", "uint256", "bytes32"], [name, owner, duration, secret]);
} 
