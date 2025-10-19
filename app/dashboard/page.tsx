"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Trash2, Copy, Check } from "lucide-react"
import { toast } from "sonner"

interface VendingMachine {
  id: string
  name: string
  itemPrice: string
  apiKey: string
  createdAt: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [machines, setMachines] = useState<VendingMachine[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newMachineName, setNewMachineName] = useState("")
  const [newMachinePrice, setNewMachinePrice] = useState("")
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push("/")
        return
      }

      setUser(session.user)
      setLoading(false)

      // Load mock machines from localStorage
      const savedMachines = localStorage.getItem(`machines_${session.user.id}`)
      if (savedMachines) {
        setMachines(JSON.parse(savedMachines))
      }
    }

    checkUser()
  }, [router])

  const generateApiKey = () => {
    return `vm_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
  }

  const handleCreateMachine = () => {
    if (!newMachineName || !newMachinePrice) {
      toast.error("Please fill in all fields")
      return
    }

    if (isNaN(Number(newMachinePrice)) || Number(newMachinePrice) <= 0) {
      toast.error("Please enter a valid price")
      return
    }

    const newMachine: VendingMachine = {
      id: Math.random().toString(36).substring(2, 15),
      name: newMachineName,
      itemPrice: newMachinePrice,
      apiKey: generateApiKey(),
      createdAt: new Date().toISOString(),
    }

    const updatedMachines = [...machines, newMachine]
    setMachines(updatedMachines)

    if (user) {
      localStorage.setItem(`machines_${user.id}`, JSON.stringify(updatedMachines))
    }

    toast.success("Vending machine created successfully!")
    setIsCreateModalOpen(false)
    setNewMachineName("")
    setNewMachinePrice("")
  }

  const handleDeleteMachine = (id: string) => {
    const updatedMachines = machines.filter((m) => m.id !== id)
    setMachines(updatedMachines)

    if (user) {
      localStorage.setItem(`machines_${user.id}`, JSON.stringify(updatedMachines))
    }

    toast.success("Vending machine deleted")
  }

  const handleCopyApiKey = (apiKey: string, id: string) => {
    navigator.clipboard.writeText(apiKey)
    setCopiedId(id)
    toast.success("API key copied to clipboard")

    setTimeout(() => {
      setCopiedId(null)
    }, 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-600 via-teal-700 to-emerald-800">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-600 via-teal-700 to-emerald-800">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Your Vending Machines</h1>
              <p className="text-gray-300">Manage your smart contract vending machines</p>
            </div>

            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-emerald-500 hover:bg-emerald-400">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Machine
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Vending Machine</DialogTitle>
                  <DialogDescription>Deploy a new smart contract for your vending machine</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Machine Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Office Snack Machine"
                      value={newMachineName}
                      onChange={(e) => setNewMachineName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Item Price (ALGO)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 2.50"
                      value={newMachinePrice}
                      onChange={(e) => setNewMachinePrice(e.target.value)}
                    />
                  </div>

                  <Button className="w-full bg-emerald-500 hover:bg-emerald-400" onClick={handleCreateMachine}>
                    Create Machine
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {machines.length === 0 ? (
            <Card className="glass-card border-gray-700">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
                  <Plus className="w-10 h-10 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No vending machines yet</h3>
                <p className="text-gray-400 mb-6 text-center max-w-md">
                  Create your first vending machine to start accepting ALGO payments
                </p>
                <Button className="bg-emerald-500 hover:bg-emerald-400" onClick={() => setIsCreateModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Machine
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {machines.map((machine) => (
                <Card key={machine.id} className="glass-card border-gray-700">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-white">{machine.name}</CardTitle>
                        <CardDescription className="text-gray-400">
                          Created {new Date(machine.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        onClick={() => handleDeleteMachine(machine.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-gray-400 text-sm">Item Price</Label>
                      <p className="text-2xl font-bold text-emerald-400">{machine.itemPrice} ALGO</p>
                    </div>

                    <div>
                      <Label className="text-gray-400 text-sm">API Key</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="flex-1 bg-gray-900/50 px-3 py-2 rounded text-sm text-gray-300 font-mono truncate">
                          {machine.apiKey}
                        </code>
                        <Button
                          variant="outline"
                          size="icon"
                          className="border-gray-700 hover:bg-gray-800 bg-transparent"
                          onClick={() => handleCopyApiKey(machine.apiKey, machine.id)}
                        >
                          {copiedId === machine.id ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button className="w-full bg-emerald-500 hover:bg-emerald-400">Withdraw Funds</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
