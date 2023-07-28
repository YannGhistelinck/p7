const Book = require('../models/book');

exports.getAllBooks = (req, res, next) => {
    //delete req.body._id;
    const book = new Book({
        ...req.body
    });
    book.save()
        .then(() => res.status(201).json({message : "Nouveau livre enregistré."}))
        .catch(error => res.status(400).json({error}));
}

exports.addBookGrade = (req, res, next) => {
    // ajout de la nouvelle note
}