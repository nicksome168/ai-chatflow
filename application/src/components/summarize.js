import React, { useState } from 'react';

const SummarizeMenu = ({ onClose }) => {
  const [summaryOption, setSummaryOption] = useState('all');

  const handleViewSummary = () => {
    // Handle view summary logic
    console.log('Viewing summary for:', summaryOption);
  };

  const handleDownloadSummary = () => {
    // Handle download summary logic
    console.log('Downloading summary for:', summaryOption);
    onClose(); // Close menu after downloading
  };

  return (
    <div style={{ backgroundColor: 'white', padding: '20px' }}>
      <h2>SUMMARISE</h2>
      <div>
        <label>
          <input
            type="radio"
            name="summaryOption"
            value="all"
            checked={summaryOption === 'all'}
            onChange={(e) => setSummaryOption(e.target.value)}
          />
          All
        </label>
        <label>
          <input
            type="radio"
            name="summaryOption"
            value="selected"
            checked={summaryOption === 'selected'}
            onChange={(e) => setSummaryOption(e.target.value)}
          />
          Selected
        </label>
      </div>
      <button onClick={handleViewSummary}>View</button>
      <button onClick={handleDownloadSummary}>Download</button>
    </div>
  );
};

export default SummarizeMenu