// src/components/About.js
import React from 'react';
import '../../css/About.css';

const ChallengeList = () => {
  return (
    <div className="about-container">
      <h1>Les Défis</h1>
      <p>
        Cette page proposera divers défis purement ludiques qui permettront de renforcer les capacités des élèves sur n'importe quel matière
      </p>

      <h2>Ce que nous pensons proposer</h2>
      <ul>
        <li><strong>Écris bien et rapidement</strong>: Jeu visant à améliorer la mémoire orthographique des élèves en les récompensant pour écrire bien et rapidement une liste de mots proposés dans un temps imparti</li>
        <li><strong>Calcul mental</strong>: Jeu de calcul mental qui permettrait aux élèves de prendre l'apprentissage de leurs tables de calcul comme un moyen de s'améliorer sur un jeu stimulant</li>
        <li><strong>Devinette</strong>: Jeu de réflexion mettant à l'épreuve les connaissances des élèves sur leurs cours d'histoires</li>
        <li><strong>Guess the word</strong>: Jeu d'anglais qui mettra à l'épreuve les capacités de traductions des élèves de mots anglais en trouvant la signification française</li>
        </ul>

      <h2>Objectif</h2>
      <p>
        Nous croyons que l'éducation doit être accessible, engageante et amusante. S'cool est là pour accompagner 
        les apprenants dans leur parcours, tout en favorisant la collaboration entre étudiants et enseignants.
      </p>
    </div>
  );
};

export default ChallengeList;
