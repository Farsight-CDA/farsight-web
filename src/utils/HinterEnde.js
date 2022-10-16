import { namehash } from "./hash";

export const fetchPriceData = async (name, expiry, duration) => {
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

export const fetchRegistration = async (name) => {
  const response = await fetch("/api/getRegistration", {
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

export const fetchPlainName = async (name) => {
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

export const fetchEstimateRenewGuess = async (chain_id, name, reg_version, duration) => {
  const response = await fetch("/api/estimateRenewGuess", {
    method: "POST",
    body: JSON.stringify({
      chain_id: chain_id,
      name: name,
      reg_version: reg_version,
      duration: BigInt(duration).toString(16),
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return await response.json();
};

export const fetchEstimateRegisterGas = async (chain_id, plain_name, name, owner, duration) => {
  const response = await fetch("/api/estimateRegisterGuess", {
    method: "POST",
    body: JSON.stringify({
      chain_id: chain_id,
      plain_name: plain_name,
      name: name,
      owner: owner,
      duration: BigInt(duration).toString(16),
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return await response.json();
};
