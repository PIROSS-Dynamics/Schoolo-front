import '../../css/Calendar.css'; // Assuming you have a CSS file to style the week selector

import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import axios from 'axios';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Initialize moment localizer for react-big-calendar
const localizer = momentLocalizer(moment);

const CalendarComponent = ({ userId }) => {
  const [events, setEvents] = useState([]);

  // Fetch events/tasks data from the backend API using `userId`
  useEffect(() => {
    if (userId) {  // Ensure `userId` is defined before making the request
      axios.get(`http://127.0.0.1:8000/api/tasks/?user=${userId}`)
        .then(response => {
          // Map the tasks to events compatible with `react-big-calendar`
          const tasks = response.data.map(task => ({
            title: task.title,
            start: new Date(`${task.realization_date}T${task.start_hour}`),
            end: new Date(`${task.realization_date}T${task.end_hour}`),
            allDay: false,
          }));
          setEvents(tasks);
        })
        .catch(error => {
          console.error("There was an error fetching the tasks:", error);
        });
    } else {
      console.warn("User ID is not defined.");
    }
  }, [userId]);

  return (
    <div>
      <h2>Calendrier Hebdomadaire</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 800 }}
      />
    </div>
  );
};

export default CalendarComponent;
