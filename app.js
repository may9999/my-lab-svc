require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// MIDDLEWARES
app.use(cors());
app.use(bodyParser.json());


// app.use('/post', () => {
//     console.log('This is a middleware running');
// });

// IMPORT ROUTES
const postsRoute = require('./routes/posts');

app.use('/posts', postsRoute);

// ROUTES
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

// app.get('/getUsers', (req, res) => {
//     userModel.find({}).then(function(users) {
//         res.json(users);
//     }).catch(function(err) {
//         console.log(err);
//     });
// });
    
// How to we start listening to the server
app.listen(3000);
// app.listen(app.get('PORT'), () =>
//     console.log(`Server running on port ${app.get('PORT')}`),
// )