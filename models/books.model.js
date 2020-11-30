
const sql = require("./database.js");

// constructor
const Book = function(book) {
  this.isbn = book.isbn;
  this.title = book.title;
  this.author = book.author;
  this.img = book.img;
  this.publish_date = book.publish_date;
  this.publisher = book.publisher;
  this.numOfPages = book.numOfPages;
};

Book.create = (newBook, result) => {
  sql.query("INSERT INTO Library SET ?", newBook, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created book: ", { isbn: res.insertId, ...newBook });
    result(null, { isbn: res.insertId, ...newBook });
  });
};

Book.getAll = result => {
  sql.query("SELECT * FROM Library", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("books: ", res);
    result(null, res);
  });
};

Book.remove = (isbn, result) => {
  sql.query("DELETE FROM Library WHERE isbn = ?", isbn, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Book with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted book with isbn: ", isbn);
    result(null, res);
  });
};

Book.findById = (bookId, result) => {
  sql.query(`SELECT * FROM Library WHERE isbn = ${bookId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found book: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Book with the id
    result({ kind: "not_found" }, null);
  });
};

Book.updateById = (isbn, book, result) => {
  sql.query(
    "UPDATE Library SET isbn = ?, title = ?, author = ?,img = ?, publish_date = ?, publisher = ?, numOfPages = ? WHERE isbn = ?",
    [book.isbn, book.title, book.author, book.publish_date, book.publisher, book.numOfPages, isbn],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Book with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated book: ", { isbn: isbn, ...book });
      result(null, { isbn: isbn, ...book });
    }
  );
};
/*

Book.removeAll = result => {
  sql.query("DELETE FROM Library", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} Library`);
    result(null, res);
  });
};


*/
module.exports = Book;
