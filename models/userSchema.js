const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema(
    {
        
        userHandle:{
            type: String,
            required: true,
        },
        password:{
            type: String,
            required: true,
        },
        email:{
            type: String,
            required: true,
        },
        questionSolved: {
            type:Schema.Types.ObjectId,
            required: true,
            ref:"questions",
        },
        profile: {
            type:Schema.Types.ObjectId,
            required: true,
            ref:"profile",
        }
        
    }
)

module.exports = mongoose.model('user' , userSchema)