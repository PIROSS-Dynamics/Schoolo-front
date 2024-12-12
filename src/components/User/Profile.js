// src/components/About.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/User/Profile.css'; 

const Profile = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [lessons, setLessons] = useState([]); 
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();
  
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

      if(userRole === "teacher"){
        fetch(`http://localhost:8000/lessons/api/teacher/${userId}/lessons/`) 
            .then((response) => {
              if (response.ok) {
                return response.json();
              } else {
                throw new Error('Erreur lors de la récupération des leçons.');
              }
            })
            .then((lessonsData) => setLessons(lessonsData))
            .catch((error) => console.error(error));

          // Récupérer les quiz créés par le professeur
          fetch(`http://localhost:8000/quizz/api/teacher/${userId}/quizzes/`)
            .then((response) => {
              if (response.ok) {
                return response.json();
              } else {
                throw new Error('Erreur lors de la récupération des quiz.');
              }
            })
            .then((quizzesData) => setQuizzes(quizzesData))
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

    const handleEditLesson = (lessonId) => {
        navigate(`/edit-lesson/${lessonId}`);
      };
    
      const handleEditQuiz = (quizId) => {
        navigate(`/edit-quiz/${quizId}`);
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

      {/* Leçons et quiz sous forme de cartes */}
        {role === 'teacher' && (
        <div className="teacher-content">
            <h2>Leçons créées :</h2>
            <div className="profile-cards-container">
            {lessons.length > 0 ? (
                lessons.map((lesson) => (
                <div
                    key={lesson.id}
                    className="profile-card profile-lesson-card"
                    onClick={() => handleEditLesson(lesson.id)}
                >
                    <h3>{lesson.title}</h3>
                    <p>{lesson.subject}</p>
                    <button>Modifier</button>
                </div>
                ))
            ) : (
                <p>Aucune leçon créée.</p>
            )}
            </div>

            <h2>Quiz créés :</h2>
            <div className="profile-cards-container">
            {quizzes.length > 0 ? (
                quizzes.map((quiz) => (
                <div
                    key={quiz.id}
                    className="profile-card profile-quiz-card"
                    onClick={() => handleEditQuiz(quiz.id)}
                >
                    <h3>{quiz.title}</h3>
                    <button>Modifier</button>
                </div>
                ))
            ) : (
                <p>Aucun quiz créé.</p>
            )}
            </div>
        </div>
        )}


    </div>

    
  );
};



export default Profile;
