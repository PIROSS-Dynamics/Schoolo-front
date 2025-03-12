import React from 'react';
import achievementsData from '../../data/AchievementsList.json';
import '../../css/User/Achievements.css'; // Importer le fichier CSS

const Achievements = ({ quizResults }) => {
  const checkAchievement = (achievement) => {
    const { type, condition, value } = achievement.criteria;
    if (type === "quiz") {
      if (condition === "max_score") {
        return quizResults.filter(q => q.score === q.total).length >= value;
      }
      if (condition === "completed") {
        return quizResults.length >= value;
      }
    }
    return false;
  };

  return (
    <div className="achievements-container">
      <div className="achievements-list">
        {achievementsData.map((achievement) => {
          const isAchieved = checkAchievement(achievement);
          return (
            <div
              key={achievement.id}
              className={`achievement-item ${isAchieved ? 'achieved' : 'not-achieved'}`}
            >
              <img src={achievement.icon} alt={achievement.name} />
              <div className="description">
                <h4>{achievement.name}</h4>
                <p>{achievement.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Achievements;
