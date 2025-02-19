import React, { useState, useEffect, useRef } from 'react';
import '../../css/Challenges/GuessWord.css';

function GuessWord() {
  const [englishWord, setEnglishWord] = useState('');
  const [choices, setChoices] = useState([]);
  const [correctTranslation, setCorrectTranslation] = useState('');
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [result, setResult] = useState('');
  const [timeLeft, setTimeLeft] = useState(10); // timer
  const timerRef = useRef(null);

  const fetchWord = async () => {
    try {
      const response = await fetch('http://localhost:8000/guessword/api/get_word/');
      const data = await response.json();
      setEnglishWord(data.english_word);
      setChoices(data.choices);
      setCorrectTranslation(data.correct_translation);
      setResult('');
      setSelectedChoice(null);
      startTimer ();
    } catch (error) {
      console.error("Error fetching word data:", error);
    }
    
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current); // Delete the last timer
    
    setTimeLeft(10);
    document.getElementById('timer-text').textContent = 10;
    
    
    const timerProgress = document.getElementById('timer-progress');
    const totalLength = 2 * Math.PI * 40; 
    timerProgress.style.strokeDasharray = totalLength; 
    timerProgress.style.strokeDashoffset = 251.2; 

    
    timerRef.current = setInterval(() => {
      
      setTimeLeft(prevTime => {
        document.getElementById('timer-text').textContent = prevTime-1;
        
        // update the animation
        timerProgress.style.strokeDashoffset = ((prevTime - 1) / 10) * totalLength;

        if (prevTime <= 1) {
          clearInterval(timerRef.current);
          timerProgress.style.strokeDashoffset = 0; 
          fetchWord();
          return 0;
        }
        return prevTime - 1;
      });
      
    }, 1000);
  };

  const checkTranslation = (chosenTranslation) => {
    setSelectedChoice(chosenTranslation);
    const isCorrect = chosenTranslation.trim().toLowerCase() === correctTranslation.trim().toLowerCase();
    setResult(isCorrect ? 'correct' : 'incorrect');
    
    setTimeout(fetchWord, 1500); // to let times for the annimation
    
  };

  useEffect(() => {
    fetchWord();
  }, []);

  return (
    <div className="gwgame-wrapper">
      <div className="gwgame-container">
        <h1 className="gwtitle">Trouve la bonne traduction ce mot :</h1>
        <p className="word">{englishWord}</p>

        <div id="timer-circle">
          <svg width="100" height="100">
            <circle cx="50" cy="50" r="40" stroke="#ddd" stroke-width="8" fill="none"/>
            <circle id="timer-progress" cx="50" cy="50" r="40" stroke="#4CAF50" stroke-width="8" fill="none" 
                    stroke-dasharray="0" stroke-dashoffset="251.2"/>
          </svg>
          <p id="timer-text">10</p>
        </div>


        <div className="gwchoices">
          {choices.map((choice, index) => (
            <button 
              key={index} 
              className={`gwchoice-btn ${selectedChoice === choice ? (result === 'correct' ? 'correct' : 'incorrect') : ''}`}
              onClick={() => checkTranslation(choice)}
              disabled={selectedChoice !== null}
            >
              {choice}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GuessWord;
