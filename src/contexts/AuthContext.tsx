import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { authApi, UserProfile } from "@/services/auth";
import { useTenant } from "./TenantContext";
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
  ) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { currentTenant, resolveTenant } = useTenant();

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true);

        // Get current auth session
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          // Get user profile
          const userProfile = await authApi.getUserProfile(session.user.id);
          setUser(userProfile);

          // If tenant context doesn't have a tenant yet, resolve it
          if (!currentTenant && userProfile.tenant_id) {
            await resolveTenant(undefined, undefined); // This will use JWT claims
          }
        } else {
          setUser(null);
          // If not logged in and not on auth pages, redirect to login
          const path = window.location.pathname;
          if (
            !path.includes("/login") &&
            !path.includes("/register") &&
            !path.includes("/onboarding")
          ) {
            navigate("/login");
          }
        }
      } catch (err: any) {
        console.error("Error initializing auth:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          try {
            const userProfile = await authApi.getUserProfile(session.user.id);
            setUser(userProfile);

            // Resolve tenant if needed
            if (!currentTenant && userProfile.tenant_id) {
              await resolveTenant(undefined, undefined);
            }

            navigate("/");
          } catch (err: any) {
            console.error("Error getting user profile:", err);
            setError(err.message);
          }
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          navigate("/login");
        }
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate, currentTenant, resolveTenant]);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      await authApi.signIn(email, password);
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
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      await authApi.signUp(email, password, userData);
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
      await authApi.signOut();
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
      const updatedProfile = await authApi.updateUserProfile(user.id, updates);
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
      await authApi.resetPassword(email);
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
      await authApi.updatePassword(password);
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
