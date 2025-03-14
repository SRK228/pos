import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTenant } from "@/contexts/TenantContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import MeeraLogo from "@/components/MeeraLogo";

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { createTenant } = useTenant();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Organization details
  const [tenantName, setTenantName] = useState("");
  const [tenantSlug, setTenantSlug] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("India");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [taxId, setTaxId] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#db2777");
  const [secondaryColor, setSecondaryColor] = useState("#f472b6");

  // Store details
  const [storeName, setStoreName] = useState("");
  const [storeCode, setStoreCode] = useState("");
  const [storeAddress, setStoreAddress] = useState("");
  const [storeCity, setStoreCity] = useState("");
  const [storeState, setStoreState] = useState("");
  const [storePostalCode, setStorePostalCode] = useState("");
  const [storeCountry, setStoreCountry] = useState("India");
  const [storePhone, setStorePhone] = useState("");
  const [storeEmail, setStoreEmail] = useState("");

  const handleSubmit = () => {
    if (currentStep === 1) {
      // Validation disabled for now
      // Just set default values if fields are empty
      if (!tenantName) setTenantName("Meera Store");
      if (!tenantSlug) setTenantSlug("meera-store-" + Date.now());

      setCurrentStep(2);
      setError(null);
    } else if (currentStep === 2) {
      // Validation disabled for now
      // Just set default values if fields are empty
      const defaultStoreName = storeName || "Main Store";
      const defaultStoreCode = storeCode || "STORE01";

      // Submit the form
      setIsLoading(true);
      createTenant(
        {
          name: tenantName || "Meera Store",
          slug: tenantSlug || "meera-store-" + Date.now(),
          primary_color: primaryColor,
          secondary_color: secondaryColor,
        },
        {
          name: defaultStoreName,
          code: defaultStoreCode,
        },
        {
          email,
          fullName: tenantName || "Meera Store",
        },
      )
        .then((slug) => {
          if (slug) {
            navigate("/");
          } else {
            setError("Failed to create tenant");
            setIsLoading(false);
          }
        })
        .catch((err) => {
          console.error("Tenant creation error:", err);
          setError(err.message || "An error occurred");
          setIsLoading(false);
        });
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-meera p-6 flex items-center justify-center">
          <MeeraLogo className="h-12 text-white" />
        </div>

        <Tabs value={`step-${currentStep}`} className="p-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="step-1"
              disabled={currentStep !== 1}
              className="data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              Organization Details
            </TabsTrigger>
            <TabsTrigger
              value="step-2"
              disabled={currentStep !== 2}
              className="data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              Store Setup
            </TabsTrigger>
          </TabsList>

          <TabsContent value="step-1" className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Organization Information</CardTitle>
                <CardDescription>
                  Enter your organization details to get started
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="org-name">Organization Name*</Label>
                    <Input
                      id="org-name"
                      value={tenantName}
                      onChange={(e) => setTenantName(e.target.value)}
                      placeholder="Enter organization name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="org-slug">Organization Slug*</Label>
                    <Input
                      id="org-slug"
                      value={tenantSlug}
                      onChange={(e) =>
                        setTenantSlug(
                          e.target.value.toLowerCase().replace(/\s+/g, "-"),
                        )
                      }
                      placeholder="organization-slug"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primary-color">Primary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="primary-color"
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondary-color">Secondary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="secondary-color"
                        type="color"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => navigate("/")}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>Next Step</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="step-2" className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Store Setup</CardTitle>
                <CardDescription>
                  Set up your first store location
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="store-name">Store Name*</Label>
                    <Input
                      id="store-name"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      placeholder="Enter store name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="store-code">Store Code*</Label>
                    <Input
                      id="store-code"
                      value={storeCode}
                      onChange={(e) =>
                        setStoreCode(e.target.value.toUpperCase())
                      }
                      placeholder="STORE01"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="store-address">Store Address</Label>
                  <Textarea
                    id="store-address"
                    value={storeAddress}
                    onChange={(e) => setStoreAddress(e.target.value)}
                    placeholder="Enter store address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="store-city">City</Label>
                    <Input
                      id="store-city"
                      value={storeCity}
                      onChange={(e) => setStoreCity(e.target.value)}
                      placeholder="Enter city"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="store-state">State</Label>
                    <Input
                      id="store-state"
                      value={storeState}
                      onChange={(e) => setStoreState(e.target.value)}
                      placeholder="Enter state"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="store-postal-code">Postal Code</Label>
                    <Input
                      id="store-postal-code"
                      value={storePostalCode}
                      onChange={(e) => setStorePostalCode(e.target.value)}
                      placeholder="Enter postal code"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="store-phone">Store Phone</Label>
                    <Input
                      id="store-phone"
                      value={storePhone}
                      onChange={(e) => setStorePhone(e.target.value)}
                      placeholder="Enter store phone"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="store-email">Store Email</Label>
                    <Input
                      id="store-email"
                      type="email"
                      value={storeEmail}
                      onChange={(e) => setStoreEmail(e.target.value)}
                      placeholder="Enter store email"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  Previous
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="bg-gradient-meera hover:bg-pink-700"
                >
                  {isLoading ? <LoadingSpinner size="sm" /> : null}
                  <span className="ml-2">Complete Setup</span>
                </Button>
              </CardFooter>
            </Card>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OnboardingPage;
