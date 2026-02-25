"use client"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
export default function LoginPage() {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [error, setError] = useState(""); const [loading, setLoading] = useState(false); const router = useRouter()
  const handleLogin = async (e: React.FormEvent) => { e.preventDefault(); setLoading(true); setError(""); const res = await signIn("credentials", { email, password, redirect: false }); if (res?.error) { setError("Invalid email or password"); setLoading(false) } else router.push("/dashboard") }
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8"><div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4"><span className="text-white font-bold text-2xl">M</span></div><h1 className="text-2xl font-bold text-gray-900">Welcome back</h1><p className="text-gray-500 mt-1">Sign in to Masterplan</p></div>
        <form onSubmit={handleLogin} className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
          {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>}
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"/></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"/></div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">{loading ? "Signing in..." : "Sign In"}</button>
          <p className="text-center text-sm text-gray-500">No account? <Link href="/signup" className="text-blue-600 font-medium hover:underline">Sign up</Link></p>
        </form>
      </div>
    </div>
  )
}
