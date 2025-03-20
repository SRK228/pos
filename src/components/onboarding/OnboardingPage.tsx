import React, { useState, useEffect } from "react";
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
import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import MeeraLogo from "@/components/MeeraLogo";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { user, signUp, isAuthenticated } = useAuth();
  const { toast } = useToast();
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

  // Check if user is already authenticated and has a tenant
  useEffect(() => {
    console.log("OnboardingPage: Checking authentication status");
    console.log("isAuthenticated:", isAuthenticated);
    console.log("user:", user);

    if (isAuthenticated && user?.tenant_id) {
      // User already has a tenant, redirect to dashboard
      console.log("User already has a tenant, redirecting to dashboard");
      navigate("/dashboard");
    } else if (user) {
      // Pre-fill email if user is logged in
      console.log("User is logged in, pre-filling email");
      setEmail(user.email || "");
    } else {
      // User is not logged in, redirect to login
      console.log("User is not logged in, redirecting to login");
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate]);

  // Auto-generate slug when tenant name changes
  useEffect(() => {
    if (tenantName && !tenantSlug) {
      setTenantSlug(tenantName.toLowerCase().replace(/\s+/g, "-"));
    }
  }, [tenantName, tenantSlug]);

  // Auto-generate store code when store name changes
  useEffect(() => {
    if (storeName && !storeCode) {
      setStoreCode(storeName.toUpperCase().replace(/\s+/g, "").substring(0, 5));
    }
  }, [storeName, storeCode]);

  const handleSubmit = async () => {
    if (currentStep === 1) {
      // Validate organization details
      if (!tenantName.trim()) {
        setError("Organization name is required");
        return;
      }
      if (!tenantSlug.trim()) {
        setTenantSlug(tenantName.toLowerCase().replace(/\s+/g, "-"));
      }

      // Validate slug format
      const slugRegex = /^[a-z0-9-]+$/;
      if (!slugRegex.test(tenantSlug)) {
        setError(
          "Slug can only contain lowercase letters, numbers, and hyphens",
        );
        return;
      }

      setCurrentStep(2);
      setError(null);
    } else if (currentStep === 2) {
      // Validate store details
      if (!storeName.trim()) {
        setError("Store name is required");
        return;
      }

      // Generate store code if not provided
      if (!storeCode) {
        setStoreCode(
          storeName.toUpperCase().replace(/\s+/g, "").substring(0, 5),
        );
      }

      try {
        setIsLoading(true);
        setError(null);
        console.log("Starting onboarding process...");

        // Create tenant and store
        const tenantData = {
          name: tenantName,
          slug: tenantSlug,
          primary_color: primaryColor,
          secondary_color: secondaryColor,
          logo_url: null, // Will be added later in settings
        };

        const storeData = {
          name: storeName,
          code: storeCode,
          address: storeAddress,
          city: storeCity,
          state: storeState,
          postal_code: storePostalCode,
          country: storeCountry,
          phone: storePhone,
          email: storeEmail || email,
        };

        console.log("Tenant data:", tenantData);
        console.log("Store data:", storeData);

        // If user is already logged in, we just need to create tenant and store
        if (user) {
          console.log(
            "User is logged in, creating tenant and store for user:",
            user.id,
          );

          try {
            // Create tenant and store for existing user
            await signUp(
              user.email,
              "", // Password not needed for existing user
              {
                full_name: user.full_name,
                email: user.email,
                role: "admin",
              },
              tenantData,
              storeData,
            );

            console.log("Tenant and store created successfully");
            toast({
              title: "Setup Complete",
              description:
                "Your organization and store have been created successfully.",
              variant: "default",
            });

            // Force reload user data to get updated tenant_id and store_id
            const { data } = await supabase.auth.getUser();
            if (data?.user) {
              console.log("Reloaded user data:", data.user);
            }

            // Save tenant slug to local storage
            localStorage.setItem("currentTenantSlug", tenantSlug);
            console.log("Saved tenant slug to local storage:", tenantSlug);

            // Redirect to dashboard
            console.log("Redirecting to dashboard");
            navigate("/dashboard");
          } catch (err) {
            console.error("Error creating tenant and store:", err);
            setError(err.message || "Failed to create organization and store");
            toast({
              title: "Setup Failed",
              description:
                err.message || "Failed to create organization and store",
              variant: "destructive",
            });
          }
        } else {
          // This should not happen as user should be logged in to access onboarding
          console.error("No user found during onboarding");
          setError("You must be logged in to complete onboarding");
          navigate("/login");
          return;
        }
      } catch (err: any) {
        console.error("Onboarding error:", err);
        setError(err.message || "An error occurred during onboarding");
        toast({
          title: "Onboarding Failed",
          description: err.message || "An error occurred during onboarding",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
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
                  Enter your organization details to get started with Meera POS
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
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="org-slug">Organization Slug*</Label>
                    <Input
                      id="org-slug"
                      value={tenantSlug}
                      onChange={(e) =>
                        setTenantSlug(
                          e.target.value
                            .toLowerCase()
                            .replace(/\s+/g, "-")
                            .replace(/[^a-z0-9-]/g, ""),
                        )
                      }
                      placeholder="organization-slug"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Your organization URL will be: {tenantSlug}.meerapos.com
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="org-email">Email</Label>
                  <Input
                    id="org-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="org-phone">Phone</Label>
                  <Input
                    id="org-phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9876543210"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="org-tax-id">Tax ID (Optional)</Label>
                  <Input
                    id="org-tax-id"
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    placeholder="GSTIN1234567890"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Brand Colors</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="primary-color" className="text-xs">
                        Primary Color
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="primary-color"
                          type="color"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="w-12 h-8 p-1"
                        />
                        <Input
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="secondary-color" className="text-xs">
                        Secondary Color
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="secondary-color"
                          type="color"
                          value={secondaryColor}
                          onChange={(e) => setSecondaryColor(e.target.value)}
                          className="w-12 h-8 p-1"
                        />
                        <Input
                          value={secondaryColor}
                          onChange={(e) => setSecondaryColor(e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => navigate("/login")}>
                  Cancel
                </Button>
                <Button onClick={() => handleSubmit()}>Continue</Button>
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
                      placeholder="Main Store"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="store-code">Store Code</Label>
                    <Input
                      id="store-code"
                      value={storeCode}
                      onChange={(e) =>
                        setStoreCode(e.target.value.toUpperCase())
                      }
                      placeholder="MAIN01"
                    />
                    <p className="text-xs text-muted-foreground">
                      A unique code for this store location
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="store-address">Address</Label>
                  <Textarea
                    id="store-address"
                    value={storeAddress}
                    onChange={(e) => setStoreAddress(e.target.value)}
                    placeholder="123 Main Street"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="store-city">City</Label>
                    <Input
                      id="store-city"
                      value={storeCity}
                      onChange={(e) => setStoreCity(e.target.value)}
                      placeholder="Chennai"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="store-state">State</Label>
                    <Input
                      id="store-state"
                      value={storeState}
                      onChange={(e) => setStoreState(e.target.value)}
                      placeholder="Tamil Nadu"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="store-postal-code">Postal Code</Label>
                    <Input
                      id="store-postal-code"
                      value={storePostalCode}
                      onChange={(e) => setStorePostalCode(e.target.value)}
                      placeholder="600001"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="store-phone">Phone</Label>
                    <Input
                      id="store-phone"
                      value={storePhone}
                      onChange={(e) => setStorePhone(e.target.value)}
                      placeholder="+91 9876543210"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="store-email">Email</Label>
                    <Input
                      id="store-email"
                      type="email"
                      value={storeEmail}
                      onChange={(e) => setStoreEmail(e.target.value)}
                      placeholder="store@example.com"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  Back
                </Button>
                <Button
                  className="bg-gradient-meera hover:bg-pink-700"
                  onClick={() => handleSubmit()}
                  disabled={isLoading}
                >
                  {isLoading ? <LoadingSpinner size="sm" /> : null}
                  <span className="ml-2">Complete Setup</span>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;
