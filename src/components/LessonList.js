import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Remplace useHistory par useNavigate

function LessonList() {
    const [lessons, setLessons] = useState([]);
    const navigate = useNavigate(); // Utilise useNavigate

    useEffect(() => {
        fetch("http://localhost:8000/lessons/api/lessonslist/") // Remplacez avec l'URL correcte
            .then(response => response.json())
            .then(data => setLessons(data))
            .catch(error => console.error('Erreur:', error));
    }, []);

    const handleLessonClick = (lessonId) => {
        // Redirige vers la page de la leçon avec l'ID correspondant
        navigate(`/lessons/${lessonId}`); // Utilise navigate à la place de history.push
    };

    return (
        <div>
            <h2>Liste des Leçons</h2>
            <div>
                {lessons.map(lesson => (
                    <button key={lesson.id} onClick={() => handleLessonClick(lesson.id)} style={{ margin: '10px', padding: '10px' }}>
                        {lesson.title} - {lesson.teacher_name}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default LessonList;
