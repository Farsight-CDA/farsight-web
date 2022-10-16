import { namehash } from "./hash";

export const fetchPriceData = async (name, expiry, duration) => {
  const response = await fetch("/api/getPrice", {
    method: "POST",
    body: JSON.stringify({
      name: name,
      expiry: expiry,
      duration: duration,
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

export const fetchEstimateRenewGuess = async (
  chain_id,
  name,
  payload,
  reg_version,
  duration,
  expiration
) => {
  const response = await fetch("/api/estimateRenewGuess", {
    method: "POST",
    body: JSON.stringify({
      chain_id: chain_id,
      name: name,
      reg_version: reg_version,
      duration: duration,
      expiration: expiration,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return await response.json();
};

export const fetchEstimateRegisterGuess = async (
  chain_id,
  plain_name,
  name,
  owner,
  duration,
  expiration
) => {
  const response = await fetch("/api/estimateRegisterGuess", {
    method: "POST",
    body: JSON.stringify({
      chain_id: chain_id,
      plain_name: plain_name,
      name: name,
      owner: owner,
      duration: duration,
      expiration: expiration,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return await response.json();
};
