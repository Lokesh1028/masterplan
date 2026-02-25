import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserId } from "@/lib/session"
export async function POST(req: Request) { const uid = await getUserId(); if(!uid) return NextResponse.json({error:"Unauthorized"},{status:401}); const {productId,quantity} = await req.json(); const p = await prisma.product.findUnique({where:{id:productId}}); if(!p||p.userId!==uid) return NextResponse.json({error:"Not found"},{status:404}); await prisma.product.update({where:{id:productId},data:{stockQuantity:p.stockQuantity+quantity}}); await prisma.transaction.create({data:{userId:uid,type:"IMPORT",amount:p.costPrice*quantity,description:`Restocked ${quantity} ${p.unit} of ${p.name}`,referenceId:productId}}); return NextResponse.json({ok:true}) }
