import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Login.module.css'; // Use the updated CSS Module

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userID', response.data.userID);
      onLogin(); // Notify parent component about successful login
      navigate('/play'); // Navigate to the main play area
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError('User not found. Please register first.');
      } else {
        setError(error.response?.data?.message || 'Error logging in. Please check your credentials.');
      }
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register'); // Navigate to the registration page
  };

  return (
    <div className={styles.loginPage}> {/* Added a wrapper for page styling */}
      <div className={styles.container}> {/* Renamed for clarity */}
        <h2 className={styles.title}>Welcome Back!</h2> {/* Added a title */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="username" className={styles.label}>Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className={styles.input}
              required // Added required attribute
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={styles.input}
              required // Added required attribute
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.buttonGroup}>
            <button type="submit" className={`${styles.button} ${styles.loginButton}`}>
              Login
            </button>
            <button type="button" onClick={handleRegisterRedirect} className={`${styles.button} ${styles.registerButton}`}>
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;