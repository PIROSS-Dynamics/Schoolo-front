import React from 'react';
import DOMPurify from 'dompurify';
import subjectColors from '../../data/subjectColors.json';
import '../../css/Lessons/LessonDetail.css';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

function LessonPreview({ lesson, onClose }) {
    const [currentPage, setCurrentPage] = React.useState(0);

    const sanitizedContent = DOMPurify.sanitize(
        lesson.content.replace(/\\newpage/g, '<div class="new-page"></div>')
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
        <div className="lesson-preview-overlay">
            <div className="lesson-preview-container" style={{ backgroundColor }}>
                <button className="previewclose-button" onClick={onClose}>Fermer</button>
                <h1 className="lesson-detail-title">{lesson.title}</h1>
                <div className="lesson-details">
                    <span>Matière : {lesson.subject}</span>
                    <span>Professeur : {lesson.teacher_name}</span>
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
            </div>
        </div>
    );
}

export default LessonPreview;
