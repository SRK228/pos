import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import POSPreferences from "./POSPreferences";

const SettingsPage = () => {
  const [theme, setTheme] = React.useState<"light" | "dark" | "meera">("meera");
  const [activeTab, setActiveTab] = React.useState("general");

  React.useEffect(() => {
    // Apply theme changes
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
      root.style.setProperty("--background", "222.2 84% 4.9%");
      root.style.setProperty("--foreground", "210 40% 98%");
    } else {
      root.classList.remove("dark");

      if (theme === "light") {
        // Light theme with neutral colors
        root.style.setProperty("--background", "0 0% 100%");
        root.style.setProperty("--foreground", "222.2 84% 4.9%");
        root.style.setProperty("--primary", "222.2 47.4% 11.2%");
        root.style.setProperty("--primary-foreground", "210 40% 98%");
        root.style.setProperty("--secondary", "210 40% 96.1%");
        root.style.setProperty("--muted", "210 40% 96.1%");
        root.style.setProperty("--accent", "210 40% 96.1%");
        root.style.setProperty("--border", "214.3 31.8% 91.4%");
      } else {
        // Meera theme with brand colors
        root.style.setProperty("--background", "0 0% 100%");
        root.style.setProperty("--foreground", "328 73% 25%");
        root.style.setProperty("--primary", "328 73% 25%");
        root.style.setProperty("--primary-foreground", "0 0% 100%");
        root.style.setProperty("--secondary", "340 82% 76%");
        root.style.setProperty("--muted", "340 82% 95%");
        root.style.setProperty("--accent", "340 82% 76%");
        root.style.setProperty("--border", "340 82% 85%");
      }
    }
  }, [theme]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">Settings</h1>
        <div className="text-sm text-muted-foreground">
          Meera Maternity & Fertility Store
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="bg-muted overflow-x-auto flex whitespace-nowrap">
          <TabsTrigger
            value="general"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            General
          </TabsTrigger>
          <TabsTrigger
            value="appearance"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Appearance
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Notifications
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Security
          </TabsTrigger>
          <TabsTrigger
            value="pos"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            POS
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="store-name">Store Name</Label>
                  <Input
                    id="store-name"
                    defaultValue="Meera Maternity & Fertility Store"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="store-email">Email Address</Label>
                  <Input
                    id="store-email"
                    type="email"
                    defaultValue="contact@meerastore.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="store-phone">Phone Number</Label>
                  <Input id="store-phone" defaultValue="+91 9876543210" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="store-currency">Currency</Label>
                  <Select defaultValue="inr">
                    <SelectTrigger id="store-currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inr">Indian Rupee (₹)</SelectItem>
                      <SelectItem value="usd">US Dollar ($)</SelectItem>
                      <SelectItem value="eur">Euro (€)</SelectItem>
                      <SelectItem value="gbp">British Pound (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="store-address">Store Address</Label>
                <Textarea
                  id="store-address"
                  defaultValue="123 Main Street, Chennai, Tamil Nadu, India - 600001"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="store-description">Store Description</Label>
                <Textarea
                  id="store-description"
                  defaultValue="A premium store for all maternity and fertility needs, offering a wide range of products for mothers and babies."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tax Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="tax-registration">
                    Tax Registration Number
                  </Label>
                  <Input id="tax-registration" defaultValue="GSTIN1234567890" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="default-tax-rate">Default Tax Rate (%)</Label>
                  <Input
                    id="default-tax-rate"
                    type="number"
                    defaultValue="18"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="tax-inclusive" defaultChecked />
                <Label htmlFor="tax-inclusive">Show prices tax-inclusive</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Theme Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme-mode">Theme Mode</Label>
                <Select
                  value={theme}
                  onValueChange={(value) =>
                    setTheme(value as "light" | "dark" | "meera")
                  }
                >
                  <SelectTrigger id="theme-mode">
                    <SelectValue placeholder="Select theme mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="meera">Meera</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Primary Color</Label>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    "bg-pink-500",
                    "bg-purple-500",
                    "bg-blue-500",
                    "bg-green-500",
                    "bg-orange-500",
                  ].map((color, index) => (
                    <div
                      key={index}
                      className={`${color} h-10 rounded-md cursor-pointer ring-offset-2 ${index === 0 ? "ring-2 ring-primary" : ""}`}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Logo & Branding</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Store Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-pink-100 rounded-md flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">M</span>
                  </div>
                  <Button>Upload New Logo</Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Favicon</Label>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-pink-100 rounded-md flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">M</span>
                  </div>
                  <Button>Upload New Favicon</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch id="email-orders" defaultChecked />
                <Label htmlFor="email-orders">New Order Notifications</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="email-inventory" defaultChecked />
                <Label htmlFor="email-inventory">Low Stock Alerts</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="email-customers" />
                <Label htmlFor="email-customers">
                  New Customer Registrations
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="email-reports" defaultChecked />
                <Label htmlFor="email-reports">Scheduled Reports</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SMS Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch id="sms-orders" />
                <Label htmlFor="sms-orders">Order Status Updates</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="sms-delivery" />
                <Label htmlFor="sms-delivery">Delivery Notifications</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="sms-promotions" />
                <Label htmlFor="sms-promotions">Promotional Messages</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Password Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
              <Button>Change Password</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Switch id="enable-2fa" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Session Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Chrome on Windows</h3>
                    <p className="text-sm text-muted-foreground">
                      Last active: 2 hours ago
                    </p>
                  </div>
                  <Button variant="outline">Sign Out</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Safari on iPhone</h3>
                    <p className="text-sm text-muted-foreground">
                      Last active: 1 day ago
                    </p>
                  </div>
                  <Button variant="outline">Sign Out</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pos" className="space-y-4">
          <POSPreferences />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
