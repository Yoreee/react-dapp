import logo from './logo.svg';
import './App.css';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'
import { useState } from 'react';

// Set address
const GreeterAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

function App() {

  const [greeting, setGreetingValue] = useState();

  async function requestAccount() {
    // use window.ethereum.request to prompt metamask sign-in
    await window.ethereum.request({method: 'eth_requestAccounts' })
  }

  async function fetchGreeting() {

    // Check if metamask exists. 
    if (typeof window.ethereum !== 'undefined') {

      // Get provider using ethers.providers by passing in the window.ethereum object to Web3Provider().
      const provider = new ethers.providers.Web3Provider(window.ethereum)

      /* Get the contract using ethers.Contract by passing in the address, 
      the binary interface of the solidity contract, and the provider. */
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider)
      
      try { 
        const data = contract.greet()
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
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
