import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../../css/Lessons/AddLesson.css';
import LessonPreview from './LessonPreview'; 

function EditLesson() {
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [description, setDescription] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [teacher, setTeacher] = useState(null);
    const [grade, setGrade] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showPreview, setShowPreview] = useState(false); 
    const { lessonId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem('id');
        const userRole = localStorage.getItem('role');

        if (userRole !== 'teacher') {
            setErrorMessage("Vous n'avez pas accès à cette fonctionnalité.");
            return;
        }

        fetch(`http://localhost:8000/lessons/api/lessonslist/detail/${lessonId}/`)
            .then(response => {
                if (response.ok) return response.json();
                throw new Error("Erreur lors de la récupération des données de la leçon.");
            })
            .then(data => {
                if (String(userId) !== String(data.teacher)) {
                    setErrorMessage("Vous n'avez pas le droit de modifier cette leçon.");
                    return;
                }

                setTitle(data.title);
                setSubject(data.subject);
                setContent(data.content);
                setDescription(data.description);
                setIsPublic(data.is_public);
                setGrade(data.grade);
                setTeacher(data.teacher);
            })
            .catch(error => console.error(error));
    }, [lessonId]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const updatedLessonData = {
            title,
            subject,
            content,
            description,
            is_public: isPublic,
            teacher: teacher?.id,
            grade,
        };

        fetch(`http://localhost:8000/lessons/api/lessonslist/detail/${lessonId}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCsrfToken(),
            },
            body: JSON.stringify(updatedLessonData),
        })
            .then(response => {
                if (response.ok) navigate('/profile');
                else throw new Error("Erreur lors de la mise à jour de la leçon.");
            })
            .catch(error => console.error(error));
    };

    const getCsrfToken = () => {
        const cookieValue = document.cookie
            .split('; ')
            .find(row => row.startsWith('csrftoken='))
            ?.split('=')[1];
        return cookieValue || '';
    };

    if (errorMessage) {
        return (
            <div>
                <p>{errorMessage}</p>
                <button onClick={() => navigate('/profile')}>Retourner au profil</button>
            </div>
        );
    }

    return (
        <div>
            <h1 className="form-title">Modifier la Leçon</h1>
            <form className="add-lesson-form" onSubmit={handleSubmit}>
                <div className="title">
                    <label>Titre de la Leçon</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div className="subject">
                    <label>Matière :</label>
                    <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                    >
                        <option value="">Sélectionnez une matière</option>
                        <option value="Maths">Maths</option>
                        <option value="Français">Français</option>
                        <option value="Histoire">Histoire</option>
                        <option value="Anglais">Anglais</option>
                        <option value="Art">Art</option>
                    </select>
                </div>

                <div className="grade">
                    <label>Niveau :</label>
                    <select
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        required
                    >
                        <option value="">Sélectionnez un niveau</option>
                        <option value="1">CP</option>
                        <option value="2">CE1</option>
                        <option value="3">CE2</option>
                        <option value="4">CM1</option>
                        <option value="5">CM2</option>
                    </select>
                </div>

                <div className="content">
                    <label>Contenu</label>
                    <ReactQuill
                        value={content}
                        onChange={setContent}
                        modules={{
                            toolbar: [
                                ['bold', 'italic', 'underline'],
                                [{ header: [1, 2, 3, false] }],
                                [{ list: 'ordered' }, { list: 'bullet' }],
                                [{ color: [] }, { background: [] }],
                                ['clean'],
                            ],
                        }}
                        formats={[
                            'bold', 'italic', 'underline',
                            'header', 'list', 'bullet', 'color', 'background',
                        ]}
                    />
                </div>
                <button type="button" onClick={() => setShowPreview(true)}>Prévisualiser</button>

                <p>Ajoutez le texte \newpage lorsque vous souhaitez passer le texte suivant sur une nouvelle page</p>

                <div className="description">
                    <label>Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </div>

                <div className="public-yesno">
                    <label>Public</label>
                    <input
                        type="checkbox"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                    />
                </div>

                <div className="button-container">
                    <button type="submit">Modifier la Leçon</button>
                </div>
            </form>

            {showPreview && (
                <LessonPreview
                    lesson={{
                        title,
                        subject,
                        content,
                        description
                    }}
                    onClose={() => setShowPreview(false)}
                />
            )}
        </div>
    );
}

export default EditLesson;
