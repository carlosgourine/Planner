import React, { useState, useEffect } from 'react';
import CommandPrompt from './components/CommandPrompt';
import ToDoList from './components/ToDoList';
import FullCalendar from './components/FullCalendar';
import Dashboard from './components/Dashboard';
import CourseOverview from './components/CourseOverview';
import WeeklyAgenda from './components/WeeklyAgenda';
import { generateRecurringSessions } from './engine/ScheduleGenerator';
import { parseCommand } from './engine/Parser';

export default function App() {
  const [masterSchedule, setMasterSchedule] = useState([]);
  const [activeTab, setActiveTab] = useState('WEEK');
  const [resetKey, setResetKey] = useState(0);
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    const savedData = localStorage.getItem('kuLeuvenSchedule');
    if (savedData) {
      setMasterSchedule(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    if (masterSchedule.length > 0) {
      localStorage.setItem('kuLeuvenSchedule', JSON.stringify(masterSchedule));
    }
  }, [masterSchedule]);

  const handleCommandResult = (parsedCommands) => {
    let updatedSchedule = [...masterSchedule];

    parsedCommands.forEach(parsedData => {
      if (parsedData.action === "CREATE_SCHEDULE") {
        const newSessions = generateRecurringSessions(parsedData);
        updatedSchedule = [...updatedSchedule, ...newSessions];
      }
      else if (parsedData.action === "MARK_MISSED") {
        updatedSchedule = updatedSchedule.map(session =>
          (session.course === parsedData.course && session.date === parsedData.date && session.type === parsedData.type)
            ? { ...session, status: 'MISSED' } : session
        );
      }
      else if (parsedData.action === "MARK_CAUGHT_UP") {
        updatedSchedule = updatedSchedule.map(session =>
          (session.course === parsedData.course && session.date === parsedData.date && session.type === parsedData.type)
            ? { ...session, status: 'CAUGHT_UP' } : session
        );
      }
      else if (parsedData.action === "CANCEL_SESSION") {
        updatedSchedule = updatedSchedule.map(session =>
          (session.course === parsedData.course && session.date === parsedData.date && session.type === parsedData.type)
            ? { ...session, status: 'CANCELLED' } : session
        );
      }
      else if (parsedData.action === "DELETE_COURSE") {
        updatedSchedule = updatedSchedule.filter(session => session.course !== parsedData.course);
      }
    });

    setMasterSchedule(updatedSchedule);
  };

  const handleToggleStatus = (taskId, newStatus) => {
    setMasterSchedule(masterSchedule.map(session =>
      session.id === taskId ? { ...session, status: newStatus } : session
    ));
  };

  const jumpToToday = () => {
    setResetKey(prevKey => prevKey + 1);
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', backgroundColor: '#f0f2f5', minHeight: '100vh', paddingBottom: '100px' }}>

      {/* THIS HIDES THE UGLY SCROLLBARS */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* THIS IS THE INTERACTIVE POP-UP MODAL */}
      {selectedSession && (
        <div
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          onClick={() => setSelectedSession(null)}
        >
          <div
            style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', minWidth: '320px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}
            onClick={e => e.stopPropagation()}
          >
            <h2 style={{ margin: '0 0 15px 0', borderBottom: `4px solid ${selectedSession.color || '#3b82f6'}`, paddingBottom: '10px', color: '#333' }}>
              {selectedSession.status === 'MISSED' ? '🟠 ' : ''}{selectedSession.course}
            </h2>
            <div style={{ fontSize: '1.1em', color: '#555', lineHeight: '1.6' }}>
              <p style={{ margin: '5px 0' }}><strong>Type:</strong> {selectedSession.type}</p>
              <p style={{ margin: '5px 0' }}><strong>Date:</strong> {selectedSession.date}</p>
              <p style={{ margin: '5px 0' }}><strong>Time:</strong> {selectedSession.startTime} - {selectedSession.endTime}</p>

              <div style={{ marginTop: '15px', padding: '10px', borderRadius: '8px', backgroundColor: selectedSession.status === 'MISSED' ? '#fff0f0' : selectedSession.status === 'CAUGHT_UP' ? '#e9fce9' : '#f0f7ff' }}>
                <strong>Status: </strong>
                <span style={{ color: selectedSession.status === 'MISSED' ? '#dc3545' : selectedSession.status === 'CAUGHT_UP' ? '#28a745' : '#0056b3' }}>
                  {selectedSession.status === 'MISSED' ? 'Behind (Action Required)' : selectedSession.status === 'CAUGHT_UP' ? 'Caught Up' : 'Upcoming'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedSession(null)}
              style={{ marginTop: '20px', padding: '12px', width: '100%', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1em' }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* THE NEW TITLE */}
      <div style={{ backgroundColor: '#1a1a1a', color: 'white', padding: '20px', textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ margin: 0 }}>Student Tracker</h1>
      </div>

      <Dashboard masterSchedule={masterSchedule} />

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {activeTab !== 'OVERVIEW' && (
          <button onClick={jumpToToday} style={{ padding: '10px 20px', backgroundColor: '#fff', color: '#3b82f6', border: '2px solid #3b82f6', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', marginRight: '15px' }}>
            Today
          </button>
        )}
        <button onClick={() => setActiveTab('MONTH')} style={{ padding: '10px 20px', backgroundColor: activeTab === 'MONTH' ? '#3b82f6' : '#ddd', color: activeTab === 'MONTH' ? 'white' : '#333', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}>Monthly Grid</button>
        <button onClick={() => setActiveTab('WEEK')} style={{ padding: '10px 20px', backgroundColor: activeTab === 'WEEK' ? '#3b82f6' : '#ddd', color: activeTab === 'WEEK' ? 'white' : '#333', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}>Detailed Week</button>
        <button onClick={() => setActiveTab('OVERVIEW')} style={{ padding: '10px 20px', backgroundColor: activeTab === 'OVERVIEW' ? '#3b82f6' : '#ddd', color: activeTab === 'OVERVIEW' ? 'white' : '#333', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}>Course Overview</button>
      </div>

      {activeTab === 'MONTH' && <FullCalendar key={resetKey} masterSchedule={masterSchedule} onSessionClick={setSelectedSession} />}
      {activeTab === 'WEEK' && <WeeklyAgenda key={resetKey} masterSchedule={masterSchedule} onSessionClick={setSelectedSession} />}
      {activeTab === 'OVERVIEW' && <CourseOverview masterSchedule={masterSchedule} onToggleStatus={handleToggleStatus} />}

      <ToDoList masterSchedule={masterSchedule} onMarkCaughtUp={(id) => handleToggleStatus(id, 'CAUGHT_UP')} onDeleteTask={(id) => handleToggleStatus(id, 'DELETED')} />

      <div style={{ position: 'relative', zIndex: 1000 }}>
        <CommandPrompt onDataExtracted={handleCommandResult} />
      </div>

    </div>
  );
}
