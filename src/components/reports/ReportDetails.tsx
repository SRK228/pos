import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Download,
  Printer,
  Mail,
  Calendar,
  Clock,
  ArrowLeft,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { addDays } from "date-fns";

interface ReportDetailsProps {
  reportId: string;
  reportName: string;
  onBack: () => void;
}

const ReportDetails = ({
  reportId,
  reportName,
  onBack,
}: ReportDetailsProps) => {
  const [date, setDate] = React.useState({
    from: new Date(),
    to: addDays(new Date(), 30),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold text-primary">{reportName}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <DatePickerWithRange date={date} setDate={setDate} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Report Format</label>
              <Select defaultValue="pdf">
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {reportId.includes("sales") && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sales Person</label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="Select sales person" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sales Persons</SelectItem>
                      <SelectItem value="sp1">Sales Person 1</SelectItem>
                      <SelectItem value="sp2">Sales Person 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="toys">Toys</SelectItem>
                      <SelectItem value="clothes">Clothes</SelectItem>
                      <SelectItem value="essentials">Essentials</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {reportId.includes("inventory") && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Stock Status</label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="Select stock status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Stock</SelectItem>
                      <SelectItem value="in-stock">In Stock</SelectItem>
                      <SelectItem value="low-stock">Low Stock</SelectItem>
                      <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Product Category
                  </label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="toys">Toys</SelectItem>
                      <SelectItem value="clothes">Clothes</SelectItem>
                      <SelectItem value="essentials">Essentials</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Schedule
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              Print
            </Button>
            <Button
              className="bg-gradient-meera hover:bg-pink-700 flex items-center gap-2"
              onClick={() => {
                // Validate required parameters
                if (!date.from || !date.to) {
                  alert("Please select a date range");
                  return;
                }
                alert("Report generated successfully!");
              }}
            >
              <Download className="h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="preview" className="space-y-4">
        <TabsList className="bg-muted">
          <TabsTrigger
            value="preview"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Preview
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Report History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No Report Generated Yet</h3>
                <p className="text-muted-foreground mt-2 max-w-md">
                  Set your parameters above and click "Generate Report" to see
                  the report preview here.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No Report History</h3>
                <p className="text-muted-foreground mt-2 max-w-md">
                  Once you generate reports, they will appear here for easy
                  access.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportDetails;
