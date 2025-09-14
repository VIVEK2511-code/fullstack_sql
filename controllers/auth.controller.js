import {prismaClient}  from "@prisma/client"
import bcrypt from "bcryptjs"
import crypto from "crypto"
import jwt from "jsonwebtoken"
const prisma=new prismaClient()


export const registerUser=async(req,res)=>{

    const {name,email,password,phone}=req.body;
    if(!name || !email || !password || !phone){
        return res.status(400).json({
            success:false,
            message:"All fields are required"})
    }

    try{

        const existingUser=await prisma.user.findUnique({
            where:{email}


        })

        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User already exists"
            })
        }

//hash password
        const hashedPassword=await bcrypt.hash(password,10);
         const verificationToken=crypto.randomBytes(32).toString("hex");
        const user=await prisma.user.create({
            data:{
                name,
                email,
                phone,
                password:hashedPassword,
                verificationToken
            }
        })
     // send mail to user with verification token
    }catch(error){

        return res.status(500).json({
            success:false,
            message:"registration failed",
        })

    }

}

export const loginUser=async(req,res)=>{

    const {email,password}=req.body;
    if(!email || !password){
        return res.status(400).json({
            success:false,
            message:"All fields are required"
        })
    }
    try{
        const user=await prisma.user.findUnique({
            where:{email}
        })
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User does not exist"
            })
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({
                success:false,
                message:"Invalid credentials"
            })
        }
        if(!user.isVerified){
            return res.status(400).json({
                success:false,
                message:"Please verify your email to login"
            })
        }

        const token=jwt.sign({
            id:user,id,role:user.role}
            ,process.env.JWT_SECRET,{expiresIn:"24h"}
        )
    const cookieOptions={
        expires:new Date(Date.now()+24*60*60*1000),
        httpOnly:true
    }
    res.cookie("token",token,cookieOptions)

    return res.status(201).json({
        success:true,
        message:"Login successful",

    })

    }catch(error){

    }

}