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
import EditLesson from './components/Lessons/EditLesson';
import QuizzList from './components/Quizz/QuizzList';
import QuizzGame from './components/Quizz/QuizzGame';
import AddQuizz from './components/Quizz/AddQuizz';
import HomePopup from './components/HomePopup'; 
import ChallengeList from './components/Challenges/ChallengeList';
import About from './components/About';
import Auth from './components/Auth'; 
import Profile from './components/User/Profile';
import EditQuizz from './components/Quizz/EditQuizz';
import Contribution from './components/Contribution';
import GuessWord from './components/Challenges/GuessWord';


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

      {/* Conteneur pour tout le contenu de la page */}
      <div className="App-content">
        {/* Définition des routes */}
        <Routes>
          {/* Home */}
          <Route path="/" element={ 
            <div> 

              <SubjectChoice />  
              <HomePopup /> 
            </div>} 
          />


          {/* Leçons */}
          <Route path="/lessons" element={<LessonList />} />
          <Route path="/lessons/subject/:subject" element={<LessonList />} />
          <Route path="/lessons/detail/:lessonId" element={<LessonDetail />} />
          <Route path="/lessons/add" element={<AddLesson />} />
          <Route path="/edit-lesson/:lessonId" element={<EditLesson />} />
          
          {/* Quizs */}
          <Route path="/quizz" element={<QuizzList />} />
          <Route path="/quizz/play/:quizzId" element={<QuizzGame />} />
          <Route path="/quizz/add" element={<AddQuizz />} />
          <Route path="/edit-quiz/:quizId" element={<EditQuizz />} />

          {/* Défis */}
          <Route path="/challenges" element={<ChallengeList />} />
          <Route path="/challenges/guessWord" element={<GuessWord />} />

          {/* A propos */}
          <Route path="/about" element={ 
            <div> 
              <About />
            
              <Contribution /> 
            </div>} 
          />

          

          {/* Connexion / Inscription */}
          <Route path="/login" element={<Auth />} />

          {/* User routes */}
          <Route path="/profile" element={<Profile />} />

            
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
