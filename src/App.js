import React, { useEffect, useState } from 'react';
import './App.css';
//import contract from './contracts/NFTCollectible.json';
//import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers/';
import snapshot from '@snapshot-labs/snapshot.js/';

//import client712 from './EIP712.ts';

const hub = 'https://hub.snapshot.org'; // or https://testnet.snapshot.org for testnet
const client712 = new snapshot.Client712(hub);

function App() {

  const [currentAccount, setCurrentAccount] = useState(null);

  const checkWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have Metamask installed!");
      return;
    } else {
      console.log("Wallet exists! We're ready to go!")
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account: ", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  }

  const connectWalletHandler = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Please install Metamask!");
    }

    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      console.log("Found an account! Address: ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err)
    }
  }

  const voteHandler = async () => {
    try {
      const { ethereum } = window;
      console.log(snapshot);
      if (ethereum) {
        const web3 = new Web3Provider(window.ethereum);
        const accounts = await ethereum.request({ method: 'eth_accounts' });

        console.log(web3);
        console.log(accounts[0]);
        console.log(await (web3.getSigner()).getAddress());

        const receipt = await client712.vote(web3, web3.account, {
          space: 'aavegotchi.eth',
          proposal:"0x917da4b1106a666eecbecb38d4aadf6f091b5fc4c8f94de769811f81eadf1010",
          type: 'single-choice',
          choice: 1,
          metadata: JSON.stringify({})
        });
        console.log(receipt);

      } else {
        console.log("Ethereum object does not exist");
      }

    } catch (err) {
      console.log(err);
    }
  }

  const connectWalletButton = () => {
    return (
      <button onClick={connectWalletHandler} className='cta-button connect-wallet-button'>
        Connect Wallet
      </button>
    )
  }

  const voteButton = () => {
    return (
      <button onClick={voteHandler} className='cta-button mint-nft-button'>
        Vote
      </button>
    )
  }

  useEffect(() => {
    checkWalletIsConnected();
  }, [])

  return (
    <div className='main-app'>
      <h1>Snapshot vote button</h1>
      <div>
        {currentAccount ? voteButton() : connectWalletButton()}
      </div>
    </div>
  )
}

export default App;
