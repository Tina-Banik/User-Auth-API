const mongoose = require('mongoose');
const blacklistsSchema = mongoose.Schema({
    token:{
        type:String,
        unique:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:"6s"
    }
},{versionKey:false,timeStamps:true});
const blacklistModel = mongoose.model("blacklistModel",blacklistsSchema,"blacklists");
module.exports = blacklistModel;
console.log("The blacklists model is ready to use..");