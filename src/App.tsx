import React, { useState } from "react";
import "./App.css";
import { WalletProvider, useWallet } from "./providers/useWallet";

function App() {
  return (
    <div className="App">
      <WalletProvider>
        <BuyScreen />
      </WalletProvider>
    </div>
  );
}

function BuyScreen() {
  const { wallet, connectWallet } = useWallet();
  const [text, setText] = useState("");
  const [signedText, setsignedText] = useState("");
 
  return (
    <header className="App-header">
      <div className="Container">
        <h1>message signer</h1>

        <div className="grid2x2">
          {(!wallet || !wallet.connected) && (
            <div
              className="phantom"
              onClick={() => {
                connectWallet("phantom");
              }}
            >
              Phantom
            </div>
          )}
          {wallet && wallet.connected && (
            <>
              <textarea className="msg" style={{ width: "100%", height: "300px" }} value={text} onChange={(e) => setText(e.target.value)} />
              <div
                onClick={ async () => {
                  const encodedMessage = new TextEncoder().encode(text);
                  const signedMessage = await  wallet.signMessage(encodedMessage);
                  const signedMessageString = Buffer.from(signedMessage).toString('hex');
                  setsignedText(signedMessageString);
                }}
              >
                sign<br></br>
              </div>
              <textarea disabled className="msg" style={{ width: "100%", height: "300px" }} value={signedText} />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
export default App;
