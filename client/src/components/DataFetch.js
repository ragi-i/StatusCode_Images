import React, { useEffect } from 'react';

// Fetch all available http.dog images by preloading via Image(), which avoids CORS issues
// and integrates with parent-managed loading/error state.
// Expects parent to pass: setAllData, setFilteredData, setLoading, setError
const DataFetchComponent = ({ setAllData, setFilteredData, setLoading, setError }) => {
  useEffect(() => {
    let cancelled = false;

    const preload = (url) =>
      new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = () => resolve(null);
        img.src = url;
      });

    const fetchData = async () => {
      try {
        if (setLoading) setLoading(true);
        if (setError) setError('');

        // Use HTTP status code range 100..599
        const statusCodes = Array.from({ length: 500 }, (_, i) => i + 100);
        const urls = statusCodes.map((code) => `https://http.dog/${code}.jpg`);

        // Preload all images; non-existent ones resolve to null
        const results = await Promise.all(urls.map((u) => preload(u)));
        const valid = results.filter((u) => u !== null);

        if (!cancelled) {
          setAllData(valid);
          if (setFilteredData) setFilteredData(valid); // show all initially
        }
      } catch (_) {
        if (!cancelled && setError) setError('Failed to fetch data. Please try again later.');
      } finally {
        if (!cancelled && setLoading) setLoading(false);
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [setAllData, setFilteredData, setLoading, setError]);

  // This component only coordinates fetching; it renders nothing
  return null;
};

export default DataFetchComponent;
