import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PaymentLifecycle = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Lifecycle</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center">
          <img
            src="/payment-lifecycle.png"
            alt="Payment Lifecycle Diagram"
            className="max-w-full h-auto rounded-md shadow-md"
          />
        </div>
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-medium">
            Understanding the Payment Process
          </h3>
          <p className="text-muted-foreground">
            The payment lifecycle illustrates how funds flow through the system
            from purchase orders to vendor payments. This process ensures proper
            tracking and accounting of all financial transactions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="border rounded-md p-4 bg-muted/20">
              <h4 className="font-medium text-primary mb-2">
                1. Purchase Order
              </h4>
              <p className="text-sm">
                Initial commitment to purchase goods from vendors, creating a
                financial obligation.
              </p>
            </div>

            <div className="border rounded-md p-4 bg-muted/20">
              <h4 className="font-medium text-primary mb-2">
                2. Bill Creation
              </h4>
              <p className="text-sm">
                When goods are received, bills are created to formalize the
                payment obligation.
              </p>
            </div>

            <div className="border rounded-md p-4 bg-muted/20">
              <h4 className="font-medium text-primary mb-2">
                3. Payment Processing
              </h4>
              <p className="text-sm">
                Payments are made against bills, updating the bill status and
                vendor accounts.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentLifecycle;
