const express = require('express');
const app= express();
/**consume the dot env file */
require('dotenv').config();
/**consume cookies */
const cookieParser = require('cookie-parser');
app.use(cookieParser());
/**consume the express expression */
app.use(express.json());
app.use(express.urlencoded({extended:true}));
/**consume the database connection */
require('./db/db.connection');
/**consume the userPath */
const userPath = '/user';
const userRoute = require('./routes/user.route');
app.use(`${process.env.API_URL}${userPath}`, userRoute);
/**consume the basic url */
app.get('/',(req,res)=>{
    res.send('<h4 style="color:red">Welcome to the e_user</h4>')
})
app.listen(process.env.PORT,()=>{
    console.log(`The server listens at port number ${process.env.PORT}`);
})