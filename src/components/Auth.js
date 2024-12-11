import React, { useState } from 'react';
import '../css/Auth.css'; 

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true); // Auth mode (register or login)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'student', // default role
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Sending to back-end
  const handleSubmit = async (event) => {
    event.preventDefault();

    const url = isLogin
      ? 'http://localhost:8000/users/api/login/' // back URL for login
      : 'http://localhost:8000/users/api/register/'; // back URL for register

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
        // stocking users data after login
        localStorage.setItem('access', data.access);
        localStorage.setItem('first_name', data.first_name);
        localStorage.setItem('role', data.role);
        window.location.href = '/'; // redirection after login
      } else {
        alert('Inscription réussie. Vous pouvez maintenant vous connecter.');
        setIsLogin(true); // go to login
      }
    } catch (error) {
      console.error('Erreur :', error);
      alert(error.message); // error
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-column">
        <div className="auth-logo">
          <img src="/images/logo scool.png" alt="S'cool Logo" />
        </div>
        {isLogin ? (
          <>
            <h2>Connexion</h2>
            <form onSubmit={handleSubmit}>
              <input
                className="auth-input"
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                required
              />
              <input
                className="auth-input"
                type="password"
                name="password"
                placeholder="Mot de passe"
                onChange={handleChange}
                required
              />
              <button className="auth-button" type="submit">Se connecter</button>
            </form>
            <p>Pas encore inscrit ? <button onClick={() => setIsLogin(false)}>S'inscrire</button></p>
          </>
        ) : (
          <>
            <h2>Inscription</h2>
            <form onSubmit={handleSubmit}>
              <input
                className="auth-input"
                type="text"
                name="first_name"
                placeholder="Prénom"
                onChange={handleChange}
                required
                autoComplete="off"
              />
              <input
                className="auth-input"
                type="text"
                name="last_name"
                placeholder="Nom"
                onChange={handleChange}
                required
                autoComplete="off"
              />
              <select className="auth-select" name="role" onChange={handleChange} required>
                <option value="student">Élève</option>
                <option value="teacher">Professeur</option>
                <option value="parent">Parent</option>
              </select>
              <input
                className="auth-input"
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                required
                autoComplete="off"
              />
              <input
                className="auth-input"
                type="password"
                name="password"
                placeholder="Mot de passe"
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
              <button className="auth-button" type="submit">S'inscrire</button>
            </form>
            <p>Déjà inscrit ? <button onClick={() => setIsLogin(true)}>Se connecter</button></p>
          </>
        )}
      </div>
    </div>
  );
};

export default Auth;
