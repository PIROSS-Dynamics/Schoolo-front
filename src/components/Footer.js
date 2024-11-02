// src/components/Footer.js
import React from 'react';
import '../css/style.css'; // Import CSS
import '../css/Footer.css';

const Footer = () => {
    return (
        <footer>
            <div className="footer-container">
                {/* Copyright */}
                <div className="footer-copyright">
                    <p>&copy; 2024 BookMyEvent. Tous droits réservés.</p>
                </div>
                
                {/* Social Media */}
                <div className="footer-social-media">
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                        <img src="https://firebasestorage.googleapis.com/v0/b/bookmyevent-piross.appspot.com/o/images%2Flogo%20instagram%20blanc.png?alt=media&token=36cd5949-015c-4bc9-ada9-a2ab821835aa" 
                        alt="Instagram" 
                        className="instagram-icon" />
                    </a>
                     
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                        <img src="https://firebasestorage.googleapis.com/v0/b/bookmyevent-piross.appspot.com/o/images%2Flogo%20linkedin%20blanc.png?alt=media&token=9322b094-a6ab-48e9-9b62-d26f83bd9329" 
                        alt="LinkedIn" 
                        className="linkedin-icon"/> 
                    </a>
                </div>

                {/* Newsletter Signup */}
                <div className="footer-newsletter">
                    <p>Inscrivez-vous à notre newsletter :</p>
                    <form action="/subscribe" method="post">
                        <input type="email" placeholder="Votre adresse email" required />
                        <button type="submit">S'inscrire</button>
                    </form>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
