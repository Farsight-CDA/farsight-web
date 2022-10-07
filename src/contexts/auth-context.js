import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import Web3 from "web3";

export const AuthContext = createContext({ web3: undefined });

export const AuthProvider = (props) => {
  const { children } = props;

  const [web3, setweb3] = useState();
  const [event, triggerevent] = useState(0);
  const [accounts, setaccounts] = useState([""]);
  const [chainid, setchainid] = useState();

  const walletType = "";

  const WalletType = { metamask: 1 };

  function ConnectWallet() {
    if (Web3.givenProvider === undefined || Web3.givenProvider === null) {
      return;
    }
    setweb3(new Web3(Web3.givenProvider));
    if (typeof window.ethereum !== undefined) {
      //console.log("MetaMask is installed!");
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((accounts) => setaccounts(accounts));
      console.log(accounts);
    }
  }

  function DisconnectWallet() {
    setweb3(undefined);
  }

  function toggleConnection() {
    if (web3 == null) {
      ConnectWallet();
    } else {
      DisconnectWallet();
    }
  }

  function handleAccountChange(wallet) {
    if (wallet !== walletType) {
      return;
    }
    web3?.eth?.getAccounts?.().then((accounts) => {
      setaccounts(accounts);
    });
  }

  function handleChainId(wallet) {
    if (wallet !== walletType) {
      return;
    }
    web3?.eth
      ?.getChainId()?.()
      .then((chainid) => setchainid(chainid));
  }

  useEffect(() => {
    window.ethereum?.on("accountsChanged", () => {
      handleAccountChange(WalletType.metamask);
    });
    window.ethereum?.on("chainChanged", () => {
      handleChainId(WalletType.metamask);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ web3, toggleConnection, accounts, chainid }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export const AuthConsumer = AuthContext.Consumer;
