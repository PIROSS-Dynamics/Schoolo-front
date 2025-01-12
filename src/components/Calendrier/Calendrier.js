import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../css/Calendar/Calendar.css';


// import '@schedule-x/theme-shadcn/dist/index.css' //theme : black
// on peut définir des couleurs differentes pour chaque matière, mais il faut en créer une pour chaqu'une

import { ScheduleXCalendar,useCalendarApp } from '@schedule-x/react';
import { createViewWeek, createViewMonthGrid, createViewMonthAgenda } from '@schedule-x/calendar';
import { createEventsServicePlugin } from '@schedule-x/events-service';
import { createEventModalPlugin } from '@schedule-x/event-modal';
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop';
import { createViewDay } from '@schedule-x/calendar';
import '@schedule-x/theme-default/dist/calendar.css'
import { createScrollControllerPlugin } from '@schedule-x/scroll-controller'
import { createCurrentTimePlugin } from '@schedule-x/current-time'


function Calendar() {

  const calendar = useCalendarApp({
    views: [createViewDay(), createViewMonthAgenda(),createViewWeek(), createViewMonthGrid()],
    events: [
      {
        id: '1',
        title: 'Event 1',
        start: '2025-01-13 10:22',
        end: '2025-01-13 12:22',
        description:"Pourquoi t'a clické sur cet événement Piravine?",
        people:["Hossein","Romain sans Thomas","Ronon!","Pire"]
      },
    ],
    plugins: [
      createEventsServicePlugin(),
      createEventModalPlugin(),
      createDragAndDropPlugin(),
      createScrollControllerPlugin({initialScroll : '08:00'}),
      createCurrentTimePlugin({fullWeekWidth: true})
    ],
    // theme: 'shadcn' theme : black
  })

  return (
      <div>
      <ScheduleXCalendar calendarApp={calendar} />
      </div>
  )
}
 
export default Calendar;