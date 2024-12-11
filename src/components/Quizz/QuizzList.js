import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/Quizz/QuizzList.css';
import '../../css/Loading.css';
import SubjectPopup from './SubjectPopup';

function QuizzList() {
    const [quizz, setQuizz] = useState([]);
    const [loading, setLoading] = useState(true);
    const [subjects, setSubjects] = useState([]);
    const [popupOpen, setPopupOpen] = useState(true);
    const navigate = useNavigate();

    const [clickedQuizzId, setClickedCardId] = useState(null);
    // References for each subject title
    const subjectRefs = useRef({});

    useEffect(() => {
        const url = "http://localhost:8000/quizz/api/quizzlist/";

        fetch(url)
            .then(response => response.json())
            .then(data => {
                setQuizz(data);
                const subjectsList = [...new Set(data.map(item => item.subject))];
                setSubjects(subjectsList);
                setLoading(false);
            })
            .catch(error => {
                console.error('Erreur:', error);
                setLoading(false);
            });
    }, []);

    const handleQuizzClick = (quizzId) => {
        setClickedCardId(quizzId); // Set the clicked card
        setTimeout(() => {
            navigate(`/quizz/play/${quizzId}`);
        }, 1100); // Adjust delay to match animation duration
    };

    // Grouping quizzes by subject
    const quizzBySubject = quizz.reduce((groups, quizzItem) => {
        const subject = quizzItem.subject || "Autre"; // Default to "Other" if no subject
        if (!groups[subject]) {
            groups[subject] = [];
        }
        groups[subject].push(quizzItem);
        return groups;
    }, {});

   // Handling the subject selection and scrolling to the section
    const handleSelectSubject = (subject) => {
        // Targeting the reference for the subject title
        const section = subjectRefs.current[subject];
        if (section) {
            const navbarHeight = document.querySelector('nav')?.offsetHeight || 0; 
            const additionalOffset = 40; // Additional offset to create more space from the navbar
            window.scrollTo({
                top: section.offsetTop - navbarHeight - additionalOffset, 
                behavior: 'smooth',
            });
        }
    };

    const handleClosePopup = () => {
        setPopupOpen(false);
    };

    // Define the custom order of subjects
    const subjectOrder = ['Maths', 'Français', 'Histoire', 'Anglais'];

    // Sort subjects to display them in the desired order
    const sortedSubjects = subjectOrder.filter(subject => subjects.includes(subject));

    // Add any remaining subjects (other than Maths, Français, Histoire, Anglais)
    const remainingSubjects = subjects.filter(subject => !subjectOrder.includes(subject));

    const allSubjectsInOrder = [...sortedSubjects, ...remainingSubjects];

    if (loading) {
        return (
            <div>
                <h2 className='list-title'>Liste des Quiz</h2>
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Chargement de la liste des quiz...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h2 className='list-title'>Liste des Quiz</h2>

            {/* Afficher la pop-up si elle est ouverte */}
            {popupOpen && (
                <SubjectPopup
                    subjects={subjects}
                    onSelectSubject={handleSelectSubject}
                    onClose={handleClosePopup}
                />
            )}

            {/* Quiz groupés par sujet */}
            {allSubjectsInOrder.length > 0 ? (
                allSubjectsInOrder.map((subject) => (
                    <div key={subject} className="subject-section">
                        <h3
                            ref={(el) => (subjectRefs.current[subject] = el)} // Lier chaque titre de section à une référence
                            className="subject-title"
                        >
                            {subject}
                        </h3>
                        <div className="quizz-list-row">
                            {quizzBySubject[subject]?.map((quizzItem) => (
                                <div
                                    key={quizzItem.id}
                                    className={`quizz-card ${clickedQuizzId === quizzItem.id ? "clicked" : ""}`}

                                    onClick={() => handleQuizzClick(quizzItem.id)}
                                >
                                    <h3 className="quizz-title">{quizzItem.title}</h3>
                                    <p className="quizz-subject">Matière : <strong>{quizzItem.subject}</strong></p>
                                    <p className="teacher-name">Par : <strong>{quizzItem.teacher_name}</strong></p>
                                    <p className="quizz-questions">Nombre de questions : {quizzItem.number_of_questions}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <p>Aucun quiz disponible pour le moment.</p>
            )}
        </div>
    );
}

export default QuizzList;
