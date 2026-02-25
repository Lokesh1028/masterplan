import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserId } from "@/lib/session"
export async function GET() { const uid = await getUserId(); if(!uid) return NextResponse.json({error:"Unauthorized"},{status:401}); return NextResponse.json(await prisma.customer.findMany({where:{userId:uid},orderBy:{name:"asc"}})) }
export async function POST(req: Request) { const uid = await getUserId(); if(!uid) return NextResponse.json({error:"Unauthorized"},{status:401}); const d = await req.json(); return NextResponse.json(await prisma.customer.create({data:{userId:uid,name:d.name,address:d.address||"",phone:d.phone||"",email:d.email||""}})) }
export async function PUT(req: Request) { const uid = await getUserId(); if(!uid) return NextResponse.json({error:"Unauthorized"},{status:401}); const d = await req.json(); return NextResponse.json(await prisma.customer.update({where:{id:d.id},data:{name:d.name,address:d.address,phone:d.phone,email:d.email}})) }
export async function DELETE(req: Request) { const uid = await getUserId(); if(!uid) return NextResponse.json({error:"Unauthorized"},{status:401}); const id = new URL(req.url).searchParams.get("id"); if(!id) return NextResponse.json({error:"Missing id"},{status:400}); await prisma.customer.delete({where:{id}}); return NextResponse.json({ok:true}) }
