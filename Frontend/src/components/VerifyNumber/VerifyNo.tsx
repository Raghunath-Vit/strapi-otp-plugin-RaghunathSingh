// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { usePhoneNumber } from '../../PhoneNumberContext';

// const VerifyNo: React.FC = () => {
//   const { phoneNumber, setPhoneNumber } = usePhoneNumber();
//   const [isNextButtonEnabled, setIsNextButtonEnabled] = useState<boolean>(false);
//   const navigate = useNavigate();

//   const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setPhoneNumber(event.target.value);
//     setIsNextButtonEnabled(true);
//   };

//   const handleCaptchaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     validateForm(phoneNumber, event.target.value);
//   };

//   const validateForm = (phone: string, captcha: string) => {
//     setIsNextButtonEnabled(phone.length > 0 && captcha.length > 0);
//   };

//   const handleNextClick = async () => {
//     try {
//       await axios.post('http://localhost:1337/otp-plugin/otp-logins/generate', { phoneNumber });
//       navigate('/enterotp');
//     } catch (error) {
//       console.error('Error while sending phone number:', error);
//     }
//   };

//   return (
//     <div>
//       <h1>Verify Your Phone Number</h1>
//       <div>
//         <label htmlFor="phoneNumber">Phone Number:</label>
//         <input
//           id="phoneNumber"
//           type="tel"
//           value={phoneNumber}
//           onChange={handlePhoneNumberChange}
//           placeholder="Enter your phone number"
//         />
//       </div>
//       <button onClick={handleNextClick} disabled={!isNextButtonEnabled}>
//         Next
//       </button>
//     </div>
//   );
// };

// export default VerifyNo;







import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { usePhoneNumber } from '../../PhoneNumberContext';
import './VerifyNo.css'; // Make sure to create this CSS file

const VerifyNo: React.FC = () => {
  const { phoneNumber, setPhoneNumber } = usePhoneNumber();
  const [isNextButtonEnabled, setIsNextButtonEnabled] = useState<boolean>(false);
  const navigate = useNavigate();

  const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(event.target.value);
    setIsNextButtonEnabled(true);
  };

  const handleCaptchaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    validateForm(phoneNumber, event.target.value);
  };

  const validateForm = (phone: string, captcha: string) => {
    setIsNextButtonEnabled(phone.length > 0 && captcha.length > 0);
  };

  const handleNextClick = async () => {
    try {
      await axios.post('http://localhost:1337/otp-plugin/otp-logins/generate', { phoneNumber });
      navigate('/enterotp');
    } catch (error) {
      console.error('Error while sending phone number:', error);
    }
  };

  return (
    <div className="verify-container">
      <div className="verify-card">
        <h1 className="verify-heading">Verify Your Phone Number</h1>
        <div className="verify-input-container">
          <label htmlFor="phoneNumber" className="verify-label">Phone Number:</label>
          <input
            id="phoneNumber"
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            placeholder="Enter your phone number"
            className="verify-input"
          />
        </div>
        <button 
          onClick={handleNextClick} 
          disabled={!isNextButtonEnabled} 
          className="verify-button"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default VerifyNo;
