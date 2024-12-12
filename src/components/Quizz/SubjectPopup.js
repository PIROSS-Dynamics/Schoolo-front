import React, { useState } from 'react';
import '../../css/Quizz/SubjectPopup.css';

const SubjectPopup = ({ subjects, onSelectSubject, onClose }) => {
  const [isOpen, setIsOpen] = useState(true);

  // Handle popup close event
  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose(); // Executes onClose action if provided
  };

  // Define the custom order for subjects
  const subjectOrder = ['Maths', 'Français', 'Histoire', 'Anglais', 'Art'];

  // Sort subjects based on the custom order
  const sortedSubjects = subjectOrder.filter((subject) => subjects.includes(subject));

  // Add any remaining subjects (those not in the custom order)
  const remainingSubjects = subjects.filter((subject) => !subjectOrder.includes(subject));

  // Combine the ordered subjects with the remaining ones
  const allSubjectsInOrder = [...sortedSubjects, ...remainingSubjects];

  // If the popup is not open, return null to not display it
  if (!isOpen) return null;

  return (
    <div className="HomePopup-container">
      <div className="HomePopup">
        <div className="HomePopup-header">
          <span className="HomePopup-title">Choisissez une matière</span>
          <button className="close-btn" onClick={handleClose}>
            ×
          </button>
        </div>
        {/* Line separator */}
        <hr className="popup-divider" />
        <div className="HomePopup-content">
          {allSubjectsInOrder.length > 0 ? (
            <ul className="subjects-list">
              {/* Loop through the sorted subjects and display them as list items */}
              {allSubjectsInOrder.map((subject) => (
                <li
                  key={subject}
                  className="subject-item"
                  onClick={() => onSelectSubject(subject)} // Handle subject selection
                >
                  {subject}
                </li>
              ))}
            </ul>
          ) : (
            // If no subjects are available, display this message
            <p className="no-subjects">Cette matière ne possède pas encore de quiz.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubjectPopup;
