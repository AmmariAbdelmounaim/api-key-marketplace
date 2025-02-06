import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Upload } from "lucide-react"

export default function SellerDashboard() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Seller Dashboard</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Pending Orders</CardTitle>
          <CardDescription>Orders where buyers have deposited funds</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>API Key</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead>Amount</TableHead>
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
                  <TableCell>
                    <Button size="sm">
                      <Upload className="mr-2 h-4 w-4" /> Upload Key
                    </Button>
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

