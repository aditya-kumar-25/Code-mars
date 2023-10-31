const express = require('express');
const router = express.Router();

const {auth} = require('../middlewares/authAdmin')

const {pushQuestion , popQuestion , fetchQuestion, pushQuestionDirect} = require('../controller/modifyQuestions')

router.post('/push-direct' , pushQuestionDirect)

router.post('/push' , auth , pushQuestion)

router.post('/pop' , auth , popQuestion)

router.get('/fetch' , auth , fetchQuestion)

module.exports = router;