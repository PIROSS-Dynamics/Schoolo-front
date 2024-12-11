import React, { useState, useEffect } from 'react';
import '../css/style.css'; // Import CSS
import '../css/Header.css';
import { Link } from 'react-router-dom';

const Header = () => {
  // Manage menu open/close state
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // State to track user login status
  const [user, setUser] = useState(null);

  // Function to toggle menu open/close
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Fetch user data from localStorage
  useEffect(() => {
    const firstName = localStorage.getItem('first_name');
    const role = localStorage.getItem('role');
    if (firstName) {
      setUser({ firstName, role });
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    // Remove user info from localStorage
    localStorage.removeItem('access');
    localStorage.removeItem('first_name');
    localStorage.removeItem('role');

    // Reset user state and redirect
    setUser(null);
    window.location.href = '/login'; // Redirect to login
  };

  useEffect(() => {
    const firstName = localStorage.getItem('first_name');
    const role = localStorage.getItem('role');
    if (firstName && role) {
        setUser({ firstName, role });  // Mise à jour avec le rôle correct
    }
}, []);


  const getRoleLabel = (role) => {
    switch (role) {
      case 'student':
        return 'Étudiant';
      case 'teacher':
        return 'Professeur';
      case 'parent':
        return 'Parent';
      default:
        return 'Utilisateur';
    }
  };
  
  return (
    <header>
      <div className="header-container">
        {/* Logo */}
        <div className="logo">
          <a href="/">
            <img src="/images/logo scool.png" alt="S'cool Logo" />
          </a>
        </div>
  
        {/* Menu toggle for small screens */}
        <div className="menu-toggle" onClick={toggleMenu}>
          <img src="/images/menu icon.png" alt="Menu" className="menu-icon" />
        </div>
  
        {/* Phone menu */}
        {isMenuOpen && (
          <ul className="phone-menu">
            <li><a href="/">Accueil</a></li>
            <li><a href="/#subject-choice-container">Matières</a></li>
            <li><a href="/quizz">Quiz</a></li>
            <li><a href="/challenge">Défis</a></li>
            <li><a href="/about">À Propos</a></li>
          </ul>
        )}
  
        {/* Desktop navigation */}
        <nav>
          <ul className="nav-links">
            <li><a href="/">Accueil</a></li>
            <li><a href="/#subject-choice-container">Matières</a></li>
            <li><a href="/quizz">Quiz</a></li>
            <li><a href="/challenge">Défis</a></li>
            <li><a href="/about">À Propos</a></li>
          </ul>
        </nav>
  
        {/* User Section */}
        <div className="header-actions">
          {user ? (
            <div className="user-menu">
              <button className="btn">
                {user.firstName} ({getRoleLabel(user.role)})
              </button>
              <div className="user-dropdown">
                <ul>
                  <li><a href="/profile">Profil</a></li>
                  <li><button onClick={handleLogout}>Se déconnecter</button></li>
                </ul>
              </div>
            </div>
          ) : (
            <Link to="/login" className="btn">Connexion / Inscription</Link>
          )}
        </div>
      </div>
    </header>
  );
  
};

export default Header;
