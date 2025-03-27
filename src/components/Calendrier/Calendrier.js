import React, { useEffect, useState, useRef } from 'react';
import { gapi } from 'gapi-script';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Modal from 'react-modal';
import Select from 'react-select';
import '../../css/Calendar.css';

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const SCOPES = 'https://www.googleapis.com/auth/calendar.events';

const localizer = momentLocalizer(moment);

const { Agenda } = Views;

export const signOut = () => {
    const authInstance = gapi.auth2.getAuthInstance();
    if (authInstance) {
        authInstance.signOut();
    }
    localStorage.removeItem('googleSignedIn');
    window.location.reload();
};

const GoogleCalendarApp = () => {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [events, setEvents] = useState([]);
    const [relations, setRelations] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEventTooltipOpen, setIsEventTooltipOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [newEvent, setNewEvent] = useState({
        title: '',
        start: new Date(),
        end: new Date(),
        description: '',
        guests: [],
        recurrence: 'none',
    });
    const [error, setError] = useState(null);
    const [invalidEmails, setInvalidEmails] = useState([]);
    const tooltipRef = useRef(null);

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
                            fetchEvents();
                            fetchRelations();
                        } else {
                            localStorage.removeItem('googleSignedIn');
                        }
                    });

                    if (authInstance.isSignedIn.get()) {
                        setIsSignedIn(true);
                        fetchEvents();
                        fetchRelations();
                    }
                }).catch(error => console.error('Error initializing Google API', error));
            });
        }
        start();
    }, []);

    const fetchEvents = () => {
        gapi.client.calendar.events.list({
            calendarId: 'primary',
            timeMin: new Date().toISOString(),
            showDeleted: false,
            singleEvents: true,
            orderBy: 'startTime',
        }).then(response => {
            const events = response.result.items.map(event => ({
                id: event.id,
                title: event.summary,
                start: new Date(event.start.dateTime || event.start.date),
                end: new Date(event.end.dateTime || event.end.date),
                description: event.description,
                attendees: event.attendees || [],
            }));
            setEvents(events);
        }).catch(error => console.error('Error fetching events:', error));
    };

    const fetchRelations = () => {
        const userId = localStorage.getItem('id');
        fetch(`http://localhost:8000/activity/api/user-relations/?user_id=${userId}`)
        .then(response => response.json())
        .then(data => {
            console.log("Fetched relations data:", data); // Log the fetched data
            setRelations(data);
        })
        .catch(error => console.error("Error fetching relations:", error));
    };

    const handleCreateEvent = () => {
        let recurrenceRule = null;
        if (newEvent.recurrence !== 'none') {
            recurrenceRule = `RRULE:FREQ=${newEvent.recurrence.toUpperCase()}`;
        }

        const event = {
            summary: newEvent.title,
            description: newEvent.description,
            start: { dateTime: newEvent.start.toISOString(), timeZone: 'Europe/Paris' },
            end: { dateTime: newEvent.end.toISOString(), timeZone: 'Europe/Paris' },
            attendees: newEvent.guests.map(guest => ({ email: guest.value })),
            recurrence: recurrenceRule ? [recurrenceRule] : [],
        };

        gapi.client.calendar.events.insert({
            calendarId: 'primary',
            resource: event,
        }).then(response => {
            if (response && response.result) {
                fetchEvents();
                setIsModalOpen(false);
            } else {
                console.error('Unexpected API response:', response);
            }
        }).catch(error => {
            console.error('Error creating event:', error);
            if (error.result && error.result.error && error.result.error.errors) {
                const invalidEmailAddresses = error.result.error.errors
                    .filter(err => err.reason === 'invalid')
                    .map(err => err.message.match(/[\w\d._%+-]+@[\w\d.-]+\.[\w]{2,}/g)[0]);
                setInvalidEmails(invalidEmailAddresses);
                setError(true);
            }
        });
    };

    const handleUpdateEvent = () => {
        let recurrenceRule = null;
        if (newEvent.recurrence !== 'none') {
            recurrenceRule = `RRULE:FREQ=${newEvent.recurrence.toUpperCase()}`;
        }

        const event = {
            summary: newEvent.title,
            description: newEvent.description,
            start: { dateTime: newEvent.start.toISOString(), timeZone: 'Europe/Paris' },
            end: { dateTime: newEvent.end.toISOString(), timeZone: 'Europe/Paris' },
            attendees: newEvent.guests.map(guest => ({ email: guest.value })),
            recurrence: recurrenceRule ? [recurrenceRule] : [],
        };

        gapi.client.calendar.events.patch({
            calendarId: 'primary',
            eventId: selectedEvent.id,
            resource: event,
        }).then(response => {
            if (response && response.result) {
                fetchEvents();
                setIsModalOpen(false);
            } else {
                console.error('Unexpected API response:', response);
            }
        }).catch(error => {
            console.error('Error updating event:', error);
        });
    };

    const handleDeleteEvent = () => {
        if (selectedEvent) {
            gapi.client.calendar.events.delete({
                calendarId: 'primary',
                eventId: selectedEvent.id,
            }).then(() => {
                console.log('Event deleted successfully.');
                closeEventTooltip();
                fetchEvents();
            }).catch(error => {
                console.error('Error deleting event:', error);
            });
        }
    };

    const handleCreateWithoutInvalidEmails = () => {
        const validGuests = newEvent.guests.filter(guest => !invalidEmails.includes(guest.value));
        setNewEvent(prevEvent => ({ ...prevEvent, guests: validGuests }));
        setInvalidEmails([]);
        setError(false);
        handleCreateEvent();
    };

    const closeErrorModal = () => {
        setError(false);
        setInvalidEmails([]);
    };

    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setIsEventTooltipOpen(true);
    };

    const closeEventTooltip = () => {
        setSelectedEvent(null);
        setIsEventTooltipOpen(false);
    };

    const openModifyModal = () => {
        setNewEvent({
            title: selectedEvent.title,
            start: selectedEvent.start,
            end: selectedEvent.end,
            description: selectedEvent.description,
            guests: selectedEvent.attendees.map(attendee => ({ value: attendee.email, label: attendee.email })),
            recurrence: 'none', // Default to no recurrence
        });
        setIsModalOpen(true);
        setIsEventTooltipOpen(false);
    };

    const getTooltipPosition = () => {
        if (tooltipRef.current && selectedEvent) {
            const eventElement = document.querySelector(`[data-event-id='${selectedEvent.id}']`);
            if (eventElement) {
                const rect = eventElement.getBoundingClientRect();
                return {
                    top: rect.top + window.scrollY,
                    left: rect.left + window.scrollX + rect.width + 10,
                };
            }
        }
        return { top: 0, left: 0 };
    };

    const views = {
        week: {
            ...Views.Week,
            min: new Date().setHours(8, 0, 0), // Start at 8 AM
            max: new Date().setHours(19, 0, 0), // End at 7 PM
        },
        day: {
            ...Views.Day,
            min: new Date().setHours(8, 0, 0), // Start at 8 AM
            max: new Date().setHours(19, 0, 0), // End at 7 PM
        },
        agenda: Agenda,
    };

    return (
        <div className="calendar-container">
            {isSignedIn ? (
                <>
                    <div className="calendar-buttons">
                        <button onClick={signOut}>Se déconnecter</button>
                        <button onClick={() => setIsModalOpen(true)}>Créer un événement</button>
                    </div>

                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        className="react-big-calendar"
                        onSelectEvent={handleEventClick}
                        style={{
                            backgroundColor: 'white',
                            height: '80vh', // Set a height to enable scrolling
                        }}
                        eventPropGetter={(event) => ({
                            style: {
                                backgroundColor: event.color,
                            },
                            'data-event-id': event.id,
                        })}
                        views={views}
                    />

                    {/* Event Creation/Modification Modal */}
                    {isModalOpen && (
                        <>
                            <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}></div>
                            <div className="modal-content">
                                <h2>{selectedEvent ? 'Modifier un événement' : 'Créer un événement'}</h2>
                                <label>Titre:</label>
                                <input
                                    type="text"
                                    value={newEvent.title}
                                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                />

                                <label>Début:</label>
                                <input
                                    type="datetime-local"
                                    value={newEvent.start.toISOString().slice(0, 16)}
                                    onChange={(e) => setNewEvent({ ...newEvent, start: new Date(e.target.value) })}
                                />

                                <label>Fin:</label>
                                <input
                                    type="datetime-local"
                                    value={newEvent.end.toISOString().slice(0, 16)}
                                    onChange={(e) => setNewEvent({ ...newEvent, end: new Date(e.target.value) })}
                                />

                                <label>Description:</label>
                                <textarea
                                    value={newEvent.description}
                                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                />

                                <label>Participants:</label>
                                <div className="react-select-container">
                                    <Select
                                        isMulti
                                        options={relations.map(rel => ({
                                            value: rel.sender.email, // Use sender's email as the value
                                            label: `${rel.sender.name} (${rel.relation_type === 'school' ? 'professeur' : rel.relation_type})`
                                        }))}
                                        value={newEvent.guests}
                                        onChange={(selected) => setNewEvent({ ...newEvent, guests: selected })}
                                    />
                                </div>

                                <label>Récurrence:</label>
                                <select
                                    value={newEvent.recurrence}
                                    onChange={(e) => setNewEvent({ ...newEvent, recurrence: e.target.value })}
                                >
                                    <option value="none">Ne pas répéter</option>
                                    <option value="daily">Tous les jours</option>
                                    <option value="weekly">Toutes les semaines</option>
                                    <option value="monthly">Tous les mois</option>
                                </select>

                                <div className="button-container">
                                    <button onClick={selectedEvent ? handleUpdateEvent : handleCreateEvent}>
                                        {selectedEvent ? 'Modifier' : 'Enregistrer'}
                                    </button>
                                    <button onClick={() => setIsModalOpen(false)}>Annuler</button>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Event Tooltip */}
                    {isEventTooltipOpen && selectedEvent && (
                        <div
                            className="event-tooltip"
                            ref={tooltipRef}
                            style={getTooltipPosition()}
                        >
                            <div className="event-tooltip-content">
                                <h3>{selectedEvent.title}</h3>
                                <p>{selectedEvent.description}</p>
                                <p>Participants: {selectedEvent.attendees ? selectedEvent.attendees.map(attendee => attendee.email).join(', ') : 'None'}</p>
                                <button onClick={handleDeleteEvent}>Supprimer</button>
                                <button onClick={openModifyModal}>Modifier</button>
                                <button onClick={closeEventTooltip}>Fermer</button>
                            </div>
                        </div>
                    )}

                    {/* Error Modal */}
                    {error && (
                        <div className="error-modal">
                            <div className="error-modal-content">
                                <h3>Erreur de création d'événement</h3>
                                <p>Les adresses email suivantes ne sont pas valides :</p>
                                <ul>
                                    {invalidEmails.map((email, index) => (
                                        <li key={index}>{email}</li>
                                    ))}
                                </ul>
                                <div className="error-modal-buttons">
                                    <button onClick={handleCreateWithoutInvalidEmails}>Créer sans ces participants</button>
                                    <button onClick={closeErrorModal}>Annuler</button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <button onClick={() => gapi.auth2.getAuthInstance().signIn()}>Se connecter avec Google</button>
            )}
        </div>
    );
};

export default GoogleCalendarApp;
