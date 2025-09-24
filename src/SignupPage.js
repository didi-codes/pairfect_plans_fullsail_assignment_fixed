import React, { useState } from 'react';
import './App.css';
import { auth } from './firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';

function SignupPage() {
  const [formData, setFormData] = useState({ name: '', email: '', username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      // Navigate directly to onboarding
      navigate('/onboarding');
    } catch (err) {
      setError(err.message);
      console.error('Signup error:', err);
    }
  };

  return (
    <div className="App" id='signup'>
      <header className="App-header">
        <h2>Create Account</h2>
        <p classname='subtitle'>Just A Few Quick Things To Get You Started</p>
        <form className="signup-form" onSubmit={handleSubmit}>
          <label id='form-label'>Name</label>
          <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
          <label id='form-label'>Email</label>
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <label id='form-label'>Username</label>
          <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
          <label id='form-label'>Password</label>
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          <button type="submit" className="signup-btn">Create Account</button>
        </form>
        {error && <p className="error">{error}</p>}
        <p className='subtitle'>Already have an account? <Link to="/login">Log In</Link></p>
      </header>
    </div>
  );
}

export default SignupPage;