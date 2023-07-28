const express = require('express');
const router = express.Router();
const bookCtrl = require('../controllers/book')
const auth = require('../middleware/auth')


  // Add a new book

router.get('/', bookCtrl.getAllBooks)
  
  
    // Add a new grade
  
router.post('/:id/rating', auth, bookCtrl.addBookGrade)
  

module.exports = router;