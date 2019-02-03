const express = require('express');

const router = express.Router();

const {userController} = require('../app/controllers/userController')

router.use('/', userController);


module.exports = {
    routes: router
}