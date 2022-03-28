import React, {
  ReactElement,
  createContext,
  useContext,
  useState,
} from "react";
import { Connection, SendOptions } from "@solana/web3.js";
import { ENV as ChainId } from "@solana/spl-token-registry";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";

export const NETWORK = "mainnet";
// export const NETWORK = "devnet";

export const ENDPOINTS = [
  {
    name: "mainnet",
    endpoint: "https://api.mainnet-beta.solana.com",
    ChainId: ChainId.MainnetBeta,
  },
  {
    name: "devnet",
    endpoint: "https://api.devnet.solana.com",
    ChainId: ChainId.Devnet,
  },
];

const DEFAULT = ENDPOINTS.find((env) => env.name === NETWORK);

export type WalletContextType = {
  connection: Connection;
  wallet: PhantomWalletAdapter | null;
  walletName: string | undefined;
  connectWallet: (walletName?: string) => void;
  disconnectWallet: () => void;
};

const defaultContextValues = {
  connection: new Connection(DEFAULT!.endpoint, "confirmed"),
  wallet: null,
  walletName: undefined,
  connectWallet: () => {},
  disconnectWallet: () => undefined,
};

export const WalletContext =
  createContext<WalletContextType>(defaultContextValues);

type WalletProviderPropsType = { children: ReactElement };

export function WalletProvider({
  children,
}: WalletProviderPropsType): ReactElement {
  const [wallet, setWallet] = useState<PhantomWalletAdapter | null>(null);
  const [walletName, setWalletName] = useState<string | undefined>(undefined);
  const connection = new MyConnection(DEFAULT!.endpoint, "confirmed");

  function disconnectWallet() {
    wallet?.disconnect();
    setWalletName(undefined);
    setWallet(null);
  }

  async function connectWallet(walletName?: string) {
    let newWallet: PhantomWalletAdapter;

    newWallet = new PhantomWalletAdapter();
    await newWallet.connect();
    newWallet.on("disconnect", () => {
      disconnectWallet();
    });
    setWalletName(walletName);
    setWallet(newWallet);
  }

  const value = {
    connection,
    wallet,
    walletName,
    connectWallet,
    disconnectWallet,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export const useWallet = (): WalletContextType => useContext(WalletContext);

class MyConnection extends Connection {
  async sendRawTransaction(
    rawTransaction: Buffer | Uint8Array | number[],
    options?: SendOptions | undefined
  ) {
    const signature = await super.sendRawTransaction(rawTransaction, options);
    return signature;
  }
}
