// components/CourseOverview.jsx
import React, { useState } from 'react';

export default function CourseOverview({ masterSchedule, onToggleStatus }) {
  const [expandedCourse, setExpandedCourse] = useState(null);
  const now = new Date(); // The exact current time

  const getDaysBehind = (classDateObj) => {
    const diffTime = now - classDateObj;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // FIX: Filter out ANY class that is in the future!
  const pastClassesOnly = masterSchedule.filter(session => {
    const [day, month] = session.date.split('/').map(Number);
    const [hour, minute] = session.startTime.split(':').map(Number);
    // Assumes year is 2026 based on your schedule
    const classDateObj = new Date(2026, month - 1, day, hour, minute);

    // Attach the actual JS Date object to the session so we don't calculate it twice
    session.exactDateObj = classDateObj;

    return classDateObj <= now; // ONLY KEEP IT IF IT ALREADY HAPPENED
  });

  const courseData = pastClassesOnly.reduce((acc, session) => {
    if (!acc[session.course]) {
      acc[session.course] = { name: session.course, totalDebt: 0, subclasses: {}, color: session.color || '#3b82f6' };
    }
    if (!acc[session.course].subclasses[session.type]) {
      acc[session.course].subclasses[session.type] = [];
    }
    acc[session.course].subclasses[session.type].push(session);

    if (session.status === 'MISSED') acc[session.course].totalDebt += 1;

    return acc;
  }, {});

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>📚 Course Action Center (Past Classes)</h2>

      {Object.values(courseData).map((course) => {
        const isCaughtUp = course.totalDebt === 0;

        return (
          <div key={course.name} style={{ marginBottom: '15px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            <div
              onClick={() => setExpandedCourse(expandedCourse === course.name ? null : course.name)}
              style={{
                backgroundColor: isCaughtUp ? '#e9fce9' : '#fff0f0',
                borderLeft: `8px solid ${course.color}`,
                padding: '15px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer'
              }}
            >
              <h3 style={{ margin: 0, color: '#333' }}>{course.name}</h3>
              <div style={{ backgroundColor: isCaughtUp ? '#28a745' : '#ff4d4d', color: 'white', padding: '5px 12px', borderRadius: '20px', fontWeight: 'bold' }}>
                {isCaughtUp ? '✅ All Clear' : `🔥 ${course.totalDebt} Behind`}
              </div>
            </div>

            {expandedCourse === course.name && (
              <div style={{ backgroundColor: '#fff', padding: '15px', border: '1px solid #ddd', borderTop: 'none' }}>
                {Object.keys(course.subclasses).map(subclassName => (
                  <div key={subclassName} style={{ marginBottom: '15px' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#555', borderBottom: '2px solid #eee' }}>{subclassName}S</h4>

                    {course.subclasses[subclassName].map(session => (
                      <div key={session.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', backgroundColor: session.status === 'MISSED' ? '#fff0f0' : '#f9f9f9', marginBottom: '4px', borderRadius: '4px' }}>
                        <div>
                          <strong>{session.date}</strong> at {session.startTime}
                          {session.status === 'MISSED' && (
                            <span style={{ color: '#ff4d4d', marginLeft: '10px', fontSize: '0.9em', fontWeight: 'bold' }}>
                              ({getDaysBehind(session.exactDateObj)} days behind)
                            </span>
                          )}
                        </div>
                        <div>
                          {session.status !== 'MISSED' ? (
                            <button onClick={() => onToggleStatus(session.id, 'MISSED')} style={{ backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>Mark Missed</button>
                          ) : (
                            <button onClick={() => onToggleStatus(session.id, 'CAUGHT_UP')} style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>✅ Catch Up</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
