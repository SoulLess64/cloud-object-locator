import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, ref, get } from '../firebase';
import './login.css';

function Login() {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!pin.trim()) {
      alert('Please enter a PIN');
      return;
    }

    setLoading(true);
    try {
      const pinRef = ref(db, 'auth/pin');
      const snapshot = await get(pinRef);
      const correctPin = snapshot.val();
      
      if (pin === correctPin) {
        navigate('/dashboard');
      } else {
        alert('Invalid PIN');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="login-container">
      <header className="header">
        <h3>EEE 416 – Microprocessor & Embedded Systems Laboratory</h3>
        <h4>Jan 2025 | Level – 4 Term – 1 | Section A2</h4>
        <h2>Project Website</h2>
      </header>
      
      <div className="project-title">
        Cloud-Based Smart Object Locator
      </div>
      
      <div className="submit-section">
        <div className="submit-block">
          <h3>Submitted by – Group 8</h3>
          <p>Afnan Ali <strong>2006063</strong></p>
          <p>Anas Rohan <strong>2006064</strong></p>
          <p>Md. Shakib Hossain <strong>2006065</strong></p>
          <p>Al Amin Shawon <strong>1806098</strong></p>
        </div>
        
        <div className="submit-block">
          <h3>Submitted to:</h3>
          <p>Md. Ehsanul Karim<br />Lecturer, Dept. of EEE, BUET</p>
          <p>Akif Hamid<br />Part-time Teacher (PT), Dept. of EEE, BUET</p>
        </div>
      </div>
      
      <div className="pin-box">
        <label>Enter Security PIN:</label>
        <input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter PIN"
          disabled={loading}
        />
        <button onClick={handleLogin} disabled={loading}>
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </div>
      
      <div className="footer-text">
        Bangladesh University of Engineering and Technology<br />
        Department of Electrical and Electronic Engineering
      </div>
    </div>
  );
}

export default Login;