import React, { useState, useEffect } from 'react';
import '../../css/User/Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState('');

   // Cette fonction permet de récupérer les notifications
   const fetchNotifications = () => {
    const userId = localStorage.getItem('id');

    fetch(`http://localhost:8000/activity/api/notifications/?user_id=${userId}`)
      .then(response => response.json())
      .then(data => setNotifications(data))
      .catch(error => console.error("Erreur récupération notifications", error));
  };

  useEffect(() => {
    // Appeler la fonction pour charger les notifications au démarrage
    fetchNotifications();
  }, []);

  // Tri des notifications du plus récent au plus ancien
  const sortedNotifications = [...notifications].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const openPopup = (notification) => {
    // Si la notification n'est pas déjà lue, on la marque comme lue localement
    if (!notification.is_read) {
      // Mettre à jour localement l'état de la notification en la marquant comme lue
      const updatedNotifications = notifications.map((notif) =>
        notif.id === notification.id ? { ...notif, is_read: true } : notif
      );
      setNotifications(updatedNotifications); // Met à jour l'état avec les notifications modifiées

      // Effectuer la requête pour marquer la notification comme lue côté serveur
      fetch(`http://localhost:8000/activity/api/notifications/${notification.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: localStorage.getItem('id') })
      })
        .then(response => response.json())
        .then(updatedNotification => {
          // Assurer que l'état local est bien mis à jour avec la réponse du serveur
          const finalNotifications = notifications.map(n =>
            n.id === updatedNotification.id ? { ...n, is_read: true } : n
          );
          setNotifications(finalNotifications);
        })
        .catch(error => console.error("Erreur mise à jour notification", error));
    }

    // Affichage du popup
    setShowPopup(true);
    setPopupContent(notification);
  };

  const closePopup = () => {
    setShowPopup(false);
    setPopupContent('');
    fetchNotifications();
  };

  const handleRelationAction = (action) => {
    const userId = localStorage.getItem('id');
    const notificationId = popupContent.id;

    // Effectuer la requête pour accepter ou refuser la relation
    fetch(`http://localhost:8000/activity/api/accept-relation/${notificationId}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: action,
        user_id: userId, // Passer l'ID de l'utilisateur pour l'acceptation
      }),
    })
      .then(response => response.json())
      .then(data => {
        // Logique après acceptation (par exemple, mise à jour de la notification dans l'interface)
        if (action === 'Accept') {
          console.log("Relation acceptée");
        } else {
          console.log("Relation refusée");
        }
        closePopup();
      })
      .catch(error => console.error("Erreur acceptation/refus de relation", error));
  };

  const handleTaskAction = () => {
    console.log('Task completed');
    closePopup();
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString); // Créer un objet Date à partir de la chaîne ISO
    return date.toLocaleString('fr-FR', {
      weekday: 'long', // Jour de la semaine complet
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false // 24 heures
    });
  };

  return (
    <div className="notif-container">
      <h1>Notifications</h1>
      <ul className="notif-list">
        {sortedNotifications.map((notification) => (
          <li
            key={notification.id}
            className={`notif-item ${notification.is_read ? 'notif-read' : 'notif-unread'}`}
            onClick={() => openPopup(notification)}
          >
            <span className="notif-title">{notification.title}</span>
            <span className="notif-icon">{notification.is_read ? '📨' : '✉️'}</span>
            <span className="notif-time">{formatDate(notification.timestamp)}</span>
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
                <button onClick={closePopup}>Refuser</button>
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
