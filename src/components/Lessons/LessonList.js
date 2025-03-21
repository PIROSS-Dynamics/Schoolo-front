import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../css/Lessons/LessonList.css';
import '../../css/Loading.css';
import subjectColors from '../../data/subjectColors.json';
import gradeMapping from '../../data/gradeMapping.json';

function LessonList() {
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const { subject } = useParams();
    const [clickedCardId, setClickedCardId] = useState(null);

    useEffect(() => {
        const url = `http://localhost:8000/lessons/api/lessonslist/subject/${subject}/`;

        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                setLessons(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Erreur:", error);
                setLoading(false);
            });
    }, [subject]);

    const handleLessonClick = (lessonId) => {
        setClickedCardId(lessonId);
        setTimeout(() => {
            navigate(`/lessons/detail/${lessonId}`);
        }, 1100);
    };

    const filteredLessons = lessons.filter((lesson) =>
        lesson.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
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

            <div className="search-container">
                <input
                    type="text"
                    placeholder="Rechercher une leçon par titre..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-input"
                />
            </div>

            <div className="lesson-list">
                {filteredLessons.length > 0 ? (
                    filteredLessons.map((lesson) => {
                        const backgroundColor = subjectColors[lesson.subject] || "#cbffee";
                        const gradeName = gradeMapping[lesson.grade]; // Get the grade name

                        return (
                            <div
                                key={lesson.id}
                                className={`lesson-card ${clickedCardId === lesson.id ? "clicked" : ""}`}
                                onClick={() => handleLessonClick(lesson.id)}
                                style={{ backgroundColor }}
                            >
                                <h3 className="lesson-title">{lesson.title}</h3>
                                <p className="lesson-description">Par : <strong>{lesson.teacher_name}</strong></p>
                                <p className="lesson-description">Niveau : <strong>{gradeName}</strong></p>
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
