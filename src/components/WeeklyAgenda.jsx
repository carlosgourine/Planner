// components/WeeklyAgenda.jsx
import React, { useState } from 'react';

export default function WeeklyAgenda({ masterSchedule }) {
  // Start the calendar on a specific week (e.g., Feb 9, 2026, a Monday)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 9));

  // --- DATE MATH ENGINE ---
  // Get the Monday of the currently selected week
  const getMonday = (d) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust if Sunday
    return new Date(date.setDate(diff));
  };

  const currentMonday = getMonday(currentDate);

  // Generate an array of the 7 days for the current week
  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(currentMonday);
    d.setDate(currentMonday.getDate() + i);
    return {
      dateObj: d,
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      // Format to DD/MM to match our masterSchedule
      matchString: `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`
    };
  });

  // Navigation
  const prevWeek = () => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7)));
  const nextWeek = () => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7)));

  // --- TIME MATH ENGINE (For drawing the blocks) ---
  const START_HOUR = 8;
  const PIXELS_PER_HOUR = 60; // 1 minute = 1 pixel

  // Converts "14:30" into a decimal number like 14.5
  const timeToDecimal = (timeStr) => {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours + (minutes / 60);
  };

  // Generate the background grid hours (08:00 to 18:00)
  const hoursGrid = Array.from({ length: 11 }).map((_, i) => START_HOUR + i);

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>

      {/* HEADER: Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button onClick={prevWeek} style={{ padding: '8px 16px', cursor: 'pointer' }}>◀ Previous Week</button>
        <h2 style={{ margin: 0 }}>
          Week of {weekDays[0].matchString} - {weekDays[6].matchString}
        </h2>
        <button onClick={nextWeek} style={{ padding: '8px 16px', cursor: 'pointer' }}>Next Week ▶</button>
      </div>

      {/* THE GRID CONTAINER */}
      <div style={{ display: 'flex', border: '1px solid #ddd', backgroundColor: '#fafafa', position: 'relative' }}>

        {/* Y-AXIS: The Hours Column */}
        <div style={{ width: '60px', borderRight: '1px solid #ddd', backgroundColor: '#fff', zIndex: 2 }}>
          <div style={{ height: '50px', borderBottom: '1px solid #ddd' }}></div> {/* Empty corner for days header */}
          {hoursGrid.map(hour => (
            <div key={hour} style={{ height: `${PIXELS_PER_HOUR}px`, borderBottom: '1px solid #eee', textAlign: 'right', paddingRight: '5px', fontSize: '0.8em', color: '#888' }}>
              {hour}:00
            </div>
          ))}
        </div>

        {/* X-AXIS: The Days Columns */}
        {weekDays.map((day, index) => {

          // Filter classes for this specific day
          const todaysClasses = masterSchedule.filter(session => session.date === day.matchString);

          return (
            <div key={index} style={{ flex: 1, borderRight: '1px solid #ddd', position: 'relative' }}>

              {/* Day Header */}
              <div style={{ height: '50px', borderBottom: '1px solid #ddd', textAlign: 'center', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <strong style={{ color: '#333' }}>{day.dayName}</strong>
                <span style={{ fontSize: '0.85em', color: '#666' }}>{day.matchString}</span>
              </div>

              {/* The absolute positioning area for class blocks */}
              <div style={{ position: 'relative', height: `${hoursGrid.length * PIXELS_PER_HOUR}px` }}>

                {todaysClasses.map(session => {
                  const startDec = timeToDecimal(session.startTime);
                  const endDec = timeToDecimal(session.endTime);

                  // Calculate exactly where the box should be drawn
                  const topPosition = (startDec - START_HOUR) * PIXELS_PER_HOUR;
                  const boxHeight = (endDec - startDec) * PIXELS_PER_HOUR;

                  return (
                    <div
                      key={session.id}
                      style={{
                        position: 'absolute',
                        top: `${topPosition}px`,
                        height: `${boxHeight}px`,
                        left: '2px',
                        right: '2px',
                        backgroundColor: session.status === 'MISSED' ? '#ff4d4d' : (session.color || '#3b82f6'),
                        color: 'white',
                        padding: '4px',
                        borderRadius: '4px',
                        fontSize: '0.75em',
                        overflow: 'hidden',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        borderLeft: session.status === 'MISSED' ? '4px solid darkred' : 'none',
                        opacity: session.status === 'CAUGHT_UP' ? 0.6 : 1 // Fade it slightly if caught up
                      }}
                    >
                      <strong>{session.startTime} - {session.endTime}</strong><br />
                      {session.course}<br />
                      <span style={{ opacity: 0.8 }}>{session.type}</span>
                    </div>
                  );
                })}

              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}
