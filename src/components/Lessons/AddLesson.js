import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../../css/Lessons/AddLesson.css';
import LessonPreview from './LessonPreview'; 

function AddLesson() {
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [description, setDescription] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [teacher, setTeacher] = useState(null);
    const [grade, setGrade] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showPreview, setShowPreview] = useState(false); 
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem('id');
        const userRole = localStorage.getItem('role');

        if (userRole !== 'teacher') {
            setErrorMessage("Vous n'avez pas accès à cette fonctionnalité, il vous faut un compte Professeur.");
            return;
        }

        fetch(`http://localhost:8000/users/api/teacher/${userId}/`)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Erreur lors de la récupération des informations du professeur.');
                }
            })
            .then((data) => {
                setTeacher(data);
            })
            .catch((error) => console.error(error));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        const lessonData = {
            title,
            subject,
            content,
            description,
            is_public: isPublic,
            teacher: teacher?.id,
            grade,
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
                    navigate('/');
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

    const handlePdfUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            uploadAndExtractPdf(file);
        }
    };

    const uploadAndExtractPdf = (pdfFile) => {
        const formData = new FormData();
        formData.append('pdf', pdfFile);

        fetch('http://localhost:8000/lessons/api/lessonslist/extract-pdf', {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCsrfToken(),
            },
            body: formData,
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    console.error("Erreur lors de l'extraction du texte depuis le PDF");
                }
            })
            .then((data) => {
                if (data && data.content) {
                    const formattedContent = data.content.replace(/\n/g, "<br>");
                    setContent(formattedContent);
                }
            })
            .catch((error) => console.error("Erreur réseau :", error));
    };

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
                        <option value="Histoire">Histoire</option>
                        <option value="Anglais">Anglais</option>
                        <option value="Art">Art</option>
                    </select>
                </div>

                <div className='grade'>
                    <label>Niveau :</label>
                    <select value={grade} onChange={(e) => setGrade(e.target.value)} required>
                        <option value="">Sélectionnez un niveau</option>
                        <option value="1">CP</option>
                        <option value="2">CE1</option>
                        <option value="3">CE2</option>
                        <option value="4">CM1</option>
                        <option value="5">CM2</option>
                    </select>
                </div>

                <div className='content'>
                    <label>Contenu</label>
                    <ReactQuill
                        value={content}
                        onChange={setContent}
                        modules={{
                            toolbar: [
                                ['bold', 'italic', 'underline'],
                                [{ 'header': [1, 2, 3, false] }],
                                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                [{ 'color': [] }, { 'background': [] }],
                                ['clean']
                            ]
                        }}
                        formats={[
                            'bold', 'italic', 'underline',
                            'header', 'list', 'bullet', 'color', 'background'
                        ]}
                        placeholder="Écrivez le contenu ici..."
                    />
                </div>
                <button type="button" onClick={() => setShowPreview(true)}>Prévisualiser</button>

                <p>Ajoutez le texte \newpage lorsque vous souhaitez passer le texte suivant sur une nouvelle page</p>

                <input
                    type="file"
                    accept="application/pdf"
                    onChange={handlePdfUpload}
                />

                <div className='description'>
                    <label>Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                </div>

                <div className='public-yesno'>
                    <label>Public</label>
                    <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
                </div>

                <div className="teacher">
                    <label>Enseignant</label>
                    <input
                        type="text"
                        value={`${teacher.first_name} ${teacher.last_name}`}
                        disabled
                    />
                </div>

                <div className="button-container">
                    <button type="submit">Ajouter la Leçon</button>
                </div>
            </form>

            {showPreview && (
                <LessonPreview
                    lesson={{
                        title,
                        subject,
                        content,
                        description,
                        teacher_name: `${teacher.first_name} ${teacher.last_name}`,
                    }}
                    onClose={() => setShowPreview(false)}
                />
            )}
        </div>
    );
}

export default AddLesson;
