import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';

function LessonDetail() {
    const { lessonId } = useParams();
    const [lesson, setLesson] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:8000/lessons/api/lessonslist/detail/${lessonId}/`)
            .then(response => response.json())
            .then(data => setLesson(data))
            .catch(error => console.error('Erreur:', error));
    }, [lessonId]);

    if (!lesson) return <div>Chargement...</div>;

    // Désinfection du contenu HTML
    const sanitizedContent = DOMPurify.sanitize(lesson.content);

    return (
        <div>
            <h1>{lesson.title} - {lesson.subject}</h1>
            <h2>Enseigné par : {lesson.teacher_name}</h2>

            {/* Affichage sécurisé du contenu HTML */}
            <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
        </div>
    );
}

export default LessonDetail;
