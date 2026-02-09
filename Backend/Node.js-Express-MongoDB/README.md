# Node.js Express MonogoDB

## First Steps

1. Create a new directory for your project and navigate into it:
    ```bash
    mkdir node-express-mongodb
    cd node-express-mongodb
    ```
2. Initialize a new Node.js project:
    ```bash
     npm init -y
    ```
3. Install the required dependencies:
    ```bash
     npm install express mongoose body-parser
    ```
4. Create a new file named `app.js` in the root of your project:
    ```bash
     touch app.js
    ```
5. Open `app.js` in your code editor and add the following code to set up a basic Express server and connect to MongoDB:

```javascript
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
// Middleware
app.use(bodyParser.json());
// Connect to MongoDB
mongoose
    .connect('mongodb://localhost:27017/mydatabase', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB', err);
    });
// Define a simple route
app.get('/', (req, res) => {
    res.send('Hello World!');
});
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
```
