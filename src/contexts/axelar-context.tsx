import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { AxelarQueryAPI } from "@axelar-network/axelarjs-sdk";
import { environment } from "../utils/environment";

interface IAxelarContext {
  axelarClient: AxelarQueryAPI;
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

  return (
    <AxelarContext.Provider
      value={{
        axelarClient: axelarClient!,
      }}
    >
      {props.children}
    </AxelarContext.Provider>
  );
};

export const AxelarConsumer = AxelarContext.Consumer;
