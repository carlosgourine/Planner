// components/FullCalendar.jsx
import React, { useState } from 'react';
import { getDaysInMonth, getFirstDayOfMonth, formatDateForMatch } from '../utils/DateEngine';

export default function FullCalendar({ masterSchedule }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const today = new Date();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));

  const getClassColor = (cls) => {
    if (cls.status === 'MISSED') return '#ff4d4d';
    if (cls.status === 'CAUGHT_UP') return '#28a745';
    return cls.color || '#3b82f6';
  };

  const blanks = Array.from({ length: firstDay === 0 ? 6 : firstDay - 1 }).map((_, i) => (
    <div key={`blank-${i}`} style={{ backgroundColor: '#f9f9f9', minHeight: '120px' }}></div>
  ));

  const days = Array.from({ length: daysInMonth }).map((_, i) => {
    const dayNumber = i + 1;
    const dateString = formatDateForMatch(dayNumber, month);
    const classesToday = masterSchedule.filter(session => session.date === dateString);

    const isToday = today.getDate() === dayNumber && today.getMonth() === month && today.getFullYear() === year;

    return (
      <div
        key={dayNumber}
        style={{
          backgroundColor: isToday ? '#eff6ff' : '#ffffff',
          border: isToday ? '3px solid #3b82f6' : '1px solid #ddd',
          minHeight: '120px',
          padding: '5px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        <div style={{ fontWeight: 'bold', color: isToday ? '#3b82f6' : '#555', marginBottom: '5px', textAlign: 'right' }}>
          {dayNumber}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
          {classesToday.map(cls => (
            <div
              key={cls.id}
              style={{
                backgroundColor: getClassColor(cls),
                color: 'white',
                fontSize: '0.75em',
                padding: '4px 6px',
                borderRadius: '4px',
                whiteSpace: 'nowrap',
                overflowX: 'auto',
                overflowY: 'hidden'
              }}
            >
              <strong>{cls.startTime}</strong> {cls.course}
            </div>
          ))}
        </div>
      </div>
    );
  });

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', backgroundColor: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <button onClick={prevMonth} style={{ padding: '8px 16px', cursor: 'pointer', border: 'none', backgroundColor: '#eee', borderRadius: '4px' }}>&lt; Prev</button>
        <h2 style={{ margin: 0 }}>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
        <button onClick={nextMonth} style={{ padding: '8px 16px', cursor: 'pointer', border: 'none', backgroundColor: '#eee', borderRadius: '4px' }}>Next &gt;</button>
      </div>

      <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid #ddd' }}>
        <div style={{ minWidth: '900px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontWeight: 'bold', padding: '10px 0', backgroundColor: '#f0f2f5', color: '#666', borderBottom: '1px solid #ddd' }}>
            <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', backgroundColor: '#ddd' }}>
            {blanks}
            {days}
          </div>
        </div>
      </div>
    </div>
  );
}
