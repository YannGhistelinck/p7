const Book = require('../models/book');
const { login } = require('./user');
const fs = require('fs')

/*
    GET
*/

exports.getAllBooks = (req, res, next) => {
    // affichage de tous les livres
    Book.find()
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({error}))
}

exports.getOneBook = (req, res, next) => {
    Book.findOne({_id : req.params.id})
        .then(book => res.status(200).json(book))
        .catch(error => res.status(404).json({error}))
}

exports.getBestRating = (req, res, next) => {
    Book.find()
        .then(books => {
            
            books.sort((a, b) => b.averageRating - a.averageRating)
            const bestRated = books.slice(0,3)
            res.status(200).json(bestRated)
        })
        .catch(error => res.status(400).json({error}))
}

/*
    POST
*/

exports.addBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book)
    delete bookObject._id
    delete bookObject._userId

    
    const book = new Book({
        ...bookObject,
        userId : req.auth.userId,
        imageUrl : `${req.protocol}://${req.get('host')}/assets/images/${req.file.filename}`
    })
    book.save()
        .then(() => res.status(201).json({message : "Nouveau livre bien enregistré."}))
        .catch(error => res.status(400).json({error}))
}

exports.addBookGrade = (req, res, next) => {
    
    const userId = req.auth.userId;
    const { rating } = req.body;
    const userRating = { userId, grade: rating };

    
    Book.findOne({_id : req.params.id})
        .then((book) => {
            if(!book){
                res.status(404).json({message : 'Livre non trouvé'})
            }else{
                const ratings = book.ratings
                let testRate = 0
                
                for(let i=0; i<ratings.length; i++){
                    if(ratings[i].userId == req.body.userId) testRate = 1
                }
                
                if(testRate == 1){
                    res.status(400).json({message : "L'utilisateur a déjà noté le livre."})
                }else{
                    Book.findByIdAndUpdate({_id: req.params.id}, { $push: { ratings: userRating }})
                        .then((book) => {
                            if (!book) {
                                return res.status(404).json({ message: 'Livre non trouvé' });
                            }
                            let sumRatings = rating
                            for(let i=0; i<book.ratings.length; i++){
                                sumRatings += book.ratings[i].grade
                            }
                            book.averageRating = (sumRatings) / (book.ratings.length+1);
                            book.save()
                            .then(() => res.status(200).json(book))
                            .catch((error) => res.status(500).json({ error }));
                        })
                }
            }
        })
        .catch(error => res.status(404).json({error}))    
}

/*
    PUT
*/

exports.modifyBook = (req, res, next) => {
    
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl : `${req.protocol}://${req.get('host')}/assets/images/${req.file.filename}`
    } : {...req.body}
    
    delete bookObject._userId

    Book.findOne({_id : req.params.id})
        .then(book => {
            if(book.userId != req.auth.userId){
                res.status(400).json({message : "Non-autorisé"})
                
            }else{
                const filename = book.imageUrl.split('images')[1]
                fs.unlink(`assets/images/${filename}`, () => {
                    Book.updateOne({_id : req.params.id}, {...bookObject, _id : req.params.id})
                    .then(() => res.status(200).json({message : "Modifications enregistrées"}))
                    .catch(error => res.status(400).json({error}))
                })
            }
        })
        .catch(error => res.status(400).json({error}))
}

/*
    DELETE
*/

exports.deleteOneBook = (req, res, next) => {
    Book.findOne({_id : req.params.id})
        .then(book => {
            if(book.userId != req.auth.userId){
                res.status(400).json({message : "Non-autorisé"})
            }else{
                const filename = book.imageUrl.split('images')[1]
                fs.unlink(`assets/images/${filename}`, () => {
                    Book.deleteOne({_id : req.params.id})
                        .then(() => res.status(200).json({message : "Livre supprimé"}))
                        .catch(error => res.status(401).json({error}))
                })
            }
        })
        .catch(error => res.status(500).json({error}))
}