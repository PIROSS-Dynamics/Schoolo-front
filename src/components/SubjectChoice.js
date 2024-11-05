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
              <img src="/images/perso maths.png" alt="Mathematiques" />
              <p>Mathématiques</p>
            </a>
          </li>

          <li> 
            <a href="/lessons/subject/Français" className='french'>
              <img src="/images/frenchGirl.png" alt="French" />
              <p>Français</p>
            </a>  
          </li>

          <li> 
            <a href="/lessons/subject/Histoire" className='history-geo'>
              <img src="/images/historyGuy.png" alt="History-geo" />
              <p>Histoire-Géographie</p>
            </a>  
          </li>

          <li> 
            <a href="/lessons/subject/Anglais" className='english'>
              <img src="/images/englishGuy.png" alt="English" />
              <p>Anglais</p>
            </a>  
          </li>
        </ul>

      </div>

  
      
    );
  };

export default SubjectChoice;
