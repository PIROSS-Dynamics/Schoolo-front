import React, { useState } from 'react';
import '../css/style.css'; 

const ButtonAddLesson = () => {
  
  return (
    <div className='lessons-add-button-container'>
        <p> Ajoutez une leçon dans la matière de votre choix </p>
        <a href="/lessons/add">Ajouts de leçons</a>
    </div>
    
  );
};

export default ButtonAddLesson;
