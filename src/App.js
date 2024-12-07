import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './css/style.css'; 
import Header from './components/Header'; 
import SubjectChoice from './components/SubjectChoice';
import Carousel from './components/Carousel';
import Footer from './components/Footer'; 
import LessonList from './components/Lessons/LessonList'; 
import LessonDetail from './components/Lessons/LessonDetail'; 
import AddLesson from './components/Lessons/AddLesson';
import QuizzList from './components/Quizz/QuizzList';
import QuizzGame from './components/Quizz/QuizzGame';
import AddQuizz from './components/Quizz/AddQuizz';
import HomePopup from './components/HomePopup'; 
import About from './components/About';

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

      {/* Affiche la pop-up uniquement sur la page d'accueil */}
      {location.pathname === '/' && <HomePopup />}

      {/* Conteneur pour tout le contenu de la page */}
      <div className="App-content">
        {/* Définition des routes */}
        <Routes>
          <Route path="/" element={<SubjectChoice />} />
          <Route path="/lessons" element={<LessonList />} />
          <Route path="/lessons/subject/:subject" element={<LessonList />} />
          <Route path="/lessons/detail/:lessonId" element={<LessonDetail />} />
          <Route path="/lessons/add" element={<AddLesson />} />
          <Route path="/quizz" element={<QuizzList />} />
          <Route path="/quizz/play/:quizzId" element={<QuizzGame />} />
          <Route path="/quizz/add" element={<AddQuizz />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>

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
