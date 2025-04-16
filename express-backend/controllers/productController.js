import Product from "../models/Product.js";

export const getAllProducts = async(req,res)=>{
    const products = await Product.find();
    res.json(products);
};

export const getSingleProduct = async(req,res)=>{
    try{
        const product = await Product.findById(req.params.id);
        res.json(product);
    }
    catch(error){
        res.status(500).json({message:"Error getting product",error:error.message});
    }
}

export const addNewProduct = async(req,res)=>{
    try{
        if(req.user.role !== "admin"){
            return res.status(403).json({message:"Unauthorized"});
        }
        
        const product = await Product.create(req.body);
        res.status(201).json(product);
    }
    catch(error){
        res.status(500).json({message:"Error adding product",error:error.message});
    }
}

export const updateProduct = async(req,res)=>{
    try{
        if(req.user.role !== "admin"){
            return res.status(403).json({message:"Unauthorized"});
        }
        
        const product = await Product.findByIdAndUpdate(req.params.id,req.body,{new:true});
        res.json(product);
    }
    catch(error){
        res.status(500).json({message:"Error updating product"});
    }
}

export const deleteProduct = async(req,res)=>{
    try{
        if(req.user.role !== "admin"){
            return res.status(403).json({message:"Unauthorized"});
        }
        
        await Product.findByIdAndDelete(req.params.id);
        res.json({message:"Product deleted"});
    }
    catch(error){
        res.status(500).json({message:"Error deleting product",error:error.message});
    }
}