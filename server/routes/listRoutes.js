const express = require('express');
const router = express.Router();
const { addList, getList, deleteSavedImage, updateImageName } = require('../controller/listController');

router.post('/addresponsecode', addList);
router.get('/getsavedlist', getList);
router.delete('/deletesavedimage', deleteSavedImage);
router.put('/updatename', updateImageName);

module.exports = router;
