import React, { useState } from 'react';
import DataFetchComponent from '../components/DataFetch';
import FilterComponent from '../components/Filter';
import Navbar from '../components/Navbar';
import axios from 'axios';
import './SearchPage.css'; 

const SearchPage = () => {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [imageNames, setImageNames] = useState({});

  const user = JSON.parse(localStorage.getItem('profile'));
  console.log('profile', user);

  const handleInputChange = (index, value) => {
    setImageNames({
      ...imageNames,
      [index]: value,
    });
  };

  const handleSave = async (index, url) => {
    const imageName = imageNames[index];
    if (!imageName) {
      alert('Please enter an image name.');
      return;
    }
    
    const user = JSON.parse(localStorage.getItem('profile'));
    const userId = user ? user.userId : '';
    console.log('userId', user.userId);
  
    const imageData = {
      name: imageName,
      url,
      userId
    };

    try {
      await axios.post('https://statuscode-image.onrender.com/addresponsecode', imageData);
      alert('Image saved successfully.');
    } catch (error) {
      console.error('Error saving image:', error);
      alert('Failed to save image.');
    }
  };

  return (
    <div className="search-page">
      <Navbar />
      <DataFetchComponent setAllData={setAllData} />
      <FilterComponent allData={allData} setFilteredData={setFilteredData} />
      <div className="filtered-results">
        <div className="grid-container">
          {filteredData.map((url, index) => (
            <div className="grid-item" key={index}>
              <input
                type="text"
                placeholder="Enter image name"
                value={imageNames[index] || ''}
                onChange={(e) => handleInputChange(index, e.target.value)}
                className="image-name-input"
              />
              <img src={url} alt={`HTTP status ${url}`} className="image" />
              <button onClick={() => handleSave(index, url)} className="save-button">
                Save
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage; 