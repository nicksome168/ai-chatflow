// SummarizeMenu.js
import React, { useState } from 'react';
import '../css/summarize.css'; // This is your CSS file for styles

const SummarizeMenu = () => {
  const [summaryOption, setSummaryOption] = useState('all');

  const handleViewSummary = () => {
    // Logic to handle viewing summary
    console.log(`Viewing summary for: ${summaryOption}`);
  };

  const handleDownloadSummary = () => {
    // Logic to handle downloading summary
    console.log(`Downloading summary for: ${summaryOption}`);
  };

  return (
    <div className="summarize-container">
      <div className="summarize-header">SUMMARISE</div>
      <div className="radio-group">
        <label className="radio-label">
          <input
            type="radio"
            name="summaryOption"
            value="all"
            checked={summaryOption === 'all'}
            onChange={() => setSummaryOption('all')}
          />
          All
        </label>
        <label className="radio-label">
          <input
            type="radio"
            name="summaryOption"
            value="selected"
            checked={summaryOption === 'selected'}
            onChange={() => setSummaryOption('selected')}
          />
          Selected
        </label>
      </div>
      <div className="buttons-container">
        <button className="button" onClick={handleViewSummary}>View</button>
        <button className="button" onClick={handleDownloadSummary}>Download</button>
      </div>
    </div>
  );
};

export default SummarizeMenu;
