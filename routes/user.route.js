const express = require('express');
const userRoute = express.Router();
const {register,login,logout,refreshAccessToken, changePassword,updateUserDetails} = require('../controller/user.controller');
const validateToken = require('../middlewares/logout.middleware');
const {verifyRefreshToken, verifyAccessToken} = require('../middlewares/auth.middleware');
const checkBlacklists = require('../middlewares/checkblacklists.middleware');
userRoute.post('/admin-register',register);
userRoute.post('/admin-login',login);
userRoute.post('/admin-logout',validateToken,logout);
userRoute.post('/new-access-token',checkBlacklists,verifyRefreshToken,refreshAccessToken);
userRoute.post('/change-password',verifyAccessToken,changePassword);
userRoute.all('/update-user-details/:id',verifyAccessToken,updateUserDetails);
module.exports = userRoute;
console.log('The user route is ready to use..');

// POST /refresh-access-token
//  └── checkBlacklists        ✅ blocks if access/refresh token is blacklisted
//  └── verifyRefreshToken     ✅ blocks if refresh token is blacklisted
//  └── refreshAccessToken     ✅ generates new token ONLY if passed checks