
import express from 'express';
//const express=require('express')

import dotenv from 'dotenv';
import connectDB from './config/db.js'
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js'

import categoryRoute from './routes/categoryRoute.js'
import productRoutes from './routes/productRoutes.js'
import cors from 'cors'

//temp

import customers from './models/userModel.js'
import JWT from 'jsonwebtoken';
import { hashPassword } from './helpers/authHelper.js';
//path
//CYCLIC
import path from 'path';
import {fileURLToPath} from 'url'

const app=express()
//configure port
dotenv.config();
//DB connect
connectDB();


//middleware
//app.use(cors());
app.use(cors({origin:"*"}))
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//cyclic
app.use(express.static(path.join(__dirname,'./client/build')))




//====view engine=======
app.set("view engine","ejs");
app.use(express.urlencoded({extended:false}))


app.use(morgan('dev'))

const PORT=process.env.PORT ||8080;


//routes
app.use('/api/auth',authRoutes)
app.use('/api/category',categoryRoute)
app.use('/api/products',productRoutes)

// app.get('/',(req,res)=>{
//     res.send({
//         message:"welcome"
//     })
// })
app.use('*',function(req,res){
  res.sendFile(path.join(__dirname,'./client/build/index.html'));
});

app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`);
})

//======MAIL get===============
app.get('/reset-password/:id/:token', async (req, res) => {
    const { id, token } = req.params;
    console.log(req.params);
    const oldUser = await customers.findOne({ _id: id });
    if (!oldUser) {
      return res.json({ status: "User Not Exists!!" });
    }
    const secret = process.env.JWT_SECRET + oldUser.password;
    try {
      const verify = JWT.verify(token, secret);
      res.render("server", { email: verify.email, status: "Not Verified" });
    } catch (error) {
      console.log(error);
      res.send("Not Verified");
    }
    //res.send('Done');
  });
  //=======mail post ==========
  app.post("/reset-password/:id/:token", async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;
  
    const oldUser = await customers.findOne({ _id: id });
    if (!oldUser) {
      return res.json({ status: "User Not Exists!!" });
    }
    const secret = process.env.JWT_SECRET + oldUser.password;
    try {
      const verify = JWT.verify(token, secret);
      const encryptedPassword = await hashPassword(password);
      await customers.updateOne(
        {
          _id: id,
        },
        {
          $set: {
            password: encryptedPassword,
          },
        },
      );
  
      res.render("server", { email: verify.email, status: "verified" });
    } catch (error) {
      console.log(error);
      res.json({ status: "Something Went Wrong" });
    }
  });

