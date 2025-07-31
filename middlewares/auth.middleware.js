/**here I write the code for verifying the refresh token */
const jwt = require("jsonwebtoken");
const verifyAccessToken = async(req,res,next)=>{
    console.log("Executing the verify access token");
    console.log("The req.headers for verifying the access token:", req.headers);
    console.log("The req.cookies for verifying the access token:", req.cookies);
    try {
        const access_key = process.env.ACCESS_KEY;
        console.log("The access key that presents in .env file:", access_key);
        const token = req.headers._accesstoken || req.cookies.accessToken;
        console.log("The access token that comes from the headers :", token);
        if(!token){
            return res.status(401).json({success:false,message:"No access token is initialized.."})
        }
        const decoded = jwt.verify(token,access_key);
        console.log("The decode token is :", decoded);
        req.decode = decoded;
        console.log("The req.decode for verifying the access token:", req.decode);
        next();
    } catch (error) {
        console.error("Error !! error during the access token:", error.message);
        return res.status(500).json({success:false,message:"Internal server error.."})
    }
}
const verifyRefreshToken = async(req,res,next)=>{
    console.log("Executing the verifying the refresh token..");
    console.log("The req.headers for verifying the refresh token:", req.headers);
    console.log("The req.cookies for verifying the refresh token:", req.cookies);
    try {
        const token = req.headers._refreshtoken || req.cookies.refreshToken;
        console.log("The token that comes from the headers for the refresh token:", token);
        if(!token){
            return res.status(401).json({success:false,message:"No token is initialized.."})
        }
        const decoded = jwt.verify(token,process.env.REFRESH_KEY);
        console.log("The decoded token is :", decoded);
        req.decode = decoded;
        console.log("The req.decode for verifying the refresh token :", req.decode);
        next();
    } catch (error) {
        console.error("Error !! error during the refresh the access token:", error.message);
        if(error.message){
            return res.status(401).json({success:false,message:"The JWT expired.."})
        }
        return res.status(500).json({success:false,message:"Internal server error"})
    }
}
module.exports = {verifyAccessToken,verifyRefreshToken};
console.log("The verify the refresh token is ready to use.");