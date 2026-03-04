// components/CourseOverview.jsx
import React, { useState } from 'react';

export default function CourseOverview({ masterSchedule, onToggleStatus }) {
  // Keeps track of which course folder is currently clicked open
  const [expandedCourse, setExpandedCourse] = useState(null);

  // 1. THE MATH ENGINE: Calculate how many days behind you are
  const getDaysBehind = (dateString) => {
    const [day, month] = dateString.split('/').map(Number);
    // Assuming 2026 based on your semester context
    const classDate = new Date(2026, month - 1, day); 
    const today = new Date(); // Gets the current date
    
    // Calculate the difference in time, then convert to days
    const diffTime = today - classDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
    
    return diffDays > 0 ? diffDays : 0; // If it's in the future, return 0
  };

  // 2. THE SORTER: Grouping the flat schedule into Courses -> Subclasses
  const courseData = masterSchedule.reduce((acc, session) => {
    // A. Create the main Course Object if it doesn't exist
    if (!acc[session.course]) {
      acc[session.course] = { 
        name: session.course, 
        totalDebt: 0, 
        subclasses: {}, 
        color: session.color || '#3b82f6' 
      };
    }
    
    // B. Create the Subclass (Lecture, Lab, etc.) inside the Course
    if (!acc[session.course].subclasses[session.type]) {
      acc[session.course].subclasses[session.type] = [];
    }

    // C. Put the class inside its specific subclass
    acc[session.course].subclasses[session.type].push(session);

    // D. Add to the debt counter if you missed it
    if (session.status === 'MISSED') {
      acc[session.course].totalDebt += 1;
    }

    return acc;
  }, {});

  // 3. DRAWING THE UI
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>Course Overview</h2>

      {/* Loop through all the created Course Objects */}
      {Object.values(courseData).map((course) => {
        const isCaughtUp = course.totalDebt === 0;

        return (
          <div key={course.name} style={{ marginBottom: '15px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            
            {/* The Main Course Header (Clickable) */}
            <div 
              onClick={() => setExpandedCourse(expandedCourse === course.name ? null : course.name)}
              style={{ 
                backgroundColor: isCaughtUp ? '#e9fce9' : '#fff0f0', // Green if caught up, Red tint if behind
                borderLeft: `8px solid ${course.color}`,
                padding: '15px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                cursor: 'pointer'
              }}
            >
              <h3 style={{ margin: 0, color: '#333' }}>{course.name}</h3>
              
              {/* The Debt Badge */}
              <div style={{ 
                backgroundColor: isCaughtUp ? '#28a745' : '#ff4d4d', 
                color: 'white', 
                padding: '5px 12px', 
                borderRadius: '20px', 
                fontWeight: 'bold' 
              }}>
                {isCaughtUp ? 'All Clear' : `${course.totalDebt} Behind`}
              </div>
            </div>

            {/* The Expanded View (Subclasses) */}
            {expandedCourse === course.name && (
              <div style={{ backgroundColor: '#fff', padding: '15px', border: '1px solid #ddd', borderTop: 'none' }}>
                
                {Object.keys(course.subclasses).map(subclassName => (
                  <div key={subclassName} style={{ marginBottom: '15px' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#555', borderBottom: '2px solid #eee' }}>
                      {subclassName}S
                    </h4>
                    
                    {/* The specific classes inside the subclass */}
                    {course.subclasses[subclassName].map(session => (
                      <div key={session.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', backgroundColor: session.status === 'MISSED' ? '#fff0f0' : '#f9f9f9', marginBottom: '4px', borderRadius: '4px' }}>
                        
                        <div>
                          <strong>{session.date}</strong> at {session.startTime} 
                          {session.status === 'MISSED' && (
                            <span style={{ color: '#ff4d4d', marginLeft: '10px', fontSize: '0.9em', fontWeight: 'bold' }}>
                              ({getDaysBehind(session.date)} days behind)
                            </span>
                          )}
                        </div>

                        {/* Manual UI Toggle Buttons */}
                        <div>
                          {session.status !== 'MISSED' ? (
                            <button onClick={() => onToggleStatus(session.id, 'MISSED')} style={{ backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8em' }}>
                              Mark Missed
                            </button>
                          ) : (
                            <button onClick={() => onToggleStatus(session.id, 'CAUGHT_UP')} style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8em' }}>
                              Catch Up
                            </button>
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
