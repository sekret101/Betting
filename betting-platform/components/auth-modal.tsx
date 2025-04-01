"use client"

import type React from "react"

import { useState } from "react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export function AuthModal() {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("signin")
  const { toast } = useToast()
  const router = useRouter()

  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState("")
  const [signInPassword, setSignInPassword] = useState("")
  const [isSigningIn, setIsSigningIn] = useState(false)

  // Sign Up Form State
  const [signUpName, setSignUpName] = useState("")
  const [signUpEmail, setSignUpEmail] = useState("")
  const [signUpPassword, setSignUpPassword] = useState("")
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState("")
  const [isSigningUp, setIsSigningUp] = useState(false)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSigningIn(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock authentication - in a real app, this would validate with a backend
    if (signInEmail === "user@example.com" && signInPassword === "password") {
      // Store user info in localStorage for demo purposes
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: "Demo User",
          email: signInEmail,
          balance: 1250.0,
          isLoggedIn: true,
        }),
      )

      toast({
        title: "Signed in successfully",
        description: "Welcome back to JBA Betting Site!",
      })

      setOpen(false)
      window.location.reload() // Refresh to update UI with logged in state
    } else {
      toast({
        title: "Sign in failed",
        description: "For demo, use user@example.com / password",
        variant: "destructive",
      })
    }

    setIsSigningIn(false)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSigningUp(true)

    // Validate passwords match
    if (signUpPassword !== signUpConfirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      })
      setIsSigningUp(false)
      return
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock registration - in a real app, this would register with a backend
    localStorage.setItem(
      "user",
      JSON.stringify({
        name: signUpName,
        email: signUpEmail,
        balance: 100.0, // Starting balance for new users
        isLoggedIn: true,
      }),
    )

    toast({
      title: "Account created successfully",
      description: "Welcome to JBA Betting Site!",
    })

    setOpen(false)
    window.location.reload() // Refresh to update UI with logged in state
    setIsSigningUp(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Sign In</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="mt-4">
            <DialogHeader>
              <DialogTitle>Sign In</DialogTitle>
              <DialogDescription>Sign in to your account to place bets and manage your funds.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSignIn}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="your@email.com"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    required
                  />
                </div>
                <Button variant="link" className="px-0 justify-start text-sm">
                  Forgot password?
                </Button>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSigningIn}>
                  {isSigningIn ? "Signing in..." : "Sign In"}
                </Button>
              </DialogFooter>
              <div className="mt-4 text-center text-sm text-muted-foreground">
                <p>Demo credentials: user@example.com / password</p>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="mt-4">
            <DialogHeader>
              <DialogTitle>Create an Account</DialogTitle>
              <DialogDescription>Join JBA Betting Site to start betting on your favorite events.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSignUp}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    placeholder="John Doe"
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your@email.com"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                  <Input
                    id="signup-confirm-password"
                    type="password"
                    value={signUpConfirmPassword}
                    onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSigningUp}>
                  {isSigningUp ? "Creating Account..." : "Create Account"}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

