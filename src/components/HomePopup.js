import React, { useState, useEffect } from 'react';
import '../css/HomePopup.css';

const HomePopup = () => {
  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(true);

  // Home pop up pages content
  const pagesContent = [
    "Vous êtes sur S'cool",
    "Récentes grandes features : Possibilité d'ajouter un quizz depuis un compte professeur. Possibilité de retrouver toutes les leçons et quizz crées dans la page profil d'un Professeur, avec la fonctionnalité de pouvoir modifier celle-ci",
    "Récentes petites features : Accès à un éditeur de texte sur le champ contenu lors de la création des leçons (gras, italique etc). Possibilité de charger un fichier pdf pour le contenu de la leçon",
    "La gestion de votre planning ainsi que d'autres features à déterminer seront bientôt disponible"
  ];

  // Home pop up pages titles
  const pageTitles = [
    "Bienvenue sur S'cool !",
    "De grandes nouveautés",
    "Des ajouts pratiques",
    "À venir sur S'cool"
  ];

  useEffect(() => {
    
    // get today date
    const today = new Date().toISOString().split('T')[0];

    // get last day the user has seen this pop up
    const lastShownDate = localStorage.getItem('popupLastShownDate');

    // get if the user has closed the pop today 
    const popupWasClosed = localStorage.getItem('HomePopupWasClosed') === 'true' ? true : false;


    // show the pop up if this was'nt showed to the user on the date and he did'nt close it on the day
    if(popupWasClosed === false) {
      setIsOpen(true);
      localStorage.setItem('popupLastShownDate', today);
    }
    if (lastShownDate === today ) {
      if(popupWasClosed === true)
      {
        setIsOpen(false);
      }
    } else {
      localStorage.setItem('HomePopupWasClosed', false);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('HomePopupWasClosed', true);
    setIsOpen(false);
  };
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
