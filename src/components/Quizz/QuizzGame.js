import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../css/Quizz/QuizzGame.css';
import '../../css/Loading.css';
import subjectColors from '../../data/subjectColors.json';
import { FaThumbsUp } from 'react-icons/fa';

function QuizzGame() {
    const { quizzId } = useParams();
    const navigate = useNavigate();
    const [quizz, setQuizz] = useState(null);
    const [responses, setResponses] = useState({});
    const [result, setResult] = useState(null);
    const [showCorrection, setShowCorrection] = useState(false);
    const [corrections, setCorrections] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [loading, setLoading] = useState(true); 
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false); 

    const currentSubjectColor = subjectColors[quizz?.subject] || '#007bff';  // Default color if subject not found

    useEffect(() => {
        fetch(`http://localhost:8000/quizz/api/quizzlist/${quizzId}/`)
            .then(response => response.json())
            .then(data => {
                const shuffledQuestions = data.questions.sort(() => Math.random() - 0.5);
                setQuizz({ ...data, questions: shuffledQuestions });
                setLikes(data.likes);
                setLoading(false); // End loading
            })
            .catch(error => {
                console.error('Erreur:', error);
                setLoading(false); 
            });
    }, [quizzId]);

    const handleChange = (questionId, value) => {
        setResponses({ ...responses, [questionId]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        if (Object.keys(responses).length < quizz.questions.length) {
            alert("Veuillez répondre à toutes les questions avant de soumettre.");
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:8000/quizz/api/quizzlist/${quizzId}/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(responses),
            });
    
            if (!response.ok) {
                throw new Error(`Erreur lors de la soumission : ${response.statusText}`);
            }
    
            const data = await response.json();
            setResult(data.result);
            setCorrections(data.corrections);
            setCurrentQuestionIndex(-1);
    
            const userId = localStorage.getItem('id');
            if (!userId) {
                alert("Veuillez vous connecter pour enregistrer vos résultats.");
                return;
            }

            const statsResponse = await fetch(`http://localhost:8000/stats/api/quizzresults/${quizzId}/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: userId, 
                    score: data.score,
                    total : data.total
                }),
            });
    
            if (!statsResponse.ok) {
                throw new Error(`Erreur lors de l'enregistrement du score : ${statsResponse.statusText}`);
            }
    
            console.log("Résultat enregistré avec succès.");
        } catch (error) {
            console.error('Erreur:', error);
            alert(`Une erreur est survenue : ${error.message}`);
        }
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

    const handleClosePopup = () => {
        setShowCorrection(false);  // Close the popup
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Chargement du quiz...</p>
            </div>
        );
    }

    const handleLike = () => {
        setIsLiked(true);
        fetch(`http://localhost:8000/quizz/api/quizzlist/like/${quizzId}/`, {
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

    if (!quizz) return <p>Erreur lors du chargement du quiz.</p>;

    const currentQuestion = quizz.questions[currentQuestionIndex];

    return (
        <div className="container" style={{ backgroundColor: currentSubjectColor }}>
            <h2 className="quiz-title">{quizz.title}</h2>
            <p className="quiz-subject"><strong>Matière :</strong> {quizz.subject}</p>
            <p className="quiz-subject"><strong>Professeur :</strong> {quizz.teacher_name}</p>


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
                        <button
                                className={`quizzlike-button ${isLiked ? 'liked' : ''}`}
                                onClick={handleLike}
                                disabled={isLiked}
                            >
                                <FaThumbsUp />
                                {likes}
                        </button>
                        <h2>Résultat</h2>
                        <p>{result}</p>
                        <button className="show-correction" type="button" onClick={() => setShowCorrection(true)}>
                            Afficher la correction
                        </button>
                        {showCorrection && corrections && (
                                <div 
                                    className="correctionpopup" 
                                    onClick={handleClosePopup} // Ajout du gestionnaire de clics
                                >
                                    <div 
                                        className="correctionpopup-content"
                                        onClick={(e) => e.stopPropagation()} // Empêche le clic sur la pop-up de se propager à l'arrière-plan
                                    >
                                        <h3>Correction</h3>
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
                                        <button className="close-correctionpopup" type="button" onClick={handleClosePopup}>
                                            Fermer
                                        </button>
                                    </div>
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
