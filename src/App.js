import React, { useState, useEffect } from 'react';
import Web3 from 'web3'
import DrawingCollectible from './abis/DrawingCollectible.json'
import CanvasComponent from './CanvasComponent.js'

function App() {

  const [deployedContract, setDeployedContract] = useState();
  const [account, setAccount] = useState();
  const [balance, setBalance] = useState();
  const [name, setName] = useState();
  const [symbol, setSymbol] = useState();


  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  };

  const loadBlockchainData = async () => {
    const web3 = window.web3
    const networkId = await web3.eth.net.getId()
    if (networkId !== 4) {
      window.alert('Please switch network to the Rinkeby and refresh the page')
    }
    const networkData = DrawingCollectible.networks[networkId];
    if (networkData) {
      const contract_address = networkData.address;
      const contract = new web3.eth.Contract(DrawingCollectible.abi, contract_address);
      setDeployedContract(contract);
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0])
      const bal = await web3.eth.getBalance(accounts[0]);
      setBalance(bal);
      contract.methods.name().call(function (err, res) {
        setName(res)
      });
      contract.methods.symbol().call(function (err, res) {
        setSymbol(res)
      });
    } else {
      alert("Wrong NETWORK")
    }
  }

  useEffect(() => {
    const load = async () => {
      await loadWeb3()
      await loadBlockchainData()
    }
    load();
  }, []);

  return (
    <div className="App">
      <p>Deployed Contract's Address: <b>{deployedContract?._address}</b> </p>
      <p>My Metamask Account: <b>{account} </b></p>
      <p>My Balance: <b>{balance}</b> </p>
      <p>Deployed Contract's Name / Symbol:<b> {name}/{symbol} </b></p>

      <CanvasComponent
        deployedContract={deployedContract}
        account={account}
      />
    </div>
  );
}

export default App;
