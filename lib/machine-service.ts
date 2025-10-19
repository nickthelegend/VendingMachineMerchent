import { prisma } from './prisma'
import { randomBytes } from 'crypto'

export function generateApiKey(): string {
  return 'vm_' + randomBytes(32).toString('hex')
}

export function generateMockContractAddress(): string {
  return '0x' + randomBytes(20).toString('hex')
}

export async function createMachine(ownerId: string, price: number = 0.0) {
  const apiKey = generateApiKey()
  const contractAddress = generateMockContractAddress()

  return await prisma.machine.create({
    data: {
      api_key: apiKey,
      owner_id: ownerId,
      machine_contract_address: contractAddress,
      price: price
    }
  })
}

export async function getUserMachines(ownerId: string) {
  return await prisma.machine.findMany({
    where: { owner_id: ownerId },
    orderBy: { created_at: 'desc' }
  })
}