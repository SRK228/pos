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
import PaymentForm from "./PaymentForm";

const PaymentsList = () => {
  const [showNewPaymentForm, setShowNewPaymentForm] = useState(false);
  const [payments, setPayments] = useState<any[]>([]);

  const handleCreatePayment = (paymentData: any) => {
    // In a real app, you would send this to your backend
    const newPayment = {
      id: `PMT-${Math.floor(Math.random() * 10000)}`,
      date: new Date().toLocaleDateString(),
      number: paymentData.number || `PMT-${Math.floor(Math.random() * 10000)}`,
      vendor: paymentData.vendor || "Anantham",
      mode: paymentData.mode || "Cash",
      amount: `₹${paymentData.amount || 0}`,
      status: "Recorded",
    };

    setPayments([...payments, newPayment]);
    setShowNewPaymentForm(false);
  };

  if (showNewPaymentForm) {
    return (
      <PaymentForm
        onSubmit={handleCreatePayment}
        onCancel={() => setShowNewPaymentForm(false)}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Payments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2 w-full max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search payments..." className="pl-9" />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          <Button
            className="bg-gradient-meera hover:bg-pink-700"
            onClick={() => setShowNewPaymentForm(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> New
          </Button>
        </div>

        {payments.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">
              You haven't made any payments yet.
            </h3>
            <p className="text-muted-foreground mb-6">
              Receipts of your bill payments will show up here.
            </p>
            <Button
              className="bg-gradient-meera hover:bg-pink-700"
              onClick={() => setShowNewPaymentForm(true)}
            >
              Record Payment
            </Button>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Date</TableHead>
                  <TableHead>Payment #</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.date}</TableCell>
                    <TableCell className="font-medium">
                      {payment.number}
                    </TableCell>
                    <TableCell>{payment.vendor}</TableCell>
                    <TableCell>{payment.mode}</TableCell>
                    <TableCell className="text-right">
                      {payment.amount}
                    </TableCell>
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

        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">
            Life cycle of a Vendor Payment
          </h3>
          <div className="border rounded-lg p-6">
            <img
              src="/payment-lifecycle.png"
              alt="Payment Lifecycle"
              className="w-full max-w-3xl mx-auto"
              onError={(e) => {
                // Fallback if image doesn't exist
                e.currentTarget.style.display = "none";
              }}
            />
            <div className="grid grid-cols-3 gap-8 mt-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                  <span className="font-medium">
                    Record payments made to vendors
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Track all your outgoing payments in one place
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-pink-500"></div>
                  <span className="font-medium">
                    View records of paid bills
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Keep track of all your bill payments
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <span className="font-medium">Record payments manually</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Add payments that weren't made through the system
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentsList;
