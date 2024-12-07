import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/Quizz/QuizzList.css';
import '../../css/Loading.css';

function QuizzList() {
    const [quizz, setQuizz] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const url = "http://localhost:8000/quizz/api/quizzlist/";

        fetch(url)
            .then(response => response.json())
            .then(data => {
                setQuizz(data);
                setLoading(false); // Désactiver le chargement après récupération des données
            })
            .catch(error => {
                console.error('Erreur:', error);
                setLoading(false); // En cas d'erreur, désactiver le chargement
            });
    }, []);

    const handleQuizzClick = (quizzId) => {
        navigate(`/quizz/play/${quizzId}`);
    };

    if (loading) {
        // Animation de chargement
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

            {/* Quizz List */}
            <div className="quizz-list">
                {quizz.length > 0 ? (
                    quizz.map((quizzItem) => (
                        <div
                            key={quizzItem.id}
                            className="quizz-card"
                            onClick={() => handleQuizzClick(quizzItem.id)}
                        >
                            <h3 className="quizz-title">{quizzItem.title}</h3>
                            <p className="quizz-subject">Matière : <strong>{quizzItem.subject}</strong></p>
                            <p className="teacher-name">Par : <strong>{quizzItem.teacher_name}</strong></p>
                            <p className="quizz-questions">Nombre de questions : {quizzItem.number_of_questions}</p>
                        </div>
                    ))
                ) : (
                    <p>Aucun quiz disponible pour le moment.</p>
                )}
            </div>
        </div>
    );
}

export default QuizzList;
