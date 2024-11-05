// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './css/style.css'; // Import global CSS
import Header from './components/Header'; // Import Header
import SubjectChoice from './components/SubjectChoice';
import Carousel from './components/Carousel';
import Footer from './components/Footer'; // Import Footer
import LessonList from './components/Lessons/LessonList'; 
import LessonDetail from './components/Lessons/LessonDetail'; 
import AddLesson from './components/Lessons/AddLesson';

function AppContent() {
  const location = useLocation();

  return (
    <div className="App">
      {/* Affiche le Header différemment sur la page d'accueil */}
      {location.pathname === '/' ? (
        <div className="blue-section">
          <Header />
          <Carousel />
        </div>
      ) : (
        <Header />
      )}

      {/* Définition des routes */}
      <Routes>
        <Route path="/" element={
          <div>
            <SubjectChoice />
            <li><a href="/quizz">Quizz</a></li>
          </div>
        } />

        <Route path="/lessons" element={<LessonList />} />
        <Route path="/lessons/subject/:subject" element={<LessonList />} />
        <Route path="/lessons/detail/:lessonId" element={<LessonDetail />} />
        <Route path="/lessons/add" element={<AddLesson />} />
      </Routes>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
