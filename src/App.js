import { ethers } from "ethers";
import React, {useEffect, useState} from "react";
import "./App.css";
import abi from "./utils/WavePortal.json";
import Form from "./components/Form"


const App = () => {
 
  const [currentAccount, setCurrentAccount] = useState("");
  const [allWaves, setAllWaves] = useState([]);
  const contractAddress = '0x467C41E834Aa7f20a58828117Bcc4441c07db315';
  const contractABI = abi.abi;

  const checkIfWalletIsConnected = async () => {
    try {
      const {ethereum} = window; 
      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return; 
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({method: "eth_accounts"});

      if (accounts.length !== 0) {
        const account = accounts[0]; 
        console.log("Found an authorized account:", account); 
        setCurrentAccount(account);
        // getAllWaves(); 
         
        
      } else {
        console.log("no authorized account found")
      }
    } catch (error) {
      console.log(error);
    } 
  }

  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const waves = await wavePortalContract.getAllWaves();


        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        /*
         * Store our data in React State
         */
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }


  /**
  * Implement your connectWallet method here
  */

const connectWallet = async () => {
  try {
    const {ethereum} = window; 

    if (!ethereum) {
      alert("Get MetaMask!");
      return; 
    }

    const accounts = await ethereum.request({method: "eth_requestAccounts"});
    console.log("Connected", accounts[0]); 
    setCurrentAccount(accounts[0])

  } catch (error) {
    console.log(error);
  }
}

const wave = async () => {
  try {
    const {ethereum} = window; 

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum); 
      const signer = provider.getSigner(); 
      const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

      let count = await wavePortalContract.getTotalWaves(); 
      console.log("Retrieved total wave count...", count.toNumber());
      /*
      * Execute the actual wave from your smart contract 
      */
     const waveTxn = await wavePortalContract.wave("this is a message");
     console.log("Mining...", waveTxn.hash);

     await waveTxn.wait(); 
     console.log("Mined ---", waveTxn.hash);

     count = await wavePortalContract.getTotalWaves(); 
     console.log("Retrieved total wave count...", count.toNumber());

    } else {
      console.log("Ethereum object does not exist!");
    }
  } catch (error){
    console.log(error);
  }
}


const handleSubmit = (msg) => {
  console.log('your message is:', msg);
  wave(); 
}

useEffect(() => {
  checkIfWalletIsConnected();
},)


return (
  <div className="mainContainer">
    <div className="dataContainer">
      <div className="header">
      <span role="img" aria-label="wave">👋</span> Hey there!
      </div>

      <div className="bio">
        I am Michael and I worked at Microsoft so that's pretty cool right? Connect your Ethereum wallet and wave at me!
      </div>

      {!currentAccount && (
        <button className="waveButton" onClick={connectWallet}>
          Connect Wallet
        </button>
      )}

      <Form handleSubmit={handleSubmit} />

      {allWaves.map((wave, index) => {
        return (
          <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
            <div>Address: {wave.address}</div>
            <div>Time: {wave.timestamp.toString()}</div>
            <div>Message: {wave.message}</div>
          </div>)
      })}
    </div>
  </div>
);

}

export default App