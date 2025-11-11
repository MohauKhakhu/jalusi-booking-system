import React from "react";
import { useNavigate } from 'react-router-dom'
import { FaSpa } from "react-icons/fa";
import "./styles/Navbar.css";

const Navbar = () => {

  const navigate = useNavigate()

  const stars = Array.from({ length: 20 }).map((_, i) => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: `${Math.random() * 6 + 3}px`,
    delay: `${Math.random() * 5}s`,
  }));

  return (
    <div className="navbarWrapperContainer">
      <div className="stars">
        {stars.map((s, i) => (
          <span
            key={i}
            className="star"
            style={{
              top: s.top,
              left: s.left,
              width: s.size,
              height: s.size,
              animationDelay: s.delay,
            }}
          ></span>
        ))}
      </div>

      <div className="navbar">
        <div className="navbarLeft flex items-center gap-4">
          <FaSpa className="navbarIcon" />
          <h1 className="navbarText">Jalusi Beauty</h1>
        </div>

        <div className="navbarRight flex items-center gap-6">
          <button className="btnLogin slideIn" onClick={() => navigate('/')}>Login</button>
          <button className="btnSignUp slideIn" onClick={() => navigate('/signup')}>Sign Up</button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
