import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import '../../css/LessonDetail.css'; // Importation des styles

function LessonDetail() {
    const { lessonId } = useParams();
    const [lesson, setLesson] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:8000/lessons/api/lessonslist/detail/${lessonId}/`)
            .then((response) => response.json())
            .then((data) => setLesson(data))
            .catch((error) => console.error('Erreur:', error));
    }, [lessonId]);

    if (!lesson) return <div>Chargement...</div>;

    // Désinfection du contenu HTML
    const sanitizedContent = DOMPurify.sanitize(lesson.content);

    return (
        <div className="lesson-container">
            <h1 className="lesson-detail-title">{lesson.title}</h1>
            <div className="lesson-details">
                <span>Matière : {lesson.subject}</span>
                <span>Professeur : {lesson.teacher_name}</span>
            </div>
            <div
                className="lesson-content"
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
            <Link to="/lessons" className="back-link">
                ← Retour à la liste des leçons
            </Link>
        </div>
    );
}

export default LessonDetail;
