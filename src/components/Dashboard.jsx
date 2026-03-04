import React from 'react';

export default function Dashboard({ masterSchedule }) {
  
  // 1. Crunching the Numbers
  const missedCount = masterSchedule.filter(session => session.status === 'MISSED').length;
  const caughtUpCount = masterSchedule.filter(session => session.status === 'CAUGHT_UP').length;
  const scheduledCount = masterSchedule.filter(session => session.status === 'SCHEDULED').length;
  
  const totalClasses = masterSchedule.length;
  
  // 2. Net Momentum (Positive is winning, Negative means falling behind)
  const netScore = caughtUpCount - missedCount;
  const scoreColor = netScore >= 0 ? '#28a745' : '#dc3545'; 
  const scoreMessage = netScore >= 0 ? 'You are beating the backlog!' : 'Time to lock in and grind.';

  // 3. Catch-up Rate (For the Progress Bar)
  const totalDebt = missedCount + caughtUpCount; 
  const catchUpPercentage = totalDebt === 0 ? 100 : Math.round((caughtUpCount / totalDebt) * 100);

  // 4. Drawing the Dashboard
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '20px auto', backgroundColor: '#f8f9fa', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
      
      <h2 style={{ textAlign: 'center', margin: '0 0 20px 0', color: '#333' }}>📊 Semester Command Center</h2>
      
      {/* Top Row: The Core Stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', gap: '15px' }}>
        
        {/* Upcoming Classes */}
        <div style={{ flex: 1, textAlign: 'center', padding: '15px', backgroundColor: '#fff', borderRadius: '8px', borderTop: '4px solid #3b82f6', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h4 style={{ margin: 0, color: '#666', fontSize: '0.9em', textTransform: 'uppercase' }}>Upcoming</h4>
          <p style={{ fontSize: '2em', fontWeight: 'bold', margin: '5px 0 0 0', color: '#3b82f6' }}>{scheduledCount}</p>
        </div>

        {/* Missed Classes (Debt) */}
        <div style={{ flex: 1, textAlign: 'center', padding: '15px', backgroundColor: '#fff', borderRadius: '8px', borderTop: '4px solid #ff4d4d', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h4 style={{ margin: 0, color: '#666', fontSize: '0.9em', textTransform: 'uppercase' }}>Active Debt</h4>
          <p style={{ fontSize: '2em', fontWeight: 'bold', margin: '5px 0 0 0', color: '#ff4d4d' }}>{missedCount}</p>
        </div>

        {/* Caught Up Classes */}
        <div style={{ flex: 1, textAlign: 'center', padding: '15px', backgroundColor: '#fff', borderRadius: '8px', borderTop: '4px solid #28a745', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h4 style={{ margin: 0, color: '#666', fontSize: '0.9em', textTransform: 'uppercase' }}>Cleared</h4>
          <p style={{ fontSize: '2em', fontWeight: 'bold', margin: '5px 0 0 0', color: '#28a745' }}>{caughtUpCount}</p>
        </div>

      </div>

      {/* Middle Row: The Progress Bar */}
      {totalDebt > 0 && (
        <div style={{ marginBottom: '20px', backgroundColor: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <strong style={{ color: '#555' }}>Backlog Recovery Rate</strong>
            <strong style={{ color: catchUpPercentage > 50 ? '#28a745' : '#ff4d4d' }}>{catchUpPercentage}%</strong>
          </div>
          {/* The actual bar */}
          <div style={{ width: '100%', backgroundColor: '#ff4d4d', height: '12px', borderRadius: '6px', overflow: 'hidden' }}>
            <div style={{ width: `${catchUpPercentage}%`, backgroundColor: '#28a745', height: '100%', transition: 'width 0.5s ease-in-out' }}></div>
          </div>
        </div>
      )}

      {/* Bottom Row: Net Momentum */}
      <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', border: `2px solid ${scoreColor}` }}>
        <h3 style={{ margin: 0, color: '#333' }}>Net Momentum: <span style={{ color: scoreColor, fontSize: '1.2em' }}>{netScore > 0 ? `+${netScore}` : netScore}</span></h3>
        <p style={{ margin: '8px 0 0 0', color: '#666', fontStyle: 'italic' }}>{scoreMessage}</p>
      </div>

    </div>
  );
}