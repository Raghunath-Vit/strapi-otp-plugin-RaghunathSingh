import React from 'react';
import './User.css'; 

const User = () => {
  return (
    <div className="userPage">
      <header className="navbar">
        <h1 className="navbar-title">Welcome to Your Dashboard</h1>
      </header>
      <main className="content">
        <div className="welcome-container">
          <h1 className="welcome-heading">Welcome User!</h1>
          <p className="welcome-message">You have successfully logged in. Enjoy your stay!</p>
        </div>
      </main>
      <footer className="footer">
        <p className="footer-text">© 2024 My OTP App</p>
      </footer>
    </div>
  );
};

export default User;
