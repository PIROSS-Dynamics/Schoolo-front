// src/components/About.js
import React, { useEffect, useState } from 'react';
import '../../css/User/Profile.css'; 

const Profile = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  
    useEffect(() => {
      const userId = localStorage.getItem('id');
      const userRole = localStorage.getItem('role');

      // Vérify user is teacher
      if (userRole === localStorage.getItem('role')) {
          // if he is a teacher we recup his data
          fetch(`http://localhost:8000/users/api/${userRole}/${userId}/`)
          .then((response) => {
              if (response.ok) {
                return response.json();

              } else {
                  throw new Error('Erreur lors de la récupération des informations.');
              }
          })
          .then((data) => {
            setUser(data); // Stocker les infos du professeur 
            setRole(data.role)
          })
          .catch((error) => console.error(error));
      }
      
          
  }, []);

    // french traduction of user role next to his name when he is connected
    const getRoleLabel = (role) => {
      switch (role) {
        case 'student':
          return 'Étudiant';
        case 'teacher':
          return 'Professeur';
        case 'parent':
          return 'Parent';
        default:
          return 'Utilisateur';
      }
    };

  return (
    <div className="profile-container">

      <h2>Données utilisateur:</h2>
      <p>Mail: {user?.email} </p> 
      <p>Rôle: {getRoleLabel(role)}</p>


      <h2>Données Personnelles:</h2>
      <p>Nom: {user?.last_name} </p>
      <p>Prénom: {user?.first_name} </p>
    

      <h2>Relations:</h2>

    </div>
  );
};


// * username
// * calendrier
// * first_name
// * last_name
// * role
// * email
export default Profile;
