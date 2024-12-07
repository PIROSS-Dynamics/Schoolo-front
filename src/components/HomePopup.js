import React, { useState } from 'react';
import '../css/HomePopup.css'; // Assurez-vous d'importer le CSS approprié

const HomePopup = () => {
  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(true);

  // Contenu des pages de la pop-up
  const pagesContent = [
    "Vous êtes sur la beta de la version 0.3.0 de S'cool",
    "Sur cette version : des leçons vous sont disponible depuis la page d'accueil et les quiz depuis la navbar",
    "Naviguez sur le carrousel pour choisir si vous voulez ajouter une leçon ou un quiz",
    "La connexion à votre profil utilisateur accompagnés de vos statistique et de la gestion de votre planning sera bientôt disponible sur cette beta"
  ];

  const handleClose = () => setIsOpen(false);
  const handleNextPage = () => setPage((prevPage) => (prevPage < 4 ? prevPage + 1 : prevPage));


  if (!isOpen) return null;

  return (
    <div className="HomePopup-container">
      <div className="HomePopup">
        <div className="HomePopup-header">
          <span className="HomePopup-title">Bienvenue sur S'cool !</span>
          <button className="close-btn" onClick={handleClose}>×</button>
        </div>
        <div className="HomePopup-content">
          <p>{pagesContent[page - 1]}</p>
        </div>
        <div className="HomePopup-footer">
          {/* Bouton suivant uniquement si on n'est pas sur la dernière page */}
          {page < 4 && (
            <button className="nav-btn" onClick={handleNextPage}>
              Suivant
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePopup;
