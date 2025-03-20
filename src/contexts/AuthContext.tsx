import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { authApi, UserProfile } from "@/services/auth";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    userData: Partial<UserProfile>,
    tenantData?: any,
    storeData?: any,
  ) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true);
        console.log("Initializing auth state...");

        // Get current auth session
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          console.log("Session found, user is logged in", session.user.id);
          // Get user profile
          try {
            const userProfile = await authApi.getUserProfile(session.user.id);
            console.log("User profile loaded:", userProfile);
            setUser(userProfile);
            setIsAuthenticated(true);

            // Check if user needs to complete onboarding
            if (!userProfile.tenant_id) {
              console.log("User has no tenant_id, redirecting to onboarding");
              navigate("/onboarding");
            }
          } catch (profileErr: any) {
            console.error("Error loading user profile:", profileErr);
            setError(profileErr.message);
            setIsAuthenticated(false);
            navigate("/login");
          }
        } else {
          console.log("No session found, user is not logged in");
          setUser(null);
          setIsAuthenticated(false);
          // If not logged in and trying to access protected routes, redirect to login
          const path = window.location.pathname;
          if (
            path !== "/" &&
            !path.includes("/login") &&
            !path.includes("/register") &&
            !path.includes("/forgot-password") &&
            !path.includes("/reset-password")
          ) {
            console.log("Redirecting to login");
            navigate("/login");
          }
        }
      } catch (err: any) {
        console.error("Error initializing auth:", err);
        setError(err.message);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session);

        if (event === "SIGNED_IN" && session?.user) {
          try {
            const userProfile = await authApi.getUserProfile(session.user.id);
            console.log("User signed in, profile loaded:", userProfile);
            setUser(userProfile);
            setIsAuthenticated(true);

            // Check if user needs to complete onboarding
            if (!userProfile.tenant_id) {
              console.log("User has no tenant_id, redirecting to onboarding");
              navigate("/onboarding");
            } else {
              console.log("User has tenant_id, redirecting to dashboard");
              navigate("/dashboard");
            }
          } catch (err: any) {
            console.error("Error getting user profile:", err);
            setError(err.message);
            setIsAuthenticated(false);
          }
        } else if (event === "SIGNED_OUT") {
          console.log("User signed out");
          setUser(null);
          setIsAuthenticated(false);
          navigate("/login");
        } else if (event === "USER_UPDATED") {
          if (session?.user) {
            try {
              const userProfile = await authApi.getUserProfile(session.user.id);
              console.log("User updated, profile reloaded:", userProfile);
              setUser(userProfile);
            } catch (err: any) {
              console.error("Error getting updated user profile:", err);
            }
          }
        }
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("Signing in user:", email);

      await authApi.signIn(email, password);
      console.log("Sign in successful");
      // Auth state listener will handle the rest
    } catch (err: any) {
      console.error("Error signing in:", err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up function
  const signUp = async (
    email: string,
    password: string,
    userData: Partial<UserProfile>,
    tenantData?: any,
    storeData?: any,
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("Signing up user:", email);

      // If tenant data is provided, create a new tenant and store
      if (tenantData && storeData) {
        console.log("Creating tenant and store");
        await authApi.signUpWithTenant(
          email,
          password,
          userData,
          tenantData,
          storeData,
        );
      } else {
        console.log("Creating user only");
        await authApi.signUp(email, password, userData);
      }
      console.log("Sign up successful");
      // Auth state listener will handle the rest
    } catch (err: any) {
      console.error("Error signing up:", err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      setIsLoading(true);
      console.log("Signing out user");
      await authApi.signOut();
      console.log("Sign out successful");
      // Auth state listener will handle the rest
    } catch (err: any) {
      console.error("Error signing out:", err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Update profile function
  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!user) throw new Error("No user logged in");

      setIsLoading(true);
      console.log("Updating user profile:", updates);
      const updatedProfile = await authApi.updateUserProfile(user.id, updates);
      console.log("Profile updated successfully");
      setUser(updatedProfile);
    } catch (err: any) {
      console.error("Error updating profile:", err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password function
  const resetPassword = async (email: string) => {
    try {
      setIsLoading(true);
      console.log("Resetting password for:", email);
      await authApi.resetPassword(email);
      console.log("Password reset email sent");
    } catch (err: any) {
      console.error("Error resetting password:", err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Update password function
  const updatePassword = async (password: string) => {
    try {
      setIsLoading(true);
      console.log("Updating password");
      await authApi.updatePassword(password);
      console.log("Password updated successfully");
    } catch (err: any) {
      console.error("Error updating password:", err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        signIn,
        signUp,
        signOut,
        updateProfile,
        resetPassword,
        updatePassword,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, useAuth };
