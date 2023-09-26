import express  from "express";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
import {braintreePaymentController, braintreeTokenController, 
      createProductController, deleteProductController, 
      getProductController, getSingleProductController,
     productCategoryController,
     productCountController,
     productFiltersController,
     productListController,
     productPhotoController, realtedProductController, searchProductController, updateProductController} from './../controllers/productController.js';
import formidable from "express-formidable";


const router =express.Router()

//routes
//create product
router.post('/create-product',requireSignIn,isAdmin,formidable(),createProductController);

//update product
router.put('/update-product/:pid',requireSignIn,isAdmin,formidable(),updateProductController);

//get product
router.get('/get-product',getProductController);

//get single product
router.get('/get-product/:slug',getSingleProductController);
 
//get photo
router.get('/product-photo/:pid',productPhotoController);

//delete product
router.delete('/delete-product/:pid',deleteProductController);

//filter routes
router.post('/product-filters',productFiltersController);

//product count
router.get('/product-count',productCountController)

//product per page
router.get('/product-list/:page',productListController);

//search product
router.get('/search/:keyword',searchProductController);

//similar product
router.get('/related-product/:pid/:cid',realtedProductController);

//category wise product
router.get('/product-category/:slug',productCategoryController);

//payment router
//token
router.get('/braintree/token',braintreeTokenController);

//payments
router.post('/braintree/payment',requireSignIn,braintreePaymentController);


export default router;