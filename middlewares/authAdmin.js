const jwt = require('jsonwebtoken');
require('dotenv').config()
const bcrypt = require("bcrypt")

// middleware authentication
exports.auth = (req , res , next) => {

    try{
        // extract JWT token

        const token = req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer ", "");

        if(!token){
            return res.status(403).json({
                success: false,
                message: 'No token found'
            })
        }

        try{
            const decode = jwt.verify(token , process.env.JWT_SECRET_ADMIN)
            req.admin = decode

        } catch(err){
            return res.status(401).json({
                success: false,
                message: 'Token could not be decoded',
                error: err
            })
        }

        next();

    } catch(err){
        res.status(500).json({
            success: false,
            message: 'Admin is not authorized'
        })
    }
}