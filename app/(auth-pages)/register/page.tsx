"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { UserPlus } from "lucide-react"

export default function RegisterPage() {
  const [role, setRole] = useState<"buyer" | "seller" | null>(null)

  const handleRegister = async () => {
    if (!role) {
      toast({
        title: "Error",
        description: "Please select a role before registering.",
        variant: "destructive",
      })
      return
    }

    // Here you would call your smart contract to register the user
    // For now, we'll just simulate the process with a timeout
    toast({
      title: "Registering...",
      description: "Please wait while we confirm your registration on-chain.",
    })

    setTimeout(() => {
      toast({
        title: "Registration Successful!",
        description: `You have been registered as a ${role}. Redirecting to your dashboard...`,
      })
      // Here you would redirect to the appropriate dashboard
      // For now, we'll just log to the console
      console.log(`Redirecting to ${role} dashboard...`)
    }, 2000)
  }

  return (
    <div className="container mx-auto p-6 flex items-center justify-center min-h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Register Your Account</CardTitle>
          <CardDescription>Choose your role to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            onValueChange={(value) => setRole(value as "buyer" | "seller")}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="buyer" id="buyer" />
              <Label htmlFor="buyer">Buyer</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="seller" id="seller" />
              <Label htmlFor="seller">Seller</Label>
            </div>
          </RadioGroup>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleRegister}>
            <UserPlus className="mr-2 h-4 w-4" /> Register
          </Button>
        </CardFooter>
      </Card>
      <Toaster />
    </div>
  )
}

