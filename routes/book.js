const express = require('express');
const router = express.Router();
const bookCtrl = require('../controllers/book')
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')
const sharp = require('../middleware/sharp')


router.get('/', bookCtrl.getAllBooks)
router.get('/bestrating', bookCtrl.getBestRating)
router.get('/:id', bookCtrl.getOneBook)

router.post('/', auth, multer, sharp, bookCtrl.addBook)  
router.post('/:id/rating', auth, bookCtrl.addBookGrade)

router.put('/:id', auth, multer, sharp, bookCtrl.modifyBook)
  
router.delete('/:id', auth, bookCtrl.deleteOneBook)
module.exports = router;