import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search, FileText, Trash2, Filter } from "lucide-react";
import BillForm from "./BillForm";

const BillsList = () => {
  const [showNewBillForm, setShowNewBillForm] = useState(false);
  const [bills, setBills] = useState([
    {
      id: "090",
      vendor: "Anantham",
      date: "27 Feb 2025",
      dueDate: "27 Feb 2025",
      amount: "₹120.00",
      status: "Open",
    },
  ]);

  const handleCreateBill = (billData: any) => {
    // In a real app, you would send this to your backend
    const newBill = {
      id: `BILL-${Math.floor(Math.random() * 10000)}`,
      vendor: "New Vendor", // This would come from the form
      date: new Date().toLocaleDateString(),
      dueDate: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000,
      ).toLocaleDateString(),
      amount: `₹${billData.total.toFixed(2)}`,
      status: "Open",
    };

    setBills([...bills, newBill]);
    setShowNewBillForm(false);
  };

  if (showNewBillForm) {
    return (
      <BillForm
        onSubmit={handleCreateBill}
        onCancel={() => setShowNewBillForm(false)}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bills</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2 w-full max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search bills..." className="pl-9" />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          <Button
            className="bg-gradient-meera hover:bg-pink-700"
            onClick={() => setShowNewBillForm(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Create a Bill
          </Button>
        </div>

        {bills.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">
              Owe money? It's good to pay bills on time!
            </h3>
            <p className="text-muted-foreground mb-6">
              If you've purchased something for your business, and you don't
              have to repay it immediately, then you can record it as a bill.
            </p>
            <Button
              className="bg-gradient-meera hover:bg-pink-700"
              onClick={() => setShowNewBillForm(true)}
            >
              Create a Bill
            </Button>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Date</TableHead>
                  <TableHead className="w-[100px]">Bill #</TableHead>
                  <TableHead>Reference Number</TableHead>
                  <TableHead>Vendor Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Balance Due</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bills.map((bill) => (
                  <TableRow key={bill.id}>
                    <TableCell>{bill.date}</TableCell>
                    <TableCell className="font-medium">{bill.id}</TableCell>
                    <TableCell></TableCell>
                    <TableCell>{bill.vendor}</TableCell>
                    <TableCell>
                      <div
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          bill.status === "Open"
                            ? "bg-blue-100 text-blue-800"
                            : bill.status === "Paid"
                              ? "bg-pink-100 text-primary"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {bill.status}
                      </div>
                    </TableCell>
                    <TableCell>{bill.dueDate}</TableCell>
                    <TableCell className="text-right">{bill.amount}</TableCell>
                    <TableCell className="text-right">{bill.amount}</TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <Button variant="ghost" size="icon">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BillsList;
