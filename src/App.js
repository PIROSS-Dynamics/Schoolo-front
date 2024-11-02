// src/App.js
import React from 'react';
import './css/style.css'; // Import global CSS
import Header from './components/Header'; // Import Header
import SubjectChoice from './components/SubjectChoice';
import Footer from './components/Footer'; // Import Footer
import UploadImage from './components/UploadImage'; 

function App() {
  return (
    <div className="App">

      <Header />

      <SubjectChoice/>
      <UploadImage />

      <Footer />

    </div>
  );
}

export default App;
