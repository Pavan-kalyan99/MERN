import JWT from 'jsonwebtoken'
import customers from '../models/userModel.js'
//protected routes token base
export const requireSignIn=async(req,res,next)=>{
    try{

        const decode =JWT.verify(req.headers.authorization, process.env.JWT_SECRET);
        req.user=decode;
        next();
    }
    catch(err)
    {
        console.log(err);
    }

}
//admin access
export  const isAdmin=async(req,res,next)=>{

    try{

        const user =await customers.findById(req.user._id);
        if(user.role !==1){
            return res.status(401).send({
                message:"Unauthorized access"
            })
        }
        else{
            next();
        }
    }
    catch(err){
        console.log(err);
         res.status(401).send({
            message:"error in admin middleware"
        })
    }
}
