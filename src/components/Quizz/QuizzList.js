import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/QuizzList.css';

function QuizzList() {
    const [quizz, setQuizz] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // URL pour récupérer tous les quizz
        const url = "http://localhost:8000/quizz/api/quizzlist/";

        fetch(url)
            .then(response => response.json())
            .then(data => setQuizz(data))
            .catch(error => console.error('Erreur:', error));
    }, []);

    const handleQuizzClick = (quizzId) => {
        navigate(`/quizz/play/${quizzId}`);
    };

    return (
        <div>
            <h2 className='list-title'>Liste des Quizz</h2>

            {/* Quizz List */}
            <div className="quizz-list">
                {quizz.map(quizz => (
                    <div 
                        key={quizz.id} 
                        className="quizz-card" 
                        onClick={() => handleQuizzClick(quizz.id)}
                    >
                        <h3 className="quizz-title">{quizz.title}</h3>
                        <p className="quizz-subject">Matière : <strong>{quizz.subject}</strong></p>
                        <p className="teacher-name">Par : <strong>{quizz.teacher_name}</strong></p>
                        <p className="quizz-questions">Nombre de questions : {quizz.number_of_questions}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default QuizzList;
