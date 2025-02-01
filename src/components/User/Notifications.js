import React, { useState } from 'react';
import '../../css/User/Notifications.css';

// Ajout de notifications supplémentaires avec des dates et heures
const notificationsData = [
  { id: 1, type: 'systeme', title: 'Marie est désormais une relation', description: 'Tu as accepté une relation avec Marie', read: false, time: '2025-02-01 12:34' },
  { id: 2, type: 'message', title: 'Tu as un message de Alice', description: 'Ceci est un message.', read: false, time: '2025-02-01 13:20' },
  { id: 3, type: 'relation', title: 'Tu as une demande de relation de Bob', description: 'Clique pour accepter ou refuser.', read: false, time: '2025-02-01 14:05' },
  { id: 4, type: 'task', title: 'Nouvelle tâche de Carlos', description: 'Compléter la mission X.', read: false, time: '2025-02-01 15:30' },
  { id: 5, type: 'systeme', title: 'Maintenance', description: 'Une maintenance est à venir', read: false, time: '2025-02-01 16:45' },
  { id: 6, type: 'message', title: 'Tu as un message de David', description: 'Message urgent à lire.', read: false, time: '2025-02-02 10:10' },
  { id: 7, type: 'relation', title: 'Demande de relation de Claire', description: 'Accepte ou refuse cette demande.', read: false, time: '2025-02-02 11:30' },
  { id: 8, type: 'task', title: 'Mission à compléter', description: 'Nouvelle mission assignée.', read: false, time: '2025-02-02 12:00' },
  { id: 9, type: 'systeme', title: 'Maintenance du serveur', description: 'Le serveur sera en maintenance.', read: false, time: '2025-02-02 12:45' },
  { id: 10, type: 'message', title: 'Message de Emma', description: 'Ton message a été reçu.', read: false, time: '2025-02-02 13:00' },
  { id: 11, type: 'message', title: 'Message de Lucas', description: 'Veux-tu discuter ?', read: false, time: '2025-02-02 14:10' },
  { id: 12, type: 'relation', title: 'Demande de relation de Sophie', description: 'Une nouvelle demande de relation.', read: false, time: '2025-02-02 15:20' },
  { id: 13, type: 'task', title: 'Nouveau challenge de travail', description: 'Compléter la tâche assignée.', read: false, time: '2025-02-02 16:35' },
  { id: 14, type: 'systeme', title: 'Mise à jour importante', description: 'Une mise à jour du système est prévue.', read: false, time: '2025-02-02 17:50' },
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(notificationsData);
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState('');

  // Trier les notifications par date décroissante (plus récente en premier)
  const sortedNotifications = [...notifications].sort((a, b) => new Date(b.time) - new Date(a.time));

  const openPopup = (notification) => {
    // Marquer la notification comme lue lors du premier clic
    if (!notification.read) {
      setNotifications(notifications.map((notif) =>
        notif.id === notification.id ? { ...notif, read: true } : notif
      ));
    }
    setShowPopup(true);
    setPopupContent(notification);
  };

  const closePopup = () => {
    setShowPopup(false);
    setPopupContent('');
  };

  const handleRelationAction = (action) => {
    console.log(`${action} relation request`);
    closePopup();
  };

  const handleTaskAction = () => {
    console.log('Task completed');
    closePopup();
  };

  return (
    <div className="notif-container">
      <h1>Notifications</h1>
      <ul className="notif-list">
        {sortedNotifications.map((notification) => (
          <li
            key={notification.id}
            className={`notif-item ${notification.read ? 'notif-read' : 'notif-unread'}`}
            onClick={() => openPopup(notification)}
          >
            <span className="notif-title">{notification.title}</span>
            <span className="notif-icon">
              {notification.read ? '📨' : '✉️'}
            </span>
            <span className="notif-time">{notification.time}</span> {/* Affichage de l'heure */}
          </li>
        ))}
      </ul>

      {showPopup && (
        <div className="notif-popup">
          <div className="notif-popup-content">
            <h2>{popupContent.title}</h2>
            <p>{popupContent.description}</p>
            {popupContent.type === 'relation' && (
              <div>
                <button onClick={() => handleRelationAction('Accept')}>Accepter</button>
                <button onClick={() => handleRelationAction('Refuse')}>Refuser</button>
              </div>
            )}
            {popupContent.type === 'task' && (
              <button onClick={handleTaskAction}>Faire la tâche</button>
            )}
            <button className="notif-close" onClick={closePopup}>Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
