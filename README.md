# Vending Machine Merchant

> A merchant dashboard for deploying and managing Algorand smart-contract vending machines — each machine is its own on-chain contract with a fixed price and a queryable API key.

## Overview

Vending Machine Merchant is a Next.js web app that lets a merchant sign in, get an Algorand wallet provisioned automatically, and spin up "machines" that are each backed by their own on-chain smart contract on Algorand TestNet. When a merchant creates a machine they set a fixed price (in ALGO); the app deploys a `MachineContract` application, stores its details, and issues a unique API key. Physical vending hardware (or any client) can then hit a public endpoint with that API key to read the machine's price and device ID before taking a payment on-chain.

The smart contract tracks a fixed price and a sales counter, accepts exact-amount payments, and lets the owner change the price or withdraw accumulated funds back to their wallet.

## Features

- **Passwordless auth** via Supabase (OAuth callback flow).
- **Automatic Algorand account provisioning** — on first sign-in a keypair is generated with `algosdk` and stored against the user.
- **One-click contract deployment** — creating a machine deploys a `MachineContract` application to Algorand TestNet via AlgoKit, seeded with the owner address and a fixed price.
- **Per-machine API keys** (`vm_…`) for identifying a machine and looking up its price from client hardware.
- **Public price lookup API** — `GET /api/[api-key]` returns the machine's price and device ID.
- **Machine dashboard** — list your machines with contract ID, price, and API key; drill into a machine to see its live on-chain contract balance and owner details.
- **On-chain contract logic** (ARC-56 `MachineContract`): `createApplication`, `pay` (enforces exact payment and increments a `transactionSales` counter), `changePrice`, `withdraw`, and `withdrawAll`.
- **Wallet balance proxy** — `GET /api/wallet/balance` reads an account's ALGO balance from an Algonode TestNet endpoint.
- **Contract deployment test** with Jest + ts-jest.

## Tech Stack

- **Framework:** Next.js 14 (App Router), React 18, TypeScript
- **Blockchain:** Algorand — `algosdk`, `@algorandfoundation/algokit-utils`, ARC-56 generated typed client
- **Auth:** Supabase (`@supabase/supabase-js`)
- **Database / ORM:** PostgreSQL via Prisma
- **UI:** Tailwind CSS, shadcn/ui (Radix primitives), lucide-react, framer-motion, recharts
- **Testing:** Jest, ts-jest

## Getting Started

### Prerequisites

- Node.js and a package manager (npm/pnpm)
- A PostgreSQL database
- A Supabase project
- An Algorand TestNet account with funds (for deploying contracts)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables (create .env)
#    DATABASE_URL=postgresql://...
#    DIRECT_URL=postgresql://...
#    NEXT_PUBLIC_SUPABASE_URL=...
#    NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# 3. Generate the Prisma client and apply migrations
npx prisma generate
npx prisma migrate deploy

# 4. Run the dev server
npm run dev
```

Then open http://localhost:3000.

### Other scripts

```bash
npm run build   # prisma generate + next build
npm run start   # run the production build
npm run lint    # eslint
npm test        # jest (includes the contract deployment test)
```

> Note: contract deployment targets Algorand **TestNet**. The included test deploys a real application and expects a funded TestNet account.

## Project Structure

```
.
├── app/                  # Next.js App Router
│   ├── api/              # Route handlers
│   │   ├── [api-key]/    # Public price lookup by API key
│   │   ├── machines/     # Create / list / fetch machines
│   │   ├── user/         # Get-or-create user
│   │   └── wallet/       # TestNet balance proxy
│   ├── dashboard/        # Merchant machine list
│   ├── machine/[id]/     # Machine detail + on-chain balance
│   ├── auth/callback/    # Supabase OAuth callback
│   └── page.tsx          # Landing page
├── client/client.ts      # ARC-56 generated MachineContract client
├── lib/
│   ├── algorand.ts       # Algorand account helpers
│   ├── machine-service.ts# Contract deploy + machine persistence
│   ├── user-service.ts   # User provisioning
│   ├── supabase.ts       # Supabase client
│   └── prisma.ts         # Prisma client
├── prisma/
│   ├── schema.prisma     # User + Machine models
│   └── migrations/
├── components/           # UI (shadcn/ui + app components)
├── hooks/
└── tests/                # Jest contract deployment test
```

---

Built by [nickthelegend](https://github.com/nickthelegend) · [nickthelegend.tech](https://nickthelegend.tech)
