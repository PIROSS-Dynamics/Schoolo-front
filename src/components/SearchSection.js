// src/components/SearchSection.js
import React from 'react';
import '../css/style.css'; // Import CSS
import '../css/SearchSection.css';

const SearchSection = () => {
  return (
    <section className="search-section">
      <h2 id="search-section-title">Rechercher un lieu à réserver</h2>
      <form className="search-form-inline">
        {/* City */}
        <div className="form-group-inline city">
          <input type="text" id="city" name="city" placeholder="Entrez une ville" required />
        </div>

        {/* Event Place */}
        <div className="form-group-inline">
          <select id="place-type" name="place-type">
            <option value="all">Tous les lieux</option>
            <option value="bars">Bars</option>
            <option value="nightclub">Boîte de nuit</option>
            <option value="games-room">Salle de jeux</option>
            <option value="cinema">cinéma</option>
            <option value="community hall">salle des fêtes</option>
          </select>
        </div>

        {/* Reservation Date */}
        <div className="form-group-inline">
          <input type="date" id="date" name="date" required />
        </div>

        {/* Group Number */}
        <div className="form-group-inline">
          <input type="number" id="guests" name="guests" min="1" placeholder="Nombre de personnes" required />
        </div>

        <div className="form-group-inline form-group-button">
          <button type="submit" className="btn-search">
            <img src="https://firebasestorage.googleapis.com/v0/b/bookmyevent-piross.appspot.com/o/images%2Fsearch%20icon.png?alt=media&token=7cbe87b8-9a64-4ffa-8295-67966d29872c" 
            alt="Rechercher" className="search-icon" />
          </button>
        </div>
      </form>
    </section>
  );
};

export default SearchSection;
