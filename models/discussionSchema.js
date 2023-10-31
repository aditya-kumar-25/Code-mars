const mongoose = require('mongoose')
const Schema = mongoose.Schema

const discussionSchema = new Schema({
    qid:{
        type:Schema.Types.ObjectId,
    },
    userHandle:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true,
    },
    body:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true,
    }
})

module.exports = mongoose.model('discussion' , discussionSchema)
