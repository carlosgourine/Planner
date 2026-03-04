// components/WeeklyAgenda.jsx
import React, { useState, useEffect } from 'react';

export default function WeeklyAgenda({ masterSchedule }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getMonday = (d) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  };

  const currentMonday = getMonday(currentDate);

  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(currentMonday);
    d.setDate(currentMonday.getDate() + i);
    return {
      dateObj: d,
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      matchString: `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`
    };
  });

  const prevWeek = () => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7)));
  const nextWeek = () => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7)));

  const START_HOUR = 7;
  const PIXELS_PER_HOUR = 60;

  const timeToDecimal = (timeStr) => {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours + (minutes / 60);
  };

  const calculateOverlaps = (sessions) => {
    const sorted = [...sessions].sort((a, b) => timeToDecimal(a.startTime) - timeToDecimal(b.startTime));
    let columns = [];
    sorted.forEach(session => {
      let placed = false;
      for (let i = 0; i < columns.length; i++) {
        const lastInCol = columns[i][columns[i].length - 1];
        if (timeToDecimal(lastInCol.endTime) <= timeToDecimal(session.startTime)) {
          columns[i].push(session);
          session.colIndex = i;
          placed = true;
          break;
        }
      }
      if (!placed) {
        session.colIndex = columns.length;
        columns.push([session]);
      }
    });

    sorted.forEach(session => {
      session.totalCols = columns.length;
    });
    return sorted;
  };

  const hoursGrid = Array.from({ length: 13 }).map((_, i) => START_HOUR + i);

  const currentDec = now.getHours() + (now.getMinutes() / 60);
  const timeLineTop = (currentDec - START_HOUR) * PIXELS_PER_HOUR;
  const isCurrentWeek = weekDays.some(d => d.dateObj.toDateString() === now.toDateString());

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button onClick={prevWeek} style={{ padding: '8px 16px', cursor: 'pointer' }}>&lt; Prev Week</button>
        <h2 style={{ margin: 0 }}>Week of {weekDays[0].matchString} - {weekDays[6].matchString}</h2>
        <button onClick={nextWeek} style={{ padding: '8px 16px', cursor: 'pointer' }}>Next Week &gt;</button>
      </div>

      <div style={{ overflowX: 'auto', border: '1px solid #ddd', backgroundColor: '#fafafa', position: 'relative' }}>

        <div style={{ display: 'flex', minWidth: '900px' }}>

          <div style={{ width: '60px', borderRight: '1px solid #ddd', backgroundColor: '#fff', zIndex: 10 }}>
            <div style={{ height: '50px', borderBottom: '1px solid #ddd' }}></div>
            {hoursGrid.map(hour => (
              <div key={hour} style={{ height: `${PIXELS_PER_HOUR}px`, borderBottom: '1px solid #eee', textAlign: 'right', paddingRight: '5px', fontSize: '0.8em', color: '#888' }}>
                {hour}:00
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flex: 1, position: 'relative' }}>

            {isCurrentWeek && currentDec >= START_HOUR && currentDec <= 20 && (
              <div style={{ position: 'absolute', top: `${timeLineTop + 50}px`, left: 0, right: 0, height: '2px', backgroundColor: '#b020a2', zIndex: 5 }}>
                <span style={{ position: 'absolute', left: '-45px', top: '-8px', fontSize: '10px', color: '#b020a2', backgroundColor: '#fff', padding: '0 2px' }}>
                  {now.getHours()}:{String(now.getMinutes()).padStart(2, '0')}
                </span>
              </div>
            )}

            {weekDays.map((day, index) => {
              const rawClasses = masterSchedule.filter(session => session.date === day.matchString);
              const todaysClasses = calculateOverlaps(rawClasses);
              const isToday = day.dateObj.toDateString() === now.toDateString();

              return (
                <div key={index} style={{ flex: 1, borderRight: '1px solid #ddd', position: 'relative', backgroundColor: isToday ? '#f4f9ff' : 'transparent' }}>

                  <div style={{ height: '50px', borderBottom: isToday ? '3px solid #3b82f6' : '1px solid #ddd', textAlign: 'center', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <strong style={{ color: isToday ? '#3b82f6' : '#333' }}>{day.dayName} {day.dateObj.getDate()}</strong>
                  </div>

                  <div style={{ position: 'relative', height: `${hoursGrid.length * PIXELS_PER_HOUR}px` }}>
                    {todaysClasses.map(session => {
                      const startDec = timeToDecimal(session.startTime);
                      const endDec = timeToDecimal(session.endTime);
                      const topPosition = (startDec - START_HOUR) * PIXELS_PER_HOUR;
                      const boxHeight = (endDec - startDec) * PIXELS_PER_HOUR;

                      const widthPct = 100 / session.totalCols;
                      const leftPos = widthPct * session.colIndex;

                      return (
                        <div
                          key={session.id}
                          style={{
                            position: 'absolute',
                            top: `${topPosition}px`,
                            height: `${boxHeight}px`,
                            width: `calc(${widthPct}% - 4px)`,
                            left: `calc(${leftPos}% + 2px)`,
                            backgroundColor: session.status === 'MISSED' ? '#ff4d4d' : (session.color || '#e2e8f0'),
                            color: '#fff',
                            padding: '6px',
                            borderRadius: '4px',
                            fontSize: '0.75em',
                            overflow: 'auto',
                            wordBreak: 'break-word',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                            zIndex: 2,
                            border: session.status === 'MISSED' ? '2px solid darkred' : '1px solid rgba(0,0,0,0.1)'
                          }}
                        >
                          <strong style={{ display: 'block', marginBottom: '4px' }}>{session.course}</strong>
                          <span style={{ opacity: 0.9 }}>{session.type} <br /> ({session.startTime})</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
