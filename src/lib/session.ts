import { getServerSession } from "next-auth"
import { authOptions } from "./auth"
export async function getUserId(): Promise<string | null> { const s = await getServerSession(authOptions); return (s?.user as any)?.id || null }
