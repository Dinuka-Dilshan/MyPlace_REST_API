const users = require('../DUMMY_DATA/users');
const HttpError = require('../Models/HttpError');
const { v4: uuidv4 } = require("uuid"); 
const {validationResult} = require('express-validator');

const getAllUsers = (req,res,next)=>{
    res.status(200).json({
        users
    })
};

const login = (req,res,next)=>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const {email, password} = req.body;
    const foundUser = users.find(user=>user.email === email && user.password === password);

    if(foundUser && foundUser.email === email){
        res.json({
            message:'Logged In'
        })
    }else{
        next(new HttpError('Cannot find a user. Credentials seems to be wrong',401));
    }
};

const signup = (req,res,next)=>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const {name, email, password} = req.body;
    const isUserFound = users.find(user=>user.email === email);

    if(isUserFound){
        next(new HttpError('Email exists',409));
    }

    users.push({
        id:uuidv4(),
        name,
        email,
        password
    })

    res.status(201).json({
        message:'Successfull'
    })
};


module.exports = {
    getAllUsers,
    login,
    signup
}