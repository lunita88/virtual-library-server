
module.exports = app => {
    const books = require("../controllers/books.controller.js");
    const users = require("../controllers/user.controller.js");
  
    const multer  = require('multer');
    const path = require('path');
    
    var storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, 'uploads/')
      },
        
     filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
      }
    })
    const upload = multer({ storage:storage});

    // Create a new book
    app.post("/book", [users.authenticateToken, upload.single("book_img")],books.create);
  
     //Retrieve all books
    app.get("/books", books.findAll);

    //Delete a book with bookId
    app.delete("/book/:bookId", users.authenticateToken, books.delete);
  
     //Retrieve a single book with bookId
    app.get("/book/:bookId", books.findOne);
  
     //Update a book with bookId
    app.put("/book/:bookId",[users.authenticateToken, upload.single("book_img")], books.update);
  
     
  /*
     //Delete all books
    app.delete("/books", books.deleteAll); */
  };
  
