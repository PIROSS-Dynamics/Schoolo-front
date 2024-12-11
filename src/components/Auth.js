import React, { useState } from 'react';
import '../css/Auth.css'; // Import du fichier CSS pour le style

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true); // Mode par défaut sur la connexion
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'student', // Rôle par défaut
  });

  // Gérer les changements dans les champs du formulaire
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Gérer la soumission du formulaire
  const handleSubmit = async (event) => {
    event.preventDefault();

    const url = isLogin
      ? 'http://localhost:8000/users/api/login/' // URL pour la connexion
      : 'http://localhost:8000/users/api/register/'; // URL pour l'inscription

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Une erreur est survenue. Vérifiez vos informations.');
      }

      const data = await response.json();

      if (isLogin) {
        // Stocker les données utilisateur après connexion
        localStorage.setItem('access', data.access);
        localStorage.setItem('first_name', data.first_name);
        localStorage.setItem('role', data.role);
        window.location.href = '/'; // Redirection après connexion
      } else {
        alert('Inscription réussie. Vous pouvez maintenant vous connecter.');
        setIsLogin(true); // Basculer vers la page de connexion
      }
    } catch (error) {
      console.error('Erreur :', error);
      alert(error.message); // Afficher un message d'erreur
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-column">
        {isLogin ? (
          <>
            <h2>Connexion</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Mot de passe"
                onChange={handleChange}
                required
              />
              <button type="submit">Se connecter</button>
            </form>
            <p>Pas encore inscrit ? <button onClick={() => setIsLogin(false)}>S'inscrire</button></p>
          </>
        ) : (
          <>
            <h2>Inscription</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="first_name"
                placeholder="Prénom"
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="last_name"
                placeholder="Nom"
                onChange={handleChange}
                required
              />
              <select name="role" onChange={handleChange} required>
                <option value="student">Élève</option>
                <option value="teacher">Professeur</option>
                <option value="parent">Parent</option>
              </select>
              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Mot de passe"
                onChange={handleChange}
                required
              />
              <button type="submit">S'inscrire</button>
            </form>
            <p>Déjà inscrit ? <button onClick={() => setIsLogin(true)}>Se connecter</button></p>
          </>
        )}
      </div>
    </div>
  );
};

export default Auth;
