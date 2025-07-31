const blacklistModel = require("../models/blacklists.model");
/**here I create a check blacklists middleware that after logout from the system the user cannot create an access token */
const checkBlacklists = async(req,res,next)=>{
    console.log("Executing the check black lists middleware ");
    console.log("The req.headers for the check black lists middleware is:", req.headers);
    console.log("The req.cookies for the check black lists middleware is:", req.cookies);
    // console.log("The req.headers for the authorization for the check black lists middleware is", req.headers.authorization)
    try {
        const authHeader = req.headers._refreshtoken || req.cookies.refreshToken;
        console.log("The auth header for the check black lists :",authHeader);
        if(!authHeader){
            return res.status(401).json({success:false,message:"The auth header is missing."})
        }
        const blacklistedToken = await blacklistModel.findOne({token:authHeader});
        console.log("The black listed token in DB is:", blacklistedToken);
        if(blacklistedToken){
            return res.status(200).json({success:true,message:"Token is already destroyed. You have log in again to visit all the paths"})
        }
        next();
    } catch (error) {
        console.error("Error !! error during the check blacklists middleware is :", error.message);
        return res.status(500).json({success:false,message:"Internal server error.."})
    }
}
module.exports = checkBlacklists;
console.log("The check black lists middleware is ready to use.")