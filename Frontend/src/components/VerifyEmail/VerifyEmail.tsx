import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './VerifyEmail.css';

const VerifyEmail: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [otpCode, setOtpCode] = useState<string>('');
  const [isNextButtonEnabled, setIsNextButtonEnabled] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(300); 
  const [otpExpired, setOtpExpired] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const navigate = useNavigate();

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setIsNextButtonEnabled(event.target.value.includes('@'));
  };

  const handleNextClick = async () => {
    try {
      await axios.post('http://localhost:1337/otp-plugin/otp-logins/generate', { email });
      setStep('otp');
    } catch (error) {
      console.error('Error while sending email:', error);
    }
  };

  useEffect(() => {
    if (timer > 0 && step === 'otp') {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    } else if (timer === 0) {
      setOtpExpired(true);
    }
  }, [timer, step]);

  const formatTimer = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleValidateOtp = async () => {
    try {
      setError('');
      setSuccess('');
      if (otpExpired) {
        setError('OTP has expired. Please request a new one.');
        return;
      }
      const response = await axios.post('http://localhost:1337/otp-plugin/otp-logins/validate', {
        email,
        otpCode,
      });
      if (response.status === 200) {
        setSuccess('OTP validated successfully!');
        navigate('/verifyno');
      } else {
        setError('Invalid OTP. Please check and try again.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to validate OTP. Please try again.');
    }
  };

  return (
    <div className="verify-container">
      <div className="verify-card">
        {step === 'email' && (
          <>
            <h1 className="verify-heading">Verify Your Email</h1>
            <div className="verify-input-container">
              <label htmlFor="email" className="verify-label">Email Address:</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email"
                className="verify-input"
              />
            </div>
            <button 
              onClick={handleNextClick} 
              disabled={!isNextButtonEnabled} 
              className="verify-button"
            >
              Send OTP
            </button>
          </>
        )}

        {step === 'otp' && (
          <>
            <h2 className="otp-heading">OTP Verification</h2>
            <p className="otp-description">We emailed you a 6 character code for verification. Enter the code to proceed.</p>
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
            <button 
              onClick={handleValidateOtp} 
              disabled={!otpCode || otpExpired} 
              className="otp-button"
            >
              Verify OTP
            </button>
            {error && <p className="otp-error">{error}</p>}
            {success && <p className="otp-success">{success}</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
