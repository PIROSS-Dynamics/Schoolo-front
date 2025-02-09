import React, { useState, useEffect } from "react";
import { database } from "../../firebase";
import { ref, onValue } from "firebase/database";
import '../../css/User/ChatPage.css';

const ChatPage = () => {
  const userId = localStorage.getItem("id");
  const userRole = localStorage.getItem("role");
  const [relations, setRelations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messageContent, setMessageContent] = useState("");

  // Charger les relations depuis l'API
  useEffect(() => {
    fetch(`http://localhost:8000/activity/api/user-relations/?user_id=${userId}`)
      .then(response => response.json())
      .then((data) => {
        const formattedRelations = data.map(relation => {
          let relatedUser = relation.teacher || relation.parent || relation.student;
          return relatedUser ? { id: relatedUser.id, username: relatedUser.name } : null;
        }).filter(user => user !== null);

        setRelations(formattedRelations);
      })
      .catch(error => console.error("Erreur récupération relations", error));
  }, [userId, userRole]);

  // Charger les messages depuis la base de données (notifications de type message)
  useEffect(() => {
    if (selectedContact) {
      fetch(`http://localhost:8000/activity/api/notifications/?user_id=${userId}`)
        .then(response => response.json())
        .then((data) => {
          console.log("Données reçues du back :", data); // Vérifier ce que le back envoie
          
          const chatMessages = data.filter(
            (notif) => notif.type === 'message' || notif.type === 'system' && 
            ((notif.receiver === selectedContact.id) ||
            (notif.sender === selectedContact.id))
          );   
                 
          console.log("Messages filtrés :", chatMessages); // Vérifier si le filtre fonctionne
          console.log(selectedContact.id)
  
          setMessages(chatMessages);
        })
        .catch(error => console.error("Erreur récupération messages", error));
    }
  }, [selectedContact, userId]);
  

  // Envoyer un message
  const sendMessage = () => {
    if (!messageContent.trim() || !selectedContact) return;
    
    fetch("http://localhost:8000/activity/api/send-message/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender_id: userId,
        receiver_id: selectedContact.id,
        message: messageContent,
      }),
    })
    .then(response => response.json())
    .then(() => {
      setMessageContent("");
    })
    .catch(error => console.error("Erreur envoi message", error));
  };

  return (
    <div className="chat-container">
      {/* Liste des contacts */}
      <div className="chat-sidebar">
        <h2>Contacts</h2>
        <ul>
          {relations.map((contact) => (
            <li
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className={selectedContact?.id === contact.id ? "active" : ""}
            >
              {contact.username}
            </li>
          ))}
        </ul>
      </div>

      {/* Zone de chat */}
      <div className="chat-messages">
        {selectedContact ? (
          <>
            <h2>Chat avec {selectedContact.username}</h2>
            <div className="messages-list">
            {messages.map((msg, index) => (
                <div 
                key={index} 
                className={`message ${msg.type === 'message' ? "receveid" : "sent"}`}
                >
                <p>{msg.description}</p>
                <span className="timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                </div>
            ))}
            </div>


            {/* Champ d'envoi de message */}
            <div className="chat-input">
              <input
                type="text"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="Écrivez un message..."
              />
              <button onClick={sendMessage}>Envoyer</button>
            </div>
          </>
        ) : (
          <p>Sélectionnez un contact pour commencer à discuter.</p>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
