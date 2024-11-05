// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './css/style.css'; // Import global CSS
import Header from './components/Header'; // Import Header
import SubjectChoice from './components/SubjectChoice';
import Footer from './components/Footer'; // Import Footer
import UploadImage from './components/UploadImage'; 
import LessonList from './components/Lessons/LessonList'; 
import LessonDetail from './components/Lessons/LessonDetail'; 
import AddLesson from './components/Lessons/AddLesson';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />

        {/* Définition des routes */}
        <Routes>

          
          <Route path="/" element={
            <div>
              <li><a href="/lessons/add">Ajouts de leçons</a></li>
              <li><a href="/quizz">Quizz</a></li>
              <SubjectChoice/>
              <UploadImage />
            </div>
          } />

          <Route path="/lessons" element={<LessonList />} /> {/* Utilise element au lieu de component */}
          <Route path="/lessons/subject/:subject" element={<LessonList />} /> {/* Utilise element au lieu de component */}
          <Route path="/lessons/detail/:lessonId" element={<LessonDetail />} /> {/* Utilise element au lieu de component */}
          <Route path="/lessons/add" element={<AddLesson />} />
          
        

          <Route path="/lessons" element={<LessonList />} />

        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
