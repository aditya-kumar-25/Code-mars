const mongoose = require('mongoose')
const Schema = mongoose.Schema

const questionSchema = new Schema( {
    
    easy:{
        type:Number,
        default:0,
    },
    medium:{
        type:Number,
        default:0,
    },
    hard:{
        type:Number,
        default:0,
    },
    total:{
        type:[{
            type:Schema.Types.ObjectId,
        }],
    },
    score:{
        type:Number,
        default:0,
    }
} )

module.exports = mongoose.model('questions' , questionSchema)


