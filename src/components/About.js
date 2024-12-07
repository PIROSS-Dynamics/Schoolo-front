// src/components/About.js
import React from 'react';
import '../css/About.css'; // Fichier CSS pour styliser cette page

const About = () => {
  return (
    <div className="about-container">
      <h1>À propos de S'cool</h1>
      <p>
        S'cool est une plateforme éducative innovante conçue pour rendre l'apprentissage amusant et interactif. 
        Que vous soyez étudiant, enseignant ou simplement passionné par l'éducation, notre site vous offre 
        des outils simples et efficaces pour améliorer vos connaissances.
      </p>

      <h2>Ce que nous proposons</h2>
      <ul>
        <li><strong>Leçons interactives</strong>: Accédez à des cours bien structurés adaptés à divers sujets et niveaux.</li>
        <li><strong>Quizz éducatifs</strong>: Testez vos connaissances avec des quizz interactifs, et suivez vos progrès.</li>
        <li><strong>Défis</strong>: Renforcez vos acquis à travers divers jeux en tentant d'atteindre les meilleurs scores</li>
        <li><strong>Statistiques d'apprentissage</strong>: Suivez votre évolution et identifiez les domaines à améliorer.</li>
        <li><strong>Convivialité et esthétique</strong>: Avec une interface colorée et intuitive, notre plateforme est adaptée aux enfants et aux apprenants de tous âges.</li>
        <li><strong>Professeurs numériques</strong>: Faites vous accompagner par nos professeurs numériques en leur demandant toutes les questions que vous souhaitez</li>
      </ul>

      <h2>Notre mission</h2>
      <p>
        Nous croyons que l'éducation doit être accessible, engageante et amusante. S'cool est là pour accompagner 
        les apprenants dans leur parcours, tout en favorisant la collaboration entre étudiants et enseignants.
      </p>

      <h2>Contactez-nous</h2>
      <p>
        Vous avez des questions ou souhaitez en savoir plus ? Contactez notre équipe de PIROSS-Dynamics via [insérer un formulaire de contact ou email].
      </p>
    </div>
  );
};

export default About;
