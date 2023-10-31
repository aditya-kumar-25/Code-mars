const express = require('express');
const router = express.Router();
const {login , addAdmin} = require('../controller/authAdmin');
const {authAdmin} = require('../middlewares/authAdmin')

router.post('/login' , login)

router.post('/add' , addAdmin)

module.exports = router;