import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import subjectColors from '../../data/subjectColors.json';
import '../../css/Lessons/LessonDetail.css';
import '../../css/Loading.css';
import { FaArrowLeft, FaArrowRight, FaThumbsUp } from 'react-icons/fa';
import PopupTeacherProfile from '../User/PopupTeacherProfile';

function LessonDetail() {
    const { lessonId } = useParams();
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false); 

    useEffect(() => {
        fetch(`http://localhost:8000/lessons/api/lessonslist/detail/${lessonId}/`)
            .then((response) => response.json())
            .then((data) => {
                setLesson(data);
                setLikes(data.likes);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Erreur:', error);
                setLoading(false);
            });
    }, [lessonId]);

    const handleLike = () => {
        setIsLiked(true); 
        fetch(`http://localhost:8000/lessons/api/lessonslist/like/${lessonId}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((response) => response.json())
        .then((data) => {
            setLikes(data.likes);
        })
        .catch((error) => {
            console.error('Erreur lors du like:', error);
            setIsLiked(false); 
        });
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Chargement de la leçon...</p>
            </div>
        );
    }

    if (!lesson) {
        return (
            <div className="lesson-container">
                <p>La leçon demandée n'existe pas ou une erreur est survenue.</p>
                <Link to="/lessons" className="back-link">← Retour à la liste des leçons</Link>
            </div>
        );
    }

    const sanitizedContent = DOMPurify.sanitize(
        lesson.content.replace(/\\newline/g, '<br>').replace(/\\newpage/g, '<div class="new-page"></div>')
    );
    const backgroundColor = subjectColors[lesson.subject] || "#cbffee";
    const pages = sanitizedContent.split('<div class="new-page"></div>').map(page => page.trim());
    const totalPages = pages.length;

    const goToPreviousPage = () => {
        setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev));
    };

    const goToNextPage = () => {
        setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev));
    };

    return (
        <div className="lesson-container fade-in" style={{ backgroundColor }}>
            <h1 className="lesson-detail-title">{lesson.title}</h1>
            <div className="lesson-details">
                <span>Matière : {lesson.subject}</span>
                <button className="teacher-button" onClick={() => setShowPopup(true)}>
                    Professeur : {lesson.teacher_name}
                </button>
                <button
                    className={`like-button ${isLiked ? 'liked' : ''}`}
                    onClick={handleLike}
                    disabled={isLiked}
                >
                    <FaThumbsUp />
                    {likes}
                </button>

            </div>
            <div className="lesson-content-wrapper">
                <div className="lesson-content" dangerouslySetInnerHTML={{ __html: pages[currentPage] }} />
            </div>
            <div className="pagination-controls">
                <button onClick={goToPreviousPage} disabled={currentPage === 0} className="pagination-button">
                    <FaArrowLeft /> Précédent
                </button>
                <span className="lesson-page-indicator">{currentPage + 1}/{totalPages}</span>
                <button onClick={goToNextPage} disabled={currentPage === totalPages - 1} className="pagination-button">
                    Suivant <FaArrowRight />
                </button>
            </div>
            <Link to={`/lessons/subject/${lesson.subject}`} className="back-link">
                ← Retour à la liste des leçons de {lesson.subject}
            </Link>

            {showPopup && (
                <PopupTeacherProfile
                    teacherId={lesson.teacher}
                    teacherName={lesson.teacher_name}
                    onClose={() => setShowPopup(false)}
                />
            )}
        </div>
    );
}

export default LessonDetail;
