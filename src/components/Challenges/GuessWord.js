import React, { useState, useEffect} from 'react';
import '../../css/Challenges/GuessWord.css';
import TimerAnswer from '../TimerAnswer.js'; 

function GuessWord() {
  const [englishWord, setEnglishWord] = useState('');
  const [choices, setChoices] = useState([]);
  const [correctTranslation, setCorrectTranslation] = useState('');
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [result, setResult] = useState('');
  
  const [questionCount, setQuestionCount] = useState(0);

  
  const fetchWord = async () => {
    try {
      const response = await fetch('http://localhost:8000/guessword/api/get_word/');
      const data = await response.json();
      setEnglishWord(data.english_word);
      setChoices(data.choices);
      setCorrectTranslation(data.correct_translation);
      setResult('');
      setSelectedChoice(null);
      
      setQuestionCount(prevCount => prevCount + 1);
    } catch (error) {
      console.error("Error fetching word data:", error);
    }
    
  };


  const checkTranslation = (chosenTranslation) => {
    setSelectedChoice(chosenTranslation);
    const isCorrect = chosenTranslation.trim().toLowerCase() === correctTranslation.trim().toLowerCase();
    setResult(isCorrect ? 'correct' : 'incorrect');
    
    setTimeout(fetchWord, 1500); // to let times for the annimation
    
  };

  var time = 10;

  const timer = {
    time: time,
    onTimerEnd: fetchWord,
    questionCount: questionCount,
  };

  // load the game instant when we join the page
  useEffect(() => {
    fetchWord();
  }, []);

  return (
    <div className="gwgame-wrapper">
      <div className="gwgame-container">
        <h1 className="gwtitle">Trouve la bonne traduction ce mot :</h1>
        <p className="word">{englishWord}</p>

        <TimerAnswer data={timer} />
        
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
