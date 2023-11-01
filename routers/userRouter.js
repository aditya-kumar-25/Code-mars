const express = require('express');
const router = express.Router();
const {signup,login,sendOTPSignUp, sendOtpResetPassword , resetPassword, getInfo, getProfileInfo, updateProfile} = require('../controller/auth');
const {auth} = require('../middlewares/auth');

router.post('/signup',signup)
router.post('/login' , login)
router.post('/otp',sendOTPSignUp)
router.post('/reset-otp' , sendOtpResetPassword)
router.post('/reset-password' , resetPassword)
router.get('/info/:userHandle' , getInfo)
router.post('/profile-info' , auth , getProfileInfo);

router.post('/edit-profile' , auth , updateProfile);

router.post('/user-verification',auth,(req,res)=>{
    console.log(req.user);
    res.status(200).json({
        success:true,
        message:'User is verified',
        userHandle:req.user.userHandle,
    })
})


module.exports = router; 