require('dotenv-safe').config();
const express = require('express');
const cors = require('cors');

const app = express();
const port = 8001;

app.use(cors());
app.options('*', cors());

app.use(express.urlencoded({ extended: false}));
app.use(express.json());

require("./routes/books.routes.js")(app);
require("./routes/user.routes.js")(app);

app.get('/', (req, res) => {
    res.send('Hello World, from express');
});
       

app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));
