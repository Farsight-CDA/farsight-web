import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import Web3 from "web3";

export const AuthContext = createContext({ web3: undefined });

export const AuthProvider = (props) => {
  const { children } = props;

  const [web3, setweb3] = useState();
  const [event, triggerevent] = useState(0);
  const [walletConection, setwalletConection] = useState();
  const [accounts, setaccounts] = useState([""]);
  const [chainid, setchainid] = useState();

  function ConnectDisconnectToWallet() {
    if (walletConection === true) {
      setweb3(undefined);
      setwalletConection(false);
    } else {
      const tempWeb3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
      setweb3(tempWeb3);
      if (typeof window?.ethereum !== "undefined") {
        //console.log("MetaMask is installed!");
        window?.ethereum
          ?.request?.({ method: "eth_requestAccounts" })
          .then((accounts) => setaccounts(accounts));
        console.log(accounts);
        setwalletConection(true);
      }
    }
  }

  useEffect(() => {
    window?.ethereum?.on?.("accountsChanged", () =>
      web3?.eth?.getAccounts?.().then((accounts) => setaccounts(accounts))
    );
    window?.ethereum?.on?.("chainChanged", () =>
      web3?.eth
        ?.getChainId()?.()
        .then((chainid) => setchainid(chainid))
    );
  }, []);

  return (
    <AuthContext.Provider
      value={{ web3, ConnectDisconnectToWallet, accounts, chainid, walletConection }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export const AuthConsumer = AuthContext.Consumer;
