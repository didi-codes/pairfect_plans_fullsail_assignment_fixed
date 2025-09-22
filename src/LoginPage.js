import React, { useState } from 'react';
import './App.css';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

function LoginPage() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );
      const user = userCredential.user;
      console.log('Logged in:', user.uid);

      // Redirect to onboarding or dashboard
      navigate('/onboarding');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>Log In</h2>
        {error && <p className="error">{error}</p>}
        <form className="login-form" onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Email" value={credentials.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={credentials.password} onChange={handleChange} required />
          <button type="submit" className="login-btn">Log In</button>
        </form>
        <p>Don’t have an account? <Link to="/signup">Sign Up</Link></p>
      </header>
    </div>
  );
}

export default LoginPage;

