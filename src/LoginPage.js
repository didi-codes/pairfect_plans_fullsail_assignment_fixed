import React, { useState } from 'react';
import './App.css';
import { auth } from './firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';

function LoginPage() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      // Navigate after login
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
      console.error('Login error:', err);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>Log In</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Email" value={credentials.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={credentials.password} onChange={handleChange} required />
          <button type="submit" className="login-btn">Log In</button>
        </form>
        {error && <p className="error">{error}</p>}
        <p>Don’t have an account? <Link to="/signup">Sign Up</Link></p>
      </header>
    </div>
  );
}

export default LoginPage;