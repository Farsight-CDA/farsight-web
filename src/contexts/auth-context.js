import { createContext, useEffect, useRef, useState } from "react";
import PropTypes, { func } from "prop-types";
import Web3 from "web3";
import { RegistrarController } from "../../contracts/types/RegistrarController";
import abi from "../../contracts/abi/RegistrarController.abi";
import { getControllerAddress } from "../utils/contract-addresses";

export const AuthContext = createContext({
  web3: null,
  address: null,
  chainId: null,
  walletType: null,
});

export const AuthProvider = (props) => {
  const { children } = props;

  const [eventsRegistered, setEventsRegistered] = useState(false);

  const isConnected = () => web3 !== null;

  const [web3, setWeb3] = useState(null);
  const [address, setAddress] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [walletType, setWalletType] = useState(null);

  const [controller, setController] = useState(null);

  useEffect(() => {
    if (!isConnected()) {
      return;
    }
    web3.defaultAccount = address;
  }, [address]);

  useEffect(() => {
    if (!isConnected()) {
      return;
    }

    setController(web3.eth.Contract(abi, getControllerAddress(chainId)));
  }, [chainId]);

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
    setWalletType(null);
    setController(null);
  }

  function tryConnectEVMBrowserWallet() {
    if (Web3.givenProvider === undefined || Web3.givenProvider === null) {
      return;
    }

    setWeb3(new Web3(Web3.givenProvider));
    registerBrowserEVMEvents();

    window.ethereum.request({ method: "eth_requestAccounts" }).then((accounts) => {
      if (accounts.length == 0) {
        disconnectWallet();
        return;
      }

      setAddress(accounts[0]);
      setWalletType(WalletType.browserEVM);
    });
  }

  function registerBrowserEVMEvents() {
    if (eventsRegistered) {
      return;
    }

    setEventsRegistered(true);

    Web3.givenProvider.on("accountsChanged", () => {
      handleAccountChanged(WalletType.browserEVM);
    });
    Web3.givenProvider.on("chainChanged", () => {
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
    <AuthContext.Provider value={{ web3, toggleConnection, address, chainId, controller }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export const AuthConsumer = AuthContext.Consumer;
