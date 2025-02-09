import React, { useState, useEffect } from 'react';
import '../css/style.css';
import '../css/Header.css';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('first_name');
    localStorage.removeItem('role');
    localStorage.removeItem('id');
    setUser(null);
    window.location.href = '/login';
  };

  useEffect(() => {
    const firstName = localStorage.getItem('first_name');
    const role = localStorage.getItem('role');
    if (firstName) {
      setUser({ firstName, role });
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-menu')) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchUnreadNotifications = () => {
      const userId = localStorage.getItem('id');
      if (!userId) return;

      fetch(`http://localhost:8000/activity/api/notifications/?user_id=${userId}`)
        .then(response => response.json())
        .then(data => {
          const unread = data.filter(notification => !notification.is_read).length;
          setUnreadCount(unread);
        })
        .catch(error => console.error("Erreur récupération notifications", error));
    };

    fetchUnreadNotifications();
    const interval = setInterval(fetchUnreadNotifications, 60000); // Rafraîchir toutes les minutes

    return () => clearInterval(interval);
  }, []);

  const getRoleLabel = (role) => {
    switch (role) {
      case 'student': return 'Étudiant';
      case 'teacher': return 'Professeur';
      case 'parent': return 'Parent';
      default: return 'Utilisateur';
    }
  };

  return (
    <header>
      <div className="header-container">
        <div className="logo">
          <a href="/">
            <img src="/images/logo scool.png" alt="S'cool Logo" />
          </a>
        </div>

        <div className="menu-toggle" onClick={toggleMenu}>
          <img src="/images/menu icon.png" alt="Menu" className="menu-icon" />
        </div>

        {isMenuOpen && (
          <ul className="phone-menu">
            <li><a href="/">Accueil</a></li>
            <li><a href="/#subject-choice-container">Matières</a></li>
            <li><a href="/quizz">Quiz</a></li>
            <li><a href="/challenges">Défis</a></li>
            <li><a href="/about">À Propos</a></li>
          </ul>
        )}

        <nav>
          <ul className="nav-links">
            <li><a href="/">Accueil</a></li>
            <li><a href="/#subject-choice-container">Matières</a></li>
            <li><a href="/quizz">Quiz</a></li>
            <li><a href="/challenges">Défis</a></li>
            <li><a href="/about">À Propos</a></li>
          </ul>
        </nav>

        <div className="header-actions">
          {user ? (
            <div className={`user-menu ${isDropdownOpen ? 'open' : ''}`}>
              <button className="btn" onClick={toggleDropdown}>
                {user.firstName} ({getRoleLabel(user.role)})
                {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
              </button>
              <div className="user-dropdown">
                <ul>
                  <li><a href="/profile">Profil</a></li>
                  <li className="notif-link">
                    <a href="/notifications">Notifications</a>
                    {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
                  </li>
                  <li><a href="/chat">Messagerie</a></li>
                  <li><button onClick={handleLogout}>Déconnexion</button></li>
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
