import React, { useEffect, useState } from 'react';
import '../../css/User/PopupTeacherProfile.css'; 
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
        <div className="teacherpopup-overlay">
            <div className="teacherpopup-content">
                <button className="teacherpopup-close-button" onClick={onClose}>✖</button>
                <h2>Aussi par {teacherName}</h2>

                {loading ? (
                    <p>Chargement des informations...</p>
                ) : (
                    <div className="teacherpopup-sections">
                        <div className="teacherpopup-section">
                            <h3>Leçons :</h3>
                            <div className="teacherpopup-cards-container">
                                {lessons.length > 0 ? (
                                    lessons.map((lesson) => (
                                        <button
                                            key={lesson.id}
                                            className="teacherpopup-card"
                                            style={{ backgroundColor: subjectColors[lesson.subject] || '#f0f0f0' }}
                                            onClick={() => window.location.href = `/lessons/detail/${lesson.id}`}
                                        >
                                            {lesson.title}
                                        </button>
                                    ))
                                ) : (
                                    <p>Aucune leçon trouvée.</p>
                                )}
                            </div>
                        </div>

                        <div className="teacherpopup-section">
                            <h3>Quiz:</h3>
                            <div className="teacherpopup-cards-container">
                                {quizzes.length > 0 ? (
                                    quizzes.map((quiz) => (
                                        <button
                                            key={quiz.id}
                                            className="teacherpopup-card"
                                            style={{ backgroundColor: subjectColors[quiz.subject] || '#f0f0f0' }}
                                            onClick={() => window.location.href = `/quizz/play/${quiz.id}`}
                                        >
                                            {quiz.title}
                                        </button>
                                    ))
                                ) : (
                                    <p>Aucun quiz trouvé.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PopupTeacherProfile;
