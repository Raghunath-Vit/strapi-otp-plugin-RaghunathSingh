import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { usePhoneNumber } from '../../PhoneNumberContext';
import './EnterOtp.css';

const EnterOtp: React.FC = () => {
  const { phoneNumber } = usePhoneNumber(); // Access the phone number from context
  const [otpCode, setOtpCode] = useState<string>('');
  const [timer, setTimer] = useState<number>(300); // 5-minute timer for OTP expiry
  const [otpExpired, setOtpExpired] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const navigate = useNavigate();

  // Timer countdown logic
  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    } else {
      setOtpExpired(true); // OTP expires when timer hits zero
    }
  }, [timer]);

  // Format timer display (MM:SS)
  const formatTimer = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Validate OTP by sending a POST request to the backend
  const handleValidateOtp = async () => {
    try {
      setError('');
      setSuccess('');
      if (otpExpired) {
        setError('OTP has expired. Please request a new one.');
        return;
      }
      const response = await axios.post('http://localhost:1337/otp-plugin/otp-logins/validate', {
        phoneNumber,
        otpCode,
      });
      console.log(response.data.isValid.jwt);
      
      const token = response.data.isValid.jwt;
      
      
      localStorage.setItem('jwtToken', token);

     
      console.log('JWT Token:', token);

     
      setSuccess('OTP validated successfully!');
      navigate('/home');
      
    } catch (err: any) {
      
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Failed to validate OTP. Please try again.');
      } else {
        setError('Failed to validate OTP. Please try again.');
      }
    }
  };

  return (
    <div className="otp-container">
      <div className="otp-card">
        <h2 className="otp-heading">OTP Verification</h2>
        <p className="otp-description">We messaged you a 6 character code for verification on your registered phone number. Enter the code to login.</p>
        <p className="otp-warning">Kindly enter the OTP manually as the Copy Paste feature is disabled.</p>
        <div className="otp-input-container">
          <input
            type="text"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
            placeholder="Enter OTP"
            disabled={otpExpired}
            className="otp-input"
          />
          <span className="otp-timer">{formatTimer()}</span>
        </div>
        <button onClick={handleValidateOtp} disabled={!otpCode || otpExpired} className="otp-button">
          Login
        </button>
        {error && <p className="otp-error">{error}</p>}
        {success && <p className="otp-success">{success}</p>}
      </div>
    </div>
  );
};

export default EnterOtp;
