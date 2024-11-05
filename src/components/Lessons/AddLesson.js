import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddLesson() {
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('Maths'); // Valeur par défaut
    const [content, setContent] = useState('');
    const [description, setDescription] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [teacherId, setTeacherId] = useState('');
    const [teachers, setTeachers] = useState([]);
    const navigate = useNavigate();

    // Récupérer la liste des enseignants depuis le backend
    useEffect(() => {
        fetch("http://localhost:8000/users/api/teachers/") 
            .then(response => response.json())
            .then(data => setTeachers(data))
            .catch(error => console.error('Erreur:', error));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!teacherId) {
            console.error('Veuillez sélectionner un enseignant');
            return; // Empêche la soumission si aucun enseignant n'est sélectionné
        }

        const lessonData = {
            title,
            subject,
            content,
            description,
            is_public: isPublic,
            teacher: teacherId // Id de l'enseignant sélectionné
        };

        fetch('http://localhost:8000/lessons/api/lessonslist/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCsrfToken() 
            },
            body: JSON.stringify(lessonData)
        })
        .then(response => {
            if (response.ok) {
                navigate('/lessons'); // Redirige vers la liste des leçons après l'ajout
            } else {
                console.error('Erreur lors de l\'ajout de la leçon');
            }
        })
        .catch(error => console.error('Erreur:', error));
    };

    const getCsrfToken = () => {
        const cookieValue = document.cookie
            .split('; ')
            .find(row => row.startsWith('csrftoken='))
            ?.split('=')[1];
        return cookieValue || '';
    };

    return (
        <div>
            <h1>Ajouter une Leçon</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Titre</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div>
                    <label>Matière</label>
                    <select value={subject} onChange={(e) => setSubject(e.target.value)} required>
                        <option value="Maths">Maths</option>
                        <option value="Français">Français</option>
                        <option value="Anglais">Anglais</option>
                        <option value="Histoire">Histoire</option>
                    </select>
                </div>
                <div>
                    <label>Contenu</label>
                    <textarea value={content} onChange={(e) => setContent(e.target.value)} required></textarea>
                </div>
                <div>
                    <label>Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)}></textarea> 
                </div>
                <div>
                    <label>Public</label>
                    <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
                </div>
                <div>
                    <label>Enseignant</label>
                    <select value={teacherId} onChange={(e) => setTeacherId(e.target.value)} required>
                        <option value="">Sélectionnez un enseignant</option>
                        {teachers.map(teacher => (
                            <option key={teacher.id} value={teacher.id}>{teacher.first_name} {teacher.last_name}</option>
                        ))}
                    </select>
                </div>
                <button type="submit">Ajouter la Leçon</button>
            </form>
        </div>
    );
}

export default AddLesson;
