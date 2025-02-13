import React, { useEffect, useState } from 'react';
import axios from 'axios';
import React, { useEffect, useState } from "react";
import { gapi } from "gapi-script";



const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";
const GoogleCalendar = () => {
  const [events, setEvents] = useState([]);
  const [isSignedIn, setIsSignedIn] = useState(false);

  // Fetch events/tasks data from the backend API using `userId`
      useEffect(() => {
        function start() {
            gapi.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
                scope: SCOPES,
            }).then(() => {
                const authInstance = gapi.auth2.getAuthInstance();
                setIsSignedIn(authInstance.isSignedIn.get());
                authInstance.isSignedIn.listen(setIsSignedIn);
            });
        }

        gapi.load("client:auth2", start);
    }, []);

    const signIn = () => {
        gapi.auth2.getAuthInstance().signIn();
    };

    const signOut = () => {
        gapi.auth2.getAuthInstance().signOut();
        setEvents([]);
    };

    const fetchEvents = async () => {
        if (isSignedIn) {
            const response = await gapi.client.calendar.events.list({
                calendarId: "primary",
                timeMin: new Date().toISOString(),
                showDeleted: false,
                singleEvents: true,
                orderBy: "startTime",
            });

            setEvents(response.result.items || []);
        }
    };

    return (
        <div>
            {isSignedIn ? (
                <>
                    <button onClick={signOut}>Sign Out</button>
                    <button onClick={fetchEvents}>Fetch Events</button>
                    <ul>
                        {events.map((event) => (
                            <li key={event.id}>
                                {event.summary} - {event.start.dateTime || event.start.date}
                            </li>
                        ))}
                    </ul>
                </>
            ) : (
                <button onClick={signIn}>Sign in with Google</button>
            )}
        </div>
    );
};

export default CalendarComponent;
