import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../css/Quizz/AddQuizz.css';

function EditQuizz() {
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('');
    const [teacher, setTeacher] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [isPublic, setIsPublic] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const { quizId } = useParams();  // Pour obtenir l'ID du quiz à modifier

    // Récupérer les informations du professeur et du quiz
    useEffect(() => {
        const userId = localStorage.getItem('id');
        const userRole = localStorage.getItem('role');

        if (userRole !== 'teacher') {
            setErrorMessage("Vous n'avez pas accès à cette fonctionnalité, il vous faut un compte Professeur.");
            return;
        }

        // Récupérer les infos du professeur
        fetch(`http://localhost:8000/users/api/teacher/${userId}/`)
            .then((response) => response.ok ? response.json() : Promise.reject('Erreur lors de la récupération des informations du professeur.'))
            .then((data) => setTeacher(data))
            .catch((error) => console.error(error));

        // Récupérer le quiz à modifier
        fetch(`http://localhost:8000/quizz/api/quizzlist/${quizId}/`)
            .then((response) => response.ok ? response.json() : Promise.reject('Erreur lors de la récupération du quiz.'))
            .then((data) => {
                
                if (String(userId) !== String(data.teacher_id)) {  
                    setErrorMessage("Vous n'avez pas le droit de modifier ce quiz.");
                    return;
                }

                setTitle(data.title);
                setSubject(data.subject);
                setIsPublic(data.is_public);
                setQuestions(data.questions);
            })
            .catch((error) => console.error(error));

    }, [quizId]);

    if (errorMessage) {
        return (
            <div>
                <p>{errorMessage}</p>
                <button onClick={() => navigate('/profile')}>Retourner au Profil</button>
            </div>
        );
    }
    
    if (!teacher) {
        return <p>Chargement des informations du professeur...</p>;
    }

    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index][field] = value;
        setQuestions(updatedQuestions);
    };

    const handleChoiceChange = (questionIndex, choiceIndex, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].choices[choiceIndex].text = value;
        setQuestions(updatedQuestions);
    };


    const validateQuizz = () => {
        return questions.every(question => {
            if (question.question_type === 'choice') {
                return question.choices.some(choice => choice.text === question.correct_answer);
            }
            return true;
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!validateQuizz()) {
            alert("Assurez-vous que chaque réponse correcte existe dans les choix correspondants.");
            return;
        }

        if (!title) {
            alert("Veuillez renseigner un titre pour le quiz.");
            return;
        }

        if (!subject || subject === "") {
            alert("Veuillez sélectionner une matière.");
            return;
        }

        if (questions.length === 0) {
            alert("Veuillez ajouter au moins une question.");
            return;
        }

        for (let i = 0; i < questions.length; i++) {
            const question = questions[i];

            if (!question.text) {
                alert(`Veuillez renseigner le texte de la question ${i + 1}.`);
                return;
            }

            if (!question.correct_answer) {
                alert(`Veuillez renseigner la bonne réponse pour la question ${i + 1}.`);
                return;
            }
        }

        fetch(`http://localhost:8000/quizz/api/quizzlist/${quizId}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title,
                subject,
                teacher: teacher?.id,
                questions,
                is_public: isPublic
            })
        })
        .then(response => response.json())
        .then(() => navigate('/quizz'))
        .catch(error => console.error('Erreur:', error));
    };

    return (
        <div>
            <h1 className="page-title">Modifier un Quiz</h1>
            {/* Avertissement */}
            <div className="warning-container">
                <p style={{ color: 'red', fontWeight: 'bold' , }}>
                    La modification des quizz ne comporte pas l'ajout ou la suppression de question ou de choix. Si vous souhaitez modifier un quizz, veuillez confirmer les réponses correctes à vos questions.
                </p>
            </div>

            <div className="quizz-form-container">
                <div className="title">
                    <label>Titre du Quiz :</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
    
                <div className="subject">
                    <label>Matière :</label>
                    <select value={subject} onChange={(e) => setSubject(e.target.value)} required>
                        <option value="">Sélectionnez une matière</option>
                        <option value="Maths">Maths</option>
                        <option value="Français">Français</option>
                        <option value="Histoire">Histoire</option>
                        <option value="Anglais">Anglais</option>
                        <option value="Art">Art</option>
                    </select>
                </div>
    
                <div className="teacher">
                    <label>Enseignant</label>
                    <input
                        type="text"
                        value={`${teacher.first_name} ${teacher.last_name}`}
                        disabled
                    />
                </div>

                {questions.map((question, index) => (
                    <div key={index} className="question-container">
                        <h3>Question {index + 1}</h3>
                        <input
                            type="text"
                            placeholder="Texte de la question"
                            value={question.text}
                            onChange={(e) =>
                                handleQuestionChange(index, 'text', e.target.value)
                            }
                            required
                        />
                        <label>Type de question :</label>
                        <select
                            value={question.question_type}
                            onChange={(e) =>
                                handleQuestionChange(index, 'question_type', e.target.value)
                            }
                            required
                        >
                            <option value="text">Texte</option>
                            <option value="choice">Choix</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Bonne réponse"
                            value={question.correct_answer}
                            onChange={(e) =>
                                handleQuestionChange(index, 'correct_answer', e.target.value)
                            }
                            required
                        />

                        {question.question_type === 'choice' && (
                            <div>
                                {question.choices.map((choice, choiceIndex) => (
                                    <div key={choiceIndex} className="choice-container">
                                        <input
                                            type="text"
                                            placeholder={`Choix ${choiceIndex + 1}`}
                                            value={choice.text}
                                            onChange={(e) =>
                                                handleChoiceChange(index, choiceIndex, e.target.value)
                                            }
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
    
                <label>
                    Quiz public :
                    <input
                        type="checkbox"
                        checked={isPublic}
                        onChange={() => setIsPublic(!isPublic)}
                    />
                </label>
    
                <div className="button-container">
                    <button onClick={handleSubmit}>Mettre à jour le Quiz</button>
                </div>
            </div>
        </div>
    );
}

export default EditQuizz;
