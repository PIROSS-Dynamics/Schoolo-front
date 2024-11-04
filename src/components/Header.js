import React, { useState } from 'react';
import '../css/style.css'; // Import CSS
import '../css/Header.css';

const Header = () => {

  // Manage menu open/close state
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to toggle menu open/close
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header>
      <div className="header-container">
        {/* Logo */}
        <div className="logo">
          <a href="/">
            <img src="/images/logo scool.png" alt="BookMyEvent Logo" />
          </a>
        </div>

        {/* Menu toggle for small screens (hamburger icon) */}
        <div className="menu-toggle" onClick={toggleMenu}>
          <img 
            src="/images/menu icon.png" 
            alt="Menu" 
            className="menu-icon"
          />
        </div>

        {/* Phone menu only visible when isMenuOpen is true */}
        {isMenuOpen && (
          <ul className="phone-menu">
            <li><a href="/">Accueil</a></li>
            <li><a href="/calendar">Calendrier</a></li>
            <li><a href="/about">À Propos</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        )}

        {/* Navigation Menu for desktop */}
        <nav>
          <ul className= "nav-links">
            <li><a href="/">Accueil</a></li>
            <li><a href="/calendar">Calendrier</a></li>
            <li><a href="/about">À Propos</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </nav>

        {/* Connexion / Inscription Button */}
        <div className="header-actions">
          <a href="/login" className="btn">Connexion / Inscription</a>
        </div>
      </div>
    </header>
  );
};

export default Header;
