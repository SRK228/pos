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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Upload, X } from "lucide-react";

interface VendorFormProps {
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
}

const VendorForm = ({
  onSubmit = () => {},
  onCancel = () => {},
}: VendorFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    displayName: "",
    email: "",
    phone: "",
    mobile: "",
    pan: "",
    isMsme: false,
    currency: "INR",
    paymentTerms: "due-on-receipt",
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
        <CardTitle>New Vendor</CardTitle>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Primary Contact</Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Select defaultValue="mr">
                  <SelectTrigger>
                    <SelectValue placeholder="Salutation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mr">Mr.</SelectItem>
                    <SelectItem value="mrs">Mrs.</SelectItem>
                    <SelectItem value="ms">Ms.</SelectItem>
                    <SelectItem value="dr">Dr.</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Input
                  placeholder="First Name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </div>
              <div>
                <Input placeholder="Last Name" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Company Name</Label>
            <Input
              placeholder="Company Name"
              value={formData.company}
              onChange={(e) => handleChange("company", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              Display Name*
              <span className="text-xs text-muted-foreground">
                (How should this vendor's name appear on transactions?)
              </span>
            </Label>
            <Select
              value={formData.displayName || formData.name || formData.company}
              onValueChange={(value) => handleChange("displayName", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select or type to add" />
              </SelectTrigger>
              <SelectContent>
                {formData.name && (
                  <SelectItem value={formData.name}>{formData.name}</SelectItem>
                )}
                {formData.company && (
                  <SelectItem value={formData.company}>
                    {formData.company}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Email Address</Label>
            <Input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Phone</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Checkbox id="work-phone" />
                <Label htmlFor="work-phone" className="text-sm">
                  Work Phone
                </Label>
                <Input
                  placeholder="Work Phone"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="mobile" />
                <Label htmlFor="mobile" className="text-sm">
                  Mobile
                </Label>
                <Input
                  placeholder="Mobile"
                  value={formData.mobile}
                  onChange={(e) => handleChange("mobile", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="other-details">
          <TabsList className="w-full">
            <TabsTrigger value="other-details" className="flex-1">
              Other Details
            </TabsTrigger>
            <TabsTrigger value="address" className="flex-1">
              Address
            </TabsTrigger>
            <TabsTrigger value="bank-details" className="flex-1">
              Bank Details
            </TabsTrigger>
            <TabsTrigger value="custom-fields" className="flex-1">
              Custom Fields
            </TabsTrigger>
            <TabsTrigger value="remarks" className="flex-1">
              Remarks
            </TabsTrigger>
          </TabsList>

          <TabsContent value="other-details" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>PAN</Label>
              <Input
                placeholder="PAN"
                value={formData.pan}
                onChange={(e) => handleChange("pan", e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="msme-registered"
                checked={formData.isMsme}
                onCheckedChange={(checked) => handleChange("isMsme", checked)}
              />
              <Label htmlFor="msme-registered">
                This vendor is MSME registered
              </Label>
            </div>

            <div className="space-y-2">
              <Label>Currency</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => handleChange("currency", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Payment Terms</Label>
              <Select
                value={formData.paymentTerms}
                onValueChange={(value) => handleChange("paymentTerms", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment terms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="due-on-receipt">Due On Receipt</SelectItem>
                  <SelectItem value="net-15">Net 15</SelectItem>
                  <SelectItem value="net-30">Net 30</SelectItem>
                  <SelectItem value="net-45">Net 45</SelectItem>
                  <SelectItem value="net-60">Net 60</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="address" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Address Line 1</Label>
              <Input placeholder="Address Line 1" />
            </div>
            <div className="space-y-2">
              <Label>Address Line 2</Label>
              <Input placeholder="Address Line 2" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>City</Label>
                <Input placeholder="City" />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Input placeholder="State" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Zip/Postal Code</Label>
                <Input placeholder="Zip/Postal Code" />
              </div>
              <div className="space-y-2">
                <Label>Country</Label>
                <Select defaultValue="india">
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="india">India</SelectItem>
                    <SelectItem value="usa">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bank-details" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Bank Name</Label>
              <Input placeholder="Bank Name" />
            </div>
            <div className="space-y-2">
              <Label>Account Number</Label>
              <Input placeholder="Account Number" />
            </div>
            <div className="space-y-2">
              <Label>IFSC Code</Label>
              <Input placeholder="IFSC Code" />
            </div>
            <div className="space-y-2">
              <Label>Account Type</Label>
              <Select defaultValue="savings">
                <SelectTrigger>
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="savings">Savings</SelectItem>
                  <SelectItem value="current">Current</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="custom-fields" className="pt-4">
            <div className="text-center py-8 text-muted-foreground">
              <p>No custom fields have been created yet.</p>
            </div>
          </TabsContent>

          <TabsContent value="remarks" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Remarks</Label>
              <Input placeholder="Add any additional information about this vendor" />
            </div>
          </TabsContent>
        </Tabs>

        <div className="space-y-2">
          <Label>Documents</Label>
          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            <Button variant="outline" className="mx-auto">
              <Upload className="mr-2 h-4 w-4" /> Upload File
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              You can upload a maximum of 10 files, 10MB each
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

export default VendorForm;
