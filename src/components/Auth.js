import React, { useState, useEffect } from 'react';
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

  // Effect to reset form data when switching between login and register
  useEffect(() => {
    if (isLogin) {
      setFormData({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        role: 'student',
      });
    } else {
      // If switching to register, retain email value
      setFormData((prevData) => ({
        ...prevData,
        email: prevData.email, // Ensure email stays the same during the switch
      }));
    }
  }, [isLogin]);

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
        // get the error from the back
        const errorData = await response.json();
        throw new Error(errorData.error || 'Une erreur est survenue.');
      }
  
      const data = await response.json();
  
      if (isLogin) {
        // stock the users data on local storage after login
        localStorage.setItem('access', data.access);
        localStorage.setItem('first_name', data.first_name);
        localStorage.setItem('role', data.role);
        localStorage.setItem('id', data.id);
        window.location.href = '/'; // redirect to home
      } else {
        alert('Inscription réussie. Vous pouvez maintenant vous connecter.');
        setIsLogin(true); // go to login view
      }
    } catch (error) {
      console.error('Erreur :', error);
      alert(error.message); // show the specific error
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
                value={formData.email} // Bind value to state
                onChange={handleChange}
                required
              />
              <input
                className="auth-input"
                type="password"
                name="password"
                placeholder="Mot de passe"
                value={formData.password} // Bind value to state
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
                value={formData.first_name} // Bind value to state
                onChange={handleChange}
                required
                autoComplete="off"
              />
              <input
                className="auth-input"
                type="text"
                name="last_name"
                placeholder="Nom"
                value={formData.last_name} // Bind value to state
                onChange={handleChange}
                required
                autoComplete="off"
              />
              <select className="auth-select" name="role" value={formData.role} onChange={handleChange} required>
                <option value="student">Élève</option>
                <option value="teacher">Professeur</option>
                <option value="parent">Parent</option>
              </select>
              <input
                className="auth-input"
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email} // Bind value to state
                onChange={handleChange}
                required
                autoComplete="off"
              />
              <input
                className="auth-input"
                type="password"
                name="password"
                placeholder="Mot de passe"
                value={formData.password} // Bind value to state
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
