import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/User/Profile.css';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const Profile = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [quizResults, setQuizResults] = useState([]);
  const [relationEmail, setRelationEmail] = useState('');
  const [relationMessage, setRelationMessage] = useState(null);
  const [relations, setRelations] = useState([]);
  const [messagePopup, setMessagePopup] = useState({ isOpen: false, receiver: null, receiverName: null });
  const [messageContent, setMessageContent] = useState("");
  const navigate = useNavigate();
  const [scoreProgressionData, setScoreProgressionData] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem('id');
    const userRole = localStorage.getItem('role');

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

    // verify if it's a teacher to take the lessons and quizzes that he did
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

    // verify if it's a student to recup his results of quizzes
    if (userRole === 'student') {
      fetch(`http://localhost:8000/stats/api/userQuizResults/${userId}/`)
        .then(response => response.json())
        .then(resultsData => {
          setQuizResults(resultsData); // ✅ Store raw quiz results
    
          // ✅ Process Score Progression Data (Convert to Percentage)
          const processedScoreProgression = resultsData.map(q => ({
            date: new Date(q.date).toLocaleDateString(),
            scorePercentage: (q.score / q.total) * 100 // Convert to percentage
          }));
    
          // ✅ Sort by date (ensures progression makes sense)
          processedScoreProgression.sort((a, b) => new Date(a.date) - new Date(b.date));
    
          // ✅ Update state with sorted progression data
          setScoreProgressionData(processedScoreProgression);
        })
        .catch(error => console.error("Erreur lors de la récupération des résultats des quiz:", error));
    }
    

    // Récupérer les relations
    fetch(`http://localhost:8000/activity/api/user-relations/?user_id=${userId}`)
    .then(response => response.json())
    .then((data) => setRelations(data))  // Stocker les relations
    .catch(error => console.error("Erreur récupération relations", error));
  }, []);







      // deuxième useEffect qui calcule les résultats pour scorePercentage
      useEffect(() => {
        if (role === 'student' && quizResults.length > 0) {
          const processedScoreProgression = quizResults.map(q => ({
            title: q.title,  // Include quiz title
            subject: q.subject,     // Include subject
            date: new Date(q.date).toLocaleDateString(),
            scorePercentage: (q.score / q.total) * 100 // Convert to percentage

          }));
      
          // Sort by date
          processedScoreProgression.sort((a, b) => new Date(a.date) - new Date(b.date));
      
          setScoreProgressionData(processedScoreProgression); // ✅ Now inside useEffect
        }
      }, [quizResults, role]); 
      
  





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

  const handleRelationRequest = (e) => {
    e.preventDefault();
    fetch('http://localhost:8000/activity/api/relation-request/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        user_id: localStorage.getItem('id'),
        email: relationEmail 
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        setRelationMessage({ type: 'error', text: data.error });
      } else {
        setRelationMessage({ type: 'success', text: 'Demande envoyée avec succès !' });
      }
    })
    .catch(error => setRelationMessage({ type: 'error', text: 'Erreur envoi de la demande.' }));
  };

  

  const openMessagePopup = (receiver, receiverName) => {
    setMessagePopup({ isOpen: true, receiver , receiverName});
  };

  const handleMessage = (receiverId, receiverName) => {
    openMessagePopup({ id: receiverId , name :receiverName});
  };
  

  const closeMessagePopup = () => {
    setMessagePopup({ isOpen: false, receiver: null , receiverName: null});
    setMessageContent("");
  };

  const sendMessage = () => {
    if (!messageContent.trim()) return;

    fetch("http://localhost:8000/activity/api/send-message/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender_id: localStorage.getItem("id"),
        receiver_id: messagePopup.receiver.id,
        message: messageContent,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        closeMessagePopup();
      })
      .catch(() => alert("Erreur lors de l'envoi du message."));
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

  const handleDeleteQuiz = (quizId) => {
    const userId = localStorage.getItem('id'); // ID de l'utilisateur connecté
  
    // Récupérer les informations du quiz pour vérifier l'ID du professeur
    fetch(`http://localhost:8000/quizz/api/quizzlist/${quizId}/`)
      .then((response) => response.ok ? response.json() : Promise.reject('Erreur lors de la récupération du quiz.'))
      .then((quizData) => {
        if (String(quizData.teacher_id) !== String(userId)) {
          
          // Si l'utilisateur connecté n'est pas le créateur du quiz
          alert('Vous n\'êtes pas autorisé à supprimer ce quiz.');
        } else {
          // Si l'utilisateur connecté est le créateur du quiz
          const confirmDelete = window.confirm('Êtes-vous sûr de vouloir supprimer ce quiz ?');
          if (confirmDelete) {
            fetch(`http://localhost:8000/quizz/api/quizzlist/${quizId}/`, {
              method: 'DELETE',
            })
              .then((response) => {
                if (response.ok) {
                  setQuizzes(quizzes.filter((quiz) => quiz.id !== quizId));
                  alert('Quiz supprimé avec succès.');
                } else {
                  throw new Error('Erreur lors de la suppression du quiz.');
                }
              })
              .catch((error) => console.error(error));
          }
        }
      })
      .catch((error) => {
        console.error(error);
        alert('Impossible de récupérer les informations du quiz.');
      });
  };
  
  const handleDeleteLesson = (lessonId) => {

    const userId = localStorage.getItem('id'); // ID of the connected user
    // get informations about the lesson to verify the professor ID
    
    fetch(`http://localhost:8000/lessons/api/lessonslist/detail/${lessonId}/`)
      .then((response) => response.ok ? response.json() : Promise.reject('Erreur lors de la récupération de la leçon.'))
      
      .then((lessonData) => {
        if (String(lessonData.teacher) !== String(userId)) {

          // If the connected user isn't the lesson creator
          alert('Vous n\'êtes pas autorisé à supprimer cette leçon.');
        } else {
          
          // If he is the lesson creator
          const confirmDelete = window.confirm('Êtes-vous sûr de vouloir supprimer cette leçon ?');
          if (confirmDelete) {
            fetch(`http://localhost:8000/lessons/api/lessonslist/detail/${lessonId}/`, {
              method: 'DELETE',
            })
              .then((response) => {
                if (response.ok) {
                  setLessons(lessons.filter((lesson) => lesson.id !== lessonId));
                  alert('Leçon supprimé avec succès.');
                } else {
                  throw new Error('Erreur lors de la suppression de la leçon.');
                }
              })
              .catch((error) => console.error(error));
          }
        }
      })
      .catch((error) => {
        console.error(error);
        alert('Impossible de récupérer les informations de la leçon.');
      });
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


      {/* Si l'utilisateur est un professeur */}
        {role === "teacher" && (
          <div>
            <h2>Élèves</h2>
            {relations.length > 0 ? (
              relations.map((relation) => (
                <div key={relation.student.id} className="relation-item">
                  <p>{relation.student.name}</p>
                  <button>Voir</button>
                  <button onClick={() => handleMessage(relation.student.id, relation.student.name)}>Message</button>
                </div>
              ))
            ) : (
              <p>Aucun élève.</p>
            )}
          </div>
        )}

        {/* Si l'utilisateur est un parent */}
        {role === "parent" && (
          <div>
            <h2>Enfants</h2>
            {relations.length > 0 ? (
              relations.map((relation) => (
                <div key={relation.student.id} className="relation-item">
                  <p>{relation.student.name}</p>
                  <button>Voir</button>
                  <button onClick={() => handleMessage(relation.student.id, relation.student.name)}>Message</button>
                </div>
              ))
            ) : (
              <p>Aucun enfant.</p>
            )}
          </div>
        )}

        {/* Si l'utilisateur est un élève */}
        {role === "student" && (
          <div>
            {/* Affichage des professeurs */}
            <h2>Professeurs</h2>
            {relations.filter(r => r.relation_type === "school").length > 0 ? (
              relations
                .filter(r => r.relation_type === "school")
                .map((relation) => (
                  <div key={relation.sender.id} className="relation-item">
                    <p>{relation.sender.name}</p>
                    <button>Voir</button>
                    <button onClick={() => handleMessage(relation.sender.id, relation.sender.name)}>Message</button>
                  </div>
                ))
            ) : (
              <p>Aucun professeur.</p>
            )}

            {/* Affichage des parents */}
            <h2>Parents</h2>
            {relations.filter(r => r.relation_type === "parent").length > 0 ? (
              relations
                .filter(r => r.relation_type === "parent")
                .map((relation) => (
                  <div key={relation.sender.id} className="relation-item">
                    <p>{relation.sender.name}</p>
                    <button onClick={() => handleMessage(relation.sender.id, relation.sender.name)}>Message</button>
                  </div>
                ))
            ) : (
              <p>Aucun parent.</p>
            )}
          </div>
        )}


      {(role === 'teacher' || role === 'parent') && (
          <div className="relation-request">
            <h2>Envoyer une demande de relation à un élève</h2>
            <form onSubmit={handleRelationRequest}>
              <input 
                type="email" 
                placeholder="Email de l'élève" 
                value={relationEmail} 
                onChange={(e) => setRelationEmail(e.target.value)} 
                required 
              />
              <button type="submit">Envoyer</button>
            </form>
            {relationMessage && <p className={relationMessage.type}>{relationMessage.text}</p>}
          </div>
        )}


      </div>

      {/* Bottom Section: Lessons and Quizzes */}
      <div className="profile-bottom">
        {/* Left Column: Lessons (only for teachers) */}
        {role === 'teacher' && (
          <div className="profile-column">
            <h2>Leçons créées :</h2>
            <div className="profile-cards-container">
              {lessons.length > 0 ? (
                lessons.map((lesson) => (
                  <div  className="profile-card profile-lesson-card" key={lesson.id}>
                    <div onClick={() => handleViewLesson(lesson.id)}>
                      <h3>{lesson.title}</h3>
                      <p>{lesson.subject}</p>
                    </div>
                    <button onClick={() => handleEditLesson(lesson.id)}>Modifier</button>
                    <button onClick={() => handleDeleteLesson(lesson.id)}>Supprimer</button>
                  </div>
                ))
              ) : (
                <p>Aucune leçon créée.</p>
              )}
            </div>
          </div>
        )}

        {/* Right Column: Quizzes (only for teachers) */}
        {role === 'teacher' && (
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
                    <button onClick={() => handleDeleteQuiz(quiz.id)}>Supprimer</button>
                  </div>
                ))
              ) : (
                <p>Aucun quiz créé.</p>
              )}
            </div>
          </div>
        )}

          {/* For students: Display quiz results */}
          {role === 'student' && (
          <div className="profile-column">
            <h2>Résultats des quiz :</h2>
            <div className="profile-cards-container">
              {quizResults.length > 0 ? (
                quizResults.map((result) => (
                  <div key={result.quizz_title} className="quizz-results-card">
                    <h3>{result.quizz_title}</h3>
                    <p>Score: {result.score} / {result.total}</p>
                    <p>Date: {new Date(result.date).toLocaleString()}</p>
                  </div>
                ))
              ) : (
                <p>Aucun résultat pour ce quiz.</p>
              )}
            </div>
          </div>
        )}

        {/* For students: Display quiz results */}
        {role === 'student' && (
        <div className="profile-column">
              <h2>Analyses des réultats obtenus :</h2>
              {quizResults.length > 0 ? (
                <>

                  {/* Line Chart: Score Progression */}
                  <div className="chart-container">
                    <h3>Progression des Scores</h3>
                    <div className="chart-wrapper">
                      <Line
                        data={{
                          labels: scoreProgressionData.map(q => q.date),
                          datasets: [
                            {
                              label: "Progression des Scores (%)",
                              data: scoreProgressionData.map(q => q.scorePercentage),
                              borderColor: "#36A2EB",
                              backgroundColor: "rgba(54, 162, 235, 0.2)",
                              tension: 0.3, // Smooth curve
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: true,
                              max: 100, // Scores in percentage
                            },
                          },
                        }}
                      />
                    </div>
                  </div>

                  {/* Pie Chart: Distribution of scores */}
                  <div className="chart-container">
                    <h3>Répartition des Scores</h3>
                    <div className="chart-wrapper">
                      <Pie
                        data={{
                          labels: quizResults.map(q => q.quizz_title),
                          datasets: [{
                            data: quizResults.map(q => q.score),
                            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
                            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
                          }]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: { position: 'top' }
                          }
                        }}
                      />
                    </div>
                  </div>


                  {/* Bar Chart: Scores over time */}
                  <div className="chart-container">
                    <h3>Évolution des Scores</h3>
                    <div className="chart-wrapper">
                    <Bar
                      data={{
                        labels: quizResults.map(q => new Date(q.date).toLocaleDateString()),
                        datasets: [{
                          label: 'Score',
                          data: quizResults.map(q => q.score),
                          backgroundColor: '#36A2EB'
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          x: {
                            ticks: { autoSkip: false, maxRotation: 45, minRotation: 45 } // ✅ Fix label cutting
                          },
                          y: {
                            beginAtZero: true,
                            max: Math.max(...quizResults.map(q => q.total))
                          }
                        }
                      }}
                    />
                    </div>
                  </div>
                </>
              ) : (
                <p>Aucun résultat pour ce quiz.</p>
              )}
            </div>
          )}

      </div>
      {messagePopup.isOpen && (
      <>
        <div className="message-popup-overlay" onClick={closeMessagePopup}></div>
        <div className="message-popup">
          <h3>Envoyer un message</h3>
          <textarea 
            value={messageContent} 
            onChange={(e) => setMessageContent(e.target.value)} 
            placeholder="Écrivez votre message..."
          />
          <button onClick={sendMessage}>Envoyer</button>
          <button onClick={closeMessagePopup}>Annuler</button>
        </div>
      </>
      )}
    </div>
  );
};

export default Profile;
