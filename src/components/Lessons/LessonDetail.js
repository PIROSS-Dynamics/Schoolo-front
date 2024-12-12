import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import '../../css/Lessons/LessonDetail.css'; 
import '../../css/Loading.css'; 

function LessonDetail() {
    const { lessonId } = useParams();
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        fetch(`http://localhost:8000/lessons/api/lessonslist/detail/${lessonId}/`)
            .then((response) => response.json())
            .then((data) => {
                setLesson(data);
                setLoading(false); // End loading
            })
            .catch((error) => {
                console.error('Erreur:', error);
                setLoading(false); // If error, desactivate the loading
            });
    }, [lessonId]);

    if (loading) {
        // Loading animation
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Chargement de la leçon...</p>
            </div>
        );
    }

    if (!lesson) {
        // if no lesson is found
        return (
            <div className="lesson-container">
                <p>La leçon demandée n'existe pas ou une erreur est survenue.</p>
                <Link to="/lessons" className="back-link">
                    ← Retour à la liste des leçons
                </Link>
            </div>
        );
    }

    // purifing html of lesson's content
    const sanitizedContent = DOMPurify.sanitize(lesson.content);

    return (
        <div className="lesson-container fade-in">
            <h1 className="lesson-detail-title">{lesson.title}</h1>
            <div className="lesson-details">
                <span>Matière : {lesson.subject}</span>
                <span>Professeur : {lesson.teacher_name}</span>
            </div>
            <div
                className="lesson-content"
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
            <Link to={`/lessons/subject/${lesson.subject}`}  className="back-link">
                ← Retour à la liste des leçons de {lesson.subject}
            </Link>
        </div>
    );
}

export default LessonDetail;
