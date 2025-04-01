"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useSiteContext } from "@/contexts/site-context"

interface UserData {
  name: string
  email: string
  balance: number
  isLoggedIn: boolean
}

export function BetHistory() {
  const [user, setUser] = useState<UserData | null>(null)
  const { bets, currencySettings } = useSiteContext()

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  // Filter bets for the current user
  const userBets = user ? bets.filter((bet) => bet.userId === user.email) : []

  // Sort bets by timestamp (newest first)
  const sortedBets = [...userBets].sort((a, b) => b.timestamp - a.timestamp)

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString()
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Event</TableHead>
            <TableHead>Selection</TableHead>
            <TableHead>Odds</TableHead>
            <TableHead>Stake</TableHead>
            <TableHead>Result</TableHead>
            <TableHead className="text-right">Returns</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedBets.map((bet) => (
            <TableRow key={bet.id}>
              <TableCell>{formatDate(bet.timestamp)}</TableCell>
              <TableCell>{bet.eventTitle}</TableCell>
              <TableCell>{bet.selection}</TableCell>
              <TableCell>{bet.odds}</TableCell>
              <TableCell>
                {currencySettings.symbol}
                {bet.amount.toFixed(2)}
              </TableCell>
              <TableCell>
                {bet.status === "won" && (
                  <Badge variant="default" className="bg-green-500">
                    Win
                  </Badge>
                )}
                {bet.status === "lost" && (
                  <Badge variant="outline" className="text-red-500 border-red-500">
                    Loss
                  </Badge>
                )}
                {bet.status === "pending" && (
                  <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                    Pending
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                {bet.status === "won" ? `${currencySettings.symbol}${bet.potentialWin.toFixed(2)}` : "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {sortedBets.length === 0 && (
        <div className="text-center py-6 text-muted-foreground">No betting history available.</div>
      )}
    </div>
  )
}

