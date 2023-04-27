const express = require('express');

require('dotenv').config();

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const { connection } = require('./config/db');

const { userRouter } = require('./routes/user.route');

const cors=require('cors')

const app = express();

app.use(cors())

app.use(express.json())

app.get('/', (req, res) => {
    res.send("Welcome!");
});


clientSecret="e65aed290a6eec54283fb37a86ac52c1bb916714"
clientID="57b046c68ef25878ff61"

app.get('/auth/github', async function (req, res) {
    try {
        let {code} = req.query;
        console.log(code);
        const token = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({
                client_id: clientID,
                client_secret:clientSecret,
                code: code,
            })
        }).then((res) => res.json());
        console.log(token);
        const userDetails = await fetch('https://api.github.com/user', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization:`Bearer ${token.access_token}`
            }
        }).then(res => res.json());
        console.log(userDetails);

        let res = await fetch('http://localhost:8080/user/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: userDetails.name,
                email: userDetails.email,
                password: "12345",
                bio: userDetails.bio,
                phone: "9175329907",
                profilePicture:userDetails.avatar_url
            })
        })
    } catch (error) {
        res.status(400).send({'Messsage': error.message})
    }
})

// Routes

app.use('/user',userRouter)


app.listen(process.env.port, async() => {
    try {
        await connection;
        console.log('Connected to Database');
    } catch (error) {
        console.log({'Error': error.message});
    }
    console.log(`server listening on port ${process.env.port}`);
})