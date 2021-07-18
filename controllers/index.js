const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const accountShema = require('../models/account');

router.get('/', (request, response, next) => {
    response.render('index', {
        title: 'Welcome to Instagraph'
    });
});

router.get('/register', (request, response, next) => {
    response.render('register', {
        title: 'Welcome to Instagraph'
    });
});

router.post('/signup', (request, response, next) => {
    
    const fullName = request.body.fullName;
    const email = request.body.email;
    const password = request.body.password;
    const avatar = request.file;

    console.log(avatar);

    accountShema.findOne({ where: { email: email}})
    .then(account => {
        if(account){
            console.log('User exist');
        } else {
            return bcryptjs.hash(password, 10)
            .then(hashPassword => {
                accountShema.create({
                    fullName: fullName,
                    email: email,
                    password: hashPassword,
                    avatar: avatar.filename
                })
                .then(newAccount => {

                    const dataToToken = {
                        id: newAccount.id,
                        name: newAccount.fullName,
                        avatar: newAccount.avatar
                    }
                    jwt.sign({dataToToken}, '80dsqrrmmDL83paHwscvyBtDrswopbuw', (err, token) => {
                        console.log(token);
                        response.redirect('/');
                    })
                })
            })
        }
    })
});

router.post('/login', (request, response, next) => {

    const email = request.body.email;
    const password = request.body.password;

    accountShema.findOne({ where: { email: email}})
    .then(account => {
        if(account){
            bcryptjs.compare(password, account.password)
            .then(isPasswordMatch => {
                if(isPasswordMatch){
                    response.redirect('/posts');
                } else {
                    console.log('Password not match');
                }
            })
        }
    });
});
module.exports = router;
