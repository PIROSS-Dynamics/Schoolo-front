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

    // Verify user is teacher
    if (userRole === localStorage.getItem('role')) {
      fetch(`http://localhost:8000/users/api/${userRole}/${userId}/`)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Erreur lors de la récupération des informations.');
          }
        })
        .then((data) => {
          setUser(data);
          setRole(data.role);
        })
        .catch((error) => console.error(error));
    }

    if (userRole === 'teacher') {
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

  const handleViewLesson = (lessonId) => {
    navigate(`/lessons/detail/${lessonId}`);
  };

  const handleEditQuiz = (quizId) => {
    navigate(`/edit-quiz/${quizId}`);
  };

  const handleViewQuiz = (quizId) => {
    navigate(`/quizz/play/${quizId}`);
  };

  return (
    <div className="profile-container">
      {/* Top Section: Personal and User Details */}
      <div className="profile-top">
        <h2 className='donnees-utilisateur'>Données utilisateur:</h2>
        <p>Mail: {user?.email}</p>
        <p>Rôle: {getRoleLabel(role)}</p>

        <h2 className='donnees-personnelles'>Données Personnelles:</h2>
        <p>Nom: {user?.last_name}</p>
        <p>Prénom: {user?.first_name}</p>

        <h2 className='relations'>Relations: (Fonctionnalité à développer)</h2>

      </div>

      {/* Bottom Section: Lessons and Quizzes */}

      {role === 'teacher' && (
      <div className="profile-bottom">
        {/* Left Column: Lessons */}
        <div className="profile-column">
          <h2>Leçons créées :</h2>
          <div className="profile-cards-container">
            {lessons.length > 0 ? (
              lessons.map((lesson) => (
                <div  className="profile-card profile-lesson-card">
                  <div key={lesson.id} onClick={() => handleViewLesson(lesson.id)}>
                    <h3>{lesson.title}</h3>
                    <p>{lesson.subject}</p>
                  </div>
                  <button onClick={() => handleEditLesson(lesson.id)}>Modifier</button>
                </div>
              ))
            ) : (
              <p>Aucune leçon créée.</p>
            )}
          </div>
        </div>

        {/* Right Column: Quizzes */}
        <div className="profile-column">
          <h2>Quiz créés :</h2>
          <div className="profile-cards-container">
            {quizzes.length > 0 ? (
              quizzes.map((quiz) => (
                <div key={quiz.id} className="profile-card profile-quiz-card">
                  <div onClick={() => handleViewQuiz(quiz.id)}>
                    <h3>{quiz.title}</h3>
                  </div>
                  <button onClick={() => handleEditQuiz(quiz.id)}>Modifier</button>
                </div>
              ))
            ) : (
              <p>Aucun quiz créé.</p>
            )}
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default Profile;
