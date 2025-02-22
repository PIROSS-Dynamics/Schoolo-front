import React from 'react';
import { Link } from 'react-router-dom';
// import '../../css/About.css';
import '../../css/Challenges/ChallengeList.css';

const ChallengeList = () => {
  return (
    <div>
      <h2 className='list-title'>Relève un défi !</h2>
      <div className="challenge-banner">
        <img src="/images/englishGuy.png" alt="Personnage anglais" className="challenge-image" />
        <h2>Guess the Word</h2>
        <p>Mets à l'épreuve ton vocabulaire anglais avec le "Guess the Word"</p>
        <Link to="/challenges/guessWord" className="challenge-button">Jouer maintenant</Link>
      </div>
      <div className="challenge-banner">
        <img src="/images/englishGuy.png" alt="Personnage anglais" className="challenge-image" />
        <h2>Trouve le pays</h2>
        <p>Sauras tu retoruver le pays sur la carte ?</p>
        <Link to="/challenges/findCountry" className="challenge-button">Jouer maintenant</Link>      </div>
      {/* <div className="about-container">
        <h1>Les Défis</h1>
        <p>
          Cette page proposera divers défis purement ludiques qui permettront de renforcer les capacités des élèves sur n'importe quelle matière.
        </p>

        <h2>Ce que nous pensons proposer</h2>
        <ul>
          <li><strong>Écris bien et rapidement</strong>: Jeu visant à améliorer la mémoire orthographique des élèves en les récompensant pour écrire bien et rapidement une liste de mots proposés dans un temps imparti.</li>
          <li><strong>Calcul mental</strong>: Jeu de calcul mental qui permettrait aux élèves de prendre l'apprentissage de leurs tables de calcul comme un moyen de s'améliorer sur un jeu stimulant.</li>
          <li><strong>Devinette</strong>: Jeu de réflexion mettant à l'épreuve les connaissances des élèves sur leurs cours d'histoire.</li>
          <li><strong>Guess the Word</strong>: Jeu d'anglais qui mettra à l'épreuve les capacités de traduction des élèves en trouvant la signification française de mots anglais.</li>
        </ul>

        <h2>Objectif</h2>
        <p>
          Nous croyons que l'éducation doit être accessible, engageante et amusante. S'cool est là pour accompagner 
          les apprenants dans leur parcours, tout en favorisant la collaboration entre étudiants et enseignants.
        </p>
      </div> */}
    </div> 
  );
};

export default ChallengeList;
