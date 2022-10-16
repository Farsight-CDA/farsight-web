export const getRegistrarAddress = (chainId) => {
  switch (chainId) {
    case 80001:
      return "0xc01Cd42FEac854Ab3c81E865Ab01D806bcd93dfc";
    default:
      return null;
  }
}

export const getControllerAddress = (chainId) => {
  switch (chainId) {
    case 80001:
      return "0x9eFe8ffb32362382E8B4b17Dff5dB9046C0e63A9";
    default:
      return null;
  }
}

export const getPaymentProviderAddress = (chainId) => {
  switch (chainId) {
    case 80001:
      return "0x072D46CB251A74363d285f7BDF3dd3d6AEdA2AEf";
    default:
      return null;
  }
}
