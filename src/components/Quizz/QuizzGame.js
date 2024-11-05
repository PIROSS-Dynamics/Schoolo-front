import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../css/QuizzGame.css';

function QuizzGame() {
    const { quizzId } = useParams();
    const navigate = useNavigate(); // Utilisation de useNavigate pour naviguer
    const [quizz, setQuizz] = useState(null);
    const [responses, setResponses] = useState({});
    const [result, setResult] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // État pour la question actuelle

    useEffect(() => {
        fetch(`http://localhost:8000/quizz/api/quizzlist/${quizzId}/`)
            .then(response => response.json())
            .then(data => {
                // Mélanger les questions aléatoirement
                const shuffledQuestions = data.questions.sort(() => Math.random() - 0.5);
                setQuizz({ ...data, questions: shuffledQuestions });
            })
            .catch(error => console.error('Erreur:', error));
    }, [quizzId]);

    const handleChange = (questionId, value) => {
        setResponses({ ...responses, [questionId]: value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        fetch(`http://localhost:8000/quizz/api/quizzlist/${quizzId}/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(responses)
        })
        .then(response => response.json())
        .then(data => {
            setResult(data.result);
            setCurrentQuestionIndex(-1); // Indiquer que le quiz est terminé
        })
        .catch(error => console.error('Erreur:', error));
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Empêche l'envoi du formulaire
            if (responses[quizz.questions[currentQuestionIndex].id]) {
                if (currentQuestionIndex < quizz.questions.length - 1) {
                    setCurrentQuestionIndex(currentQuestionIndex + 1);
                }
            } else {
                alert("Veuillez répondre à la question avant de passer à la suivante."); // Avertir l'utilisateur
            }
        }
    };

    if (!quizz) return <p>Chargement...</p>;

    const currentQuestion = quizz.questions[currentQuestionIndex];

    return (
        <div className="container">
            <h2>{quizz.title}</h2>
            <p><strong>Matière :</strong> {quizz.subject}</p>

            <form onSubmit={handleSubmit}>
                {/* Vérifier si le quiz est terminé */}
                {currentQuestionIndex >= 0 ? (
                    <div className="question-box">
                        <h2>{currentQuestion.text}</h2>
                        {currentQuestion.question_type === 'choice' ? (
                            currentQuestion.choices.map(choice => (
                                <label key={choice.id}>
                                    <input
                                        type="radio"
                                        name={`question_${currentQuestion.id}`}
                                        value={choice.id}
                                        onChange={() => handleChange(currentQuestion.id, choice.id)}
                                        
                                    />
                                    {choice.text}
                                </label>
                            ))
                        ) : (
                            <input
                                type="text"
                                value={responses[currentQuestion.id] || ''}
                                name={`question_${currentQuestion.id}`}
                                onChange={e => handleChange(currentQuestion.id, e.target.value)}
                                autoComplete='off'
                                onKeyDown={handleKeyDown}
                                
                            />
                        )}

                        {/* Affichage de la position de la question */}
                        <div className="progress">
                            Question {currentQuestionIndex + 1} / {quizz.questions.length}
                        </div>

                        {/* Bouton pour passer à la question suivante */}
                        <button type="button" onClick={() => {
                            if (responses[currentQuestion.id]) {
                                setCurrentQuestionIndex(currentQuestionIndex + 1);
                            } else {
                                alert("Veuillez répondre à la question avant de passer à la suivante.");
                            }
                        }} disabled={currentQuestionIndex === quizz.questions.length - 1}>
                            Question Suivante
                        </button>
                    </div>
                ) : (
                    <div className="question-box">
                        <h2>Résultat</h2>
                        <p>{result}</p>
                        <button type="button" onClick={() => navigate('/quizz')}>Retourner à la liste des quizz</button>
                    </div>
                )}
                {/* Afficher le bouton de soumission seulement si c'est la dernière question */}
                {currentQuestionIndex === quizz.questions.length - 1 && (
                    <button type="submit" className="submit-button">Soumettre</button>
                )}
            </form>
        </div>
    );
}

export default QuizzGame;
