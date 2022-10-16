import { createContext, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { ethers } from "ethers";
import { IRegistrar } from "../../contracts/types/IRegistrar.ts"

import IRegistrarABI from "../../contracts/abi/IRegistrar.abi.json";
import IRegistrarControllerABI from "../../contracts/abi/IRegistrarController.abi.json";
import IERC20PaymentProviderABI from "../../contracts/abi/IERC20PaymentProvider.abi.json";
import IERC20ABI from "../../contracts/abi/IERC20.abi.json"

import { getRegistrarAddress, getControllerAddress } from "../utils/contract-addresses";

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

  const [paymentProvider, setPaymentProvider] = useState(null);
  const [paymentToken, setPaymentToken] = useState(null);

  const isConnected = provider != null;

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
    setRegistrar(null);
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

      initWallet(accounts);

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

  async function initWallet() {
    const _provider = new ethers.providers.Web3Provider(window.ethereum);
    const _signer = _provider.getSigner();
    const _address = await _signer.getAddress()
    const _chainId = await _signer.getChainId();

    if (_signer === null || _signer === undefined) {
      disconnectWallet();
      return;
    }

    const iRegistrarABI = new ethers.utils.Interface(IRegistrarABI);
    const iRegistrarControllerABI = new ethers.utils.Interface(IRegistrarControllerABI);
    const iERC20PaymentProviderABI = new ethers.utils.Interface(IERC20PaymentProviderABI);
    const iERC20ABI = new ethers.utils.Interface(IERC20ABI);

    var _registrar = new ethers.Contract(getRegistrarAddress(_chainId), iRegistrarABI, _signer);
    var _controller = new ethers.Contract(getControllerAddress(_chainId), iRegistrarControllerABI, _signer);

    const _paymentProviderAddress = await _controller.getPaymentProvider();

    var _paymentProvider = new ethers.Contract(_paymentProviderAddress, iERC20PaymentProviderABI, _signer);

    const _paymentTokenAddress = await _paymentProvider.getTokenAddress();

    var _paymentToken = new ethers.Contract(_paymentTokenAddress, iERC20ABI, _signer);

    setProvider(_provider);
    setAddress(_address);
    setChainId(_chainId);
    setSigner(_signer);
    setWalletType(WalletType.browserEVM);

    setRegistrar(_registrar);
    setController(_controller);
    setPaymentProvider(_paymentProvider);
    setPaymentToken(_paymentToken);
  }

  async function handleAccountChanged(wallet) {
    if (wallet != walletTypeRef.current) {
      return;
    }

    await initWallet();
  }

  async function handleChainIdChanged(wallet) {
    if (wallet != walletTypeRef.current) {
      return;
    }

    await initWallet([address]);
  }

  return (
    <AuthContext.Provider value={{ isConnected, provider, toggleConnection, address, chainId, controller, registrar, paymentProvider, paymentToken }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export const AuthConsumer = AuthContext.Consumer;
