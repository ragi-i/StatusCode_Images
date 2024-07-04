import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DataFetchComponent = ({ setAllData }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const statusCodes = Array.from({ length: 901 }, (_, i) => i + 99); 
        const imageUrls = await Promise.all(
          statusCodes.map(async code => {
            const imageUrl = `https://http.dog/${code}.jpg`;
            try {
              await axios.head(imageUrl);
              return imageUrl; 
            } catch (error) {
                
              return null; 
            }
          })
        );

        const filteredImageUrls = imageUrls.filter(url => url !== null);

        setAllData(filteredImageUrls);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, [setAllData]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return <p>Data fetched successfully.</p>;
};

export default DataFetchComponent;