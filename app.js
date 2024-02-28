require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// MIDDLEWARES
app.use(cors());
app.use(bodyParser.json());

// IMPORT ROUTES
const postsRoute = require('./routes/posts');
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const authenticateToken = require('./routes/verifyToken');

// ROUTE MIDDLEWARES
app.use('/api/usr', authRoute);
app.use('/posts', authenticateToken, postsRoute);
app.use('/api/user', authenticateToken, userRoute);

app.get('/', (req, res) => {
    res.send('We are on home');
});


mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(
    // Connection successfull
    () => {
        console.log('CONECTED TO DB');
    },
    // Error
    err => {
        console.log(err);
});
    
// How to we start listening to the server
app.listen(3000);
// app.listen(app.get('PORT'), () =>
//     console.log(`Server running on port ${app.get('PORT')}`),
// )