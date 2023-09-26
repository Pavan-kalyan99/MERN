import express  from "express";
import {Register,loginController,forgetPasswordController,testController, 
    updateProfileController,
     getOrdersController, getAllOrdersController, orderStatusController, 
  } from '../controllers/authConrtoller.js';
//   resetPasswordController, resetpostPasswordController
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
const router=express.Router();

//router
//REGISTER POST
router.post('/register',Register)

//LOGIN POST
router.post('/login',loginController)

//forget password | POST
router.post('/forget-password',forgetPasswordController);

//update the forgetpassword with mail
//router.get('/reset-password/:id/:token',resetPasswordController);

//router.post('/reset-password/:id/:token',resetpostPasswordController);

//test route GET
router.get('/test',requireSignIn,isAdmin,testController)

//protected route admin
router.get('/admin-auth',requireSignIn,isAdmin, (req,res)=>{
    res.status(200).send({ok:true})
});

//protected route auth 
router.get('/user-auth',requireSignIn,(req,res)=>{
    res.status(200).send({ok:true})
});

//update profile
router.put('/profile',requireSignIn,updateProfileController);

//user order
router.get('/orders',requireSignIn,getOrdersController);

//Admin all orders
router.get('/all-orders',requireSignIn,isAdmin,getAllOrdersController);

//order status update
router.put('/order-status/:orderId',isAdmin,requireSignIn,orderStatusController);

export default router;