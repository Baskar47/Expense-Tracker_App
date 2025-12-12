const User=require('../models/userModel')
const bcrypt=require('bcrypt')
// import bcrypt from 'bcrypt'
const jwt=require('jsonwebtoken')

const register= async (req,res,next)=>{
 
    const {name,email,password}=req.body
   
    const existingUser=await User.findOne({email:email})
    try{
    if(existingUser){
        res.status(400).json({

            message:"you are already exist as user"
        })
    }
    const hashed= await bcrypt.hash(password,10)
    const user=await User.create({name,email,password:hashed})
    res.status(201).json({
        success:true,
        message:"register success",
        data:{
            user:user
        }
    })
    }catch(err){
        console.log(err)
        
    }
   
}


const login=async (req,res,next)=>{

    
        const {email,password}=req.body
   try{
     const user=await User.findOne({email:email})
     if(!user){
        res.status(400).json({
            message:'you are not a user,plz register'
        })
     }

     const match=await bcrypt.compare(password,user.password)
     if(!match)res.send(400).json({message:'password invalid'})
        const token=await jwt.sign({email:email},process.env.JWT_SECRET,
    {
        expiresIn:'1h'
    })

    res.status(200).json({
        success:true,
        message:'login successfully',
        token
    })



    }catch(err){

        console.log(err)
    }
}

module.exports={
    register,
    login
}