import React from 'react';
import '../css/style.css'; // Import CSS
import '../css/SubjectChoice.css';

const SubjectChoice = () => {
    return (
      

      // Every subjects
      <div className="subject-choice-container">
          
        <h1> Choisis ta matière ! </h1>

        <ul className= "subject-choice">
          <li>
            <a href="/lessons/subject/Maths" class="mathematiques">
              <img src="/images/mathsGuy.png" alt="Mathematiques" />
            </a>
          </li>

          <li> 
            <a href="/lessons/subject/Français" className='french'>
              <img src="/images/frenchGirl.png" alt="French" />
            </a>  
          </li>

          <li> 
            <a href="/lessons/subject/Histoire" className='history-geo'>
              <img src="/images/historyGuy.png" alt="History-geo" />
            </a>  
          </li>

          <li> 
            <a href="/lessons/subject/Anglais" className='english'>
              <img src="/images/englishGuy.png" alt="English" />
            </a>  
          </li>
        </ul>

      </div>

  
      
    );
  };

export default SubjectChoice;
