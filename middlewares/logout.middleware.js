const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const validateToken = async(req,res,next)=>{
    console.log("Executing the logout middleware..");
    console.log('The req header authorization :', req.header("Authorization"));
    try {
        const authHeader = req.cookies.refreshToken || req.header('Authorization').replace("Bearer ","");
        console.log("The auth header token with Bearer: ", authHeader);
        if(!authHeader){
            return res.status(401).json({success:false,message:"The auth header is missing.."})
        }
        const decodedToken = jwt.verify(authHeader,process.env.REFRESH_KEY);
        console.log("The decoded token is :", decodedToken);
        const logoutUser = await userModel.findById(decodedToken._id);
        console.log("the decoded token for the logout user is ", logoutUser);
        req.user = logoutUser;
        console.log("the logout user is :", req.user);
        next();
    } catch (error) {
        console.error('Error !! During the logout middleware :', error.message);
        if(error.message){
            return res.status(401).json({success:false,message:"The JWT expired.."})
        }
        return res.status(500).json({success:false,message:"Internal server error !!"})
    }
}
module.exports = validateToken;
console.log("The validate token which is used for the logout ready to use")