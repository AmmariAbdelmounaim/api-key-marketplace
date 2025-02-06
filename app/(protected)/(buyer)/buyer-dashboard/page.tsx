import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Check, X } from "lucide-react"

export default function BuyerDashboard() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Buyer Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Your Purchases</CardTitle>
          <CardDescription>API keys you've bought and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>API Key</TableHead>
                <TableHead>Seller</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3].map((i) => (
                <TableRow key={i}>
                  <TableCell>ORD-{i}</TableCell>
                  <TableCell>API-{i}</TableCell>
                  <TableCell>0x1234...5678</TableCell>
                  <TableCell>0.1 ETH</TableCell>
                  <TableCell>{i === 1 ? "Delivered" : "Pending"}</TableCell>
                  <TableCell>
                    {i === 1 ? (
                      <Button size="sm" variant="outline">
                        <Check className="mr-2 h-4 w-4" /> Confirm
                      </Button>
                    ) : (
                      <Button size="sm" variant="destructive">
                        <X className="mr-2 h-4 w-4" /> Refund
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

