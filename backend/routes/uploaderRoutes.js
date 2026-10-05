const express = require('express');
const router = express.Router();

// Case-sensitive relative path
const controller = require('../controllers/uploaderController');

router.post('/batches', controller.getBatches);
router.post('/content', controller.getBatchContent);
router.post('/sync', controller.syncToDatabase);
router.get('/live/:batchId/:type', controller.getLiveContent);

module.exports = router;
