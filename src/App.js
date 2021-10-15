import './App.css';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'
import { useState } from 'react';
import { ethers } from "ethers";


/* 
--- SET ADDRESS ---

This is the address that gets returned when you deploy 
(npx hardhat run scripts/deploy.js --network localhost) 
your contract. This is the address of your smart contract. 
It is your contract address.

*/
const greeterAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"
// const greeterAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"

function App() {

  const [greeting, setGreetingValue] = useState('');

  async function requestAccount() {
    // use window.ethereum.request to prompt metamask sign-in
    await window.ethereum.request({method: 'eth_requestAccounts' })
  }

  async function fetchGreeting() {
    console.log('FETCHING...')
    // Check if metamask exists. 
    if (typeof window.ethereum !== 'undefined') {

      // Get provider using ethers.providers by passing in the window.ethereum object to Web3Provider().
      const provider = new ethers.providers.Web3Provider(window.ethereum)

      /* Get the contract using ethers.Contract by passing in the address, 
      the binary interface of the solidity contract, and the provider. */
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider)
      
      try { 
        const data = await contract.greet()
        console.log('data: ', data)
      } catch (err) {
        console.log("error: ", err)
      }
    }
  }

  async function setGreeting() {
    
    if (!greeting) return
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
      const transaction = await contract.setGreeting(greeting)
      await transaction.wait()
      fetchGreeting()
    }
  }

  async function sayHello() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider)

      try {
        const sayhello = await contract.sayHello()
        console.log(sayhello)
      }
      catch (err) {
        console.log(err)
      } 
    }
  }
  
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <button onClick={setGreeting}> Set Greeting</button>
        <button onClick={sayHello}> HELLO?</button>
        <input 
          onChange={e => setGreetingValue(e.target.value)} 
          placeholder="Set greeting..."
          value={greeting}  
        ></input>
      </header>
    </div>
  );
}

export default App;
