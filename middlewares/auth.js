const jwt = require('jsonwebtoken');

require('dotenv').config();

const auth = (req,res,next) => {
    let token = req.headers.authorization.split(' ')[1];
    try {
        if (!token) {
        res.status(403).send({'Message' :'Token is missing'});
    } else {
            const decoded = jwt.verify(token, process.env.key, function (err, decoded) {
                if (deoded) {
                    const userID = decoded.userID;
                req.body.userID = userID;
                next();
                } else {
                    res.status(400).send({ 'Message': err.message });
                    console.log(err);
                }
            });
    }
    } catch (error) {
        res.status(400).send({ 'Message': error.message });
        console.log(error);
    }
}

module.exports={auth}