import React from 'react';
import { Link } from 'react-router-dom';
import '../../css/Challenges/ChallengeList.css';

const ChallengeList = () => {
  return (
    <div>
      <h2 className='list-title'>Relève un défi !</h2>
      <div className="challenge-container">
        <div className="challenge-banner english">
          <img src="/images/englishGuy.png" alt="Personnage anglais" className="challenge-image" />
          <h2>Guess the Word</h2>
          <p>Mets à l'épreuve ton vocabulaire anglais avec le "Guess the Word"</p>
          <Link to="/challenges/guessWord" className="challenge-button">Jouer maintenant</Link>
        </div>
        <div className="challenge-banner history">
          <img src="/images/historyGuy.png" alt="Personnage histoire" className="challenge-image" />
          <h2>Trouve le pays</h2>
          <p>Sauras-tu retrouver le pays sur la carte ?</p>
          <Link to="/challenges/findCountry" className="challenge-button">Jouer maintenant</Link>
        </div>
      </div>
    </div> 
  );
};

export default ChallengeList;
