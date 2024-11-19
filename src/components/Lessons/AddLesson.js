import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Importer les styles de base
import '../../css/AddLesson.css';

function AddLesson() {
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState([]);
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
            return;
        }

        const lessonData = {
            title,
            subject,
            content, // React Quill gère automatiquement le HTML
            description,
            is_public: isPublic,
            teacher: teacherId
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
                    navigate('/lessons');
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
            <h1 className='form-title'>Ajouter une Leçon</h1>
            <form className='add-lesson-form' onSubmit={handleSubmit}>

                <div className='title'>
                    <label>Titre de la Leçon</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>

                <div className='subject'>
                    <label>Matière :</label>
                    <select value={subject} onChange={(e) => setSubject(e.target.value)} required>
                        <option value="">Sélectionnez une matière</option>
                        <option value="Maths">Maths</option>
                        <option value="Français">Français</option>
                        <option value="Anglais">Anglais</option>
                        <option value="Histoire">Histoire</option>
                    </select>
                </div>

                <div className='content'>
                    <label>Contenu</label>
                    <ReactQuill
                        value={content}
                        onChange={setContent}
                        modules={{
                            toolbar: [
                                ['bold', 'italic', 'underline'], // Gras, italique, souligné
                                [{ 'header': [1, 2, 3, false] }], // Tailles des titres
                                [{ 'list': 'ordered' }, { 'list': 'bullet' }], // Listes
                                [{ 'color': [] }, { 'background': [] }], // Couleurs
                                ['clean'] // Nettoyer le formatage
                            ]
                        }}
                        formats={[
                            'bold', 'italic', 'underline',
                            'header', 'list', 'bullet', 'color', 'background'
                        ]}
                        placeholder="Écrivez le contenu ici..."
                    />
                </div>

                <div className='description'>
                    <label>Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                </div>

                <div className='public-yesno'>
                    <label>Public</label>
                    <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
                </div>

                <div className='teacher'>
                    <label>Enseignant</label>
                    <select value={teacherId} onChange={(e) => setTeacherId(e.target.value)} required>
                        <option value="">Sélectionnez un enseignant</option>
                        {teachers.map(teacher => (
                            <option key={teacher.id} value={teacher.id}>{teacher.first_name} {teacher.last_name}</option>
                        ))}
                    </select>
                </div>

                <div className="button-container">
                    <button type="submit">Ajouter la Leçon</button>
                </div>
            </form>
        </div>
    );
}

export default AddLesson;
