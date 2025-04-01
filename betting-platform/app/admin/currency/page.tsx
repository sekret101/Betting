"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { DollarSign, Save, Smartphone } from "lucide-react"
import { useSiteContext } from "@/contexts/site-context"

export default function CurrencySettings() {
  const { currencySettings, setCurrencySettings } = useSiteContext()
  const [currency, setCurrency] = useState(currencySettings.currency)
  const [symbol, setSymbol] = useState(currencySettings.symbol)
  const [exchangeRates, setExchangeRates] = useState(currencySettings.exchangeRates)
  const [minDeposit, setMinDeposit] = useState(currencySettings.minDeposit)
  const [maxDeposit, setMaxDeposit] = useState(currencySettings.maxDeposit)
  const [minWithdraw, setMinWithdraw] = useState(currencySettings.minWithdraw)
  const [maxWithdraw, setMaxWithdraw] = useState(currencySettings.maxWithdraw)
  const [gcashNumber, setGcashNumber] = useState(currencySettings.gcashNumber)
  const [autoConvert, setAutoConvert] = useState(true)
  const { toast } = useToast()

  // Update local state when context changes
  useEffect(() => {
    setCurrency(currencySettings.currency)
    setSymbol(currencySettings.symbol)
    setExchangeRates(currencySettings.exchangeRates)
    setMinDeposit(currencySettings.minDeposit)
    setMaxDeposit(currencySettings.maxDeposit)
    setMinWithdraw(currencySettings.minWithdraw)
    setMaxWithdraw(currencySettings.maxWithdraw)
    setGcashNumber(currencySettings.gcashNumber)
  }, [currencySettings])

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate GCash number
    if (!gcashNumber || gcashNumber.length < 10) {
      toast({
        title: "Invalid GCash number",
        description: "Please enter a valid GCash number.",
        variant: "destructive",
      })
      return
    }

    // Update the context with new settings
    setCurrencySettings({
      currency,
      symbol,
      exchangeRates,
      minDeposit,
      maxDeposit,
      minWithdraw,
      maxWithdraw,
      gcashNumber,
    })

    toast({
      title: "Currency settings saved",
      description: "Your currency settings have been updated successfully.",
    })
  }

  const handleUpdateExchangeRate = (currency: string, value: string) => {
    setExchangeRates({
      ...exchangeRates,
      [currency]: Number.parseFloat(value) || 0,
    })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Currency Settings</h1>

      <form onSubmit={handleSaveSettings}>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Primary Currency</CardTitle>
              <CardDescription>Set the primary currency for your betting platform.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Currency</Label>
                  <RadioGroup value={currency} onValueChange={setCurrency} className="grid grid-cols-2 gap-4">
                    <div>
                      <RadioGroupItem value="PHP" id="php" className="peer sr-only" />
                      <Label
                        htmlFor="php"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <DollarSign className="mb-3 h-6 w-6" />
                        Philippine Peso (PHP)
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="USD" id="usd" className="peer sr-only" />
                      <Label
                        htmlFor="usd"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <DollarSign className="mb-3 h-6 w-6" />
                        US Dollar (USD)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="currency-symbol">Currency Symbol</Label>
                  <Input
                    id="currency-symbol"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    maxLength={3}
                    className="w-20"
                  />
                  <p className="text-sm text-muted-foreground">
                    This symbol will be displayed throughout the platform.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="auto-convert" checked={autoConvert} onCheckedChange={setAutoConvert} />
                  <Label htmlFor="auto-convert">Automatically convert currencies for users</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>GCash Settings</CardTitle>
              <CardDescription>Configure the GCash account number for deposits.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="gcash-number" className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    GCash Account Number
                  </Label>
                  <Input
                    id="gcash-number"
                    type="tel"
                    placeholder="09XX XXX XXXX"
                    value={gcashNumber}
                    onChange={(e) => setGcashNumber(e.target.value)}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    This is the GCash number that will be displayed to users for deposits.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Exchange Rates</CardTitle>
              <CardDescription>Set exchange rates for currency conversion.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <p className="text-sm text-muted-foreground">
                  Set the exchange rate for 1 {currency} to the following currencies:
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="usd-rate">USD (US Dollar)</Label>
                    <Input
                      id="usd-rate"
                      type="number"
                      step="0.0001"
                      value={exchangeRates.USD}
                      onChange={(e) => handleUpdateExchangeRate("USD", e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="eur-rate">EUR (Euro)</Label>
                    <Input
                      id="eur-rate"
                      type="number"
                      step="0.0001"
                      value={exchangeRates.EUR}
                      onChange={(e) => handleUpdateExchangeRate("EUR", e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="gbp-rate">GBP (British Pound)</Label>
                    <Input
                      id="gbp-rate"
                      type="number"
                      step="0.0001"
                      value={exchangeRates.GBP}
                      onChange={(e) => handleUpdateExchangeRate("GBP", e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="jpy-rate">JPY (Japanese Yen)</Label>
                    <Input
                      id="jpy-rate"
                      type="number"
                      step="0.0001"
                      value={exchangeRates.JPY}
                      onChange={(e) => handleUpdateExchangeRate("JPY", e.target.value)}
                    />
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">
                  These rates will be used when converting between currencies.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transaction Limits</CardTitle>
              <CardDescription>Set minimum and maximum limits for deposits and withdrawals.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="min-deposit">Minimum Deposit ({symbol})</Label>
                    <Input
                      id="min-deposit"
                      type="number"
                      value={minDeposit}
                      onChange={(e) => setMinDeposit(Number.parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="max-deposit">Maximum Deposit ({symbol})</Label>
                    <Input
                      id="max-deposit"
                      type="number"
                      value={maxDeposit}
                      onChange={(e) => setMaxDeposit(Number.parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="min-withdraw">Minimum Withdrawal ({symbol})</Label>
                    <Input
                      id="min-withdraw"
                      type="number"
                      value={minWithdraw}
                      onChange={(e) => setMinWithdraw(Number.parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="max-withdraw">Maximum Withdrawal ({symbol})</Label>
                    <Input
                      id="max-withdraw"
                      type="number"
                      value={maxWithdraw}
                      onChange={(e) => setMaxWithdraw(Number.parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full">
            <Save className="mr-2 h-4 w-4" />
            Save Currency Settings
          </Button>
        </div>
      </form>
    </div>
  )
}

