import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseUser } from '@/infra/supabase-server'

export async function GET(req: NextRequest) {
  const token = req.cookies.get('sb-access-token')?.value
  if (!token) {
    return NextResponse.json({ user: null }, { status: 200 })
  }

  try {
    const sb = getSupabaseUser(token)
    const { data, error } = await sb.auth.getUser()
    if (error || !data.user) {
      return NextResponse.json({ user: null }, { status: 200 })
    }
    return NextResponse.json({
      user: { id: data.user.id, email: data.user.email ?? '' },
    })
  } catch {
    return NextResponse.json({ user: null }, { status: 200 })
  }
}
