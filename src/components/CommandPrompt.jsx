import React, { useState } from 'react';
import { parseCommand } from '../engine/Parser';

export default function CommandPrompt({ onDataExtracted }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const parsed = parseCommand(text);
    onDataExtracted(parsed);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ position: 'fixed', bottom: 0, width: '100%', background: '#fff', padding: '10px', boxShadow: '0 -2px 5px rgba(0,0,0,0.1)' }}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder='Type command here...'
        style={{ width: '80%', padding: '8px' }}
      />
      <button type="submit" style={{ padding: '8px 12px', marginLeft: '8px' }}>Go</button>
    </form>
  );
}