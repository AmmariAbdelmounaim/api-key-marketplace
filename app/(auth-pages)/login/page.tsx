import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet } from "lucide-react"

export default function AuthPage() {
  return (
    <div className="container mx-auto p-6 flex items-center justify-center min-h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Authentication</CardTitle>
          <CardDescription>Connect your wallet to sign in</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center mb-4">
            Click the button below to connect your MetaMask wallet and sign a message to authenticate.
          </p>
        </CardContent>
        <CardFooter>
          <Button className="w-full">
            <Wallet className="mr-2 h-4 w-4" /> Connect Wallet
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

