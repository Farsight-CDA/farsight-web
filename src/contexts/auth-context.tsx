import { createContext, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { ethers } from "ethers";

import IRegistrarABI from "../../contracts/abi/IRegistrar.abi.json";
import IRegistrarControllerABI from "../../contracts/abi/IRegistrarController.abi.json";
import IERC20PaymentProviderABI from "../../contracts/abi/IERC20PaymentProvider.abi.json";
import IERC20ABI from "../../contracts/abi/IERC20.abi.json";

import {
  getRegistrarAddress,
  getControllerAddress,
} from "../utils/contract-addresses";
import { isSupported } from "../utils/chain-ids";
import { IRegistrar } from "../../contracts/types/IRegistrar";
import { IRegistrarController } from "../../contracts/types/IRegistrarController";
import { IERC20PaymentProvider } from "../../contracts/types/IERC20PaymentProvider";
import { IERC20 } from "../../contracts/types";
import { Web3Provider } from "@ethersproject/providers";

declare global {
  interface Window {
    ethereum: any;
  }
}

interface IAuthContext {
  isConnected: boolean;
  toggleConnection: () => void;
  address: string | null;
  chainId: number | null;
  provider: Web3Provider | null;
  controller: IRegistrarController | null;
  registrar: IRegistrar | null;
  paymentProvider: IERC20PaymentProvider | null;
  paymentToken: IERC20 | null;
  secret: string;
  ResetSecret: () => void;
}

export const AuthContext = createContext<IAuthContext>(null!);

interface AuthProviderProps {
  children: any[];
}

enum WalletType {
  BrowserEVM,
}

export const AuthProvider = (props: AuthProviderProps) => {
  const { children } = props;

  const [eventsRegistered, setEventsRegistered] = useState(false);

  const [provider, setProvider] = useState<Web3Provider | null>(null);

  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [walletType, setWalletType] = useState<WalletType | null>(null);

  const [registrar, setRegistrar] = useState<IRegistrar | null>(null);
  const [controller, setController] = useState<IRegistrarController | null>(
    null
  );

  const [paymentProvider, setPaymentProvider] =
    useState<IERC20PaymentProvider | null>(null);
  const [paymentToken, setPaymentToken] = useState<IERC20 | null>(null);

  const [secret, setSecret] = useState<string>(
    "0x0000000000000000000000000000000000000000000000000000006d6168616d"
  ); //ToDo: Generate random bytes

  const isConnected =
    provider != null &&
    chainId != null &&
    (!isSupported(chainId) ||
      (registrar != null &&
        controller != null &&
        paymentProvider != null &&
        paymentToken != null));

  const walletTypeRef = useRef<WalletType | null>();
  walletTypeRef.current = walletType;
  const providerRef = useRef<Web3Provider | null>();
  providerRef.current = provider;

  const getRandomHex = (size: number) =>
    [...Array(size)]
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join("");

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

    prov.send("eth_requestAccounts", []).then((accounts) => {
      if (accounts.length == 0) {
        disconnectWallet();
        return;
      }

      initWallet().then();
    });
  }
  function ResetSecret() {
    setSecret("0x" + getRandomHex(64));
  }

  useEffect(() => {
    ResetSecret();
    initWallet().then();
  }, []);

  async function initWallet() {
    if (window.ethereum === undefined) {
      return;
    }

    const _provider = new ethers.providers.Web3Provider(window.ethereum);

    if (!eventsRegistered) {
      const { provider: ethereum }: any = _provider;
      ethereum.on("accountsChanged", () => {
        handleAccountChanged(WalletType.BrowserEVM);
      });
      ethereum.on("chainChanged", () => {
        handleChainIdChanged(WalletType.BrowserEVM);
      });

      setEventsRegistered(true);
    }

    const addresses = await _provider.listAccounts();
    if (addresses.length == 0) {
      return;
    }

    const _signer = _provider.getSigner();
    const _address = await _signer.getAddress();
    const _chainId = await _signer.getChainId();

    setProvider(_provider);
    setAddress(_address);
    setChainId(_chainId);
    setWalletType(WalletType.BrowserEVM);

    if (!isSupported(_chainId)) {
      setRegistrar(null);
      setController(null);
      setPaymentProvider(null);
      setPaymentToken(null);
      return;
    }

    const iRegistrarABI = new ethers.utils.Interface(IRegistrarABI);
    const iRegistrarControllerABI = new ethers.utils.Interface(
      IRegistrarControllerABI
    );
    const iERC20PaymentProviderABI = new ethers.utils.Interface(
      IERC20PaymentProviderABI
    );
    const iERC20ABI = new ethers.utils.Interface(IERC20ABI);

    const _registrar = new ethers.Contract(
      getRegistrarAddress(_chainId)!,
      iRegistrarABI,
      _signer
    ) as IRegistrar;
    const _controller = new ethers.Contract(
      getControllerAddress(_chainId)!,
      iRegistrarControllerABI,
      _signer
    ) as IRegistrarController;

    const _paymentProviderAddress = await _controller.getPaymentProvider();

    var _paymentProvider = new ethers.Contract(
      _paymentProviderAddress,
      iERC20PaymentProviderABI,
      _signer
    ) as IERC20PaymentProvider;

    const _paymentTokenAddress = await _paymentProvider.getTokenAddress();

    var _paymentToken = new ethers.Contract(
      _paymentTokenAddress,
      iERC20ABI,
      _signer
    ) as IERC20;

    setRegistrar(_registrar);
    setController(_controller);
    setPaymentProvider(_paymentProvider);
    setPaymentToken(_paymentToken);
  }

  function handleAccountChanged(wallet: WalletType | null | undefined) {
    if (wallet != walletTypeRef.current) {
      return;
    }

    initWallet();
  }

  function handleChainIdChanged(wallet: WalletType | null | undefined) {
    if (wallet != walletTypeRef.current) {
      return;
    }

    initWallet().then();
  }

  return (
    <AuthContext.Provider
      value={{
        isConnected,
        provider,
        toggleConnection,
        address,
        chainId,
        controller,
        registrar,
        paymentProvider,
        paymentToken,
        secret,
        ResetSecret,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export const AuthConsumer = AuthContext.Consumer;
