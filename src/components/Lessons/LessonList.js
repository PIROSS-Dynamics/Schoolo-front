import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../css/LessonList.css';

function LessonList() {
    const [lessons, setLessons] = useState([]);
    const navigate = useNavigate();
    const { subject } = useParams();

    useEffect(() => {
        const url = subject 
            ? `http://localhost:8000/lessons/api/lessonslist/subject/${subject}/`
            : "http://localhost:8000/lessons/api/lessonslist/";

        fetch(url)
            .then(response => response.json())
            .then(data => setLessons(data))
            .catch(error => console.error('Erreur:', error));
    }, [subject]);

    const handleLessonClick = (lessonId) => {
        navigate(`/lessons/detail/${lessonId}`);
    };

    return (
        <div>
            <h2 className='list-title'>Liste des Leçons {subject && `- ${subject}`}</h2>

            {/* Lesson List */}
            <div className="lesson-list">
                {lessons.map(lesson => (
                    <div 
                        key={lesson.id} 
                        className="lesson-card" 
                        onClick={() => handleLessonClick(lesson.id)}
                    >
                        <h3 className="lesson-title">{lesson.title}</h3>
                        <p className="teacher-name">Par : <strong>{lesson.teacher_name}</strong></p>
                        <p className="lesson-description">{lesson.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LessonList;
