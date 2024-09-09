import React from 'react';
import './App.css';
import Register from './Components/Register/Register';
import { Routes,Route } from 'react-router-dom';import VerifyNo from './Components/VerifyNumber/VerifyNo';
import EnterOtp from './Components/EnterOtp/EnterOtp';
import Home from './Components/Home/Home';


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Register/>}/>      
        <Route path='/verifyno' element={<VerifyNo/>}/>
        <Route path='/enterotp' element={<EnterOtp/>} />
        <Route path='/home' element={<Home/>}/>
      </Routes>
    </div>
  );
}

export default App;
