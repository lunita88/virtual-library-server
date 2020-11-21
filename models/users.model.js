 const sql = require("./database.js"),
      bcrypt = require('bcrypt');

// constructor
const User = function(user) {
  this.email = user.email;
  this.password = bcrypt.hashSync(user.password, 10);
};

User.login = (user, result) => {
   sql.query(`SELECT * FROM users WHERE active = 1 and email = '${user.email}'`, (err, res) => {
      if (err) {
         console.log("error: ", err);
         result(err, null);
         return;
      }
      if (res.length) {
        //console.log("found user: ", res[0]);
        if (bcrypt.compareSync(user.password, res[0].password)) {
          //console.log("password match!");
          result(null, { email: res[0].email });
          return;
        } else {
          result({ msg: "Authentication failed. Invalid email or password." }, null);
        }
      }
      // not found User with the id
      result({ msg: "Authentication failed. User not found." }, null);
   });
}

User.signup = (newUser, result) => {
  //console.log(newUser);
  sql.query("INSERT INTO users SET ?", newUser, (err, res) => {
    if (err) {
      console.log("error: ", err);
      // if sql return ER_DUP_ENTRY we consider this duplicate email entry
      // since email field is PRIMARY KEY so we return message
      if (err.code == 'ER_DUP_ENTRY') {
        result({ msg: "This email is already registered. Use FORGOT PASSWORD to reactivate your account." }, null);
        return;
      }
      result(err, null);
      return;
    }
    console.log("created user: ", { ...newUser });
    result(null, { ...newUser });
  });
}

User.forgot = (user, result) => {
  sql.query("UPDATE users SET password = ? WHERE email = ?", [user.password, user.email], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("password changed for: ", user.email);
    result(null, { email: user.email });
  });
}

User.confirm = (email, result) => {
  sql.query("UPDATE users SET active = 1 WHERE email = ?", [email], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("activated user: ", email);
    result(null, { email });
  });
}

User.findById = (username, userId,result,req,res) => {
  var userId = JSON.stringify(md5(userId));
  console.log(userId);
  
  sql.query(`SELECT * FROM Users WHERE username = ${username} and password = ${userId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
  
    if (res.length) {
      console.log("found user: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found User with the id
    result({ kind: "not_found" }, null);
  });
};  

User.getAll = result => {
  sql.query("SELECT * FROM Users", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("users: ", res);
    result(null, res);
  });
};

User.updateById = (isbn, user, result) => {
  sql.query(
    "UPDATE Users SET username = ?, password = ?, email = ?  WHERE isbn = ?",
    [user.username, user.password, user.email, isbn],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found User with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated user: ", { isbn: isbn, ...user });
      result(null, { isbn: isbn, ...user });
    }
  );
};

User.remove = (isbn, result) => {
  sql.query("DELETE FROM Users WHERE isbn = ?", isbn, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found User with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted user with isbn: ", isbn);
    result(null, res);
  });
};

User.removeAll = result => {
  sql.query("DELETE FROM Users", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} Users`);
    result(null, res);
  });
};
/*
User.removeAll = result => {
  var username = request.body.username;
  var password = request.body.password;
   if(username && password) {
     sql.query('SELECT * FROM Users WHERE username = ? AND password = ?', [username,password], function(error,results,fields) {
        if(results.length > 0) {
          request.session.logedin = true;
          request.session.username = username;
          response.redirect('/user');
        } else {
          response.end();
        }
     });
   } else {
     response.send('please enter sername and pass');
     response.end();
   }
}; */


module.exports = User;