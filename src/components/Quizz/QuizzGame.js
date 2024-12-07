import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../css/QuizzGame.css';
import '../../css/Loading.css';

function QuizzGame() {
    const { quizzId } = useParams();
    const navigate = useNavigate();
    const [quizz, setQuizz] = useState(null);
    const [responses, setResponses] = useState({});
    const [result, setResult] = useState(null);
    const [showCorrection, setShowCorrection] = useState(false);
    const [corrections, setCorrections] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [loading, setLoading] = useState(true); // Indicateur de chargement

    useEffect(() => {
        fetch(`http://localhost:8000/quizz/api/quizzlist/${quizzId}/`)
            .then(response => response.json())
            .then(data => {
                const shuffledQuestions = data.questions.sort(() => Math.random() - 0.5);
                setQuizz({ ...data, questions: shuffledQuestions });
                setLoading(false); // Désactiver le chargement
            })
            .catch(error => {
                console.error('Erreur:', error);
                setLoading(false); // Désactiver même en cas d'erreur
            });
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
            setCorrections(data.corrections);
            setCurrentQuestionIndex(-1);
        })
        .catch(error => console.error('Erreur:', error));
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            if (responses[quizz.questions[currentQuestionIndex].id]) {
                if (currentQuestionIndex < quizz.questions.length - 1) {
                    setCurrentQuestionIndex(currentQuestionIndex + 1);
                }
            } else {
                alert("Veuillez répondre à la question avant de passer à la suivante.");
            }
        }
    };

    if (loading) {
        // Animation de chargement
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Chargement du quiz...</p>
            </div>
        );
    }

    if (!quizz) return <p>Erreur lors du chargement du quiz.</p>;

    const currentQuestion = quizz.questions[currentQuestionIndex];

    return (
        <div className="container fade-in">
            <h2 className="quiz-title">{quizz.title}</h2>
            <p className="quiz-subject"><strong>Matière :</strong> {quizz.subject}</p>

            <form onSubmit={handleSubmit}>
                {currentQuestionIndex >= 0 ? (
                    <div className="question-box">
                        <h2 className="question-title">{currentQuestion.text}</h2>
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
                                autoComplete="off"
                                onKeyDown={handleKeyDown}
                            />
                        )}

                        <div className="progress">
                            Question {currentQuestionIndex + 1} / {quizz.questions.length}
                        </div>

                        {currentQuestionIndex < quizz.questions.length - 1 && (
                            <button className="next-button"
                                type="button"
                                onClick={() => {
                                    if (responses[currentQuestion.id]) {
                                        setCurrentQuestionIndex(currentQuestionIndex + 1);
                                    } else {
                                        alert("Veuillez répondre à la question avant de passer à la suivante.");
                                    }
                                }}
                            >
                                Question Suivante
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="question-box">
                        <h2>Résultat</h2>
                        <p>{result}</p>
                        <button className="show-correction" type="button" onClick={() => setShowCorrection(!showCorrection)}>
                            {showCorrection ? "Masquer la correction" : "Afficher la correction"}
                        </button>
                        {showCorrection && corrections && (
                            <div className="correction">
                                {corrections.map((correction, index) => (
                                    <div key={index} className="correction-item">
                                        <p><strong>Question {index + 1} :</strong> {correction.question_text}</p>
                                        <p><strong>Bonne réponse :</strong> {correction.correct_answer}</p>
                                        <span
                                            className={correction.is_correct ? "success-icon" : "error-icon"}
                                            style={{
                                                color: correction.is_correct ? "green" : "red",
                                                fontWeight: "bold"
                                            }}
                                        >
                                            {correction.is_correct ? "✓ Réussi" : "✗ Raté"}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                        <button className="back-to-quiz-list" type="button" onClick={() => navigate('/quizz')}>Retourner à la Liste des Quiz</button>
                    </div>
                )}
                
                {currentQuestionIndex === quizz.questions.length - 1 && (
                    <button type="submit" className="submit-button">Soumettre</button>
                )}
            </form>
        </div>
    );
}

export default QuizzGame;