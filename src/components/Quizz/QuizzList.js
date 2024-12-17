import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/Loading.css';
import '../../css/Quizz/QuizzList.css';
import SubjectPopup from './SubjectPopup';

function QuizzList() {
    const [quizz, setQuizz] = useState([]);
    const [loading, setLoading] = useState(true);
    const [subjects, setSubjects] = useState([]);
    const [popupOpen, setPopupOpen] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const [clickedQuizzId, setClickedCardId] = useState(null);
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

    // Filtrer les quiz par titre
    const filteredQuizz = quizz.filter((q) =>
        q.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Grouper les quiz par matière
    const quizzBySubject = filteredQuizz.reduce((groups, quizzItem) => {
        const subject = quizzItem.subject || "Autre";
        if (!groups[subject]) {
            groups[subject] = [];
        }
        groups[subject].push(quizzItem);
        return groups;
    }, {});

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value); // Mettre à jour le terme de recherche
    };

    const handleQuizzClick = (quizzId) => {
        setClickedCardId(quizzId);
        setTimeout(() => {
            navigate(`/quizz/play/${quizzId}`);
        }, 1100);
    };

    const handleSelectSubject = (subject) => {
        const section = subjectRefs.current[subject];
        if (section) {
            const navbarHeight = document.querySelector('nav')?.offsetHeight || 0;
            const additionalOffset = 40;
            window.scrollTo({
                top: section.offsetTop - navbarHeight - additionalOffset,
                behavior: 'smooth',
            });
        }
    };

    const handleClosePopup = () => {
        setPopupOpen(false);
    };

    const subjectOrder = ['Maths', 'Français', 'Histoire', 'Anglais'];
    const sortedSubjects = subjectOrder.filter(subject => subjects.includes(subject));
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

            {/* Barre de recherche */}
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Rechercher un quiz par titre..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-input"
                />
            </div>

            {/* Afficher la pop-up si elle est ouverte */}
            {popupOpen && (
                <SubjectPopup
                    subjects={subjects}
                    onSelectSubject={handleSelectSubject}
                    onClose={handleClosePopup}
                />
            )}

            {/* Quiz groupés par matière */}
            {allSubjectsInOrder.length > 0 ? (
                allSubjectsInOrder.map((subject) => (
                    <div key={subject} className="subject-section">
                        <h3
                            ref={(el) => (subjectRefs.current[subject] = el)}
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
                <p>Aucun quiz trouvé.</p>
            )}
        </div>
    );
}

export default QuizzList;
