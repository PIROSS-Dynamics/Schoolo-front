import React, { useState } from 'react';
import '../css/HomePopup.css'; // Assurez-vous d'importer le CSS approprié

const HomePopup = () => {
  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(true);

  // Contenu des pages de la pop-up
  const pagesContent = [
    "Vous êtes sur la beta de la version 0.3.0 de S'cool",
    "Sur cette version : des leçons vous sont disponibles depuis la page d'accueil et les quiz depuis la navbar",
    "Naviguez sur le carrousel pour choisir si vous voulez ajouter une leçon ou un quiz",
    "La connexion à votre profil utilisateur accompagnée de vos statistiques et de la gestion de votre planning sera bientôt disponible sur cette beta"
  ];

  // Titres pour chaque page
  const pageTitles = [
    "Bienvenue sur S'cool !",
    "Fonctionnalités pour les élèves",
    "Fonctionnalités pour les professeurs",
    "À venir sur S'cool"
  ];

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
        {/* Ligne de séparation */}
        <hr className="popup-divider" />
        <div className="HomePopup-content">
          <p>{pagesContent[page - 1]}</p>
        </div>
        <div className="HomePopup-footer">
          {/* Bouton pour revenir à la page précédente */}
          <button className="nav-btn circle-btn" onClick={handlePrevPage}>
            &#8592; {/* Flèche gauche */}
          </button>

          {/* Indicateurs des pages */}
          <div className="page-indicators">
            {pagesContent.map((_, index) => (
              <div
                key={index}
                className={`page-indicator ${page === index + 1 ? 'active' : ''}`}
              ></div>
            ))}
          </div>

          {/* Bouton pour aller à la page suivante */}
          <button className="nav-btn circle-btn" onClick={handleNextPage}>
            &#8594; {/* Flèche droite */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePopup;
