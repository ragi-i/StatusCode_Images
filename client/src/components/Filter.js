import React, { useState } from 'react';

const FilterComponent = ({ allData, setFilteredData }) => {
  const [filterInput, setFilterInput] = useState('');

  const handleFilter = () => {
    const inputCode = filterInput.trim();
    if (!inputCode) {
      setFilteredData(allData);
      return;
    }

    const filtered = allData.filter(url => {
      const urlParts = url.split('/');
      const statusCode = urlParts[urlParts.length - 1];
      return statusCode.startsWith(inputCode);
    });

    setFilteredData(filtered);

    if (filtered.length === 0) {
      alert(`No images found for status code ${inputCode}`);
    }
  };

  return (
    <div className="filter-container" style={styles.container}>
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={filterInput}
          onChange={(e) => setFilterInput(e.target.value)}
          placeholder="Enter status code (e.g., 2, 200)"
          style={styles.input}
        />
      </div>
      <button onClick={handleFilter} style={styles.button}>Search Status Code</button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '20px',
  },
  inputContainer: {
    marginBottom: '10px',
  },
  input: {
    width: '600px',
    padding: '8px',
    fontSize: '14px',
    fontWeight: 'bold', 
    border: '1px solid #ccc',
  },
  button: {
    padding: '8px 16px',
    width: '200px',
    border: 'none',
    backgroundColor: '#007bff',
    color: 'white',
    cursor: 'pointer',
    borderRadius: '4px',
    fontSize: '14px',
  },
};

export default FilterComponent;
