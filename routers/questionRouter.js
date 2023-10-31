const express = require('express');
const router = express.Router();

const {getOutput, fetchAllQuestions , findOneQuestion, getVerdict, mySubmissions, getDiscussion, postDiscussion, getUser, deleteDiscussion, getAllSubmissions} = require('../controller/getOutput');
const { auth } = require('../middlewares/auth');

router.post('/run-code' , auth ,getOutput);

router.get('/all-submissions/:userHandle' , getAllSubmissions)

router.post('/all-questions',  fetchAllQuestions)

router.get('/find-one/:id' , findOneQuestion)

router.post('/get-verdict' , auth , getVerdict)

router.post('/my-submissions' , auth , mySubmissions)

router.get('/discussions/:id' , getDiscussion)

router.post('/discussions' , auth , postDiscussion)

router.get('/get-user/:userHandle' , getUser);

router.post('/delete-discussion' , auth , deleteDiscussion);

module.exports = router;