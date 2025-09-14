import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from 'cors'

//custom routes
import userRouter from "./routes/auth.routes";
dotenv.config()
const app=express()
const port=process.env.PORT||4000


app.use(cookieParser())
app.use(cors({
    origin:'http://localhost:5173'
}))

app.use(express.json())

app.use(express.urlencoded({extended:true}))

app.get("/",(req,res)=>{
    res.status(200).json({
        success:true,
        Message:"test checked"
    })
})

app.use("/api/v1/users",userRouter);
app.listen(port,()=>{
    console.log(`Backend is listening at port:${port}`)
})