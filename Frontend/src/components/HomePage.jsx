import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [otpExpired, setOtpExpired] = useState(false);
  const [countdown, setCountdown] = useState(0); 
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (generatedOtp) {
      const expirationTime = 300000; 
      setCountdown(expirationTime / 1000); 

      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setOtpExpired(true);
            setGeneratedOtp('');
            setError('OTP expired. Please request a new one.');
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      
      return () => clearInterval(timer);
    }
  }, [generatedOtp]);

  const handleGenerateOtp = async () => {
    try {
      setError('');
      setSuccess('');
      setOtpExpired(false);
      const response = await axios.post('http://localhost:1337/otp-plugin/otp-logins/generate', { phoneNumber });
      setGeneratedOtp(response.data.otpCode); 
      console.log('Generated OTP:', response.data.otpCode);
      setSuccess('OTP generated successfully! It will expire in 5 minutes.');
    } catch (err) {
      if (err.response && err.response.data) {
        console.log(err.response.data.error.message)
        setError(err.response.data.error.message || 'Failed to generate OTP. Please try again.');
      } else {
        setError('Failed to generate OTP. Please try again.');
      }
    }
  };

  const handleValidateOtp = async () => {
    try {
      setError('');
      setSuccess('');
      if (otpExpired) {
        setError('OTP has expired. Please request a new one.');
        return;
      }
      const response = await axios.post('http://localhost:1337/otp-plugin/otp-logins/validate', { phoneNumber, otpCode });
      if (response.data.isValid) {
        setSuccess('OTP validated successfully!');
        navigate('/user');
      } else {
        setError('Invalid OTP. Please check and try again.');
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Failed to validate OTP. Please try again.');
      } else {
        setError('Failed to validate OTP. Please try again.');
      }
    }
  };


  const formatCountdown = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="homePage">
      <header className="navbar">
        <h1 className="navbar-title">My OTP App</h1>
      </header>
      <main className="content">
        <div className="form-container">
          <h2 className="form-heading">OTP Verification</h2>
          <div className="form-group">
            <input
              type="text"
              className="input-field"
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <button className="button" onClick={handleGenerateOtp}>Get OTP</button>
          </div>
          <div className="form-group">
            <input
              type="text"
              className="input-field"
              placeholder="Enter OTP"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
            />
            <button className="button" onClick={handleValidateOtp}>Validate OTP</button>
          </div>
          <div className="countdown">
            {generatedOtp && !otpExpired && (
              <p>Time remaining: {formatCountdown(countdown)}</p>
            )}
          </div>
          <div className="message-container">
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
          </div>
        </div>
      </main>
      <footer className="footer">
        <p className="footer-text">© 2024 My OTP App</p>
      </footer>
    </div>
  );
};

export default HomePage;



