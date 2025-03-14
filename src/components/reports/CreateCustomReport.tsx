import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Plus, Trash2, MoveVertical } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface CreateCustomReportProps {
  onBack: () => void;
  onSave: (report: any) => void;
}

const CreateCustomReport = ({ onBack, onSave }: CreateCustomReportProps) => {
  const [reportName, setReportName] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [selectedModule, setSelectedModule] = useState("sales");
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const modules = [
    { id: "sales", name: "Sales" },
    { id: "inventory", name: "Inventory" },
    { id: "receivables", name: "Receivables" },
    { id: "payments", name: "Payments" },
  ];

  const availableFields = {
    sales: [
      { id: "date", name: "Date" },
      { id: "order_id", name: "Order ID" },
      { id: "customer_name", name: "Customer Name" },
      { id: "product_name", name: "Product Name" },
      { id: "category", name: "Category" },
      { id: "quantity", name: "Quantity" },
      { id: "unit_price", name: "Unit Price" },
      { id: "total_price", name: "Total Price" },
      { id: "payment_method", name: "Payment Method" },
      { id: "sales_person", name: "Sales Person" },
    ],
    inventory: [
      { id: "product_id", name: "Product ID" },
      { id: "product_name", name: "Product Name" },
      { id: "category", name: "Category" },
      { id: "current_stock", name: "Current Stock" },
      { id: "reorder_level", name: "Reorder Level" },
      { id: "cost_price", name: "Cost Price" },
      { id: "selling_price", name: "Selling Price" },
      { id: "last_updated", name: "Last Updated" },
    ],
    receivables: [
      { id: "invoice_id", name: "Invoice ID" },
      { id: "customer_name", name: "Customer Name" },
      { id: "invoice_date", name: "Invoice Date" },
      { id: "due_date", name: "Due Date" },
      { id: "amount", name: "Amount" },
      { id: "status", name: "Status" },
    ],
    payments: [
      { id: "payment_id", name: "Payment ID" },
      { id: "customer_name", name: "Customer Name" },
      { id: "payment_date", name: "Payment Date" },
      { id: "amount", name: "Amount" },
      { id: "payment_method", name: "Payment Method" },
      { id: "reference_number", name: "Reference Number" },
    ],
  };

  const handleFieldToggle = (fieldId: string) => {
    if (selectedFields.includes(fieldId)) {
      setSelectedFields(selectedFields.filter((id) => id !== fieldId));
    } else {
      setSelectedFields([...selectedFields, fieldId]);
    }
  };

  const handleFilterToggle = (fieldId: string) => {
    if (selectedFilters.includes(fieldId)) {
      setSelectedFilters(selectedFilters.filter((id) => id !== fieldId));
    } else {
      setSelectedFilters([...selectedFilters, fieldId]);
    }
  };

  const handleSave = () => {
    // Validate form
    const errors: string[] = [];
    if (!reportName) errors.push("Report name is required");
    if (!selectedModule) errors.push("Module is required");
    if (selectedFields.length === 0)
      errors.push("At least one field must be selected");

    if (errors.length > 0) {
      alert("Please fix the following errors:\n" + errors.join("\n"));
      return;
    }

    const newReport = {
      id: `custom-${Date.now()}`,
      name: reportName,
      description: reportDescription,
      module: selectedModule,
      fields: selectedFields,
      filters: selectedFilters,
      createdBy: "User",
      createdAt: new Date().toISOString(),
    };
    onSave(newReport);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold text-primary">
          Create Custom Report
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="report-name">Report Name*</Label>
              <Input
                id="report-name"
                placeholder="Enter report name"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="module">Module*</Label>
              <Select
                value={selectedModule}
                onValueChange={(value) => {
                  setSelectedModule(value);
                  setSelectedFields([]);
                  setSelectedFilters([]);
                }}
              >
                <SelectTrigger id="module">
                  <SelectValue placeholder="Select module" />
                </SelectTrigger>
                <SelectContent>
                  {modules.map((module) => (
                    <SelectItem key={module.id} value={module.id}>
                      {module.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter report description"
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="fields" className="space-y-4">
        <TabsList className="bg-muted">
          <TabsTrigger
            value="fields"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Select Fields
          </TabsTrigger>
          <TabsTrigger
            value="filters"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Set Filters
          </TabsTrigger>
          <TabsTrigger
            value="sorting"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Sorting & Grouping
          </TabsTrigger>
        </TabsList>

        <TabsContent value="fields" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Select Fields to Include</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-4">Available Fields</h3>
                  <div className="space-y-2">
                    {availableFields[
                      selectedModule as keyof typeof availableFields
                    ].map((field) => (
                      <div
                        key={field.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`field-${field.id}`}
                          checked={selectedFields.includes(field.id)}
                          onCheckedChange={() => handleFieldToggle(field.id)}
                        />
                        <label
                          htmlFor={`field-${field.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {field.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-4">Selected Fields</h3>
                  {selectedFields.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No fields selected yet.</p>
                      <p>Select fields from the left panel.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedFields.map((fieldId) => {
                        const field = availableFields[
                          selectedModule as keyof typeof availableFields
                        ].find((f) => f.id === fieldId);
                        return (
                          <div
                            key={fieldId}
                            className="flex items-center justify-between p-2 border rounded-md"
                          >
                            <span>{field?.name}</span>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon">
                                <MoveVertical className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleFieldToggle(fieldId)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="filters" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Set Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-4">Available Filters</h3>
                  <div className="space-y-2">
                    {availableFields[
                      selectedModule as keyof typeof availableFields
                    ].map((field) => (
                      <div
                        key={field.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`filter-${field.id}`}
                          checked={selectedFilters.includes(field.id)}
                          onCheckedChange={() => handleFilterToggle(field.id)}
                        />
                        <label
                          htmlFor={`filter-${field.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {field.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-4">Selected Filters</h3>
                  {selectedFilters.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No filters selected yet.</p>
                      <p>Select filters from the left panel.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedFilters.map((filterId) => {
                        const filter = availableFields[
                          selectedModule as keyof typeof availableFields
                        ].find((f) => f.id === filterId);
                        return (
                          <div key={filterId} className="p-3 border rounded-md">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">
                                {filter?.name}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleFilterToggle(filterId)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <Select defaultValue="equals">
                                <SelectTrigger>
                                  <SelectValue placeholder="Condition" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="equals">Equals</SelectItem>
                                  <SelectItem value="contains">
                                    Contains
                                  </SelectItem>
                                  <SelectItem value="greater_than">
                                    Greater Than
                                  </SelectItem>
                                  <SelectItem value="less_than">
                                    Less Than
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <Input placeholder="Enter value" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sorting" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sorting & Grouping</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Sort By</h3>
                  <div className="flex items-end gap-4">
                    <div className="flex-1 space-y-2">
                      <Label>Field</Label>
                      <Select defaultValue="">
                        <SelectTrigger>
                          <SelectValue placeholder="Select field" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedFields.map((fieldId) => {
                            const field = availableFields[
                              selectedModule as keyof typeof availableFields
                            ].find((f) => f.id === fieldId);
                            return (
                              <SelectItem key={fieldId} value={fieldId}>
                                {field?.name}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label>Order</Label>
                      <Select defaultValue="asc">
                        <SelectTrigger>
                          <SelectValue placeholder="Select order" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="asc">Ascending</SelectItem>
                          <SelectItem value="desc">Descending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button variant="outline">
                      <Plus className="h-4 w-4 mr-2" /> Add Sort
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Group By</h3>
                  <div className="flex items-end gap-4">
                    <div className="flex-1 space-y-2">
                      <Label>Field</Label>
                      <Select defaultValue="">
                        <SelectTrigger>
                          <SelectValue placeholder="Select field" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedFields.map((fieldId) => {
                            const field = availableFields[
                              selectedModule as keyof typeof availableFields
                            ].find((f) => f.id === fieldId);
                            return (
                              <SelectItem key={fieldId} value={fieldId}>
                                {field?.name}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button variant="outline">
                      <Plus className="h-4 w-4 mr-2" /> Add Group
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onBack}>
          Cancel
        </Button>
        <Button
          className="bg-gradient-meera hover:bg-pink-700"
          onClick={handleSave}
          disabled={!reportName || selectedFields.length === 0}
        >
          Save Report
        </Button>
      </div>
    </div>
  );
};

export default CreateCustomReport;
