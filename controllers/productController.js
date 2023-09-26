import slugify from "slugify";
import Category from "../models/categoryModel.js";

 import  Products from "../models/productModel.js";
import fs from 'fs';
import braintree from "braintree";
import Order from '../models/orderModel.js';
import dotenv from 'dotenv';

dotenv.config();

//===========payment gateway==========================
let gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
  });

export const createProductController=async(req,res)=>{
    try{
        const {name,description,price,category,quantity,shipping}=req.fields;
        const {photo}=req.files;
        //validation
        // if(!name || !description || !price || !category || !quantity || !shipping){
        //     res.status(400).send({message:"all field are is required"})
        // }
        switch(true){
            case !name:
                return res.status(500).send({error:"name is required"})
            case !description:
                return res.status(500).send({error:"description is required"})
            case !price:
                return res.status(500).send({error:"price is required"})
            case !category:
                return res.status(500).send({error:"category is required"})
            case !quantity:
                return res.status(500).send({error:"quantity is required"})
         
            case photo && photo.size >1000000:
                return res.status(500).send({error:'photo is required and lessthan 1MB'})
        }

      
        const product=new  Products({...req.fields,slug:slugify(name)});
        if(photo){
            product.photo.data=fs.readFileSync(photo.path)
            product.photo.contentType=photo.type
        }
        await product.save()
        res.status(200).send({

            success:true,
            message:"Product created successfully",
            product,
        }
        )
    }
    catch(error){
        console.log(error);
        res.status(400).send({
            success:false,
            message:" Error in creating products"
          });
    }
}

//get all products
export const getProductController=async(req,res)=>{
    try{
        const product=await Products.find({})
        .populate('category')
        .select('-photo')
        .limit(12)
        .sort({createdAt: -1});
        res.status(200).send({
            success:true,
            message:"All products",
            countTotal:product.length,
            product,
        })

    }
    catch(error){
        console.log(error);
        res.status(400).send({
            success:false,
            message:" Error in getting products"
          });
    }
}

//get single products
export const getSingleProductController=async(req,res)=>{
    try{
           const product =await Products.findOne({slug:req.params.slug})
           .select('-photo')
           .populate('category');

           res.status(200).send({
            success:true,
            message:"getting single product",
            product,
           })
    }
    catch(error){
        console.log(error);
        res.status(400).send({
            success:false,
            message:" Error in getting single products"
          });
    }
}
// get photo of products
export const productPhotoController=async(req,res)=>{
    try{
           const product =await Products.findById(req.params.pid).select('photo')
           if(product.photo.data){
            res.set('Content-type',product.photo.contentType);
             return res.status(200).send(product.photo.data)
           }
    }
    catch(error){
        console.log(error);
        res.status(400).send({
            success:false,
            message:" Error in getting photo of products"
          });
    }
}
//delete product 
export const deleteProductController=async(req,res)=>{
    try{ 
        await Products.findByIdAndDelete(req.params.pid).select("-photo");
        res.status(200).send(
            {
                success:true,
                message:'deleted the product'
            }
        )

    }
    catch(error){
        console.log(error);
        res.status(400).send({
            success:false,
            message:" Error in deleting products"
          });
    }
}
//update product 
export const updateProductController=async(req,res)=>{
    try{
        const {name,description,price,category,quantity,shipping}=req.fields;
        const {photo}=req.files;
        //validation
        // if(!name || !description || !price || !category || !quantity || !shipping){
        //     res.status(400).send({message:"all field are is required"})
        // }
        switch(true){
            case !name:
                return res.status(500).send({error:"name is required"})
            case !description:
                return res.status(500).send({error:"description is required"})
            case !price:
                return res.status(500).send({error:"price is required"})
            case !category:
                return res.status(500).send({error:"category is required"})
            case !quantity:
                return res.status(500).send({error:"quantity is required"})
         
            case photo && photo.size >1000000:
                return res.status(500).send({error:'photo is required and lessthan 1MB'})
        }

      
        const product=await  Products.findByIdAndUpdate(req.params.pid,
            {...req.fields,slug:slugify(name)},
            {new:true})
        if(photo){
            product.photo.data=fs.readFileSync(photo.path);
            product.photo.contentType=photo.type;
        }
        await product.save();
        res.status(200).send({

            success:true,
            message:"Product updated successfully",
            product,
        }
        )
    }
    catch(error){
        console.log(error);
        res.status(400).send({
            success:false,
            message:" Error in updating products"
          });
    }

}
//product filter
export const productFiltersController = async (req, res) => {
    try {
      const { checked, radio } = req.body;
      let args = {};
      if (checked.length > 0) args.category = checked;
      if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
      const product = await Products.find(args);
      res.status(200).send({
        success: true,
        product,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        message: "Error WHile Filtering Products",
        error,
      });
    }
  };


  //====================product count controller===============================
  export const productCountController=async(req,res)=>{
 try{
     const total=await Products.find({ }).estimatedDocumentCount();
     res.status(200).send({
        success:true,
        total,
     })
 }
 catch(error){
    console.log(error);
    res.status(400).send({
        success: false,
        message: "Error WHile counting Products",
        error,
      });

 }
  };
  //==================product list based on page=============================
  export const productListController=async(req,res)=>{
    try{
        const perPage=3;
        const page=req.params.page ? req.params.page : 1;
        const product=await Products.find({}).select('-photo').skip((page-1)*perPage).limit(perPage).sort({createdAt:-1});

          res.status(200).send({
            success:true,
            product,
          })
    }
    catch(error){
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error in per page Products",
            error,
          });
    }
  }
  //=======search product ===========================
  export const searchProductController=async(req,res)=>{
    try{
        const {keyword}=req.params
        const result=await Products.find({
            $or: [
                {name:{$regex:keyword,$options:'i'}},
                {description:{$regex:keyword,$options:'i'}},
            ]
        })
        .select("-photo");
        res.json(result);

    }
    catch(error){
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error in searching Products",
            error,
          });
    }
  }
  //==============releated product======================

  export const realtedProductController=async(req,res)=>{
    try{
        const {pid,cid}=req.params;
        const product=await Products.find({
            category:cid,
            _id:{$ne:pid},
        }).select('-photo').limit(3).populate('category');
        res.status(200).send({
            success:true,
            product,
        })
    }
    catch(error){
 console.log(error);
 res.status(400).send({
    success: false,
    message: "Error in releated Products",
    error,
  });
    }
  }
  
  //=========get product by category==============
  export const productCategoryController=async(req,res)=>{
    try{
        const category=await Category.findOne({slug:req.params.slug});
        const product=await Products.find({category}).populate('category')
        res.status(200).send({
            success:true,
            category,
            product,
        })
    }
    catch(error){
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error in getting  Products per category",
            
          });

    }
  }
  //=======payment gateway api==============
  //token
  export const braintreeTokenController=async(req,res)=>{
    try{
        gateway.clientToken.generate({},function(err,response){
            if(err){
                res.status(500).send(err);

            }else{
                res.send(response);
            }
        });        
    }
    catch(error){
        console.log(error);
        // .status(400).send({
        //     success: false,
        //     message: "Error in getting  payment controller",
            
        //   });
    }
  } 

  //================payment================================
  export const braintreePaymentController=async(req,res)=>{
    try{
     const {nonce,cart}=req.body;
     console.log(req.body);
     let total=0;
     cart.map((i)=>{
        total += i.price;
     });
     let newTransation =gateway.transaction.sale({
        amount:total,
        paymentMethodNonce:nonce,
        options:{
            submitForSettlement:true,
        },
     
    },
    function(error,result){
      if(result){
        const order=new Order({
            product:cart,
            payment:result,
            buyer:req.user._id,

        }).save();
        res.json({ok:true});
      }
      else{
        res.status(500).send(error);
      }
     })

    }
    catch(error){
        console.log(error);
       
    }

  };
