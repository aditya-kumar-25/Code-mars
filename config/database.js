const mongoose = require('mongoose')

exports.dbConnect =() =>{
    mongoose.connect(process.env.MONGOOSE_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
    })
    .then(()=>{
        console.log("db connection established")
    })
    .catch((err)=>{
        console.log("error connecting");
        console.log(err);
        process.exit(1);
    })
}