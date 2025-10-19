import { NextRequest, NextResponse } from 'next/server'
import { createOrGetUser } from '@/lib/user-service'

export async function POST(request: NextRequest) {
  try {
    const { user: supabaseUser } = await request.json()
    
    if (!supabaseUser) {
      return NextResponse.json({ error: 'User data required' }, { status: 400 })
    }

    const user = await createOrGetUser(supabaseUser)
    return NextResponse.json({ user })
  } catch (error) {
    console.error('User creation error:', error)
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}