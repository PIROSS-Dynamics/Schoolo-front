import React, { useEffect, useState } from 'react';
import '../../css/User/PopupTeacherProfile.css'; // Ajoute un fichier CSS pour le style
import subjectColors from '../../data/subjectColors.json';

function PopupTeacherProfile({ teacherId, teacherName, onClose }) {
    const [lessons, setLessons] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);

        Promise.all([
            fetch(`http://localhost:8000/lessons/api/teacher/${teacherId}/lessons/`).then(res => res.json()),
            fetch(`http://localhost:8000/quizz/api/teacher/${teacherId}/quizzes/`).then(res => res.json())
        ])
        .then(([lessonsData, quizzesData]) => {
            setLessons(lessonsData);
            setQuizzes(quizzesData);
            setLoading(false);
        })
        .catch((error) => {
            console.error('Erreur lors de la récupération des données du professeur:', error);
            setLoading(false);
        });

    }, [teacherId]);

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <button className="popup-close-button" onClick={onClose}>✖</button>
                <h2>Profil de {teacherName}</h2>

                {loading ? (
                    <p>Chargement des informations...</p>
                ) : (
                    <>
                        <h3>Leçons créées :</h3>
                        <div className="popup-cards-container">
                            {lessons.length > 0 ? (
                                lessons.map((lesson) => (
                                    <div
                                        key={lesson.id}
                                        className="popup-card"
                                        style={{ backgroundColor: subjectColors[lesson.subject] || '#f0f0f0' }}
                                    >
                                        <a href={`/lessons/detail/${lesson.id}`} className="popup-card-link">{lesson.title}</a>
                                    </div>
                                ))
                            ) : (
                                <p>Aucune leçon trouvée.</p>
                            )}
                        </div>

                        <h3>Quiz créés :</h3>
                        <div className="popup-cards-container">
                            {quizzes.length > 0 ? (
                                quizzes.map((quiz) => (
                                    <div
                                        key={quiz.id}
                                        className="popup-card"
                                        style={{ backgroundColor: subjectColors[quiz.subject] || '#f0f0f0' }}
                                    >
                                        <a href={`/quizz/play/${quiz.id}`} className="popup-card-link">{quiz.title}</a>
                                    </div>
                                ))
                            ) : (
                                <p>Aucun quiz trouvé.</p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default PopupTeacherProfile;
