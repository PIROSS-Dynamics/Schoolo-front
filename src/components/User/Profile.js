import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/User/Profile.css";
import { Bar, Pie, Line} from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const Profile = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [quizResults, setQuizResults] = useState([]);
  const [relationEmail, setRelationEmail] = useState("");
  const [relationMessage, setRelationMessage] = useState(null);
  const [relations, setRelations] = useState([]);
  const [messagePopup, setMessagePopup] = useState({
    isOpen: false,
    receiver: null,
    receiverName: null,
  });
  const [messageContent, setMessageContent] = useState("");
  const navigate = useNavigate();
  const [scoreProgressionData, setScoreProgressionData] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("Toutes les Matières");
  const [activeSection, setActiveSection] = useState("personalInfo");
  const [menuItems, setMenuItems] = useState([
    { key: "personalInfo", label: "Profil" },
    { key: "stats", label: "Statistiques" },
    { key: "contacts", label: "Relations" },
  ]);

  useEffect(() => {
    if (role === "teacher") {
      setMenuItems((prevMenu) => {
        if (!prevMenu.some((item) => item.key === "create")) {
          return [...prevMenu, { key: "create", label: "Créer Quiz/Leçon" }];
        }
        return prevMenu;
      });
    }
  }, [role]);

  if (role === "teacher" && !menuItems.some((item) => item.key === "create")) {
    menuItems.push({ key: "create", label: "Créer Quiz/Leçon" });
  }

  const handleMenuClick = (section) => {
    console.log("Clicked section:", section); // Debugging line
    setActiveSection(section);
  };

  useEffect(() => {
    console.log("Active section:", activeSection); // Debugging line to trace current active section
  }, [activeSection]);

  useEffect(() => {
    const userId = localStorage.getItem("id");
    const userRole = localStorage.getItem("role");

    if (userRole === localStorage.getItem("role")) {
      fetch(`http://localhost:8000/users/api/${userRole}/${userId}/`)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Erreur lors de la récupération des informations.");
          }
        })
        .then((data) => {
          console.log("Fetched user data:", data); // Debugging line
          setUser(data);
          setRole(data.role);
        })
        .catch((error) => console.error(error));
    }

    if (userRole === "teacher") {
      fetch(`http://localhost:8000/lessons/api/teacher/${userId}/lessons/`)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Erreur lors de la récupération des leçons.");
          }
        })
        .then((lessonsData) => setLessons(lessonsData))
        .catch((error) => console.error(error));

      fetch(`http://localhost:8000/quizz/api/teacher/${userId}/quizzes/`)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Erreur lors de la récupération des quiz.");
          }
        })
        .then((quizzesData) => setQuizzes(quizzesData))
        .catch((error) => console.error(error));
    }

    if (userRole === "student") {
      fetch(`http://localhost:8000/stats/api/userQuizResults/${userId}/`)
        .then((response) => response.json())
        .then((resultsData) => {
          console.log("resultsData:", resultsData); // Debugging line to inspect quizResults
          setQuizResults(resultsData);
          const processedScoreProgression = resultsData.map((q) => ({
            date: new Date(q.date).toLocaleDateString(),
            scorePercentage: (q.score / q.total) * 100,
          }));
          processedScoreProgression.sort(
            (a, b) => new Date(a.date) - new Date(b.date)
          );
          setScoreProgressionData(processedScoreProgression);
        })
        .catch((error) =>
          console.error(
            "Erreur lors de la récupération des résultats des quiz:",
            error
          )
        );
    }

    fetch(
      `http://localhost:8000/activity/api/user-relations/?user_id=${userId}`
    )
      .then((response) => response.json())
      .then((data) => setRelations(data))
      .catch((error) => console.error("Erreur récupération relations", error));
  }, []);

  const [subjects, setSubjects] = useState(["Toutes les Matières"]);
  useEffect(() => {
    if (role === "student" && quizResults.length > 0) {
      const uniqueSubjects = [
        "Toutes les Matières",
        ...new Set(quizResults.map((q) => q.subject)),
      ];
      setSubjects(uniqueSubjects);

      const processedScoreProgression = quizResults.map((q) => ({
        title: q.quizz_title,
        subject: q.subject,
        date: new Date(q.date).toLocaleDateString(),
        scorePercentage: (q.score / q.total) * 100,
      }));
      processedScoreProgression.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
      setScoreProgressionData(processedScoreProgression);
    }
  }, [quizResults, role]);

  const getRoleLabel = (role) => {
    switch (role) {
      case "student":
        return "Étudiant";
      case "teacher":
        return "Professeur";
      case "parent":
        return "Parent";
      default:
        return "Utilisateur";
    }
  };

  const handleRelationRequest = (e) => {
    e.preventDefault();
    fetch("http://localhost:8000/activity/api/relation-request/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: localStorage.getItem("id"),
        email: relationEmail,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setRelationMessage({ type: "error", text: data.error });
        } else {
          setRelationMessage({
            type: "success",
            text: "Demande envoyée avec succès !",
          });
        }
      })
      .catch((error) =>
        setRelationMessage({
          type: "error",
          text: "Erreur envoi de la demande.",
        })
      );
  };

  const openMessagePopup = (receiver, receiverName) => {
    setMessagePopup({ isOpen: true, receiver, receiverName });
  };

  const handleMessage = (receiverId, receiverName) => {
    openMessagePopup({ id: receiverId, name: receiverName });
  };

  const closeMessagePopup = () => {
    setMessagePopup({ isOpen: false, receiver: null, receiverName: null });
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
    const userId = localStorage.getItem("id");
    fetch(`http://localhost:8000/quizz/api/quizzlist/${quizId}/`)
      .then((response) =>
        response.ok
          ? response.json()
          : Promise.reject("Erreur lors de la récupération du quiz.")
      )
      .then((quizData) => {
        if (String(quizData.teacher_id) !== String(userId)) {
          alert("Vous n'êtes pas autorisé à supprimer ce quiz.");
        } else {
          const confirmDelete = window.confirm(
            "Êtes-vous sûr de vouloir supprimer ce quiz ?"
          );
          if (confirmDelete) {
            fetch(`http://localhost:8000/quizz/api/quizzlist/${quizId}/`, {
              method: "DELETE",
            })
              .then((response) => {
                if (response.ok) {
                  setQuizzes(quizzes.filter((quiz) => quiz.id !== quizId));
                  alert("Quiz supprimé avec succès.");
                } else {
                  throw new Error("Erreur lors de la suppression du quiz.");
                }
              })
              .catch((error) => console.error(error));
          }
        }
      })
      .catch((error) => {
        console.error(error);
        alert("Impossible de récupérer les informations du quiz.");
      });
  };

  const handleDeleteLesson = (lessonId) => {
    const userId = localStorage.getItem("id");
    fetch(`http://localhost:8000/lessons/api/lessonslist/detail/${lessonId}/`)
      .then((response) =>
        response.ok
          ? response.json()
          : Promise.reject("Erreur lors de la récupération de la leçon.")
      )
      .then((lessonData) => {
        if (String(lessonData.teacher) !== String(userId)) {
          alert("Vous n'êtes pas autorisé à supprimer cette leçon.");
        } else {
          const confirmDelete = window.confirm(
            "Êtes-vous sûr de vouloir supprimer cette leçon ?"
          );
          if (confirmDelete) {
            fetch(
              `http://localhost:8000/lessons/api/lessonslist/detail/${lessonId}/`,
              {
                method: "DELETE",
              }
            )
              .then((response) => {
                if (response.ok) {
                  setLessons(
                    lessons.filter((lesson) => lesson.id !== lessonId)
                  );
                  alert("Leçon supprimé avec succès.");
                } else {
                  throw new Error("Erreur lors de la suppression de la leçon.");
                }
              })
              .catch((error) => console.error(error));
          }
        }
      })
      .catch((error) => {
        console.error(error);
        alert("Impossible de récupérer les informations de la leçon.");
      });
  };

  const handleViewQuiz = (quizId) => {
    navigate(`/quizz/play/${quizId}`);
  };

  const [filteredQuizResults, setFilteredQuizResults] = useState([]);

  useEffect(() => {
    if (quizResults.length > 0) {
      console.log("Quiz Results:", quizResults); // Debugging line to inspect quizResult
      const results =
        selectedSubject === "Toutes les Matières"
          ? quizResults
          : quizResults.filter((q) => q.subject === selectedSubject);
      setFilteredQuizResults(results);
    }
  }, [selectedSubject, quizResults]);

  return (
    <div className="profile-container">
      <div className="sidebar">
        <ul>
          {menuItems.map((item) => (
            <li
              key={item.key}
              className={activeSection === item.key ? "active" : ""}
              onClick={() => handleMenuClick(item.key)}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="info-container">
        {activeSection === "personalInfo" && (
          <div>
            {user ? (
              <>
                <h2 className="donnees-utilisateur">Données utilisateur:</h2>
                <p>
                  <strong>Mail:</strong> {user.email}
                </p>
                <p>
                  <strong>Rôle:</strong> {getRoleLabel(role)}
                </p>
                <h2 className="donnees-personnelles">Données Personnelles:</h2>
                <p>
                  <strong>Nom:</strong> {user.last_name}
                </p>
                <p>
                  <strong>Prénom:</strong> {user.first_name}
                </p>
              </>
            ) : (
              <p>Chargement des données...</p>
            )}
          </div>
        )}

        {activeSection === "contacts" && role === "teacher" && (
          <div>
            <h2>Élèves</h2>
            {relations.length > 0 ? (
              relations.map((relation) => (
                <div key={relation.student.id}>
                  <p>{relation.student.name}</p>
                  <button>Voir</button>
                  <button
                    onClick={() =>
                      handleMessage(relation.student.id, relation.student.name)
                    }
                  >
                    Message
                  </button>
                </div>
              ))
            ) : (
              <p>Aucun élève.</p>
            )}
          </div>
        )}

        {activeSection === "contacts" && role === "parent" && (
          <div>
            <h2>Enfants</h2>
            {relations.length > 0 ? (
              relations.map((relation) => (
                <div key={relation.student.id}>
                  <p>{relation.student.name}</p>
                  <button>Voir</button>
                  <button
                    onClick={() =>
                      handleMessage(relation.student.id, relation.student.name)
                    }
                  >
                    Message
                  </button>
                </div>
              ))
            ) : (
              <p>Aucun enfant.</p>
            )}
          </div>
        )}

        {activeSection === "contacts" && role === "student" && (
          <div>
            <h2 className="professors">Professeurs</h2>
            {relations.filter((r) => r.relation_type === "school").length >
            0 ? (
              relations
                .filter((r) => r.relation_type === "school")
                .map((relation) => (
                  <div key={relation.sender.id} className="relation-item">
                    <h3>{relation.sender.name}</h3>
                    <button>Voir</button>
                    <button
                      onClick={() =>
                        handleMessage(relation.sender.id, relation.sender.name)
                      }
                    >
                      Message
                    </button>
                  </div>
                ))
            ) : (
              <p>Aucun professeur.</p>
            )}

            <h2 className="parents">Parents</h2>
            {relations.filter((r) => r.relation_type === "parent").length >
            0 ? (
              relations
                .filter((r) => r.relation_type === "parent")
                .map((relation) => (
                  <div key={relation.sender.id} className="relation-item">
                    <h3>{relation.sender.name}</h3>
                    <button
                      onClick={() =>
                        handleMessage(relation.sender.id, relation.sender.name)
                      }
                    >
                      Message
                    </button>
                  </div>
                ))
            ) : (
              <p>Aucun parent.</p>
            )}
          </div>
        )}

        {activeSection === "contacts" &&
          (role === "teacher" || role === "parent") && (
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
              {relationMessage && (
                <p className={relationMessage.type}>{relationMessage.text}</p>
              )}
            </div>
          )}

        {activeSection === "create" && role === "teacher" && (
          <div>
            <h2>Créer un Quiz ou une Leçon</h2>
            <button onClick={() => navigate("/add-quiz")}>Créer un Quiz</button>
            <button onClick={() => navigate("/add-lesson")}>
              Créer une Leçon
            </button>
          </div>
        )}

        {activeSection === "stats" && role === "teacher" && (
          <div className="profile-column">
            <h2>Quiz créés :</h2>
            <div className="profile-cards-container">
              {quizzes.length > 0 ? (
                quizzes.map((quiz) => (
                  <div key={quiz.id} className="profile-card profile-quiz-card">
                    <div onClick={() => handleViewQuiz(quiz.id)}>
                      <h3>{quiz.title}</h3>
                    </div>
                    <button onClick={() => handleEditQuiz(quiz.id)}>
                      Modifier
                    </button>
                    <button onClick={() => handleDeleteQuiz(quiz.id)}>
                      Supprimer
                    </button>
                  </div>
                ))
              ) : (
                <p>Aucun quiz créé.</p>
              )}
            </div>

            <h2>Leçons créées :</h2>
            <div className="profile-cards-container">
              {lessons.length > 0 ? (
                lessons.map((lesson) => (
                  <div
                    className="profile-card profile-lesson-card"
                    key={lesson.id}
                  >
                    <div onClick={() => handleViewLesson(lesson.id)}>
                      <h3>{lesson.title}</h3>
                      <p>{lesson.subject}</p>
                    </div>
                    <button onClick={() => handleEditLesson(lesson.id)}>
                      Modifier
                    </button>
                    <button onClick={() => handleDeleteLesson(lesson.id)}>
                      Supprimer
                    </button>
                  </div>
                ))
              ) : (
                <p>Aucune leçon créée.</p>
              )}
            </div>
          </div>
        )}

        {activeSection === "stats" && role === "student" && (
          <div className="profile-column">
            <h2>Analyses des réultats obtenus :</h2>
            <div className="filter-container">
              <label htmlFor="subject-filter">Sélectionner une matière :</label>
              <select
                id="subject-filter"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>
            {filteredQuizResults.length > 0 ? (
              <>
                <div className="profile-column">
                  <h2>Résultats des quiz :</h2>
                  <div className="profile-cards-container">
                    {filteredQuizResults.map((result) => (
                      <div
                        key={result.quizz_title}
                        className="quizz-results-card"
                      >
                        <h3>{result.quizz_title}</h3>
                        <p>
                          Score: {result.score} / {result.total}
                        </p>
                        <p>Date: {new Date(result.date).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="chart-container">
                  <h3>Progression des Scores</h3>
                  <div className="chart-wrapper">
                    <Line
                      data={{
                        labels: scoreProgressionData.map((q) => q.title),
                        datasets: [
                          {
                            label: "Progression des Scores (%)",
                            data: scoreProgressionData.map(
                              (q) => q.scorePercentage
                            ),
                            borderColor: "#36A2EB",
                            backgroundColor: "rgba(54, 162, 235, 0.2)",
                            tension: 0.3,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          tooltip: {
                            callbacks: {
                              title: (tooltipItems) => {
                                const index = tooltipItems[0].dataIndex;
                                const quiz = scoreProgressionData[index];
                                return `${quiz.title} (${quiz.subject})`;
                              },
                            },
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            max: 100,
                          },
                        },
                      }}
                    />
                  </div>
                </div>

                <div className="chart-container">
                  <h3>Répartition des Scores</h3>
                  <div className="chart-wrapper">
                    <Pie
                      data={{
                        labels: filteredQuizResults.map((q) => q.quizz_title),
                        datasets: [
                          {
                            data: filteredQuizResults.map((q) => q.score),
                            backgroundColor: [
                              "#FF6384",
                              "#36A2EB",
                              "#FFCE56",
                              "#4BC0C0",
                              "#9966FF",
                            ],
                            hoverBackgroundColor: [
                              "#FF6384",
                              "#36A2EB",
                              "#FFCE56",
                              "#4BC0C0",
                              "#9966FF",
                            ],
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { position: "top" },
                        },
                      }}
                    />
                  </div>
                </div>

                <div className="chart-container">
                  <h3>Évolution des Scores</h3>
                  <div className="chart-wrapper">
                    <Bar
                      data={{
                        labels: filteredQuizResults.map((q) => q.quizz_title),
                        datasets: [
                          {
                            label: "Score",
                            data: filteredQuizResults.map((q) => q.score),
                            backgroundColor: "#36A2EB",
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          x: {
                            ticks: {
                              autoSkip: false,
                              maxRotation: 45,
                              minRotation: 45,
                            },
                          },
                          y: {
                            beginAtZero: true,
                            max: Math.max(
                              ...filteredQuizResults.map((q) => q.total)
                            ),
                          },
                        },
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
          <div
            className="message-popup-overlay"
            onClick={closeMessagePopup}
          ></div>
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
