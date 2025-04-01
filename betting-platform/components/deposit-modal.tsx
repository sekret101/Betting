"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
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
import { PlusCircle, Smartphone, Copy, Upload, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useSiteContext } from "@/contexts/site-context"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface UserData {
  name: string
  email: string
  balance: number
  isLoggedIn: boolean
}

export function DepositModal() {
  const [amount, setAmount] = useState("")
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<UserData | null>(null)
  const [receiptImage, setReceiptImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const { currencySettings, addTransaction } = useSiteContext()

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(currencySettings.gcashNumber)
    toast({
      title: "GCash number copied",
      description: "The GCash number has been copied to your clipboard.",
    })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "The receipt image must be less than 5MB.",
        variant: "destructive",
      })
      return
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        setReceiptImage(event.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  }

  const clearImage = () => {
    setReceiptImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Not logged in",
        description: "Please sign in to deposit funds.",
        variant: "destructive",
      })
      return
    }

    if (!receiptImage) {
      toast({
        title: "Receipt image required",
        description: "Please upload a receipt image to verify your deposit.",
        variant: "destructive",
      })
      return
    }

    const depositAmount = Number.parseFloat(amount)

    // Check minimum deposit
    if (depositAmount < currencySettings.minDeposit) {
      toast({
        title: "Minimum deposit",
        description: `The minimum deposit amount is ${currencySettings.symbol}${currencySettings.minDeposit}.`,
        variant: "destructive",
      })
      return
    }

    // Check maximum deposit
    if (depositAmount > currencySettings.maxDeposit) {
      toast({
        title: "Maximum deposit",
        description: `The maximum deposit amount is ${currencySettings.symbol}${currencySettings.maxDeposit}.`,
        variant: "destructive",
      })
      return
    }

    // Add transaction to context
    addTransaction({
      userId: user.email,
      userName: user.name,
      type: "deposit",
      amount: depositAmount,
      status: "pending",
      receiptImage: receiptImage,
    })

    toast({
      title: "Deposit request submitted",
      description: `Your deposit request for ${currencySettings.symbol}${amount} has been submitted and is pending admin approval.`,
    })

    setOpen(false)
    setAmount("")
    setReceiptImage(null)
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen && !user) {
      toast({
        title: "Not logged in",
        description: "Please sign in to deposit funds.",
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
          <PlusCircle className="h-4 w-4" />
          Deposit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Deposit via GCash</DialogTitle>
          <DialogDescription>Add funds to your account using GCash.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleDeposit}>
          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg mb-2">
              <div className="flex flex-col items-center">
                <Smartphone className="h-10 w-10 text-blue-600 mb-2" />
                <span className="text-blue-600 font-semibold">GCash</span>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="amount">Amount ({currencySettings.symbol})</Label>
              <Input
                id="amount"
                type="number"
                min={currencySettings.minDeposit.toString()}
                max={currencySettings.maxDeposit.toString()}
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Minimum deposit: {currencySettings.symbol}
                {currencySettings.minDeposit}
              </p>
            </div>

            <Alert className="bg-blue-50 border-blue-200">
              <div className="flex justify-between items-center">
                <div>
                  <Label className="text-sm font-medium">GCash Number</Label>
                  <AlertDescription className="font-medium text-blue-600">
                    {currencySettings.gcashNumber}
                  </AlertDescription>
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={handleCopyNumber} className="h-8 px-2">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </Alert>

            <div className="grid gap-2">
              <Label htmlFor="receipt-image">Upload Receipt Image</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="receipt-image"
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="w-full">
                  {receiptImage ? (
                    <div className="relative border rounded-md overflow-hidden">
                      <img
                        src={receiptImage || "/placeholder.svg"}
                        alt="Receipt"
                        className="w-full h-40 object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6 rounded-full"
                        onClick={clearImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-40 flex flex-col gap-2 justify-center items-center border-dashed"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-6 w-6 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Click to upload receipt</span>
                    </Button>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Upload a screenshot of your GCash payment receipt</p>
            </div>

            <div className="bg-muted p-3 rounded-md text-sm">
              <p className="font-medium mb-1">How it works:</p>
              <ol className="list-decimal pl-4 space-y-1">
                <li>Send the amount to the GCash number above</li>
                <li>Take a screenshot of your payment receipt</li>
                <li>Upload the receipt image</li>
                <li>Submit your deposit request</li>
                <li>Admin will verify and approve your deposit</li>
              </ol>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!amount || !receiptImage}>
              Submit Deposit Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

