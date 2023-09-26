import Category from "../models/categoryModel.js";
import slugify from "slugify";

//create category
export  const createCategoryController=async(req,res)=>{
    try{
      const {name}=req.body;
      console.log(req.body)
      if(!name){
        return res.status(401).send({message:'name is required'})

      }
      const existingCategory= await Category.findOne({name})
      if(existingCategory){
        return res.status(200).send({
            success:true,
            message:"category already exists",
        })
      }
      const category =await new Category({name,slug:slugify(name),}).save()
      res.status(201).send({
        success:true,
        message:"new category is created",
        category,
      })

    }
    catch(error){
        console.log(error)
        res.status(404).send({
            success:false,
            message:"error in category",

        })
    }

}

//update category controller
export const updateCategoryController=async(req,res)=>{
   try{
    const {name} =req.body;
    const {id}=req.params
    const category =await Category.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true})
    res.status(200).send({success:true,
    message:"category updated successfully",
  category,})

   }
   catch(error){
    console.log(error)
    res.status(500).send({success:false,
    message:"error in updating categorty"})
   }    

}
//get all category
export const categoryController=async(req,res)=>{
  try{ //you changed 'categories'
    const category=await Category.find({});
    res.status(200).send({
      success:true,
    message:'All categories list',
  category,})

  }
  catch(error){
    console.log(error);
    res.status(400).send({
      success:false,
      message:"error in getting all category"
    })
  }

}
//single category
export const singleCategoryController=async(req,res)=>{
  try{

    const category =await Category.findOne({slug:req.params.slug});
   res.status(200).send({
    success:true,
    message:"Get single category",
    category,
   });
  }
  catch(error){
    console.log(error);
    res.status(400).send({
      success:false,
      message:"error in getting single category"
    });
  }
}
//delete category
export const deleteCategoryController =async(req,res)=>{
  try{
    const {id}=req.params;
     await Category.findByIdAndDelete(id)
     res.status(200).send({
      success:true,
      message:"category deleted successfully"
     })
  }
  catch(error){
    console.log(error);
    res.status(400).send({
      success:false,
      message:"error in getting single category"
    });

  }
}