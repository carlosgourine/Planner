import React from 'react';

export default function ToDoList({ masterSchedule, onMarkCaughtUp, onDeleteTask }) {
  
  // 1. THE FILTER
  // Look at the entire semester, but ONLY keep the classes marked as 'MISSED'
  const backlogTasks = masterSchedule.filter(session => session.status === 'MISSED');

  // 2. THE ORGANIZER
  // Group the missed classes by Course Name (Accordion style)
  const groupedTasks = backlogTasks.reduce((groups, task) => {
    if (!groups[task.course]) {
      groups[task.course] = [];
    }
    groups[task.course].push(task);
    return groups;
  }, {});

  // 3. THE REWARD STATE
  // If the filter finds 0 missed classes, show the success message!
  if (backlogTasks.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#28a745', backgroundColor: '#e9fce9', borderRadius: '8px', margin: '20px' }}>
        <h2>🎉 You are all caught up!</h2>
        <p>Your backlog is empty. Enjoy your free time!</p>
      </div>
    );
  }

  // 4. DRAWING THE ACTION CENTER
  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ borderBottom: '2px solid #ff4d4d', paddingBottom: '10px' }}>
        🔥 Your Backlog ({backlogTasks.length} pending)
      </h2>

      {/* Loop through each Course category */}
      {Object.keys(groupedTasks).map((courseName) => (
        <div key={courseName} style={{ marginBottom: '20px', border: '1px solid #ddd', borderRadius: '8px', padding: '15px', backgroundColor: '#fff' }}>
          
          <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>📚 {courseName}</h3>
          
          {/* Loop through the specific missed classes inside that Course */}
          {groupedTasks[courseName].map((task) => (
            <div key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#fff0f0', marginBottom: '8px', borderRadius: '6px', borderLeft: '4px solid #ff4d4d' }}>
              
              <div>
                <strong style={{ display: 'block', fontSize: '1.1em' }}>{task.type}</strong>
                <span style={{ color: '#666', fontSize: '0.9em' }}>Date: {task.date} | Time: {task.startTime || 'Ad-hoc'}</span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                {/* Check-off Button: Flips status to 'CAUGHT_UP' */}
                <button 
                  onClick={() => onMarkCaughtUp(task.id)}
                  style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  ✅ Done
                </button>
                
                {/* Delete Button: Erases it from existence */}
                <button 
                  onClick={() => onDeleteTask(task.id)}
                  style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  🗑️ Drop
                </button>
              </div>

            </div>
          ))}
        </div>
      ))}
    </div>
  );
}