import React, { useState } from 'react';
import './App.css';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

function SignupPage() {
  const [formData, setFormData] = useState({ name: '', email: '', username: '', password: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // store additional info in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        createdAt: new Date(),
      });

      // Redirect to onboarding after signup
      navigate('/onboarding');
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>Sign Up</h2>
        {error && <p className="error">{error}</p>}
        <form className="signup-form" onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          <button type="submit" className="signup-btn">Create Account</button>
        </form>
        <p>Already have an account? <Link to="/login">Log In</Link></p>
      </header>
    </div>
  );
}

export default SignupPage;
