import React, { useEffect, useState } from 'react';

function AddQuizz() {
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('Maths');
    const [teacherId, setTeacherId] = useState('');
    const [teachers, setTeachers] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [isPublic, setIsPublic] = useState(false);

    // Récupération des enseignants depuis le backend
    useEffect(() => {
        fetch("http://localhost:8000/users/api/teachers/")
            .then(response => response.json())
            .then(data => setTeachers(data))
            .catch(error => console.error('Erreur:', error));
    }, []);

    // Initialiser les questions avec un nombre spécifique de choix
    const initializeQuestions = (numQuestions) => {
        const initialQuestions = Array.from({ length: numQuestions }, () => ({
            text: '',
            question_type: 'text',
            correct_answer: '',
            choices: []
        }));
        setQuestions(initialQuestions);
    };

    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index][field] = value;
        setQuestions(updatedQuestions);
    };

    // Initialiser les choix pour les questions de type "choice"
    const initializeChoices = (index, numChoices) => {
        const updatedQuestions = [...questions];
        const initialChoices = Array.from({ length: numChoices }, () => ({ text: '' }));
        updatedQuestions[index].choices = initialChoices;
        setQuestions(updatedQuestions);
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

        if (!teacherId) {
            alert("Veuillez sélectionner un enseignant");
            return;
        }

        fetch('http://localhost:8000/quizz/api/quizzlist/add/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title,
                subject,
                teacher: teacherId,
                questions,
                is_public: isPublic
            })
        })
        .then(response => response.json())
        .then(data => {
            alert("Quizz ajouté avec succès !");
        })
        .catch(error => console.error('Erreur:', error));
    };

    return (
        <div>
            <h2>Ajouter un Quizz</h2>
            <div>
                <label>Titre du Quizz :</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>

            <div>
                <label>Matière :</label>
                <select value={subject} onChange={(e) => setSubject(e.target.value)} required>
                    <option value="Maths">Maths</option>
                    <option value="Français">Français</option>
                    <option value="Anglais">Anglais</option>
                    <option value="Histoire">Histoire</option>
                </select>
            </div>

            <div>
                <label>Enseignant :</label>
                <select value={teacherId} onChange={(e) => setTeacherId(e.target.value)} required>
                    <option value="">Sélectionnez un enseignant</option>
                    {teachers.map((teacher) => (
                        <option key={teacher.id} value={teacher.id}>
                            {teacher.first_name} {teacher.last_name}
                        </option>
                    ))}
                </select>
            </div>

            <label>
                Nombre de questions:
                <input type="number" onChange={(e) => initializeQuestions(parseInt(e.target.value) || 0)} />
            </label>

            {questions.map((question, index) => (
                <div key={index}>
                    <h3>Question {index + 1}</h3>
                    <input
                        type="text"
                        placeholder="Texte de la question"
                        value={question.text}
                        onChange={(e) => handleQuestionChange(index, 'text', e.target.value)}
                        required
                    />
                    <label>Type de question:</label>
                    <select
                        value={question.question_type}
                        onChange={(e) => handleQuestionChange(index, 'question_type', e.target.value)}
                        required
                    >
                        <option value="text">Texte</option>
                        <option value="choice">Choix</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Bonne réponse"
                        value={question.correct_answer}
                        onChange={(e) => handleQuestionChange(index, 'correct_answer', e.target.value)}
                        required
                    />

                    {question.question_type === 'choice' && (
                        <div>
                            <label>
                                Nombre de choix:
                                <input
                                    type="number"
                                    onChange={(e) => initializeChoices(index, parseInt(e.target.value) || 0)}
                                />
                            </label>

                            {question.choices.map((choice, choiceIndex) => (
                                <div key={choiceIndex}>
                                    <input
                                        type="text"
                                        placeholder={`Choix ${choiceIndex + 1}`}
                                        value={choice.text}
                                        onChange={(e) => handleChoiceChange(index, choiceIndex, e.target.value)}
                                    />
                                    <button onClick={() => removeChoice(index, choiceIndex)}>Supprimer le choix</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}

            <label>
                Quizz public:
                <input type="checkbox" checked={isPublic} onChange={() => setIsPublic(!isPublic)} />
            </label>

            <button onClick={handleSubmit}>Soumettre le Quizz</button>
        </div>
    );
}

export default AddQuizz;
