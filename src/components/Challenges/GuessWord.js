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

    document.getElementById('timer').textContent = 10;
    
    timerRef.current = setInterval(() => {
      
      setTimeLeft(prevTime => {
        document.getElementById('timer').textContent = prevTime-1;
        
        if (prevTime <= 1) {
          clearInterval(timerRef.current);
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

        <p id='timer'></p>

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
