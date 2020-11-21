
module.exports = app => {
    const books = require(".controllers/books.controller.js");
  
    // Create a new book
    app.post("/book", books.create);
  
     //Retrieve all books
    app.get("/books", books.findAll);

    //Delete a book with bookId
    app.delete("/book/:bookId", books.delete);
  
     //Retrieve a single book with bookId
    app.get("/book/:bookId", books.findOne);
  
     //Update a book with bookId
    app.put("/book/:bookId", books.update);
  
     
  /*
     //Delete all books
    app.delete("/books", books.deleteAll); */
  };
  