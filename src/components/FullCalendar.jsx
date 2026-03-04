import React, { useState } from 'react';
import { getDaysInMonth, getFirstDayOfMonth, formatDateForMatch } from '../utils/DateEngine';

export default function FullCalendar({ masterSchedule }) {
  // Start the calendar in February 2026 (when your semester screenshots started)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 1)); // 1 = February

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // Navigation
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));

  // The Color Engine for individual class blocks
  const getClassColor = (status) => {
    if (status === 'MISSED') return '#ff4d4d'; // Red: Needs your attention!
    if (status === 'CAUGHT_UP') return '#28a745'; // Green: You handled it.
    return '#3b82f6'; // Blue: Standard upcoming or attended class
  };

  // Generate the blank boxes before the 1st of the month
  const blanks = Array.from({ length: firstDay === 0 ? 6 : firstDay - 1 }).map((_, i) => (
    <div key={`blank-${i}`} style={{ backgroundColor: '#f9f9f9', minHeight: '100px' }}></div>
  ));

  // Generate the actual days of the month
  const days = Array.from({ length: daysInMonth }).map((_, i) => {
    const dayNumber = i + 1;
    const dateString = formatDateForMatch(dayNumber, month);
    
    // FILTER: Find all classes from the master schedule that land on this exact day
    const classesToday = masterSchedule.filter(session => session.date === dateString);
    
    return (
      <div 
        key={dayNumber} 
        style={{ 
          backgroundColor: '#ffffff',
          border: '1px solid #eee',
          minHeight: '100px',
          padding: '5px',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* The Day Number */}
        <div style={{ fontWeight: 'bold', color: '#555', marginBottom: '5px' }}>
          {dayNumber}
        </div>

        {/* Loop through and draw the actual classes for this day */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
          {classesToday.map(cls => (
            <div 
              key={cls.id}
              style={{
                backgroundColor: getClassColor(cls.status),
                color: 'white',
                fontSize: '0.75em',
                padding: '4px',
                borderRadius: '4px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
              title={`${cls.course} (${cls.type})`} // Shows full name if you hover
            >
              <strong>{cls.startTime}</strong> {cls.course}
            </div>
          ))}
        </div>

      </div>
    );
  });

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Calendar Header with Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', backgroundColor: '#fff', padding: '10px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <button onClick={prevMonth} style={{ padding: '8px 16px', cursor: 'pointer', border: 'none', backgroundColor: '#eee', borderRadius: '4px' }}>◀ Prev</button>
        <h2 style={{ margin: 0 }}>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
        <button onClick={nextMonth} style={{ padding: '8px 16px', cursor: 'pointer', border: 'none', backgroundColor: '#eee', borderRadius: '4px' }}>Next ▶</button>
      </div>

      {/* Days of the Week Header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontWeight: 'bold', marginBottom: '5px', color: '#666' }}>
        <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
      </div>

      {/* The Calendar Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', backgroundColor: '#ddd', border: '1px solid #ddd' }}>
        {blanks}
        {days}
      </div>

    </div>
  );
}