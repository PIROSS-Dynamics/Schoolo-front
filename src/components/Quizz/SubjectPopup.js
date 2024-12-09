import React, { useState } from 'react';
import '../../css/Quizz/SubjectPopup.css';

const SubjectPopup = ({ subjects, onSelectSubject, onClose }) => {
  const [isOpen, setIsOpen] = useState(true);

  // Handle popup close event
  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose(); // Executes onClose action if provided
  };

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
          {subjects.length > 0 ? (
            <ul className="subjects-list">
              {/* Loop through the subjects and display them as list items */}
              {subjects.map((subject) => (
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
