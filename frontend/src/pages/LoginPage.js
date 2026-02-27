import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaHome, FaEye, FaEyeSlash } from 'react-icons/fa'; 
import API from '../api';

const LoginPage = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(''); // Added error state for feedback
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // 1. Send Login Request
      const { data } = await API.post('/auth/login', { email, password });
      
      // 2. Save Data
      // 🔴 UPDATE: Using 'userInfo' to match App.js logic
      localStorage.setItem('token', data.token);
      localStorage.setItem('userInfo', JSON.stringify(data.user)); 
      
      setUser(data.user);
      
      // 3. 🔴 REDIRECT: Send to Dashboard (/shop), NOT Landing Page (/)
      navigate('/shop');
      
    } catch (err) {
      console.error(err);
      setError('Invalid Email or Password'); // Show error message on screen
    }
  };

  return (
    <div style={styles.container}>
      <div style={{ marginBottom: '20px' }}>
        <Link to="/" style={styles.homeLink}>
          <FaHome /> Back to Home
        </Link>
      </div>

      <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>Login</h2>
      
      {/* Error Message Display */}
      {error && <p style={{ color: '#e74c3c', marginBottom: '15px', fontWeight: 'bold' }}>{error}</p>}
      
      <form onSubmit={handleLogin}>
        <input 
          type="email" 
          placeholder="Email" 
          style={styles.input} 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        
        {/* --- PASSWORD FIELD WITH EYE ICON --- */}
        <div style={styles.passwordWrapper}>
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder="Password" 
            style={styles.input} 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <span 
            onClick={() => setShowPassword(!showPassword)} 
            style={styles.eyeIcon}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button type="submit" style={styles.button}>Login</button>
      </form>
      
      <p style={{ marginTop: '15px' }}>
        Don't have an account? <Link to="/signup" style={{ color: '#27ae60', fontWeight: 'bold' }}>Sign Up</Link>
      </p>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '30px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
    backgroundColor: 'white'
  },
  homeLink: {
    textDecoration: 'none',
    color: '#7f8c8d',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '14px',
    fontWeight: 'bold'
  },
  passwordWrapper: {
    position: 'relative',
    width: '100%',
  },
  input: {
    width: '100%',
    padding: '12px',
    margin: '10px 0',
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxSizing: 'border-box'
  },
  eyeIcon: {
    position: 'absolute',
    right: '15px',
    top: '50%',
    transform: 'translateY(-50%)', 
    cursor: 'pointer',
    color: '#7f8c8d',
    fontSize: '18px'
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '10px'
  }
};

export default LoginPage;