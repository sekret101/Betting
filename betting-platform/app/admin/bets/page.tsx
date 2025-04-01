"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Check, X, Eye } from "lucide-react"
import { useSiteContext } from "@/contexts/site-context"
import type { Bet } from "@/contexts/site-context"

export default function BetsManagement() {
  const { bets, updateBet, currencySettings } = useSiteContext()
  const [selectedBet, setSelectedBet] = useState<Bet | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleViewBet = (bet: Bet) => {
    setSelectedBet(bet)
    setViewDialogOpen(true)
  }

  const handleWinBet = (bet: Bet) => {
    // Update bet status
    updateBet(bet.id, { status: "won" })

    // Update user balance with winnings
    const userData = localStorage.getItem("user")
    if (userData) {
      const user = JSON.parse(userData)
      if (user.email === bet.userId) {
        const newBalance = user.balance + bet.potentialWin
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...user,
            balance: newBalance,
          }),
        )
      }
    }

    setViewDialogOpen(false)
    toast({
      title: "Bet marked as won",
      description: `The bet has been marked as won and the user has been credited with ${currencySettings.symbol}${bet.potentialWin.toFixed(2)}.`,
    })
  }

  const handleLoseBet = (bet: Bet) => {
    // Update bet status
    updateBet(bet.id, { status: "lost" })

    setViewDialogOpen(false)
    toast({
      title: "Bet marked as lost",
      description: "The bet has been marked as lost.",
    })
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Bets Management</h1>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending Bets</TabsTrigger>
          <TabsTrigger value="completed">Completed Bets</TabsTrigger>
          <TabsTrigger value="all">All Bets</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Bets</CardTitle>
              <CardDescription>Manage bets that are waiting for results.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Selection</TableHead>
                    <TableHead>Odds</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Potential Win</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bets
                    .filter((b) => b.status === "pending")
                    .map((bet) => (
                      <TableRow key={bet.id}>
                        <TableCell>{formatDate(bet.timestamp)}</TableCell>
                        <TableCell>{bet.userName}</TableCell>
                        <TableCell>{bet.eventTitle}</TableCell>
                        <TableCell>{bet.selection}</TableCell>
                        <TableCell>{bet.odds}</TableCell>
                        <TableCell>
                          {currencySettings.symbol}
                          {bet.amount.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          {currencySettings.symbol}
                          {bet.potentialWin.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => handleViewBet(bet)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              onClick={() => handleWinBet(bet)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleLoseBet(bet)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              {bets.filter((b) => b.status === "pending").length === 0 && (
                <div className="text-center py-6 text-muted-foreground">No pending bets.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Completed Bets</CardTitle>
              <CardDescription>View all completed bets.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Selection</TableHead>
                    <TableHead>Odds</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Returns</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bets
                    .filter((b) => b.status !== "pending")
                    .map((bet) => (
                      <TableRow key={bet.id}>
                        <TableCell>{formatDate(bet.timestamp)}</TableCell>
                        <TableCell>{bet.userName}</TableCell>
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
                        </TableCell>
                        <TableCell>
                          {bet.status === "won" ? `${currencySettings.symbol}${bet.potentialWin.toFixed(2)}` : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              {bets.filter((b) => b.status !== "pending").length === 0 && (
                <div className="text-center py-6 text-muted-foreground">No completed bets.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Bets</CardTitle>
              <CardDescription>View all bets.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Selection</TableHead>
                    <TableHead>Odds</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bets.map((bet) => (
                    <TableRow key={bet.id}>
                      <TableCell>{formatDate(bet.timestamp)}</TableCell>
                      <TableCell>{bet.userName}</TableCell>
                      <TableCell>{bet.eventTitle}</TableCell>
                      <TableCell>{bet.selection}</TableCell>
                      <TableCell>{bet.odds}</TableCell>
                      <TableCell>
                        {currencySettings.symbol}
                        {bet.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {bet.status === "pending" && (
                          <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                            Pending
                          </Badge>
                        )}
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
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => handleViewBet(bet)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {bets.length === 0 && <div className="text-center py-6 text-muted-foreground">No bets available.</div>}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Bet Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Bet Details</DialogTitle>
            <DialogDescription>View and manage bet details.</DialogDescription>
          </DialogHeader>
          {selectedBet && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Bet ID</p>
                  <p className="font-medium">{selectedBet.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{formatDate(selectedBet.timestamp)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">User</p>
                  <p className="font-medium">{selectedBet.userName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">User ID</p>
                  <p className="font-medium">{selectedBet.userId}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Event</p>
                <p className="font-medium">{selectedBet.eventTitle}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Selection</p>
                  <p className="font-medium">{selectedBet.selection}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Odds</p>
                  <p className="font-medium">{selectedBet.odds}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-medium">
                    {currencySettings.symbol}
                    {selectedBet.amount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Potential Win</p>
                  <p className="font-medium">
                    {currencySettings.symbol}
                    {selectedBet.potentialWin.toFixed(2)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-medium capitalize">{selectedBet.status}</p>
              </div>
            </div>
          )}
          <DialogFooter className="flex justify-between">
            {selectedBet && selectedBet.status === "pending" && (
              <>
                <Button type="button" variant="destructive" onClick={() => handleLoseBet(selectedBet)}>
                  Mark as Lost
                </Button>
                <Button type="button" onClick={() => handleWinBet(selectedBet)}>
                  Mark as Won
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

