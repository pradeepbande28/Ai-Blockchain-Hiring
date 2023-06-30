import React, { useEffect, useRef, useState } from 'react';
// reactstrap components
import { Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import { ethers } from 'ethers';

import './index.scss';

function HomePage() {

  const [isConnected, setIsConnected] = useState(false);
  const [signer, setSigner] = useState(null);
  const handleAccountsChangedRef = useRef(null);

  useEffect(() => {

    if (typeof window.ethereum == 'undefined') {
      alert("No Metamask!")
    }

    const checkConnection = async () => {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        setIsConnected(true);
        setSigner(signer);
      }
    };

    const handleAccountsChanged = (accounts) => {
      if (accounts.length > 0) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        setIsConnected(true);
        setSigner(signer);
      } else {
        setIsConnected(false);
        setSigner(null);
      }
    };

    handleAccountsChangedRef.current = handleAccountsChanged;
    window.ethereum.on('accountsChanged', handleAccountsChangedRef.current);

    checkConnection();

    return () => {
      handleAccountsChangedRef.current = null;
    };
  }, []);

  const connectWallet = async () => {
    if (!isConnected) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        setIsConnected(true);
        setSigner(signer);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const signText = async () => {
    if (!signer) {
      alert('Please connect to MetaMask first!');
      return;
    }
    const textToSign = 'Hello, Ai-Blockchain!';
    try {
      const signature = await signer.signMessage(textToSign);
      console.log("Signature --- ", signature)
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Row className="padding-32">
      <Col xs="4" className="">
        {' '}
        <img src={require('assets/img/logo.png')} />{' '}
      </Col>
      <Col xs="4" className="logo" >
        <Link to="/" className="margin-12">
          HOME
        </Link>{' '}
        <span>/</span>
        <Link to="/about" className="margin-12">
          ABOUT
        </Link>{' '}
        <span>/</span>
        <Link to="/loginpage" className="margin-12">
          LOGIN
        </Link>
      </Col>
      <Col xs="4" className="logo" >
        {
          isConnected &&
          <a className="margin-12" onClick={signText}>
            Sign Text
          </a>
        }
        <a className="margin-12" onClick={connectWallet}>
          {isConnected ? 'Connected' : 'Connect Wallet'}
        </a>
      </Col>
    </Row>
  );
}

export default HomePage;
