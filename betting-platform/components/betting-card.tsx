"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, AlertCircle, Smartphone } from "lucide-react"
import { useSiteContext } from "@/contexts/site-context"
import { useToast } from "@/hooks/use-toast"

interface BettingCardProps {
  id: number
  title: string
  description: string
  option1: string
  option2: string
  odds1: string
  odds2: string
  liveStream: boolean
}

interface UserData {
  name: string
  email: string
  balance: number
  isLoggedIn: boolean
}

export function BettingCard({ id, title, description, option1, option2, odds1, odds2, liveStream }: BettingCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [betAmount, setBetAmount] = useState<string>("")
  const [isPlaying, setIsPlaying] = useState(false)
  const [user, setUser] = useState<UserData | null>(null)
  const { currencySettings, liveStreams, addBet } = useSiteContext()
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option)
  }

  const handleBetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBetAmount(e.target.value)
  }

  const handlePlaceBet = () => {
    if (!selectedOption || !betAmount || !user) {
      toast({
        title: "Error",
        description: "Please select an option and enter a bet amount.",
        variant: "destructive",
      })
      return
    }

    const amount = Number.parseFloat(betAmount)

    // Check if user has enough balance
    if (amount > user.balance) {
      toast({
        title: "Insufficient funds",
        description: "You don't have enough balance to place this bet.",
        variant: "destructive",
      })
      return
    }

    // Calculate potential win
    const selectedOdds = selectedOption === option1 ? odds1 : odds2
    const potentialWin = amount * Number.parseFloat(selectedOdds)

    // Add bet to context
    addBet({
      userId: user.email,
      userName: user.name,
      eventId: id,
      eventTitle: title,
      selection: selectedOption,
      odds: selectedOption === option1 ? odds1 : odds2,
      amount: amount,
      potentialWin: potentialWin,
      status: "pending",
    })

    // Update user balance
    const newBalance = user.balance - amount
    const updatedUser = {
      ...user,
      balance: newBalance,
    }
    localStorage.setItem("user", JSON.stringify(updatedUser))
    setUser(updatedUser)

    toast({
      title: "Bet placed successfully",
      description: `You placed a bet of ${currencySettings.symbol}${amount} on ${selectedOption}. Potential win: ${currencySettings.symbol}${potentialWin.toFixed(2)}`,
    })

    // Reset form
    setSelectedOption(null)
    setBetAmount("")
  }

  const toggleVideo = () => {
    setIsPlaying(!isPlaying)
  }

  // Find the corresponding live stream if available
  const stream = liveStreams.find((s) => s.name === title && s.status === "live")

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative h-48 bg-muted">
          {!isPlaying ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-full bg-background/80 backdrop-blur-sm"
                onClick={toggleVideo}
                disabled={!liveStream}
              >
                <Play className="h-6 w-6" />
              </Button>
              <span className="mt-2 text-sm">
                {liveStream ? "Click to watch live stream" : "Live stream not available"}
              </span>
              {stream && (
                <span className="mt-1 text-xs text-red-500 flex items-center">
                  <span className="h-2 w-2 rounded-full bg-red-500 mr-1"></span>
                  Live • {stream.viewers} viewers
                </span>
              )}
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <div className="text-center text-white">
                <p>Mobile live stream playing</p>
                {stream && <p className="text-sm mb-2">Quality: {stream.quality}</p>}
                <div className="flex items-center justify-center mt-2 text-xs">
                  <Smartphone className="h-3 w-3 mr-1" />
                  <span>Streamed from mobile device</span>
                </div>
                <Button variant="outline" size="sm" className="mt-2" onClick={toggleVideo}>
                  Stop Stream
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>

        <Tabs defaultValue="bet" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="bet">Place Bet</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
          </TabsList>
          <TabsContent value="bet" className="space-y-4">
            <div className="grid grid-cols-2 gap-4 mt-4">
              <Button
                variant={selectedOption === option1 ? "default" : "outline"}
                className="w-full justify-between"
                onClick={() => handleOptionSelect(option1)}
              >
                <span>{option1}</span>
                <span className="font-bold">{odds1}</span>
              </Button>
              <Button
                variant={selectedOption === option2 ? "default" : "outline"}
                className="w-full justify-between"
                onClick={() => handleOptionSelect(option2)}
              >
                <span>{option2}</span>
                <span className="font-bold">{odds2}</span>
              </Button>
            </div>

            {!user && (
              <div className="bg-yellow-50 p-3 rounded-md flex items-center text-sm text-yellow-800 mt-4">
                <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>Please sign in to place a bet</span>
              </div>
            )}

            {user && selectedOption && (
              <div className="space-y-2 mt-4">
                <Label htmlFor={`bet-amount-${id}`}>Bet Amount</Label>
                <div className="flex space-x-2">
                  <Input
                    id={`bet-amount-${id}`}
                    placeholder="Enter amount"
                    type="number"
                    min="10"
                    max={user.balance.toString()}
                    value={betAmount}
                    onChange={handleBetAmountChange}
                  />
                  <Button onClick={handlePlaceBet} disabled={!betAmount}>
                    Place Bet
                  </Button>
                </div>
                {betAmount && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Potential win: {currencySettings.symbol}
                      {(
                        Number.parseFloat(betAmount) * Number.parseFloat(selectedOption === option1 ? odds1 : odds2)
                      ).toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Your balance: {currencySettings.symbol}
                      {user.balance.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
          <TabsContent value="stats">
            <div className="space-y-2 mt-4">
              <div className="flex justify-between py-1">
                <span>Last 5 matches:</span>
                <span className="font-medium">W W L W D</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Head to head:</span>
                <span className="font-medium">2-1</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Current form:</span>
                <span className="font-medium">Good</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

