import { createContext, useEffect, useRef, useState } from "react";
import PropTypes, { func } from "prop-types";
import Web3 from "web3";

export const AuthContext = createContext({ web3: undefined });

export const AuthProvider = (props) => {
  const { children } = props;

  const [web3, setWeb3] = useState(null);
  const [address, setAddress] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [walletType, setWalletType] = useState(0);
  const walletTypeRef = useRef();
  walletTypeRef.current = walletType;
  const web3Ref = useRef();
  web3Ref.current = web3;

  const WalletType = { browserEVM: 1 };

  function toggleConnection() {
    if (web3 === null) {
      connectWallet();
    } else {
      disconnectWallet();
    }
  }

  function connectWallet() {
    tryConnectEVMBrowserWallet();
  }

  function disconnectWallet() {
    setWeb3(null);
    setAddress(null);
    setChainId(null);
    setWalletType(0);
  }

  function tryConnectEVMBrowserWallet() {
    if (Web3.givenProvider === undefined || Web3.givenProvider === null) {
      return;
    }

    setWeb3(new Web3(Web3.givenProvider));
    registerEVMEvents();

    window.ethereum
     .request({ method: "eth_requestAccounts" })
     .then(accounts => {
      if (accounts.length == 0) {
        disconnectWallet();
        return;
      }

      setAddress(accounts[0]);
      setWalletType(WalletType.browserEVM);
     });
  }

  function registerEVMEvents() {
    if (window.ethereum === undefined || window.ethereum === null) {
      return;
    }

    window.ethereum.on("accountsChanged", () => {
      handleAccountChanged(WalletType.browserEVM);
    });
    window.ethereum.on("chainChanged", () => {
      handleChainIdChanged(WalletType.browserEVM);
    });
  }

  function handleAccountChanged(wallet) {
    if (wallet != walletTypeRef.current) {
      return;
    }
    web3Ref.current?.eth.getAccounts().then((_accounts) => {
      if (_accounts.length == 0) {
        disconnectWallet();
        return;
      }
      setAddress(_accounts[0]);
    });
  }

  function handleChainIdChanged(wallet) {
    if (wallet != walletTypeRef.current) {
      return;
    }
    web3Ref.current?.eth.getChainId().then((_chainId) => {
      if (_chainId == 0) {
        disconnectWallet();
        return;
      } 

      setChainId(_chainId);
    });
  }

  return (
    <AuthContext.Provider value={{ web3, toggleConnection, address, chainId }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export const AuthConsumer = AuthContext.Consumer;
