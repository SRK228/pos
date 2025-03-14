import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X } from "lucide-react";

interface PaymentFormProps {
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
}

const PaymentForm = ({
  onSubmit = () => {},
  onCancel = () => {},
}: PaymentFormProps) => {
  const [formData, setFormData] = useState({
    vendor: "",
    amount: "",
    mode: "cash",
    date: new Date().toISOString().split("T")[0],
    number: `PMT-${Math.floor(Math.random() * 10000)}`,
    reference: "",
    notes: "",
  });

  const handleChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Payment for {formData.vendor || "Vendor"}</CardTitle>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-primary">Vendor Name*</Label>
            <Select
              value={formData.vendor}
              onValueChange={(value) => handleChange("vendor", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a vendor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="anantham">Anantham</SelectItem>
                <SelectItem value="kids-toys">Kids Toys Inc.</SelectItem>
                <SelectItem value="baby-essentials">
                  Baby Essentials Ltd.
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-primary">Payment Mode (INR)*</Label>
            <Input
              type="number"
              placeholder="Enter amount"
              value={formData.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Payment Mode</Label>
            <Select
              value={formData.mode}
              onValueChange={(value) => handleChange("mode", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                <SelectItem value="check">Check</SelectItem>
                <SelectItem value="credit-card">Credit Card</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-primary">Payment Date*</Label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => handleChange("date", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-primary">Payment #*</Label>
            <Input
              placeholder="Payment number"
              value={formData.number}
              onChange={(e) => handleChange("number", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Reference#</Label>
            <Input
              placeholder="Reference number"
              value={formData.reference}
              onChange={(e) => handleChange("reference", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Notes</Label>
          <Textarea
            placeholder="Add notes about this payment"
            className="min-h-[100px]"
            value={formData.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Attachments</Label>
          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            <Button variant="outline" className="mx-auto">
              <Upload className="mr-2 h-4 w-4" /> Upload File
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              You can upload a maximum of 5 files, 10MB each
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            className="bg-gradient-meera hover:bg-pink-700"
            onClick={handleSubmit}
          >
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentForm;
