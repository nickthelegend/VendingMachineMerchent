import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { 'api-key': string } }
) {
  try {
    const apiKey = params['api-key']
    
    const machine = await prisma.machine.findUnique({
      where: { api_key: apiKey },
      select: {
        id: true,
        price: true,
        machine_contract_address: true
      }
    })

    if (!machine) {
      return NextResponse.json({ 
        success: false,
        price: null 
      })
    }

    return NextResponse.json({ 
      success: true,
      price: machine.price 
    })
  } catch (error) {
    console.error('API key validation error:', error)
    return NextResponse.json({ 
      success: false,
      price: null 
    }, { status: 500 })
  }
}