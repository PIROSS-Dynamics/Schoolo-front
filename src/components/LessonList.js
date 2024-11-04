import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function LessonList() {
    const [lessons, setLessons] = useState([]);
    const navigate = useNavigate();
    const { subject } = useParams(); // Récupère le sujet depuis l'URL, si présent

    useEffect(() => {
        // Détermine l'URL de l'API en fonction de la présence du sujet
        const url = subject 
            ? `http://localhost:8000/lessons/api/lessonslist/subject/${subject}/`
            : "http://localhost:8000/lessons/api/lessonslist/";

        fetch(url)
            .then(response => response.json())
            .then(data => setLessons(data))
            .catch(error => console.error('Erreur:', error));
    }, [subject]); // Réexécute quand 'subject' change

    const handleLessonClick = (lessonId) => {
        navigate(`/lessons/detail/${lessonId}`);
    };

    return (
        <div>
            <h2>Liste des Leçons {subject && `- ${subject}`}</h2>
            <div>
                {lessons.map(lesson => (
                    <button 
                        key={lesson.id} 
                        onClick={() => handleLessonClick(lesson.id)} 
                        style={{ margin: '10px', padding: '10px' }}
                    >
                        {lesson.title} - {lesson.teacher_name}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default LessonList;
