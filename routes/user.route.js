
const express = require("express");

const { User } = require("../models/user.model");

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const {auth}=require("../middlewares/auth")

const userRouter = express.Router();

userRouter.get('/api/getProfile/:id', async (req, res) => {
    let id = req.params.id
    try {
        let user = await User.findOne({ '_id': id });
        console.log(user);
        res.status(200).send({ "msg": "User Profile", "profile": user })
    } catch (error) {
        res.status(400).send({ "Error": error.message })
    }
});

userRouter.get('/api/getProfile', async (req, res) => {
    try {
        let user = await User.find();
        console.log(user);
        res.status(200).send({ "msg": "All Users", "profile": user })
    } catch (error) {
        res.status(400).send({ "Error": error.message })
    }
});


userRouter.post("/api/register", (req, res) => {
    let { name, email, password, bio, phone, profilePicture } = req.body;
    
    try {
        bcrypt.hash(password, 5, async function (err, hash) {
            if (err) {
                res.status(400).send({ 'Error': err.message });
            } else {
                let newUser = new User({ name, email, password: hash, bio, phone, profilePicture });
                await newUser.save();
                res.status(201).send({ "msg": "Registration is successfull", "User": newUser })
            }
        });
    } catch (error) {
        res.status(400).send({ 'Error': error.message });
        console.log(error);
    }
});

userRouter.post('/api/login', async (req, res) => {
    let { email, password } = req.body;
    let user = await User.findOne({ 'email': email });
    let hashPassword = user.password;
    try {
        bcrypt.compare(password, hashPassword, function (err, result) {
            if (result) {
                var token = jwt.sign({ userId: user._id }, process.env.key);
                res.status(200).send({ 'Message': 'Login successful', 'token': token,"userID":user._id });
            } else {
                res.status(400).send({ 'Message': err });
                console.log(err);
            }
        });
    } catch (error) {
        res.status(404).send({ "Message": error.message });
        console.log(error);
    }
});

userRouter.patch('/api/update/:id',auth, async (req, res) => {
    let id = req.params.id;
    let payload = req.body;
    let user = await User.findOne({ '_id': id });
    let userIdInData = user.userID;
    let userIdofMakingReq = req.body.userID;
    try {
        if (userIdofMakingReq !== userIdInData) {
            return res.status(400).send({'Message':'Not Authourised to make Changes'})
        } else {
            let upagedUser = await User.findByIdAndUpdate({ '_id': id }, payload);
            res.status(201).send({ 'Message': 'User Data Updated' });
            console.log(`user with the id:${id} updated successfully`);
        }
    } catch (error) {
        res.status(404).send({ 'Message': error.message });
        console.log(error);
    }
})

module.exports={userRouter}