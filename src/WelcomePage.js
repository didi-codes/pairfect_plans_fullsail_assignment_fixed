import React from 'react';
import { Link } from 'react-router-dom';
import logo from "./Pairfect_Plans_Logo.png";
import './App.css';

function WelcomePage() {
  return (
    <div className="App" id='welcome'>
      <img src={logo} alt="logo" className="logo" id='welcome-logo'/>
      <header className="App-header">
        <h1>Pairfect Plans</h1>
        <div className="welcome-buttons">
          <Link to="/signup">
            <button className="welcome-btn">Get Started</button>
          </Link>
          <div className="login-link">
          <p className='subtitle'>Have An Account?  
            <Link to="/login">
             Log In
          </Link>
          </p>
          </div>
        </div>
      </header>
    </div>
  );
}

export default WelcomePage;
