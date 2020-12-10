
const Book = require("../models/books.model.js");

const fs = require('fs');
const user = require("../models/users.model.js");

// Create and Save a new User
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Book
  const book = new Book({
    isbn: req.body.isbn,
    title: req.body.title,
    author: req.body.author,
    img: req.file.filname,
    publish_date: req.body.publish_date,
    publisher: req.body.publisher,
    numOfPages: req.body.numOfPages
  });

  // Save Book in the database
  Book.create(book, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Book."
      });
    else res.send(data);
  });
};

// Retrieve all Book from the database.
exports.findAll = (req, res) => {
  Book.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving books."
      });
    else res.send(data);
  });
};

// Delete a Book with the specified customerId in the request
exports.delete = (req, res) => {
  //remove file(img) from folder-'uploads'
  Book.imgFind(req.params.bookId, (err, data) => {
    var imgPath = process.env.PWD + '/uploads/' + data;
    if (err) {
       console.log("greska");
    }else {
      fs.unlink(imgPath, (err) => {
        if (err) {
           console.error(err)
           return
        }
        //file removed
      })
      console.log(data + " image removed");
    }
  });
  
  Book.remove(req.params.bookId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Book with id ${req.params.bookId}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Book with id " + req.params.bookId
        });
      }
    } else res.send({ message: `Book was deleted successfully!` });
  });
};


// Find a single book with a bookId
exports.findOne = (req, res) => {
  Book.findById(req.params.bookId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Book with id ${req.params.bookId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Book with id " + req.params.bookId
        });
      }
    } else res.send(data);
  });
};

// Update a book identified by the bookId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  console.log(req.body);
  const book = new Book({
    isbn: req.body.isbn,
    title: req.body.title,
    author: req.body.author,
    img: req.file.filename,
    publish_date: req.body.publish_date,
    publisher: req.body.publisher,
    numOfPages: req.body.numOfPages
  }); 
  Book.imgFind(req.params.bookId, (err, imgName) => {
    const imgPath = process.env.PWD + '/uploads/' + imgName;
      if (err) {
         console.log("greska");
      }else {
        fs.unlink(imgPath,(err) => {
          if (err) {
            console.error(err)
            return
         }
        //file removed
      })
      console.log(imgName);
    }

  }); 


  Book.updateById(
    req.params.bookId,
    new Book(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Book with id ${req.params.bookId}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Book with id " + req.params.bookId
          });
        }
      } else res.send(data);
    }
  );
};

/*

// Delete all Books from the database.
exports.deleteAll = (req, res) => {
  Book.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all books."
      });
    else res.send({ message: `All Books were deleted successfully!` });
  });
};
*/
