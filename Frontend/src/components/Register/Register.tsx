import React from 'react';
import './Register.css';
import { useNavigate } from 'react-router-dom';

const Register:React.FC = () => {
  const navigate=useNavigate();

  const handleSignUp=()=>{
    navigate('/verifyno');
  }
  return (
    <div className='container'>
        <button className="signotp" onClick={handleSignUp}>Sign Up With Mobile</button>
    </div>
  )
}

export default Register
