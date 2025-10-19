import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { key: string } }) {
  const apiKey = params.key

  // Mock API key validation
  // In production, this would check against a database
  const mockValidKeys = ["vm_test_key_123", "vm_prod_key_456", "vm_demo_key_789"]

  // Check if the API key exists in our mock data or localStorage pattern
  const isValid = mockValidKeys.includes(apiKey) || apiKey.startsWith("vm_")

  return NextResponse.json({
    success: isValid,
    message: isValid ? "API key is valid" : "API key not found",
    timestamp: new Date().toISOString(),
  })
}
