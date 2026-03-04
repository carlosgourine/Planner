import React, { useState } from 'react';
import CommandPrompt from './components/CommandPrompt';
import ToDoList from './components/ToDoList';
import FullCalendar from './components/FullCalendar';
import Dashboard from './components/Dashboard';
import { generateRecurringSessions } from './engine/ScheduleGenerator';

export default function App() {
  const [masterSchedule, setMasterSchedule] = useState([]);

  // 2. THE COMMAND DIRECTOR
  // This listens to your text prompt and decides what to do with the data.
  const handleCommandResult = (parsedData) => {
    
    // SCENARIO A: You scheduled a new recurring course
    if (parsedData.action === "CREATE_SCHEDULE") {
      // 1. Ask the generator to build all the individual class objects
      const newSessions = generateRecurringSessions(parsedData);
      
      // 2. Add them to our master database
      setMasterSchedule([...masterSchedule, ...newSessions]);
    }
    
    // SCENARIO B: You missed a class
    else if (parsedData.action === "MARK_MISSED") {
      let classFoundInSchedule = false;

      // 1. Look through the entire schedule to find the exact class you missed
      const updatedSchedule = masterSchedule.map(session => {
        if (
          session.course === parsedData.course && 
          session.date === parsedData.date && 
          session.type === parsedData.type
        ) {
          classFoundInSchedule = true;
          // Change its status from 'SCHEDULED' to 'MISSED'
          return { ...session, status: 'MISSED' }; 
        }
        return session;
      });

      // 2. What if you log a missed class that wasn't on the calendar? (Ad-hoc)
      if (!classFoundInSchedule) {
        updatedSchedule.push({
          id: `${parsedData.course}-${parsedData.date}-adhoc`,
          course: parsedData.course,
          type: parsedData.type,
          date: parsedData.date,
          status: 'MISSED' // Instantly marked as missed
        });
      }

      // 3. Save the updated database
      setMasterSchedule(updatedSchedule);
    }
  };

  // 3. THE ACTION HANDLERS (For the To-Do List)
  const handleMarkCaughtUp = (taskId) => {
    setMasterSchedule(masterSchedule.map(session => 
      session.id === taskId ? { ...session, status: 'CAUGHT_UP' } : session
    ));
  };

  const handleDeleteTask = (taskId) => {
    setMasterSchedule(masterSchedule.filter(session => session.id !== taskId));
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', backgroundColor: '#f0f2f5', minHeight: '100vh', paddingBottom: '100px' }}>
      
      <div style={{ backgroundColor: '#1a1a1a', color: 'white', padding: '20px', textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ margin: 0 }}>KU Leuven Tracker</h1>
      </div>

      {/* 1. The Dashboard (Top) */}
      <Dashboard masterSchedule={masterSchedule} />

      {/* 2. The Calendar (Middle) */}
      <FullCalendar masterSchedule={masterSchedule} />

      {/* 3. The To-Do List (Bottom) */}
      <ToDoList 
        masterSchedule={masterSchedule} 
        onMarkCaughtUp={handleMarkCaughtUp} 
        onDeleteTask={handleDeleteTask} 
      />

      {/* 4. The Command Prompt (Fixed to the very bottom of the screen) */}
      <CommandPrompt onDataExtracted={handleCommandResult} />

    </div>
  );
}