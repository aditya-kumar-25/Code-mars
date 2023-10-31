const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cors());
app.use(cookieParser())
require('./config/database').dbConnect();

const PORT = process.env.PORT || 7000;
app.listen(PORT,()=>{
    console.log('listening on port',PORT);
})

app.get('/',(req, res)=>{
    res.send('<h1>Hello World</h1>');
})

app.use('/user',require('./routers/userRouter'));
app.use('/questions' , require('./routers/questionRouter'))   // fetch any kind of questions
app.use('/modify-questions' , require('./routers/addRemoveQuestions'))
app.use('/admin' , require('./routers/adminRouter'))
app.use('/request-question' , require('./routers/requestQuestions'))



