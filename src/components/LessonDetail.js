import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function LessonDetail() {
    const { lessonId } = useParams();
    const [lesson, setLesson] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:8000/lessons/api/lessonslist/${lessonId}/`) // Assurez-vous d'avoir cette route dans votre backend
            .then(response => response.json())
            .then(data => setLesson(data))
            .catch(error => console.error('Erreur:', error));
    }, [lessonId]);

    if (!lesson) return <div>Loading...</div>;

    return (
        <div>
            <h1>{lesson.title}</h1>
            <h2>Enseigné par : {lesson.teacher_name}</h2>
            <p>{lesson.content}</p>
        </div>
    );
}

export default LessonDetail;
