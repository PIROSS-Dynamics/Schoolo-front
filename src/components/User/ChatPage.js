import React, { useState, useEffect, useRef } from "react";
import EmojiPicker from "emoji-picker-react";
import { database } from "../../firebase";
import { ref, onValue, push, set } from "firebase/database";
import '../../css/User/ChatPage.css';

const ChatPage = () => {
  const userId = localStorage.getItem("id");
  const [relations, setRelations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messageContent, setMessageContent] = useState("");
  const [recentMessages, setRecentMessages] = useState({});
  const messagesEndRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);

  useEffect(() => {
    fetch(`http://localhost:8000/activity/api/user-relations/?user_id=${userId}`)
      .then(response => response.json())
      .then((data) => {
        const formattedRelations = data.map(relation => {
          if (relation.student.id === parseInt(userId)) {
            return { id: relation.sender.id, username: relation.sender.name };
          } else {
            return { id: relation.student.id, username: relation.student.name };
          }
        });
        setRelations(formattedRelations);
      })
      .catch(error => console.error("Erreur récupération relations", error));
  }, [userId]);

  useEffect(() => {
    if (!relations.length) return;
    const unsubscribes = relations.map((contact) => {
      const conversationId =
        userId < contact.id ? `${userId}_${contact.id}` : `${contact.id}_${userId}`;
      const messagesRef = ref(database, `messages/${conversationId}`);

      return onValue(messagesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const chatMessages = Object.values(data);
          const lastMessage = chatMessages[chatMessages.length - 1];
          if (lastMessage.sender !== userId) {
            const now = Date.now();
            const diffMinutes = (now - lastMessage.timestamp) / (1000 * 60);
            let status = null;
            if (diffMinutes < 10) {
              status = "green"; 
            } else if (diffMinutes < 60) {
              status = "orange"; 
            }
            setRecentMessages((prev) => ({
              ...prev,
              [contact.id]: status,
            }));
          }
        }
      });
    });
    return () => unsubscribes.forEach((unsub) => unsub());
  }, [relations, userId]);

  useEffect(() => {
    if (selectedContact) {
      const conversationId =
        userId < selectedContact.id ? `${userId}_${selectedContact.id}` : `${selectedContact.id}_${userId}`;
      const messagesRef = ref(database, `messages/${conversationId}`);
  
      const unsubscribe = onValue(messagesRef, (snapshot) => {
        const data = snapshot.val();
        const chatMessages = data ? Object.values(data) : [];
        setMessages(chatMessages);
  
        setTimeout(() => {
          if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      });
  
      return () => unsubscribe();
    }
  }, [selectedContact, userId]);

  const sendMessage = () => {
    if (!messageContent.trim() || !selectedContact) return;
    const conversationId =
      userId < selectedContact.id ? `${userId}_${selectedContact.id}` : `${selectedContact.id}_${userId}`;
    const messagesRef = ref(database, `messages/${conversationId}`);
    const newMessageRef = push(messagesRef);
    set(newMessageRef, {
      sender: userId,
      receiver: selectedContact.id,
      description: messageContent,
      timestamp: Date.now(),
    })
      .then(() => setMessageContent(""))
      .catch((error) => console.error("Erreur envoi message", error));
  };

  const addEmoji = (emoji) => {
    setMessageContent((prev) => prev + emoji.emoji);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
              {recentMessages[contact.id] === "green" && <span className="notification-dot-green"></span>}
              {recentMessages[contact.id] === "orange" && <span className="notification-dot-orange"></span>}
            </li>
          ))}
        </ul>
      </div>
      <div className="chat-messages">
        {selectedContact ? (
          <>
            <h2 className="conversation-title">Conversation avec {selectedContact.username}</h2>
            <div className="messages-list">
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.sender === userId ? "sent" : "received"}`}>
                  <p dangerouslySetInnerHTML={{ __html: msg.description }}></p>
                  <span className="timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                </div>
              ))}
              <div ref={messagesEndRef}></div>
            </div>
            <div className="chat-input">
              {showEmojiPicker && (
                <div ref={emojiPickerRef} className="emoji-picker active">
                  <EmojiPicker onEmojiClick={addEmoji} searchDisabled={true} skinTonesDisabled={true} previewConfig={{ showPreview: false }} />
                </div>
              )}
              <input
                type="text"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Écrivez un message..."
              />
              <button className="emoji-button" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                <span role="img" aria-label="emoji">🙂</span>
              </button>
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