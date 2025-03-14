import React, { Suspense, lazy } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import { TenantProvider } from "./contexts/TenantContext";
import { AuthProvider } from "./contexts/AuthContext";

// Lazy load components for better performance
const Dashboard = lazy(() => import("./components/dashboard/Dashboard"));
const POSLayout = lazy(() => import("./components/pos/POSLayout"));
const InventoryDashboard = lazy(
  () => import("./components/inventory/InventoryDashboard"),
);
const ItemGroups = lazy(() => import("./components/inventory/ItemGroups"));
const InventoryAdjustment = lazy(
  () => import("./components/inventory/InventoryAdjustment"),
);
const SettingsPage = lazy(() => import("./components/settings/SettingsPage"));
const BillingPage = lazy(() => import("./components/billing/BillingPage"));
const SalesPage = lazy(() => import("./components/sales/SalesPage"));
const OrderForm = lazy(() => import("./components/sales/OrderForm"));
const ReportsPage = lazy(() => import("./components/reports/ReportsPage"));
const StaffPage = lazy(() => import("./components/staff/StaffPage"));
const OnboardingPage = lazy(
  () => import("./components/onboarding/OnboardingPage"),
);
const LoginPage = lazy(() => import("./components/auth/LoginPage"));
const RegisterPage = lazy(() => import("./components/auth/RegisterPage"));
const ForgotPasswordPage = lazy(
  () => import("./components/auth/ForgotPasswordPage"),
);
const ResetPasswordPage = lazy(
  () => import("./components/auth/ResetPasswordPage"),
);

import routes from "tempo-routes";

// Loading spinner component
const LoadingSpinner = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-pink-50 gap-4">
    <svg
      className="animate-spin h-10 w-10 text-primary"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
    <p className="text-xl font-bold text-primary">
      Loading Meera POS System...
    </p>
  </div>
);

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // This would normally check auth state, but we'll implement that later
  return <>{children}</>;
};

function App() {
  return (
    <TenantProvider>
      <AuthProvider>
        <Suspense fallback={<LoadingSpinner />}>
          <div className="min-h-screen bg-background">
            {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
            <Routes>
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
                  <Suspense fallback={<LoadingSpinner />}>
                    <OnboardingPage />
                  </Suspense>
                }
              />

              {/* Protected routes */}
              <Route
                path="/"
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
      </AuthProvider>
    </TenantProvider>
  );
}

export default App;
