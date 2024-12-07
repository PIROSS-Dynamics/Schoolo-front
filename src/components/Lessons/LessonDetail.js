import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import '../../css/LessonDetail.css'; // Importation des styles pour LessonDetail
import '../../css/Loading.css'; // Importation des styles pour le chargement

function LessonDetail() {
    const { lessonId } = useParams();
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true); // Gestion de l'état de chargement

    useEffect(() => {
        fetch(`http://localhost:8000/lessons/api/lessonslist/detail/${lessonId}/`)
            .then((response) => response.json())
            .then((data) => {
                setLesson(data);
                setLoading(false); // Chargement terminé
            })
            .catch((error) => {
                console.error('Erreur:', error);
                setLoading(false); // En cas d'erreur, désactiver le chargement
            });
    }, [lessonId]);

    if (loading) {
        // Animation de chargement
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Chargement de la leçon...</p>
            </div>
        );
    }

    if (!lesson) {
        // Gestion des cas où aucune leçon n'est trouvée
        return (
            <div className="lesson-container">
                <p>La leçon demandée n'existe pas ou une erreur est survenue.</p>
                <Link to="/lessons" className="back-link">
                    ← Retour à la liste des leçons
                </Link>
            </div>
        );
    }

    // Désinfection du contenu HTML
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
            <Link to="/lessons" className="back-link">
                ← Retour à la liste des leçons
            </Link>
        </div>
    );
}

export default LessonDetail;
