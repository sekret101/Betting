"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BanknoteIcon, Smartphone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useSiteContext } from "@/contexts/site-context"

interface UserData {
  name: string
  email: string
  balance: number
  isLoggedIn: boolean
}

export function WithdrawModal() {
  const [amount, setAmount] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<UserData | null>(null)
  const { toast } = useToast()
  const { currencySettings, addTransaction } = useSiteContext()

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Not logged in",
        description: "Please sign in to withdraw funds.",
        variant: "destructive",
      })
      return
    }

    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid GCash phone number.",
        variant: "destructive",
      })
      return
    }

    const withdrawAmount = Number.parseFloat(amount)

    // Check if user has enough balance
    if (withdrawAmount > user.balance) {
      toast({
        title: "Insufficient funds",
        description: "You don't have enough balance to withdraw this amount.",
        variant: "destructive",
      })
      return
    }

    // Check minimum withdrawal
    if (withdrawAmount < currencySettings.minWithdraw) {
      toast({
        title: "Minimum withdrawal",
        description: `The minimum withdrawal amount is ${currencySettings.symbol}${currencySettings.minWithdraw}.`,
        variant: "destructive",
      })
      return
    }

    // Check maximum withdrawal
    if (withdrawAmount > currencySettings.maxWithdraw) {
      toast({
        title: "Maximum withdrawal",
        description: `The maximum withdrawal amount is ${currencySettings.symbol}${currencySettings.maxWithdraw}.`,
        variant: "destructive",
      })
      return
    }

    // Add transaction to context
    addTransaction({
      userId: user.email,
      userName: user.name,
      type: "withdraw",
      amount: withdrawAmount,
      status: "pending",
      phoneNumber: phoneNumber,
    })

    // Update user balance
    const newBalance = user.balance - withdrawAmount
    const updatedUser = {
      ...user,
      balance: newBalance,
    }
    localStorage.setItem("user", JSON.stringify(updatedUser))
    setUser(updatedUser)

    toast({
      title: "Withdrawal request submitted",
      description: `Your withdrawal request for ${currencySettings.symbol}${amount} has been submitted and is pending admin approval.`,
    })

    setOpen(false)
    setAmount("")
    setPhoneNumber("")
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen && !user) {
      toast({
        title: "Not logged in",
        description: "Please sign in to withdraw funds.",
        variant: "destructive",
      })
      return
    }
    setOpen(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <BanknoteIcon className="h-4 w-4" />
          Withdraw
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Withdraw via GCash</DialogTitle>
          <DialogDescription>Withdraw your winnings to your GCash account.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleWithdraw}>
          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg mb-2">
              <div className="flex flex-col items-center">
                <Smartphone className="h-10 w-10 text-blue-600 mb-2" />
                <span className="text-blue-600 font-semibold">GCash</span>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="withdraw-amount">Amount ({currencySettings.symbol})</Label>
              <Input
                id="withdraw-amount"
                type="number"
                min={currencySettings.minWithdraw.toString()}
                max={Math.min(currencySettings.maxWithdraw, user?.balance || 0).toString()}
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">
                  Minimum: {currencySettings.symbol}
                  {currencySettings.minWithdraw}
                </span>
                <span className="text-muted-foreground">
                  Available: {currencySettings.symbol}
                  {user?.balance.toFixed(2) || "0.00"}
                </span>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="gcash-number">GCash Phone Number</Label>
              <Input
                id="gcash-number"
                type="tel"
                placeholder="09XX XXX XXXX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">Enter the phone number linked to your GCash account</p>
            </div>

            <div className="bg-muted p-3 rounded-md text-sm">
              <p className="font-medium mb-1">Important information:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Withdrawals are processed within 24 hours</li>
                <li>A confirmation SMS will be sent to your phone</li>
                <li>
                  Minimum withdrawal amount is {currencySettings.symbol}
                  {currencySettings.minWithdraw}
                </li>
                <li>No fees for GCash withdrawals</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!amount || !phoneNumber}>
              Submit Withdrawal Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

