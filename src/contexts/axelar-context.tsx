import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { AxelarQueryAPI } from "@axelar-network/axelarjs-sdk"

export const AxelarContext = createContext({});

export const AxelarProvider = (props) => {
  const { children } = props;

  const [axelarClient, setAxelarClient] = useState(null);

  useEffect(() => {
    setAxelarClient(new AxelarQueryAPI({
      environment: "testnet"
    }));
  }, []);


  return (
    <AxelarContext.Provider value={{ axelarClient }}>
      {children}
    </AxelarContext.Provider>
  );
}

AxelarProvider.propTypes = {
  children: PropTypes.node,
};

export const AxelarConsumer = AxelarContext.Consumer;
