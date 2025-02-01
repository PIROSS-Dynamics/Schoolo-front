import React, { useState, useEffect } from 'react';
import '../../css/Challenges/GuessWord.css';

function GuessWord() {
  const [englishWord, setEnglishWord] = useState('');
  const [choices, setChoices] = useState([]);
  const [correctTranslation, setCorrectTranslation] = useState('');
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [result, setResult] = useState('');

  const fetchWord = async () => {
    try {
      const response = await fetch('http://localhost:8000/guessword/api/get_word/');
      const data = await response.json();
      setEnglishWord(data.english_word);
      setChoices(data.choices);
      setCorrectTranslation(data.correct_translation);
      setResult('');
      setSelectedChoice(null);
    } catch (error) {
      console.error("Error fetching word data:", error);
    }
  };

  const checkTranslation = (chosenTranslation) => {
    setSelectedChoice(chosenTranslation);
    const isCorrect = chosenTranslation.trim().toLowerCase() === correctTranslation.trim().toLowerCase();
    setResult(isCorrect ? 'correct' : 'incorrect');
    
    setTimeout(fetchWord, 1500);
  };

  useEffect(() => {
    fetchWord();
  }, []);

  return (
    <div className="game-wrapper">
      <div className="game-container">
        <h1 className="title">Trouve la bonne traduction :</h1>
        <p className="word">{englishWord}</p>

        <div className="choices">
          {choices.map((choice, index) => (
            <button 
              key={index} 
              className={`choice-btn ${selectedChoice === choice ? (result === 'correct' ? 'correct' : 'incorrect') : ''}`}
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
