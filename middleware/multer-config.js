const multer = require('multer')


const MINE_TYPES = {
    'image/jpg' : 'jpg',
    'image/jpeg' : 'jpg',
    'image/png' : 'png',
    'image/webp' : 'webp'
}



const storage = multer.diskStorage({
    destination : (req, file, callback) => {
        callback(null, 'assets/images')
    },
    filename : (req, file, callback) => {
        const name = file.originalname.split(' ').join('_').split('.')[0]
        const extension = MINE_TYPES[file.mimetype]
        callback(null, name + Date.now() + '.' + extension)
    }
})



module.exports = multer({storage}).single('image')