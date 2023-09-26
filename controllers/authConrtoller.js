import { comparePassword, hashPassword, } from "../helpers/authHelper.js";

import customers from '../models/userModel.js'
import JWT from 'jsonwebtoken';
import Order from '../models/orderModel.js';

import nodemailer from 'nodemailer';

// app.set("view engine","ejs");
import dotenv from 'dotenv';
dotenv.config();

//register user
 export const Register=async(req,res)=>{
    try{
        const  {name,email,password,phone}=req.body;
        console.log(req.body);
        if(!name|| !email || !password || !phone){
            res.status(400);
            //res.send("all fields are mandatory..")
            return res.send({message:"all fields are mandatory"})
        }
         //check user
        const existUser=await customers.findOne({email})
        //existing user
        if(existUser){
            return res.status(200).send({success:false,
                 message:"user already register,Please login"})

        }
        else{
               
            const html=` <h2>Dear User thanks for registration</h2><br>
            <p>Stay updated for more information.</p>`;
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'business999945+demo@gmail.com',
                  pass: 'gkpz kmya opio kvel'
                }
              });
              //iiaeewfijhadtiqp
              var mailOptions = {
                from: 'youremail@gmail.com',
                to: `${email}`,
                subject: 'Successfully register',
                html:html,
               // text: link,
                attachments:[{
                    
                    filename:"https://i.gifer.com/8V9H.gif",
                }]
                
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
            //console.log(link);
        }
        //============register userPassword=======
        const hashedPassword=await hashPassword(password);
        //save

        //===========new user=============
        const user=await new customers({name,email,password:hashedPassword,phone}).save();
       

        return res.status(201).send({
            success:true,
            message:"user register successfully...",user
        })
//============sending mail to register user==========================
  // try{
    //  const user=await Register.findOne({email});
      
      // if(!user){
      //     return res.json({status:"user not found"});
      // }
     // const secret=JWT_SECRET + user.password;
     // const token=jwt.sign({email:user.email,id:user._id},secret,{expiresIn:'5m',});
      //console.log('token is:'${token})

     // const link=`http://localhost:5000/reset-password/${user._id}/${token}`;
     // const html=` <h2>Dear User thanks for registration</h2><br>
   //   <p>Stay updated for more information.</p>`;
    //   var transporter = nodemailer.createTransport({
    //       service: 'gmail',
    //       auth: {
    //         user: 'bavisettikalyan2@gmail.com',
    //         pass: 'iiaeewfijhadtiqp'
    //       }
    //     });
        
        // var mailOptions = {
        //   from: 'youremail@gmail.com',
        //   to: `${email}`,
        //   subject: 'Successfully register',
        //   html:html,
        //  // text: link,
        //   attachments:[{
              
        //       filename:"https://i.gifer.com/8V9H.gif",
        //   }]
          
        // };
        
    //     transporter.sendMail(mailOptions, function(error, info){
    //       if (error) {
    //         console.log(error);
    //       } else {
    //         console.log('Email sent: ' + info.response);
    //       }
    //     });
    //   console.log(link);
  }
    catch(err){
        console.log(err);
        res.status(400).json({message:"register failed"})
    }
}
//===========login user===============
export const loginController=async(req,res)=>{
    try{
        const {email,password}=req.body;
        //validation
        if(!email || !password){
           return res.status(404).send({success:false,message:"Invalid email or password",})

        }
        //check user
        const user=await customers.findOne({email})
        if(!user){
            return res.status(404).send({success:false,message:"email is not found"})
        }

        const match=await comparePassword(password,user.password);
        if(!match){
            return res.status(200).send({success:false,message:"Invalid password"})
        }

        //token
        const token=await JWT.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:"2d",})
        res.status(200).send({success:true,message:"login successfully..",
        user:{
            _id:user._id,
            name:user.name,
            email:user.email,
            phone:user.phone,
            role:user.role,
        },
        token:token})

        //==console.log(token);

    }
    catch(error){
        console.log(error);
        res.status(400).send({success:false,message:"login failed",error})

    }
}
//forget password controller

// export const forgetPasswordController=async(req,res)=>{
//     try{
//         const {email,answer,newPassword}=req.body;
//         if(!email || !answer || !newPassword){
//             res.status(400).send({message:"all field are is required"})
//         }

//         //check
//         const user =await customers.findOne({email,answer})
//       //validation
//       if(!user){
//         return res.status(404).send({
//             success:false,
//             message:"wrong Email or Answer"
//         })
//       }
//       const hashed =await hashPassword(newPassword)
//       await customers.findByIdAndUpdate(user._id,{password:hashed})
//       res.status(200).send({
//         success:true,
//         message:"password reset successfully",
//       })
//     }
//     catch(error){
//         console.log(error)
//         res.status(500).send({
//             success:false,
//             message:"something went wrong",
//             error
//         })
//     }
//  }

//============forget password with mail======================POST
export const forgetPasswordController=async(req,res)=>{
           const {email}=req.body;
           console.log('forget passsword mail:',email)
    try{
        const user=await customers.findOne({email});
        
        if(!user){
            return res.status(400).send({success:false,
              message:'Email not found',
            });
        }
      //  const hashed =await hashPassword(newPassword)
      //await customers.findByIdAndUpdate(user._id,{password:hashed})
    //   res.status(200).send({
    //     success:true,
    //     message:"password reset successfully",
    //   })

        /////////////////////////////////////////
        const secret=process.env.JWT_SECRET + user.password;
       // const token=await JWT.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:"2d",})

        const token= await JWT.sign({email:user.email,_id:user._id},secret,{expiresIn:'2d',});
        console.log(`token is   :  ${token}`)

        const link=`http://localhost:${process.env.PORT}/reset-password/${user._id}/${token}`;
       const html=` <h1>hi</h1>`;
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'business999945+demo@gmail.com',
              pass: 'gkpz kmya opio kvel'
            }
          });
          
          var mailOptions = {
            from: 'youremail@gmail.com',
            to: `${email}`,
            subject: 'Password Reset',
            html:link ,
           // text: link,
        
            attachments:[{
                
                filename:"https://i.gifer.com/8V9H.gif",
            }]
            
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
        console.log(link);
        res.status(200).send({
            message:'forget password success'
         })
    }
    catch(error){
        console.log(error);
    }

}
//==============updating the forgetpassword with mail=============GET
// export const resetPasswordController=async(req,res)=>{
//     const {_id,token}=req.params;
//     console.log(req.params);
//     // const oldUser =await customers.findOne({_id:id});
//     // if(!oldUser){
//     //     return res.json({status:"user not Exist"})
//     // }

//     // const secret=process.env.JWT_SECRET+oldUser.password;
//     // try{
//     //     const verify=JWT.verify(token,secret)
//     //     res.render('./server',{email:verify.email,status:'Not verified'})
//     //     //res.send('Verified')
//     // }
//     // catch(error){
//     //     console.log(error);
//     //   res.send({message:"not verified"});
//     // }
//     res.send('Done');
  

// }
//=======post===
// export const resetpostPasswordController=async(req,res)=>{
//     const {_id,token}=req.params;
//     const {password}=req.body;

//     // console.log(req.params);
//     // const oldUser =await customers.findOne({_id:id});
//     // if(!oldUser){
//     //     return res.json({status:"user not Exist"})
//     // }
//     // const secret=process.env.JWT_SECRET+oldUser.password;
//     // try{
//     //     const verify=JWT.verify(token,secret);
//     //     const encryptedPassword=await hashPassword(password,10);
//     //     await customers.updateOne(
//     //         {
//     //             _id:id,
//     //         },
//     //         {
//     //             $set:{
//     //                 password:encryptedPassword,
//     //             },
//     //         }
//     //     );

//     //     res.json({status:'Password Updated'})
//     //      res.render('./server',{email:verify.email,status:'Verified'})
//     // }
//     // catch(error){
//     //     console.log(error);
//     //   res.json({status:"something went wrong"})
//     // }
//     res.send('Done');


// }


//test constroller
export const testController=(req,res)=>{
    res.status(200).send({message:"protected route"})
}

// =========update the profile page============
export const updateProfileController=async(req,res)=>{
    try{
      const {name,email,password,phone}=req.body;
      console.log(req.body);
      const user =await customers.findById(req.user._id);
      //password
    //   if(password && password.length< 6){
    //     return res.json({error:"password id required and 6 character long"})
    //   }
      const hashedPassword=password ? await hashPassword(password) : undefined;
      const updatedUser =await customers.findByIdAndUpdate(req.user._id,{
        name:name ||user.name,
        password:hashedPassword || user.password,
    
        phone:phone || user.phone,
      },{new:true});
      res.status(200).send({
        success:true,
        message:'Your profile updated successfully',
        updatedUser,
      })
    }
    catch(error){

        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in updating the profile",
            error
        })
    }
}

// =============orders=================
export const getOrdersController=async(req,res)=>{
    try{
        const orders =await Order.find({buyer:req.user._id}).populate('products','-photo').populate('buyer','name')
        res.json(orders);


    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in getting orders",
            error,
        })
    }
};

//===========admin all products===================================================
export const getAllOrdersController=async(req,res)=>{
    try{
        
        const orders =await Order.find({}).populate('products','-photo').populate('buyer','name').sort({createdAt:'-1'});
            res.json(orders);
      
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in getting all-orders",
            error,
        })
    }
};
export const orderStatusController=async(req,res)=>{
    try{
       const {orderId}=req.params;
       const {status}=req.body;
       const orders=await Order.findByIdAndUpdate(orderId,{status}, {new:true})
       res.json(orders);
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in getting all-orders",
            error,
        })
    }
}