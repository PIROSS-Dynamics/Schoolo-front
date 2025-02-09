import React, { useState, useEffect } from "react";
import { database } from "../../firebase";
import { ref, onValue, push, set } from "firebase/database";
import '../../css/User/ChatPage.css';

const ChatPage = () => {
  const userId = localStorage.getItem("id");
  const [relations, setRelations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messageContent, setMessageContent] = useState("");

  useEffect(() => {
    fetch(`http://localhost:8000/activity/api/user-relations/?user_id=${userId}`)
      .then(response => response.json())
      .then((data) => {
        const formattedRelations = data.map(relation => {
          if (relation.student.id === parseInt(userId)) {
            // Si l'utilisateur est un étudiant, récupérer le sender (parent ou professeur)
            return { id: relation.sender.id, username: relation.sender.name };
          } else {
            // Si l'utilisateur est un professeur ou un parent, récupérer l'étudiant
            return { id: relation.student.id, username: relation.student.name};
          }
        });
  
        setRelations(formattedRelations);
      })
      .catch(error => console.error("Erreur récupération relations", error));
  }, [userId]);
  

  // Récupérer les messages en temps réel depuis Firebase
  useEffect(() => {
    if (selectedContact) {
      const conversationId = userId < selectedContact.id ? `${userId}_${selectedContact.id}` : `${selectedContact.id}_${userId}`;
      const messagesRef = ref(database, `messages/${conversationId}`);
      
      const unsubscribe = onValue(messagesRef, (snapshot) => {
        const data = snapshot.val();
        const chatMessages = data ? Object.values(data) : [];
        setMessages(chatMessages);
      });

      return () => unsubscribe(); // Nettoyage lors du changement de contact
    }
  }, [selectedContact, userId]);

  // Envoyer un message à Firebase
  const sendMessage = () => {
    if (!messageContent.trim() || !selectedContact) return;
    
    const conversationId = userId < selectedContact.id ? `${userId}_${selectedContact.id}` : `${selectedContact.id}_${userId}`;
    const messagesRef = ref(database, `messages/${conversationId}`);
    const newMessageRef = push(messagesRef);
    
    set(newMessageRef, {
      sender: userId,
      receiver: selectedContact.id,
      description: messageContent,
      timestamp: Date.now()
    })
    .then(() => setMessageContent(""))
    .catch(error => console.error("Erreur envoi message", error));
  };

  return (
    <div className="chat-container">
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

      <div className="chat-messages">
        {selectedContact ? (
          <>
            <h2>Chat avec {selectedContact.username}</h2>
            <div className="messages-list">
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`message ${msg.sender === userId ? "sent" : "received"}`}
                >
                  <p>{msg.description}</p>
                  <span className="timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
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
