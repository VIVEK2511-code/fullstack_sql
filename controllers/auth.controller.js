import {prismaClient}  from "@prisma/client"

const prisma=new prismaClient()
export const registerUser=async(req,res)=>{

    console.log("user registered")
    await prisma.user.findUnique({
        where:{email}
    })
}