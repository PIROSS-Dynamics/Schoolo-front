import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Importer les styles de base
import '../../css/Lessons/AddLesson.css';

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
            uploadAndExtractPdf(file); // send the pdf for extraction
        }
    };

    const uploadAndExtractPdf = (pdfFile) => {
        
        // Create an object FormData to send the file
        const formData = new FormData();
        formData.append('pdf', pdfFile);
        
        fetch('http://localhost:8000/lessons/api/lessonslist/extract-pdf', {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCsrfToken(), // Add CSRF token if needed
            },
            body: formData, // The PDF is end is the body

        })
            .then((response) => {
                
                if (response.ok) {
                    return response.json(); // Get the JSON response
                } else {
                    console.error("Erreur lors de l'extraction du texte depuis le PDF");
                }
            })
            .then((data ) => {
                
                if (data && data.content) {
                    // Update content
                    const formattedContent = data.content.replace(/\n/g, "<br>");
                    setContent(formattedContent);
                    
                }
            })
            .catch((error) => console.error("Erreur réseau :", error));
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
                                ['bold', 'italic', 'underline'], // Bold, italics, underline
                                [{ 'header': [1, 2, 3, false] }], // title size
                                [{ 'list': 'ordered' }, { 'list': 'bullet' }], // List
                                [{ 'color': [] }, { 'background': [] }], // Color
                                ['clean'] // Clean Format
                            ]
                        }}
                        formats={[
                            'bold', 'italic', 'underline',
                            'header', 'list', 'bullet', 'color', 'background'
                        ]}
                        placeholder="Écrivez le contenu ici..."
                    />
                </div>
                
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
