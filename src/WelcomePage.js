import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

function WelcomePage() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Pairfect Plans 💕</h1>
        <p>Make Dating Easy, Make It Fun</p>
        <div className="welcome-buttons">
          <Link to="/signup">
            <button className="welcome-btn">Sign Up</button>
          </Link>
          <Link to="/login">
            <button className="welcome-btn secondary">Log In</button>
          </Link>
        </div>
      </header>
    </div>
  );
}

export default WelcomePage;
