import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SavedResponseCode.css'; 

const SavedResponseCode = () => {
  const [savedImages, setSavedImages] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [newName, setNewName] = useState('');
  const user = JSON.parse(localStorage.getItem('profile'));
  const userId = user ? user.userId : '';

  useEffect(() => {
    const fetchSavedImages = async () => {
      try {
        const response = await axios.get('https://statuscode-image.onrender.com/getsavedlist', {
          params: { userId }
        });
        setSavedImages(response.data);
      } catch (error) {
        console.error('Error fetching saved images:', error);
      }
    };

    if (userId) {
      fetchSavedImages();
    }
  }, [userId]);

  const handleDelete = async (imageId) => {
    try {
      console.log('ImageID:', imageId)
      await axios.delete(`https://statuscode-image.onrender.com/deletesavedimage`, {
        params: { imageId }  
      });
      setSavedImages(savedImages.filter(image => image._id !== imageId));
      alert('Image deleted successfully.');
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image.');
    }
  };

  const handleEdit = (imageId, currentName) => {
    setEditMode(imageId);
    setNewName(currentName);
  };

  const handleSaveEdit = async (imageId) => {
    try {
      console.log(imageId);
      await axios.put(`https://statuscode-image.onrender.com/updatename`, {
        imageId,
        newName
      });
      setSavedImages(savedImages.map(image => image._id === imageId ? { ...image, name: newName } : image));
      setEditMode(null);
      alert('Image name updated successfully.');
    } catch (error) {
      console.error('Error updating image name:', error);
      alert('Failed to update image name.');
    }
  };

  return (
    <div className="saved-container">
      <h1>Saved Images</h1>
      <div className="saved-images-grid">
        {savedImages.length === 0 ? (
          <p>No saved images.</p>
        ) : (
          savedImages.map((image) => (
            <div key={image._id} className="image-wrapper">
              {editMode === image._id ? (
                <div className="edit-container">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="edit-input"
                  />
                  <button onClick={() => handleSaveEdit(image._id)} className="save-button">
                    Save
                  </button>
                  <button onClick={() => setEditMode(null)} className="cancel-button">
                    Cancel
                  </button>
                </div>
              ) : (
                <p className="image-name">{image.name}</p>
              )}
              <img src={image.imageLinks[0]} alt={image.name} className="saved-image" />
              <div className="image-buttons">
                <button onClick={() => handleEdit(image._id, image.name)} className="edit-button">
                  Edit Name
                </button>
                <button className="delete-button" onClick={() => handleDelete(image._id)}>
                  Delete Image
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SavedResponseCode;
