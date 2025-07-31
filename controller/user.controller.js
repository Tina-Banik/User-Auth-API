const {create_accessToken,create_refreshToken} = require("../middlewares/jwt.helper");
const blacklistModel = require("../models/blacklists.model");
const userModel = require("../models/user.model");
const bcrypt = require('bcryptjs');
/**register the user */
const register = async(req,res)=>{
    try {
        const {username,email,password,role} = req.body;
        console.log(`The username is ${username}, email : ${email} , password: ${password} and ${role}`);
        if(!username || !email || !password || !role){
            const missingFields = !username ?  "username" : !email ? "email" : !password ? "password" : !role ? "role" : "";
            console.log(`The missing fields are : ${missingFields}`);
            return res.status(500).json({success:false,message:`The missing fields are : ${missingFields}`})
        }
        const userExists = await userModel.findOne({email});
        console.log('The user is exists..', userExists);
        if(userExists){
            return res.status(200).json({success:true,message:`The user is already exists :${userExists}`})
        }
        const salt = await bcrypt.genSaltSync(10);
        const hashPass = await bcrypt.hashSync(password,salt);
        const newUser = await userModel.create({username,email,password:hashPass,role});
        console.log("The user details is :", newUser);
        if(newUser){
            return res.status(200).json({success:true, message:"The registered is done successfully.."})
        }else{
            return res.status(500).json({success:false,message:"The user data is not valid.."})
        }
    } catch (error) {
        console.log('Error during the register the user..', error.message);
        return res.status(500).json({success:false,message:"Error during the registration"})
    }
};
/**login the user */
const login = async(req,res)=>{
    try {
        const {username,email,password} = req.body;
        console.log(`The username : ${username} and email : ${email}`);
        if(!(username || email)){
            return res.status(404).json({success:false, message:"The username or email is required"});
        }
        const validUser = await userModel.findOne({
            $or:[{username},{email}]
        });
        console.log("The valid user is :", validUser);
        if(!validUser){
            return res.status(500).json({success:false,message:"The user is not valid.."})
        }
        if(!password){
            return res.status(500).json({success:false,message:"The password is required"})
        }
        const validUserPassword = await validUser.password;
        console.log("The valid user password is :", validUserPassword);
        /**now we check the password */
        const validPassword = await validUser.isPasswordCorrect(password);
        console.log("The valid password for the valid user is ", validPassword);
        if(!validPassword){
            return res.status(404).json({success:false,message:"The user credentials are not true."})
        }
        const loggedUser = await userModel.findById(validUser._id);
        console.log("The logged user is :", loggedUser);
        /**if the password and logged user is valid, then we create an access token and refresh token */
        const accessToken = await create_accessToken(loggedUser.email,loggedUser.role,loggedUser._id);
        console.log("the access token is :", accessToken);
        const refreshToken = await create_refreshToken(loggedUser.email,loggedUser._id);
        console.log("the refresh token is :", refreshToken);
        const options = {
            httpOnly: true,
            secure: true,
            maxAge: 20*1000
        };
        return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,{httpOnly:true,secure:true,maxAge: 2* 60 *1000}).json({success :true,info: loggedUser.username,_accessToken:accessToken,_refreshToken:refreshToken , message: `${loggedUser.username} is logged in successfully`})
    } catch (error) {
        console.log('Error!! Error during the login..',error.message);
        return res.status(500).json({success:false,message:"Internal server error.."})
    }
};
/**logout the user */
const logout = async(req,res)=>{
    // return res.status(200).json({success:true,message:"The user is successfully logout.."})
    console.log("The req.user that comes from the logout middleware ", req.user);
    try {
        const token = req.user.refreshToken;
        console.log("the token is :", token);
        const savedBlacklists = await blacklistModel.create({token:token});
        console.log("the saved blacklists token is :", savedBlacklists);
        await userModel.findByIdAndUpdate(
            {_id:req.user._id},
            {$unset:{refreshToken:null}},
            {new:true}
        );
        const options = {
            httpOnly:true,
            secure:true
        }
        return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json({success:true,message:`${req.user.username} is logged out successfully`})
    } catch (error) {
        console.error("Error !! error during the logout :", error.message);
        return res.status(500).json({success:false,message:"Internal server error.."})
    }
}
/**refresh the access token */
const refreshAccessToken = async(req,res)=>{
    console.log("The req.user after verifying the refresh token :", req.decode);
    try {
        const trueLoggedInfo = await userModel.findOne({email:req.decode.email});
        console.log("The logged info is true for generating the access token:",trueLoggedInfo);
        // const newAccessToken = await create_accessToken(trueLoggedInfo.email,trueLoggedInfo.role,trueLoggedInfo._id);
        // console.log("The new access token is :", newAccessToken);
        return res.status(200).json({success:true,email:req.decode.email, _newAccessToken: await create_accessToken(trueLoggedInfo.email,trueLoggedInfo.role,trueLoggedInfo._id),message:"The access token is re-generated successfully.."})
    } catch (error) {
        console.error("Error !! error comes from the refresh the access token:", error.message);
        return res.status(500).json({success:false,message:"Internal server error.."})
    }
}
/**user change the password */
const changePassword = async(req,res)=>{
    // return res.status(200).json({success:true,message:"The password is changed successfully.."})
    try {
        const {oldPassword, newPassword} = req.body;
        console.log(`The old password is : ${oldPassword} and new password is : ${newPassword}`);
        if(!oldPassword){
            return res.status(500).json({success:false,message:"The old password is required."})
        }
        const user = await userModel.findById(req.decode._id);
        console.log("The user who need to change the password:",user);
        const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
        if(!isPasswordCorrect){
            return res.status(401).json({success:false,message:"The old password is not correct"})
        }
        if(!newPassword){
            return res.status(401).json({success:false,message:"The new password is required."})
        }
        if(typeof newPassword !== 'string' || typeof newPassword === ''){
            return res.status(500).json({success:true,message:"The passwords can not blank."})
        }
        user.password = await bcrypt.hash(newPassword,10);
        await user.save({validateBeforeSave:false});
        return res.status(200).json({success:true,message:"The user password is set successfully..."})
    } catch (error) {
        console.error("Error !! during the change password:", error.message);
        return res.status(500).json({success:false,message:"Internal server error.."})
    }
}
/**update the user details */
const updateUserDetails = async(req,res)=>{
    try {
        if(req.method === 'PUT' || req.method === 'PATCH'){
            console.log("The put and patch method is accepted..");
            if(req.decode._id !== req.params.id){
                return res.status(401).json({success:false,message:"The user id does not exists."})
            }
            const existingUserId = await userModel.findById(req.decode._id);
            console.log("The user exists :", existingUserId);
            const updateData = {...req.body};
            const change = Object.keys(updateData).some(
                key => updateData[key] && updateData[key] !== existingUserId[key]
            );
            console.log("The change requests is coming:", change);
            if(!change){
                return res.status(500).json({success:false,message:"The user data remains same"})
            }
            const userUpdateDetails = await userModel.findByIdAndUpdate(req.decode._id, updateData,{new:true}).select("-password -role -refreshToken");
            console.log("The user update details :", userUpdateDetails);
            if(!userUpdateDetails){
                return res.status(500).json({success:false,message:"The user details are not updated."})
            }
            return res.status(200).json({success:true,info:userUpdateDetails,message:"The user details are updated successfully.."})
        }else{
            console.error(`${req.method} is not defined`)
        }
    } catch (error) {
        console.error('Error !! during the update info', error.message);
        return res.status(500).json({success:false,message:"Internal server error..."})
    }
    
}
module.exports ={register,login,logout,refreshAccessToken,changePassword,updateUserDetails};
console.log('The user controller is ready to use..');