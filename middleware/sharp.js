const sharp = require('sharp')
const fs = require('fs')

module.exports = (req, res, next) => {
    const fileToConvert = `assets/images/${req.file.filename}`

    if(req.file && req.file.mimetype != "image/webp"){
        
        sharp(`${req.file.destination}/${req.file.filename}`)
            .resize(410)
            .toFile(`${req.file.destination}/${req.file.filename.split('.')[0]}-s.webp`, (err, info) => {
                if(err){
                    res.status(400).json({message : "Erreur de conversion"})
                }else{
                    req.file.mimetype = 'image/webp'
                    req.file.filename = `${req.file.filename.split('.')[0]}-s.webp`
                    req.file.path = `${req.file.path.split('.')[0]}-s.webp`
                    
                    fs.unlink(`${fileToConvert}`, (err) => {if(err)res.status(400).json({message : "Erreur de supression"})})


                    next()
                }
            })        

    }else{
        next()
    }
}