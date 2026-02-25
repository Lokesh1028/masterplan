import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserId } from "@/lib/session"
export async function GET() { const uid = await getUserId(); if(!uid) return NextResponse.json({error:"Unauthorized"},{status:401}); return NextResponse.json(await prisma.user.findUnique({where:{id:uid},select:{id:true,email:true,storeName:true,address:true,phone:true,logoUrl:true,taxRate:true,currency:true}})) }
export async function PUT(req: Request) { const uid = await getUserId(); if(!uid) return NextResponse.json({error:"Unauthorized"},{status:401}); const d = await req.json(); return NextResponse.json(await prisma.user.update({where:{id:uid},data:{storeName:d.storeName,address:d.address,phone:d.phone,logoUrl:d.logoUrl||"",taxRate:d.taxRate||0,currency:d.currency||"INR"}})) }
