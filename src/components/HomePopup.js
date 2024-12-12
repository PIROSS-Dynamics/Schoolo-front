import React, { useState, useEffect } from 'react';
import '../css/HomePopup.css';

const HomePopup = () => {
  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(true);

  // Home pop up pages content
  const pagesContent = [
    "Vous êtes sur la beta de la version 0.3.0 de S'cool",
    "Sur cette version : des leçons vous sont disponibles depuis la page d'accueil et les quiz depuis la navbar",
    "Naviguez sur le carrousel pour choisir si vous voulez ajouter une leçon ou un quiz",
    "La connexion à votre profil utilisateur accompagnée de vos statistiques et de la gestion de votre planning sera bientôt disponible sur cette beta"
  ];

  // Home pop up pages titles
  const pageTitles = [
    "Bienvenue sur S'cool !",
    "Fonctionnalités pour les élèves",
    "Fonctionnalités pour les professeurs",
    "À venir sur S'cool"
  ];

  useEffect(() => {
    
    // get today date
    const today = new Date().toISOString().split('T')[0];

    // get last day the user has seen this pop up
    const lastShownDate = localStorage.getItem('popupLastShownDate');

    // show the pop up if this was'nt showed to the user on the date
    if (lastShownDate === today) {
      setIsOpen(false);

      // update the local storage 
      localStorage.setItem('popupLastShownDate', today);
    }
  }, []);

  const handleClose = () => setIsOpen(false);
  const handleNextPage = () => setPage((prevPage) => (prevPage < 4 ? prevPage + 1 : 1));
  const handlePrevPage = () => setPage((prevPage) => (prevPage > 1 ? prevPage - 1 : 4));

  if (!isOpen) return null;

  return (
    <div className="HomePopup-container">
      <div className="HomePopup">
        <div className="HomePopup-header">
          <span className="HomePopup-title">{pageTitles[page - 1]}</span>
          <button className="close-btn" onClick={handleClose}>×</button>
        </div>
        {/* Séparation ligne */}
        <hr className="popup-divider" />
        <div className="HomePopup-content">
          <p>{pagesContent[page - 1]}</p>
        </div>
        <div className="HomePopup-footer">
          {/* Go back button */}
          <button className="nav-btn circle-btn" onClick={handlePrevPage}>
            &#8592; {/* Left arrow */}
          </button>

          {/* Pages indicators */}
          <div className="page-indicators">
            {pagesContent.map((_, index) => (
              <div
                key={index}
                className={`page-indicator ${page === index + 1 ? 'active' : ''}`}
              ></div>
            ))}
          </div>

          {/* Go next button */}
          <button className="nav-btn circle-btn" onClick={handleNextPage}>
            &#8594; {/* Right arrow */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePopup;
