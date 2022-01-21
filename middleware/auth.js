require('dotenv').config();
const { verify } = require("jsonwebtoken");
const HttpError = require('../Models/HttpError');

const auth = (req, res, next) => {

    try {
        const token = req.headers.authorization.split(' ')[1]; //barer Token

        if(!token){
            throw new Error('Authentication Failed');
        }
        const decodedToken = verify(token,process.env.SECRET_KEY);
        req.userData = {
            userID:decodedToken.userID
        }
        next();
    } catch (error) {
        return next(new HttpError('Authentication Failed',401));
    }
    
};

module.exports = auth;
