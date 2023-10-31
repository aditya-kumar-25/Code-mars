const express = require('express');
const { pushRequestQuestion, fetchRequestQuestions } = require('../controller/modifyRequestQuestions');
const router = express.Router();

router.post('/push' , pushRequestQuestion)

router.get('/fetch' , fetchRequestQuestions)

module.exports = router;