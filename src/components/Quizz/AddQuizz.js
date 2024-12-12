import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/Quizz/AddQuizz.css';

function AddQuizz() {
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState([]);
    const [teacher, setTeacher] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [isPublic, setIsPublic] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    // getting teachers from the back
    useEffect(() => {
        const userId = localStorage.getItem('id');
        const userRole = localStorage.getItem('role');

        // Vérify user is teacher
        if (userRole!== 'teacher') {
            setErrorMessage("Vous n'avez pas accès à cette fonctionnalité, il vous faut un compte Professeur.");
            return;
        }
        // if he is a teacher we recup his data
        fetch(`http://localhost:8000/users/api/teacher/${userId}/`)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Erreur lors de la récupération des informations du professeur.');
                }
            })
            .then((data) => {
                setTeacher(data); // Stocker les infos du professeur 
            })
            .catch((error) => console.error(error));
            
    }, []);

    if (errorMessage) {
        return (
            <div>
                <p>{errorMessage}</p>
                <button onClick={() => navigate('/')}>Retourner à l'accueil</button>
            </div>
        );
    }
    
    if (!teacher) {
        return <p>Chargement des informations du professeur...</p>;
    }

    // Update the number of questions without removing content of the the ones that are still counted
    const updateQuestions = (numQuestions) => {
        setQuestions(prevQuestions => {
            const updatedQuestions = [...prevQuestions];

            if (numQuestions > updatedQuestions.length) {
                // add questions input if the number of questions is increased 
                for (let i = updatedQuestions.length; i < numQuestions; i++) {
                    updatedQuestions.push({
                        text: '',
                        question_type: 'text',
                        correct_answer: '',
                        choices: []
                    });
                }
            } else {
                // deletes questions that are out of the number of questions we need
                updatedQuestions.splice(numQuestions);
            }

            return updatedQuestions;
        });
    };

    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index][field] = value;
        setQuestions(updatedQuestions);
    };

    
    const updateChoices = (questionIndex, numChoices) => {
        setQuestions(prevQuestions => {
            const updatedQuestions = [...prevQuestions];
            const choices = updatedQuestions[questionIndex].choices || [];

            if (numChoices > choices.length) {
                // add choices 
                for (let i = choices.length; i < numChoices; i++) {
                    choices.push({ text: '' });
                }
            } else {
                // delete choices
                choices.splice(numChoices);
            }

            updatedQuestions[questionIndex].choices = choices;
            return updatedQuestions;
        });
    };

    const handleChoiceChange = (questionIndex, choiceIndex, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].choices[choiceIndex].text = value;
        setQuestions(updatedQuestions);
    };

    const removeChoice = (questionIndex, choiceIndex) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].choices.splice(choiceIndex, 1);
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

        if (!subject || subject === "Sélectionnez une matière") {
            alert("Veuillez sélectionner une matière.");
            return;
        }

        if (questions.length === 0) {
            alert("Veuillez ajouter au moins une question.");
            return;
        }

        // VVerification of mandatory fields for each questions
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

            // Verification of choice for the question of type 'choice'
            if (question.question_type === 'choice' && question.choices.length === 0) {
                alert(`Veuillez ajouter des choix pour la question ${i + 1}.`);
                return;
            }
        }

        fetch('http://localhost:8000/quizz/api/quizzlist/add/', {
            method: 'POST',
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
        .then(data => {
            navigate('/quizz')
        })
        .catch(error => console.error('Erreur:', error));
    };

    return (
        <div>
            <h1 className="page-title">Ajouter un Quiz</h1>
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

                <label>
                    Nombre de questions :
                    <input
                        type="number"
                        min="0"
                        onChange={(e) =>
                            updateQuestions(parseInt(e.target.value) || 0)
                        }
                    />
                </label>
    
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
                                <label>
                                    Nombre de choix :
                                    <input
                                        type="number"
                                        min="0"
                                        onChange={(e) =>
                                            updateChoices(index, parseInt(e.target.value) || 0)
                                        }
                                    />
                                </label>
    
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
                                        <button
                                            onClick={() => removeChoice(index, choiceIndex)}
                                        >
                                            Supprimer le choix
                                        </button>
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
                    <button onClick={handleSubmit}>Soumettre le Quiz</button>
                </div>
            </div>
        </div>
    );
    
}

export default AddQuizz;
