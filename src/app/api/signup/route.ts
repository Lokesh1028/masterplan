import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
export async function POST(req: Request) {
  try { const { email, password, storeName } = await req.json(); if(!email||!password) return NextResponse.json({error:"Email and password required"},{status:400}); const exists = await prisma.user.findUnique({where:{email}}); if(exists) return NextResponse.json({error:"Email already registered"},{status:400}); const hashed = await bcrypt.hash(password,10); const user = await prisma.user.create({data:{email,password:hashed,storeName:storeName||""}}); return NextResponse.json({id:user.id,email:user.email}) } catch(e:any) { return NextResponse.json({error:e.message},{status:500}) }
}
