import { createContext, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { ethers } from "ethers";
import { IRegistrar } from "../../contracts/types/IRegistrar.ts"
import IRegistrarABI from "../../contracts/abi/IRegistrar.abi.json";
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

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  const [address, setAddress] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [walletType, setWalletType] = useState(null);

  const [registrar, setRegistrar] = useState(null);
  const [controller, setController] = useState(null);

  const isConnected = provider != null && registrar != null;

  useEffect(() => {
    if (!isConnected) {
      return;
    }

    registrar.connect(signer);
  }, [signer]);

  useEffect(() => {
    if (provider == null) {
      return;
    }

    console.log(provider);
    const iface = new ethers.utils.Interface(IRegistrarABI);

    const registrar = new ethers.Contract(getControllerAddress(chainId), iface, provider);
    registrar.connect(signer);

    setRegistrar(registrar);

    //setController(web3.eth.Contract(abi, getControllerAddress(chainId)));
  }, [chainId]);

  const walletTypeRef = useRef();
  walletTypeRef.current = walletType;
  const providerRef = useRef();
  providerRef.current = provider;

  const WalletType = { browserEVM: 1 };

  function toggleConnection() {
    if (!isConnected) {
      connectWallet();
    } else {
      disconnectWallet();
    }
  }

  function connectWallet() {
    tryConnectEVMBrowserWallet();
  }

  function disconnectWallet() {
    setProvider(null);
    setSigner(null);
    setAddress(null);
    setChainId(null);
    setWalletType(null);
    setController(null);
  }

  function tryConnectEVMBrowserWallet() {
    if (window.ethereum === null || window.ethereum === undefined) {
      return;
    }

    const prov = new ethers.providers.Web3Provider(window.ethereum);

    prov.send("eth_requestAccounts", []).then(async (accounts) => {
      if (accounts.length == 0) {
        disconnectWallet();
        return;
      }

      const signer = prov.getSigner();

      if (signer === null || signer === undefined) {
        disconnectWallet();
        return;
      }

      const cId = await signer.getChainId();

      setProvider(prov);
      setAddress(accounts[0]);
      setChainId(cId);
      setSigner(signer);
      setWalletType(WalletType.browserEVM);

      if (!eventsRegistered) {
        const { provider: ethereum } = prov;
        ethereum.on("accountsChanged", () => {
          handleAccountChanged(WalletType.browserEVM);
        });
        ethereum.on("chainChanged", () => {
          handleChainIdChanged(WalletType.browserEVM);
        });

        setEventsRegistered(true);
      }
    });
  }

  function handleAccountChanged(wallet) {
    if (wallet != walletTypeRef.current) {
      return;
    }

    const signer = providerRef.current?.getSigner();

    if (signer === null || signer === undefined) {
      disconnectWallet();
      return;
    }

    setSigner(signer);

    signer.getAddress().then(address => {
      setAddress(address);
    });
  }

  async function handleChainIdChanged(wallet) {
    if (wallet != walletTypeRef.current) {
      return;
    }

    const prov = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(prov);

    const signer = prov.getSigner();

    if (signer === null || signer === undefined) {
      disconnectWallet();
      return;
    }

    const cId = await signer.getChainId();

    setProvider(prov);
    setSigner(signer);
    setChainId(cId);
  }

  return (
    <AuthContext.Provider value={{ isConnected, provider, toggleConnection, address, chainId, controller }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export const AuthConsumer = AuthContext.Consumer;
