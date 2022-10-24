import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { AxelarQueryAPI, Environment } from "@axelar-network/axelarjs-sdk";
import { environment } from "../utils/environment";

interface IAxelarContext {
  axelarClient: AxelarQueryAPI;
  getTransactionExplorerURL: (txHash: string) => string;
}

export const AxelarContext = createContext<IAxelarContext>(null!);

interface AxelarProviderProps {
  children: any;
}

export const AxelarProvider = (props: AxelarProviderProps) => {
  const [axelarClient, setAxelarClient] = useState<AxelarQueryAPI | null>(null);

  useEffect(() => {
    setAxelarClient(
      new AxelarQueryAPI({
        environment: environment,
      })
    );
  }, []);

  function getTransactionExplorerURL(txHash: string) {
    return environment == Environment.MAINNET
      ? "https://axelarscan.io/gmp/" + txHash
      : "https://testnet.axelarscan.io/gmp/" + txHash;
  }

  return (
    <AxelarContext.Provider
      value={{
        axelarClient: axelarClient!,
        getTransactionExplorerURL
      }}
    >
      {props.children}
    </AxelarContext.Provider>
  );
};

export const AxelarConsumer = AxelarContext.Consumer;
