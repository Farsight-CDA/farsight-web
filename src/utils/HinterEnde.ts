import { bool } from "yup";
import { namehash } from "./hash";

export interface PriceData {
  token: string;
  amount: Number;
}

export async function fetchPriceData(name: string, expiry: number, duration: number): Promise<PriceData> {
  const response = await fetch("/api/getPrice", {
    method: "POST",
    body: JSON.stringify({
      name: name,
      expiry: BigInt(expiry).toString(16),
      duration: BigInt(duration).toString(16),
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();
  return {
    token: result.token,
    amount: Number((100n * BigInt(result.amount)) / BigInt(Math.pow(10, 6))) / 100,
  };
};

export interface Registration {
  available: boolean;
  chainStates: ChainState[];
}
export interface ChainState {
  chainId: number;
  localOwner: string;
  expiration: number;
  isKeeper: boolean;
  ownerChangeVersion: number;
  registrationVersion: number;
}

export async function fetchRegistration(name: string): Promise<Registration> {
  const response = await fetch("/api/getRegistration", {
    method: "POST",
    body: JSON.stringify({
      name: namehash(name),
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();
  return {
    available: result.available,
    chainStates: result.chain_states.map((state: any) => {
      return {
        chainId: Number(state.chainId),
        localOwner: state.owner,
        expiration: state.expiration,
        isKeeper: state.isKeeper,
        ownerChangeVersion: state.owner_change_version,
        registrationVersion: state.registration_version
      };
    })
  };
};

export async function fetchPlainName(name: string): Promise<string> {
  const response = await fetch("/api/getPlainName", {
    method: "POST",
    body: JSON.stringify({
      name: namehash(name),
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return await response.json();
};

export async function fetchEstimateRenewGuess(chainId: number, name: string, registrationVersion: number, duration: number) {
  const response = await fetch("/api/estimateRenewGas", {
    method: "POST",
    body: JSON.stringify({
      chain_id: chainId,
      name: name,
      reg_version: registrationVersion,
      duration: BigInt(duration).toString(16),
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return await response.json();
};

export async function fetchEstimateRegisterGas(chainId: number, name: string, owner: string, duration: number) {
  const response = await fetch("/api/estimateRegisterGas", {
    method: "POST",
    body: JSON.stringify({
      chain_id: chainId,
      plain_name: name,
      name: namehash(name),
      owner: owner,
      duration: BigInt(duration).toString(16),
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return await response.json();
};
