import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../css/Lessons/LessonList.css';
import '../../css/Loading.css';
import subjectColors from '../../data/subjectColors.json';

function LessonList() {
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const { subject } = useParams(); // Extract the subject from the route params

    const [clickedCardId, setClickedCardId] = useState(null);

    useEffect(() => {
        // API endpoint dynamically based on the subject
        const url = `http://localhost:8000/lessons/api/lessonslist/subject/${subject}/`;

        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                setLessons(data); // Set the lessons based on the subject
                setLoading(false);
            })
            .catch((error) => {
                console.error("Erreur:", error);
                setLoading(false);
            });
    }, [subject]);

    const handleLessonClick = (lessonId) => {
        setClickedCardId(lessonId); // Set the clicked card's ID for animation
        setTimeout(() => {
            navigate(`/lessons/detail/${lessonId}`); // Navigate to the lesson details page
        }, 1100); // Match the animation duration
    };

    const filteredLessons = lessons.filter((lesson) =>
        lesson.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value); // Update the search term
    };

    if (loading) {
        return (
            <div>
                <h2 className="list-title">Liste des Leçons {subject && `- ${subject}`}</h2>
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Chargement des leçons...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h2 className="list-title">Liste des Leçons {subject && `- ${subject}`}</h2>

            {/* Search bar */}
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Rechercher une leçon par titre..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-input"
                />
            </div>

            {/* Lesson list */}
            <div className="lesson-list">
                {filteredLessons.length > 0 ? (
                    filteredLessons.map((lesson) => {
                        const backgroundColor = subjectColors[lesson.subject] || "#cbffee"; // Get subject color

                        return (
                            <div
                                key={lesson.id}
                                className={`lesson-card ${clickedCardId === lesson.id ? "clicked" : ""}`}
                                onClick={() => handleLessonClick(lesson.id)}
                                style={{ backgroundColor }} // Apply background color
                            >
                                <h3 className="lesson-title">{lesson.title}</h3>
                                <p className="lesson-description">Par : <strong>{lesson.teacher_name}</strong></p>
                                <p className="lesson-description">{lesson.description}</p>
                            </div>
                        );
                    })
                ) : (
                    <p>Aucune leçon disponible pour cette matière.</p>
                )}
            </div>
        </div>
    );
}

export default LessonList;
