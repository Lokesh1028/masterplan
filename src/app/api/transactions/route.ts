import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserId } from "@/lib/session"
export async function GET() { const uid = await getUserId(); if(!uid) return NextResponse.json({error:"Unauthorized"},{status:401}); return NextResponse.json(await prisma.transaction.findMany({where:{userId:uid},orderBy:{createdAt:"desc"}})) }
