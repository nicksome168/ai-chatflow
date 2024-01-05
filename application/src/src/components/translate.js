import React, { useState } from 'react';

const TranslateMenu = ({ onClose}) => {
  const [fromLanguage, setFromLanguage] = useState('');
  const [toLanguage, setToLanguage] = useState('');
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');

  const OPENAI_API_KEY = "****";

  const handleTranslate = async () => {
    const OPENAI_ENDPOINT = 'https://api.openai.com/v1/translations';

    try {
      const response = await fetch(OPENAI_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          prompt: `Translate the following text from ${fromLanguage} to ${toLanguage}: ${inputText}`,
          max_tokens: 100
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      setTranslatedText(responseData.choices[0].text);
      onClose(); // Close menu after translation
    } catch (error) {
      console.error('Error during translation:', error);
    }
  };

  return (
    <div style={{ backgroundColor: 'white', padding: '20px' }}>
      <h2>TRANSLATE</h2>
      <div>
        <label>
          From
          <select value={fromLanguage} onChange={(e) => setFromLanguage(e.target.value)}>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          To
          <select value={toLanguage} onChange={(e) => setToLanguage(e.target.value)}>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
        </label>
      </div>
      <div>
        <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} />
      </div>
      <button onClick={handleTranslate}>Translate</button>
      {translatedText && (
        <div>
          <strong>Translated Text:</strong>
          <p>{translatedText}</p>
        </div>
      )}
    </div>
  );
};

export default TranslateMenu;
