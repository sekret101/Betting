"use client"

import Link from "next/link"
import { BettingCard } from "@/components/betting-card"
import { DepositModal } from "@/components/deposit-modal"
import { WithdrawModal } from "@/components/withdraw-modal"
import { UserNav } from "@/components/user-nav"
import { AdminAuth } from "@/components/admin-auth"
import { useSiteContext } from "@/contexts/site-context"

export default function Home() {
  const { bettingOptions } = useSiteContext()

  // Filter only active betting options
  const activeBettingOptions = bettingOptions.filter((option) => option.active)

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">JBA Betting Site</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
              Home
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex">
              <DepositModal />
              <WithdrawModal />
            </div>
            <UserNav />
            <AdminAuth />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="container py-8 md:py-12">
          <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
            <div className="flex-1 space-y-4">
              <h1 className="inline-block text-4xl font-bold tracking-tight lg:text-5xl">Live Betting</h1>
              <p className="text-xl text-muted-foreground">Place your bets on live events happening right now.</p>
            </div>
            <div className="flex gap-2 md:hidden">
              <DepositModal />
              <WithdrawModal />
            </div>
          </div>

          {activeBettingOptions.length > 0 ? (
            <div className="grid gap-6 pt-8 md:grid-cols-2 lg:grid-cols-2">
              {activeBettingOptions.map((option) => (
                <BettingCard
                  key={option.id}
                  id={option.id}
                  title={option.title}
                  description={option.description}
                  option1={option.option1}
                  option2={option.option2}
                  odds1={option.odds1}
                  odds2={option.odds2}
                  liveStream={option.liveStream}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-xl text-muted-foreground">No active betting options available.</p>
              <p className="text-sm text-muted-foreground mt-2">Check back later for new betting opportunities.</p>
            </div>
          )}
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} JBA Betting Site. This is a demonstration platform only. No real betting
            takes place.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

