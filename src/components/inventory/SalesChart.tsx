import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const weeklyData = [
  { name: "Mon", Toys: 4000, Clothes: 2400, Essentials: 1800 },
  { name: "Tue", Toys: 3000, Clothes: 1398, Essentials: 2800 },
  { name: "Wed", Toys: 2000, Clothes: 9800, Essentials: 2800 },
  { name: "Thu", Toys: 2780, Clothes: 3908, Essentials: 1800 },
  { name: "Fri", Toys: 1890, Clothes: 4800, Essentials: 2800 },
  { name: "Sat", Toys: 2390, Clothes: 3800, Essentials: 2800 },
  { name: "Sun", Toys: 3490, Clothes: 4300, Essentials: 2800 },
];

export function SalesChart() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Category-wise Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={weeklyData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`₹${value}`, "Sales"]} />
              <Bar dataKey="Toys" fill="#B83280" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Clothes" fill="#F687B3" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Essentials" fill="#FED7E2" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Stock Movement History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                date: "2024-03-20",
                product: "Soft Teddy Bear",
                type: "in",
                quantity: 50,
              },
              {
                date: "2024-03-19",
                product: "Baby Onesie",
                type: "out",
                quantity: 10,
              },
              {
                date: "2024-03-19",
                product: "Building Blocks",
                type: "in",
                quantity: 25,
              },
              {
                date: "2024-03-18",
                product: "Baby Wipes",
                type: "out",
                quantity: 15,
              },
              {
                date: "2024-03-18",
                product: "Diapers Pack",
                type: "in",
                quantity: 30,
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded-lg bg-card shadow-sm hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${item.type === "in" ? "bg-primary" : "bg-red-500"}`}
                  />
                  <div>
                    <p className="font-medium">{item.product}</p>
                    <p className="text-sm text-gray-500">{item.date}</p>
                  </div>
                </div>
                <div
                  className={`text-sm font-medium ${item.type === "in" ? "text-primary" : "text-red-600"}`}
                >
                  {item.type === "in" ? "+" : "-"}
                  {item.quantity} units
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
