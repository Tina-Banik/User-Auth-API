const mongoose = require('mongoose');
mongoose.set('strictQuery',true);
const database_connection = mongoose.connect(`${process.env.MONGODB_URL}`)
    .then(()=>{
    console.log('The database strung is ready to use...');
    })
    .catch((error)=>{
        console.log('Error !!! Error in database connection',error.message);
    })
module.exports = database_connection;
console.log('The data base connection string is ready to be used..');