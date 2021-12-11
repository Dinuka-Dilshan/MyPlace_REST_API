const users = require('../DUMMY_DATA/users');
const HttpError = require('../Models/HttpError');

const getAllUsers = (req,res,next)=>{
    res.status(200).json({
        users
    })
};

const login = (req,res,next)=>{
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
    
};


module.exports = {
    getAllUsers,
    login,
    signup
}