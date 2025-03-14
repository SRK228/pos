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
import VendorForm from "./VendorForm";

const VendorsList = () => {
  const [showNewVendorForm, setShowNewVendorForm] = useState(false);
  const [vendors, setVendors] = useState([
    {
      id: 1,
      name: "Anantham",
      company: "Anantham",
      email: "",
      phone: "",
      payables: "₹0.00",
      credits: "₹0.00",
    },
  ]);

  const handleCreateVendor = (vendorData: any) => {
    // In a real app, you would send this to your backend
    const newVendor = {
      id: vendors.length + 1,
      name: vendorData.name,
      company: vendorData.company || vendorData.name,
      email: vendorData.email || "",
      phone: vendorData.phone || "",
      payables: "₹0.00",
      credits: "₹0.00",
    };

    setVendors([...vendors, newVendor]);
    setShowNewVendorForm(false);
  };

  if (showNewVendorForm) {
    return (
      <VendorForm
        onSubmit={handleCreateVendor}
        onCancel={() => setShowNewVendorForm(false)}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Vendors</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2 w-full max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search vendors..." className="pl-9" />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          <Button
            className="bg-gradient-meera hover:bg-pink-700"
            onClick={() => setShowNewVendorForm(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> New
          </Button>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Company Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Work Phone</TableHead>
                <TableHead className="text-right">Payables (INR)</TableHead>
                <TableHead className="text-right">
                  Unused Credits (INR)
                </TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendors.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell>
                    <input type="checkbox" className="rounded" />
                  </TableCell>
                  <TableCell className="font-medium">{vendor.name}</TableCell>
                  <TableCell>{vendor.company}</TableCell>
                  <TableCell>{vendor.email}</TableCell>
                  <TableCell>{vendor.phone}</TableCell>
                  <TableCell className="text-right">
                    {vendor.payables}
                  </TableCell>
                  <TableCell className="text-right">{vendor.credits}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default VendorsList;
