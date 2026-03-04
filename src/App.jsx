import React, { useState } from 'react';
import CommandPrompt from './components/CommandPrompt';
import ToDoList from './components/ToDoList';
import FullCalendar from './components/FullCalendar';
import Dashboard from './components/Dashboard';
import CourseOverview from './components/CourseOverview';
import WeeklyAgenda from './components/WeeklyAgenda';
import { generateRecurringSessions } from './engine/ScheduleGenerator';

export default function App() {
  const [masterSchedule, setMasterSchedule] = useState([]);
  const [activeTab, setActiveTab] = useState('WEEK');

  // 2. THE COMMAND DIRECTOR
  // This listens to your text prompt and decides what to do with the data.
  const handleCommandResult = (parsedCommands) => {
    let updatedSchedule = [...masterSchedule];

    // Loop through every command in the batch
    parsedCommands.forEach((parsedData) => {
      if (parsedData.action === "CREATE_SCHEDULE") {
        const newSessions = generateRecurringSessions(parsedData);
        updatedSchedule = [...updatedSchedule, ...newSessions];
      }

      else if (parsedData.action === "MARK_MISSED") {
        let classFoundInSchedule = false;

        updatedSchedule = updatedSchedule.map(session => {
          if (
            session.course === parsedData.course &&
            session.date === parsedData.date &&
            session.type === parsedData.type
          ) {
            classFoundInSchedule = true;
            return { ...session, status: 'MISSED' };
          }
          return session;
        });

        if (!classFoundInSchedule) {
          updatedSchedule.push({
            id: `${parsedData.course}-${parsedData.date}-adhoc`,
            course: parsedData.course,
            type: parsedData.type,
            date: parsedData.date,
            status: 'MISSED'
          });
        }
      }

      else if (parsedData.action === "MARK_CAUGHT_UP") {
        let classFoundInSchedule = false;

        updatedSchedule = updatedSchedule.map(session => {
          if (
            session.course === parsedData.course &&
            session.date === parsedData.date &&
            session.type === parsedData.type
          ) {
            classFoundInSchedule = true;
            return { ...session, status: 'CAUGHT_UP' };
          }
          return session;
        });

        if (!classFoundInSchedule) {
          updatedSchedule.push({
            id: `${parsedData.course}-${parsedData.date}-adhoc-caughtup`,
            course: parsedData.course,
            type: parsedData.type,
            date: parsedData.date,
            status: 'CAUGHT_UP'
          });
        }
      }

      else if (parsedData.action === "CANCEL_SESSION") {
        updatedSchedule = updatedSchedule.map(session => {
          if (
            session.course === parsedData.course &&
            session.date === parsedData.date &&
            session.type === parsedData.type
          ) {
            return { ...session, status: 'CANCELLED' };
          }
          return session;
        });
      }

      else if (parsedData.action === "DELETE_COURSE") {
        updatedSchedule = updatedSchedule.filter(
          session => session.course !== parsedData.course
        );
      }
    });

    // Save the database once all batch commands are processed
    setMasterSchedule(updatedSchedule);
  };

  // 3. THE ACTION HANDLERS (For UI toggles)
  const handleToggleStatus = (taskId, newStatus) => {
    setMasterSchedule(masterSchedule.map(session =>
      session.id === taskId ? { ...session, status: newStatus } : session
    ));
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', backgroundColor: '#f0f2f5', minHeight: '100vh', paddingBottom: '100px' }}>
      
      <div style={{ backgroundColor: '#1a1a1a', color: 'white', padding: '20px', textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ margin: 0 }}>KU Leuven Tracker</h1>
      </div>

      {/* 1. The Dashboard (Top) */}
      <Dashboard masterSchedule={masterSchedule} />

      {/* 2. The Tab Switcher */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('MONTH')}
          style={{ padding: '10px 20px', backgroundColor: activeTab === 'MONTH' ? '#3b82f6' : '#ddd', color: activeTab === 'MONTH' ? 'white' : '#333', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Monthly Grid
        </button>
        <button
          onClick={() => setActiveTab('WEEK')}
          style={{ padding: '10px 20px', backgroundColor: activeTab === 'WEEK' ? '#3b82f6' : '#ddd', color: activeTab === 'WEEK' ? 'white' : '#333', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Detailed Week
        </button>
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          style={{ padding: '10px 20px', backgroundColor: activeTab === 'OVERVIEW' ? '#3b82f6' : '#ddd', color: activeTab === 'OVERVIEW' ? 'white' : '#333', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Course Overview
        </button>
      </div>

      {/* 3. Calendar, Weekly Agenda, or Overview */}
      {activeTab === 'MONTH' && <FullCalendar masterSchedule={masterSchedule} />}
      {activeTab === 'WEEK' && <WeeklyAgenda masterSchedule={masterSchedule} />}
      {activeTab === 'OVERVIEW' && <CourseOverview masterSchedule={masterSchedule} onToggleStatus={handleToggleStatus} />}

      {/* 4. The To-Do List (Bottom) */}
      <ToDoList 
        masterSchedule={masterSchedule} 
        onMarkCaughtUp={(id) => handleToggleStatus(id, 'CAUGHT_UP')}
        onDeleteTask={(id) => handleToggleStatus(id, 'DELETED')}
      />

      {/* 5. The Command Prompt (Fixed to the very bottom of the screen) */}
      <CommandPrompt onDataExtracted={handleCommandResult} />

    </div>
  );
}
