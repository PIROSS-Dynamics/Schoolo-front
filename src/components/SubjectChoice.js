import React from 'react';
import '../css/style.css'; // Import CSS
import '../css/SubjectChoice.css';

const SubjectChoice = () => {
    return (
      

      // Every subjects
      <div id="subject-choice-container">
          
        <h1 className='title'> Choisis ta matière ! </h1>

        <ul className= "subject-choice">

          <li> 
            <a href="/lessons/subject/Histoire" className='history'>
              <img src="/images/historyGuy.png" alt="History" />
            </a>  
          </li>

          <li>
            <a href="/lessons/subject/Maths" class="mathematiques">
              <img src="/images/mathsGirl.png" alt="Mathematiques" />
            </a>
          </li>

          <li> 
            <a href="/lessons/subject/Français" className='french'>
              <img src="/images/frenchGirl.png" alt="French" />
            </a>  
          </li>

          

          <li> 
            <a href="/lessons/subject/Anglais" className='english'>
              <img src="/images/englishGuy.png" alt="English" />
            </a>  
          </li>

          <li> 
            <a href="/lessons/subject/Art" className='art'>
              <img src="/images/artGirl.png" alt="art" />
            </a>  
          </li>
        </ul>

      </div>

  
      
    );
  };

export default SubjectChoice;
