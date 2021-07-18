// IMPORT LIBS
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');

// CREATE APP
const instaApp = express();

// USE EJS
instaApp.set('view engine', 'ejs');
instaApp.set('views', 'views');

// USE BODY-PARSER
instaApp.use(bodyParser.urlencoded({ extended: false}));
instaApp.use(bodyParser.json());
instaApp.locals.moment = require('moment');
// USE AND SET MULTER
instaApp.use(express.static(path.join(__dirname, 'public')));
instaApp.use('/images', express.static('images'));

// IMPORT CONTROLLERS
const indexController = require('./controllers/index');
const postsController = require('./controllers/post');
const connectionController = require('./controllers/connection');


// SET MULTER
const fileStorage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null,'public/images')
    },
    filename: (request, file, callback) =>{
        callback(null,file.originalname);
    }
});
instaApp.use(multer({ storage: fileStorage, limits: {fileSize: 2500000362}}).single('image'));

instaApp.use('/', indexController);
instaApp.use('/posts', postsController);

const port = 6015;

connectionController
.sync()
.then(results => {
    instaApp.listen(port, function(){
        console.log(`App is run under port ${port}`);
    });
})
.catch(err => {
    console.log(err);
});
