const List = require('../model/listModel');
const User = require('../model/userModel'); 


const addList = async (req, res) => {
  const { name, url, userId } = req.body;

  try {
    const list = new List({ name, imageLinks: [url], userId });
    await list.save();

    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.imageList) {
      user.imageList = [];
    }

    user.imageList.push(list._id);

    await user.save();

    res.status(201).json({ list, imageId: list._id });
  } catch (error) {
    console.error('Error saving image:', error);
    res.status(400).json({ error: error.message });
  }
};


  

const getList = async (req, res) => {
  const { userId } = req.query; 
    // console.log(userId);
  try {
    const lists = await List.find({ userId }); 
    res.json(lists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const deleteSavedImage = async (req, res) => {
  const { imageId } = req.query;
  console.log('Image ID:', imageId); 

  try {
   
    await List.findByIdAndDelete(imageId);

    const user = await User.findOne({ imageList: imageId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.imageList.pull(imageId);
    await user.save();

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
};


const updateImageName = async (req, res) => {
  const { imageId, newName } = req.body;
  console.log(imageId);
  try {
    const list = await List.findById(imageId);
    if (!list) {
      return res.status(404).json({ message: 'Image not found' });
    }
    list.name = newName;
    await list.save();
    res.json({ message: 'Image name updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update image name' });
  }
};



module.exports= {addList, getList,deleteSavedImage, updateImageName }