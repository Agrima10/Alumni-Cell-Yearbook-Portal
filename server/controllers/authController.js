const Auth = require("../models/authModel");
const asyncHandler = require('express-async-handler')

const getAllusers = asyncHandler(async(rq,res) => {
    //Get all users from mongodb
        const auths = await Auth.find().lean();
        
    // if no users
    if(!auths?.length){
        return res.send({message:"No users found"})
    }
    res.json(auths);
})

const createUsers = asyncHandler(async(req,res) => {
    console.log("hello");
    const {email, name} = req.body;


    //Create and store user
    const auths = await Auth.create({email, name});

    if(auths){
        //created
        res.send({message:"New User Created"});
    }else{
        res.send({message:"Invalid user data recieved"});
    }
})

const findAAuth = asyncHandler(async (req,res)=>{
    const email = req.body.email;

    const User = await Auth.find({email:email}).exec();

    if(!User.length){
        res.send({message:"No Auth Found"})
    }
    else{
        res.send({message:"Auth Found", User});
    }
})

module.exports = {
    getAllusers,
    createUsers,
    findAAuth
}