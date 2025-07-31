const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const userModel = require('../models/user.model');
function generateRandomToken(length){
    return crypto.randomBytes(length).toString("hex");
}
/**create an access token */
const create_accessToken = async(email,role,id)=>{
    const accessKey = process.env.ACCESS_KEY || generateRandomToken(64);
    console.log("the access key is present in .env file : ", accessKey);
    if(accessKey){
        const access_token = await jwt.sign({email:email,role: role === "admin"?"admin":"user",_id:id},accessKey,{expiresIn: process.env.ACCESS_KEY_EXPIRY});
        return access_token;
    }
}
const create_refreshToken = async(email,id)=>{
    const refresh_key = process.env.REFRESH_KEY || generateRandomToken(32);
    console.log("The refresh key is :", refresh_key);
    if(refresh_key){
        const refresh_token = await jwt.sign({email:email,_id:id}, refresh_key,{expiresIn:process.env.REFRESH_KEY_EXPIRY});
        await userModel.findByIdAndUpdate(id,{refreshToken: refresh_token})
        return refresh_token;
    }
}
module.exports = {create_accessToken , create_refreshToken} ;
console.log("The access and refresh token is ready to use..");