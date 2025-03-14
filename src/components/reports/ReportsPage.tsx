import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Search, Filter, Plus, FileText, Download } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useReports } from "@/hooks/useReports";
import { useScheduledReports } from "@/hooks/useScheduledReports";
import ReportDetails from "./ReportDetails";
import CreateCustomReport from "./CreateCustomReport";

const ReportsPage = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [showCreateCustomReport, setShowCreateCustomReport] = useState(false);

  const reportCategories = [
    {
      id: "sales",
      name: "Sales",
      reports: [
        {
          id: "sales-by-customer",
          name: "Sales by Customer",
          type: "Sales by Customer",
          createdBy: "System Generated",
        },
        {
          id: "sales-by-item",
          name: "Sales by Item",
          type: "Sales by Item",
          createdBy: "System Generated",
        },
        {
          id: "order-fulfillment-by-item",
          name: "Order Fulfillment By Item",
          type: "Order Fulfillment By Item",
          createdBy: "System Generated",
        },
        {
          id: "sales-order-return-history",
          name: "Sales Order Return History",
          type: "Sales Order Return History",
          createdBy: "System Generated",
        },
        {
          id: "sales-by-category",
          name: "Sales by Category",
          type: "Sales by Category",
          createdBy: "System Generated",
        },
        {
          id: "sales-by-sales-person",
          name: "Sales by Sales Person",
          type: "Sales by Sales Person",
          createdBy: "System Generated",
        },
        {
          id: "sales-by-register",
          name: "Sales by Register",
          type: "Sales by Register",
          createdBy: "System Generated",
        },
        {
          id: "packing-history",
          name: "Packing History",
          type: "Packing History",
          createdBy: "System Generated",
        },
      ],
    },
    {
      id: "inventory",
      name: "Inventory",
      reports: [
        {
          id: "inventory-summary",
          name: "Inventory Summary",
          type: "Inventory Summary",
          createdBy: "System Generated",
        },
        {
          id: "committed-stock-details",
          name: "Committed Stock Details",
          type: "Committed Stock Details",
          createdBy: "System Generated",
        },
        {
          id: "inventory-valuation-summary",
          name: "Inventory Valuation Summary",
          type: "Inventory Valuation Summary",
          createdBy: "System Generated",
        },
        {
          id: "fifo-cost-lot-tracking",
          name: "FIFO Cost Lot Tracking",
          type: "FIFO Cost Lot Tracking",
          createdBy: "System Generated",
        },
        {
          id: "inventory-aging-summary",
          name: "Inventory Aging Summary",
          type: "Inventory Aging Summary",
          createdBy: "System Generated",
        },
        {
          id: "product-sales-report",
          name: "Product Sales Report",
          type: "Product Sales Report",
          createdBy: "System Generated",
        },
        {
          id: "active-purchase-orders-report",
          name: "Active Purchase Orders Report",
          type: "Active Purchase Orders Report",
          createdBy: "System Generated",
        },
        {
          id: "stock-summary-report",
          name: "Stock Summary Report",
          type: "Stock Summary Report",
          createdBy: "System Generated",
        },
        {
          id: "abc-classification",
          name: "ABC Classification",
          type: "ABC Classification",
          createdBy: "System Generated",
        },
      ],
    },
    {
      id: "receivables",
      name: "Receivables",
      reports: [
        {
          id: "invoice-details",
          name: "Invoice Details",
          type: "Invoice Details",
          createdBy: "System Generated",
        },
        {
          id: "sales-order-details",
          name: "Sales Order Details",
          type: "Sales Order Details",
          createdBy: "System Generated",
        },
        {
          id: "delivery-challan-details",
          name: "Delivery Challan Details",
          type: "Delivery Challan Details",
          createdBy: "System Generated",
        },
        {
          id: "customer-balance-summary",
          name: "Customer Balance Summary",
          type: "Customer Balance Summary",
          createdBy: "System Generated",
        },
        {
          id: "receivable-summary",
          name: "Receivable Summary",
          type: "Receivable Summary",
          createdBy: "System Generated",
        },
        {
          id: "receivable-details",
          name: "Receivable Details",
          type: "Receivable Details",
          createdBy: "System Generated",
        },
      ],
    },
    {
      id: "payments-received",
      name: "Payments Received",
      reports: [
        {
          id: "payments-received",
          name: "Payments Received",
          type: "Payments Received",
          createdBy: "System Generated",
        },
        {
          id: "credit-note-details",
          name: "Credit Note Details",
          type: "Credit Note Details",
          createdBy: "System Generated",
        },
      ],
    },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [allReports, setAllReports] = useState(
    reportCategories.flatMap((category) => category.reports),
  );
  const [favoriteReports, setFavoriteReports] = useState<any[]>([]);
  const [customReports, setCustomReports] = useState<any[]>([]);
  const [scheduledReports, setScheduledReports] = useState<any[]>([]);

  const filteredReports = allReports.filter((report) =>
    report.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const addToFavorites = (report: any) => {
    if (!favoriteReports.some((r) => r.id === report.id)) {
      setFavoriteReports([...favoriteReports, report]);
    }
  };

  const removeFromFavorites = (reportId: string) => {
    setFavoriteReports(
      favoriteReports.filter((report) => report.id !== reportId),
    );
  };

  const handleReportClick = (report: any) => {
    setSelectedReport(report);
  };

  const handleBackToReports = () => {
    setSelectedReport(null);
    setShowCreateCustomReport(false);
  };

  const handleCreateCustomReport = () => {
    setShowCreateCustomReport(true);
  };

  const handleSaveCustomReport = (report: any) => {
    // Validate the report before saving
    if (
      !report.name ||
      !report.module ||
      !report.fields ||
      report.fields.length === 0
    ) {
      alert("Please fill in all required fields for the report");
      return;
    }

    setCustomReports([...customReports, report]);
    setShowCreateCustomReport(false);
    alert("Custom report created successfully!");
  };

  if (selectedReport) {
    return (
      <ReportDetails
        reportId={selectedReport.id}
        reportName={selectedReport.name}
        onBack={handleBackToReports}
      />
    );
  }

  if (showCreateCustomReport) {
    return (
      <CreateCustomReport
        onBack={handleBackToReports}
        onSave={handleSaveCustomReport}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">Reports Center</h1>
        <div className="text-sm text-muted-foreground">
          Meera Maternity & Fertility Store
        </div>
      </div>

      <Tabs defaultValue="all-reports" className="space-y-4">
        <TabsList className="bg-muted">
          <TabsTrigger
            value="all-reports"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            All Reports
          </TabsTrigger>
          <TabsTrigger
            value="favorites"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Favorites
          </TabsTrigger>
          <TabsTrigger
            value="custom-reports"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Custom Reports
          </TabsTrigger>
          <TabsTrigger
            value="scheduled-reports"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Scheduled Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all-reports" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-2 w-full max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search reports..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            <Button
              className="bg-gradient-meera hover:bg-pink-700"
              onClick={handleCreateCustomReport}
            >
              <Plus className="mr-2 h-4 w-4" /> Create Custom Report
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-280px)]">
                <Table>
                  <TableHeader className="sticky top-0 bg-white">
                    <TableRow>
                      <TableHead className="w-[300px]">REPORT NAME</TableHead>
                      <TableHead>TYPE</TableHead>
                      <TableHead>CREATED BY</TableHead>
                      <TableHead className="w-[100px]">ACTIONS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportCategories.map((category) => (
                      <React.Fragment key={category.id}>
                        <TableRow className="bg-muted/50">
                          <TableCell colSpan={4} className="font-medium">
                            <div className="flex items-center">
                              <span className="mr-2">{category.name}</span>
                              <span className="bg-primary/20 text-primary text-xs rounded-full px-2 py-0.5">
                                {category.reports.length}
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                        {category.reports
                          .filter((report) =>
                            report.name
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()),
                          )
                          .map((report) => (
                            <TableRow key={report.id}>
                              <TableCell className="font-medium">
                                <div
                                  className="flex items-center cursor-pointer hover:text-primary"
                                  onClick={() => handleReportClick(report)}
                                >
                                  <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                                  {report.name}
                                </div>
                              </TableCell>
                              <TableCell>{report.type}</TableCell>
                              <TableCell>{report.createdBy}</TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => addToFavorites(report)}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="text-muted-foreground"
                                    >
                                      <path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2z"></path>
                                    </svg>
                                  </Button>
                                  <Button variant="ghost" size="icon">
                                    <Download className="h-4 w-4 text-muted-foreground" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="favorites" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Favorite Reports</CardTitle>
            </CardHeader>
            <CardContent>
              {favoriteReports.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>You haven't added any reports to your favorites yet.</p>
                  <p>Star reports to add them here for quick access.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">REPORT NAME</TableHead>
                      <TableHead>TYPE</TableHead>
                      <TableHead>CREATED BY</TableHead>
                      <TableHead className="w-[100px]">ACTIONS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {favoriteReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">
                          <div
                            className="flex items-center cursor-pointer hover:text-primary"
                            onClick={() => handleReportClick(report)}
                          >
                            <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                            {report.name}
                          </div>
                        </TableCell>
                        <TableCell>{report.type}</TableCell>
                        <TableCell>{report.createdBy}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFromFavorites(report.id)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-yellow-500"
                              >
                                <path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2z"></path>
                              </svg>
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom-reports" className="space-y-4">
          <div className="flex justify-end">
            <Button
              className="bg-gradient-meera hover:bg-pink-700"
              onClick={handleCreateCustomReport}
            >
              <Plus className="mr-2 h-4 w-4" /> Create Custom Report
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Custom Reports</CardTitle>
            </CardHeader>
            <CardContent>
              {customReports.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>You haven't created any custom reports yet.</p>
                  <p>Create a custom report to see it here.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">REPORT NAME</TableHead>
                      <TableHead>MODULE</TableHead>
                      <TableHead>CREATED AT</TableHead>
                      <TableHead className="w-[100px]">ACTIONS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">
                          <div
                            className="flex items-center cursor-pointer hover:text-primary"
                            onClick={() => handleReportClick(report)}
                          >
                            <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                            {report.name}
                          </div>
                        </TableCell>
                        <TableCell>{report.module}</TableCell>
                        <TableCell>
                          {new Date(report.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => addToFavorites(report)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-muted-foreground"
                              >
                                <path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2z"></path>
                              </svg>
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled-reports" className="space-y-4">
          <div className="flex justify-end">
            <Button className="bg-gradient-meera hover:bg-pink-700">
              <Plus className="mr-2 h-4 w-4" /> Schedule a Report
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>You haven't scheduled any reports yet.</p>
                <p>
                  Schedule reports to have them automatically generated and sent
                  to you.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsPage;
