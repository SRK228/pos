import React, { Suspense } from "react";
import { Routes, Route, Navigate, useRoutes } from "react-router-dom";
import { TenantProvider } from "./contexts/TenantContext";
import { AuthProvider } from "./contexts/AuthContext";
import { LoadingSpinner } from "./components/ui/loading-spinner";
import { Toaster } from "./components/ui/toaster";

// Import pages
import LandingPage from "./components/landing/LandingPage";
import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";
import ForgotPasswordPage from "./components/auth/ForgotPasswordPage";
import ResetPasswordPage from "./components/auth/ResetPasswordPage";
import OnboardingPage from "./components/onboarding/OnboardingPage";
import Dashboard from "./components/dashboard/Dashboard";
import POSLayout from "./components/pos/POSLayout";
import InventoryDashboard from "./components/inventory/InventoryDashboard";
import ItemGroups from "./components/inventory/ItemGroups";
import InventoryAdjustment from "./components/inventory/InventoryAdjustment";
import BillingPage from "./components/billing/BillingPage";
import SalesPage from "./components/sales/SalesPage";
import OrderForm from "./components/sales/OrderForm";
import ReportsPage from "./components/reports/ReportsPage";
import StaffPage from "./components/staff/StaffPage";
import SettingsPage from "./components/settings/SettingsPage";
import { MainLayout } from "./components/layout/MainLayout";

// Import routes for Tempo
import routes from "tempo-routes";

// Import hooks
import { useAuth } from "./contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
};

function App() {
  return (
    <AuthProvider>
      <TenantProvider>
        <Suspense fallback={<LoadingSpinner />}>
          <div className="min-h-screen bg-background">
            <Toaster />
            {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
            <Routes>
              {/* Landing Page */}
              <Route
                path="/"
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <LandingPage />
                  </Suspense>
                }
              />

              {/* Auth routes */}
              <Route
                path="/login"
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <LoginPage />
                  </Suspense>
                }
              />
              <Route
                path="/register"
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <RegisterPage />
                  </Suspense>
                }
              />
              <Route
                path="/forgot-password"
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <ForgotPasswordPage />
                  </Suspense>
                }
              />
              <Route
                path="/reset-password"
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <ResetPasswordPage />
                  </Suspense>
                }
              />
              <Route
                path="/onboarding"
                element={
                  <ProtectedRoute>
                    <OnboardingPage />
                  </ProtectedRoute>
                }
              />

              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Dashboard />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pos"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <POSLayout />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/inventory"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <InventoryDashboard />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/inventory/item-groups"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <ItemGroups />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/inventory/adjustments"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <InventoryAdjustment />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/billing"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <BillingPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sales"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <SalesPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sales/new-order"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Suspense
                        fallback={
                          <div className="p-8 flex flex-col items-center justify-center space-y-4">
                            <div className="animate-spin h-10 w-10 text-primary rounded-full border-4 border-solid border-current border-r-transparent"></div>
                            <p>Loading order form...</p>
                          </div>
                        }
                      >
                        <OrderForm
                          onCancel={() => (window.location.href = "/sales")}
                        />
                      </Suspense>
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <ReportsPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/staff"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <StaffPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <SettingsPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              {/* Tempo routes */}
              {import.meta.env.VITE_TEMPO === "true" && (
                <Route path="/tempobook/*" />
              )}

              {/* Catch-all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Suspense>
      </TenantProvider>
    </AuthProvider>
  );
}

export default App;
