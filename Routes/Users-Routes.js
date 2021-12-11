const express = require('express');
const router = express.Router();

const usersControllers = require('../Controllers/Users-Controller');


router.get('/',usersControllers.getAllUsers);

router.post('/login',usersControllers.login);

router.post('/signup',usersControllers.signup);


module.exports = router;