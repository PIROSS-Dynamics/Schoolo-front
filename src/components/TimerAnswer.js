import React, { useState, useEffect, useRef } from 'react';
import '../css/style.css'; 
import '../css/TimerAnswer.css';


const TimerAnswer = ({ data }) => {

    const [timeLeft, setTimeLeft] = useState(data.time);
    const timerRef = useRef(null);

      // load the game instant when we join the page
      useEffect(() => {
        startTimer();
      }, [data.questionCount]);

    const startTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current); // Delete the last timer
        
        setTimeLeft(data.time);
        document.getElementById('timer-text').textContent = data.time;
        
        
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
                data.onTimerEnd(data.time)
                return 0;
            }
            return prevTime - 1;
            });
            
        }, 1000);
    };


    return (
        <div>
 
            <div id="timer-circle">
                <svg width="100" height="100">
                    <circle cx="50" cy="50" r="40" stroke="#ddd" stroke-width="8" fill="none"/>
                    <circle id="timer-progress" cx="50" cy="50" r="40" stroke="#4CAF50" stroke-width="8" fill="none" 
                            stroke-dasharray="0" stroke-dashoffset="251.2"/>
                </svg>
                <p id="timer-text"></p>
            </div>
                
        </div>
        
    );
};

export default TimerAnswer;
