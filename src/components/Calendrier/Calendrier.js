import React, { useEffect, useState } from 'react';
import { gapi } from 'gapi-script';

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const SCOPES = 'https://www.googleapis.com/auth/calendar';

export const signOut = () => {
    const authInstance = gapi.auth2.getAuthInstance();
    if (authInstance) {
        authInstance.signOut();
    }
    localStorage.removeItem('googleSignedIn');
    window.location.reload();
};

const GoogleCalendar = () => {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userEmail, setUserEmail] = useState(null);

    useEffect(() => {
        function start() {
            gapi.load('client:auth2', () => {
                gapi.client.init({
                    apiKey: API_KEY,
                    clientId: CLIENT_ID,
                    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
                    scope: SCOPES,
                }).then(() => {
                    const authInstance = gapi.auth2.getAuthInstance();

                    authInstance.isSignedIn.listen((status) => {
                        setIsSignedIn(status);
                        if (status) {
                            localStorage.setItem('googleSignedIn', 'true');
                            fetchUserEmail();
                        } else {
                            localStorage.removeItem('googleSignedIn');
                        }
                    });

                    if (authInstance.isSignedIn.get()) {
                        setIsSignedIn(true);
                        fetchUserEmail();
                    }

                    setIsLoading(false);
                }).catch(error => {
                    console.error('Error initializing Google API', error);
                    setIsLoading(false);
                });
            });
        }
        start();
    }, []);

    const fetchUserEmail = () => {
        const authInstance = gapi.auth2.getAuthInstance();
        const user = authInstance.currentUser.get();
        const profile = user.getBasicProfile();
        if (profile) {
            setUserEmail(profile.getEmail());
        }
    };

    const signIn = () => {
        const authInstance = gapi.auth2.getAuthInstance();
        authInstance.signIn().then(() => {
            localStorage.setItem('googleSignedIn', 'true');
            setIsSignedIn(true);
            fetchUserEmail();
        }).catch((error) => {
            console.error('Google Sign-In Error:', error);
        });
    };

    const openGoogleCalendar = () => {
        // ✅ Open full calendar with editing capabilities
        window.open('https://calendar.google.com/calendar/u/0/r', '_blank');
    };

    return (
        <div>
            {isLoading ? (
                <p>Vérification de l&apos;authentification...</p>
            ) : isSignedIn ? (
                <>
                    <button onClick={signOut}>Se déconnecter</button>
                    <button onClick={openGoogleCalendar} style={{ marginLeft: '10px' }}>
                        📅 Ouvrir Google Agenda (Édition)
                    </button>
                </>
            ) : (
                <div style={{ textAlign: 'center', marginTop: '50px' }}>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google Logo" width="100" />
                    <p>Connectez-vous pour accéder à votre calendrier</p>
                    <button onClick={signIn} style={{ padding: '10px', fontSize: '16px' }}>
                        Se connecter avec Google
                    </button>
                </div>
            )}
        </div>
    );
};

export default GoogleCalendar;
