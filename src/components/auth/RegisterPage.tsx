import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import MeeraLogo from "@/components/MeeraLogo";
import { useToast } from "@/components/ui/use-toast";

const RegisterPage = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const { signUp, isAuthenticated, signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setRegistrationSuccess(false); // Reset registration success state

    // Enhanced validation
    if (!fullName.trim()) {
      setErrorMessage("Full name is required");
      return;
    }

    if (!email.trim()) {
      setErrorMessage("Email is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address");
      return;
    }

    if (!password) {
      setErrorMessage("Password is required");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setErrorMessage("Password must contain at least one uppercase letter");
      return;
    }

    if (!/[0-9]/.test(password)) {
      setErrorMessage("Password must contain at least one number");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      setIsLoading(true);

      // Create user account
      await signUp(email, password, {
        full_name: fullName,
        email,
        role: "admin", // First user is admin for their organization
        is_active: true, // Explicitly set is_active to true
      });

      // Show success message
      setRegistrationSuccess(true);
      toast({
        title: "Registration successful",
        description: "Your account has been created successfully.",
      });

      // Try to sign in directly after registration to avoid email verification
      try {
        await signIn(email, password);
        // If successful, the auth context will handle navigation
      } catch (signInError) {
        console.log("Auto sign-in failed, redirecting to login page");
        // Redirect to login page after successful registration
        setTimeout(() => {
          navigate("/login?registered=true");
        }, 3000);
      }
    } catch (error: any) {
      console.error("Registration error:", error);

      // Handle specific error cases
      if (error.message.includes("already registered")) {
        setErrorMessage(
          "This email is already registered. Please use a different email or try to sign in.",
        );
        toast({
          title: "Registration failed",
          description:
            "This email is already registered. Please use a different email or try to sign in.",
          variant: "destructive",
        });
      } else if (error.message.includes("is_active")) {
        setErrorMessage(
          "System error. Please try again later or contact support.",
        );
        toast({
          title: "System error",
          description:
            "We're experiencing technical difficulties. Our team has been notified.",
          variant: "destructive",
        });
      } else {
        setErrorMessage(error.message || "Failed to register");
        toast({
          title: "Registration failed",
          description:
            error.message || "Failed to register. Please try again later.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <MeeraLogo className="h-12" />
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Create an account
            </CardTitle>
            <CardDescription className="text-center">
              Enter your information to create your Meera account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {registrationSuccess ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                  <p className="font-medium">Registration successful!</p>
                  <p className="mt-1">
                    Your account has been created. You will be redirected to the
                    login page shortly.
                  </p>
                </div>
                <div className="flex justify-center">
                  <LoadingSpinner size="md" />
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    autoComplete="name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                  <p className="text-xs text-muted-foreground">
                    Password must be at least 8 characters long, include an
                    uppercase letter and a number
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                </div>

                {errorMessage && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {errorMessage}
                    <div className="mt-2">
                      <Button
                        type="button"
                        onClick={() => setErrorMessage("")}
                        variant="outline"
                        className="text-sm bg-white hover:bg-gray-100"
                      >
                        Try Again
                      </Button>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-meera hover:bg-pink-700 text-white font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? <LoadingSpinner size="sm" /> : null}
                  <span className={isLoading ? "ml-2" : ""}>
                    Create Account
                  </span>
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
