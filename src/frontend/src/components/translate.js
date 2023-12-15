// TranslateMenu.js
import React, { useState } from 'react';
import '../css/translate.css'; // Make sure the path to your CSS file is correct

const TranslateMenu = ({ onClose }) => {
  const [fromLanguage, setFromLanguage] = useState('');
  const [toLanguage, setToLanguage] = useState('');

  const handleTranslate = () => {
    console.log(`Translating from ${fromLanguage} to ${toLanguage}`);
    // Translation logic goes here
    onClose(); // Close the TranslateMenu
  };

  return (
    <div className="menu-container">
      <div className="menu-header">TRANSLATE</div>
      <div className="input-group">
        <label className="label">From</label>
        <input
          className="input"
          type="text"
          value={fromLanguage}
          onChange={(e) => setFromLanguage(e.target.value)}
        />
      </div>
      <div className="input-group">
        <label className="label">To</label>
        <input
          className="input"
          type="text"
          value={toLanguage}
          onChange={(e) => setToLanguage(e.target.value)}
        />
      </div>
      <button className="button" onClick={handleTranslate}>Translate</button>
    </div>
  );
};

export default TranslateMenu;

