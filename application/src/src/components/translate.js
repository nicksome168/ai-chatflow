import React, { useState } from 'react';
import '../css/login.css'

const TranslateMenu = ({ onClose }) => {
  const [fromLanguage, setFromLanguage] = useState('');
  const [toLanguage, setToLanguage] = useState('');

  const handleTranslate = () => {
    // Handle translation logic
    console.log('Translating from:', fromLanguage, 'to:', toLanguage);
    onClose(); // Close menu after translation
  };

  return (
    <div style={{ backgroundColor: 'white', padding: '20px' }}>
      <h2>TRANSLATE</h2>
      <div>
        <label>
          From
          <input type="text" value={fromLanguage} onChange={(e) => setFromLanguage(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          To
          <input type="text" value={toLanguage} onChange={(e) => setToLanguage(e.target.value)} />
        </label>
      </div>
      <button onClick={handleTranslate}>Translate</button>
    </div>
  );
};

export default TranslateMenu