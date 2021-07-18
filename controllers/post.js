const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const accountShema = require('../models/account');
const postShema = require('../models/post');

router.get('/profile/:id', (request, response, next) => {
    const id = request.params.id;
    postShema.findAll({ where: {userid: id}})
    .then(posts => {
        posts.sort(function(b,a){
            return a.id - b.id
        })
        response.render('profile', {
            posts: posts
        });
    })  
});

router.get('/', (request, response, next) => {
    postShema.findAll()
    .then(posts => {
        posts.sort(function(b,a){
            return a.id - b.id
        })
        response.render('posts', {
            posts: posts
        });
    })  
});

router.post('/uploadImage', (request, response, next) => {
    const token = request.body.token;
    const comment = request.body.comments;
    const image = request.file;

    jwt.verify(token, '80dsqrrmmDL83paHwscvyBtDrswopbuw', (err, data) =>{
        if(err){
            console.log('Your token is not valid');
        } else {
            postShema.create({
                image: image.filename,
                comments: comment,
                userid: data.dataToToken.id,
                likes: 0,
                fullName: data.dataToToken.name,
                avatar: data.dataToToken.avatar
            })
            .then(upload => {
                response.redirect('/posts');
            })
           
        }
    })
});

module.exports = router;
