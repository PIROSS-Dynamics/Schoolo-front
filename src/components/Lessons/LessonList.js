import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../css/Lessons/LessonList.css';
import '../../css/Loading.css'; 

function LessonList() {
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { subject } = useParams();

    useEffect(() => {
        const url = subject 
            ? `http://localhost:8000/lessons/api/lessonslist/subject/${subject}/`
            : "http://localhost:8000/lessons/api/lessonslist/";

        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                setLessons(data);
                setLoading(false); // End loading
            })
            .catch((error) => {
                console.error('Erreur:', error);
                setLoading(false); // If error, desactivate the loading
            });
    }, [subject]);

    const handleLessonClick = (lessonId) => {
        navigate(`/lessons/detail/${lessonId}`);
    };

    if (loading) {
        // loading animation
        return (
            <div>
                <h2 className='list-title'>Liste des Leçons {subject && `- ${subject}`}</h2>
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Chargement des leçons...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h2 className='list-title'>Liste des Leçons {subject && `- ${subject}`}</h2>

            {/* Lesson List */}
            <div className="lesson-list">
            {lessons.length > 0 ? (
                    lessons.map((lesson) => (
                        <div
                            key={lesson.id}
                            className="lesson-card"
                            onClick={() => handleLessonClick(lesson.id)}
                        >
                            <h3 className="lesson-title">{lesson.title}</h3>
                            <p className="teacher-name">Par : <strong>{lesson.teacher_name}</strong></p>
                            <p className="lesson-description">{lesson.description}</p>
                        </div>
                    ))
                ) : (
                    <p>Aucune leçon disponible pour le moment.</p>
                )}
            </div>
        </div>
    );
}

export default LessonList;
