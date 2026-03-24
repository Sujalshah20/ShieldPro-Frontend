import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./utils/QueryClient";
import { AnimatePresence, motion } from "framer-motion";
import Lenis from "lenis";
import { ThemeProvider } from "./context/ThemeContext";
import { NotificationProvider } from "./context/NotificationContext";
import { Toaster } from "./components/lightswind/toaster";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

/* Lazy Loaded Pages */
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const VerifyEmail = lazy(() => import("./pages/auth/VerifyEmail"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const Home = lazy(() => import("./pages/Home"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminPolicies = lazy(() => import("./pages/admin/AdminPolicies"));
const AdminApplications = lazy(() => import("./pages/admin/AdminApplications"));
const AdminClaims = lazy(() => import("./pages/admin/AdminClaims"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminAgents = lazy(() => import("./pages/admin/AdminAgents"));
const AdminCommissions = lazy(() => import("./pages/admin/AdminCommissions"));
const AdminTransactions = lazy(() => import("./pages/admin/AdminTransactions"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const PolicyDetails = lazy(() => import("./pages/admin/PolicyDetails"));
const AgentLayout = lazy(() => import("./pages/agent/AgentLayout"));
const AgentDashboard = lazy(() => import("./pages/agent/AgentDashboard"));
const AgentPolicies = lazy(() => import("./pages/agent/AgentPolicies"));
const AgentClaims = lazy(() => import("./pages/agent/AgentClaims"));
const AgentClients = lazy(() => import("./pages/agent/AgentClients"));
const AgentCommissions = lazy(() => import("./pages/agent/AgentCommissions"));
const AgentApplications = lazy(() => import("./pages/agent/AgentApplications"));
const AgentVerification = lazy(() => import("./pages/agent/AgentVerification"));
const AgentPerformance = lazy(() => import("./pages/agent/AgentPerformance"));
const AgentProfile = lazy(() => import("./pages/agent/AgentProfile"));
const AgentSettings = lazy(() => import("./pages/agent/AgentSettings"));
const CustomerLayout = lazy(() => import("./pages/customer/CustomerLayout"));
const CustomerDashboard = lazy(() => import("./pages/customer/CustomerDashboard"));
const Checkout = lazy(() => import("./pages/customer/CheckoutPage"));
const CustomerProfile = lazy(() => import("./pages/customer/CustomerProfile"));
const CustomerSettings = lazy(() => import("./pages/customer/CustomerSettings"));
const CustomerPolicies = lazy(() => import("./pages/customer/CustomerPolicies"));
const BrowsePolicies = lazy(() => import("./pages/customer/BrowsePolicies"));
const CustomerClaims = lazy(() => import("./pages/customer/CustomerClaims"));
const CheckoutSuccess = lazy(() => import("./pages/customer/CheckoutSuccessPage"));

const ApplicationPage = lazy(() => import("./pages/customer/ApplicationPage"));
const PolicyDetail = lazy(() => import("./pages/customer/PolicyDetail"));
const PaymentHistory = lazy(() => import("./pages/customer/PaymentHistory"));
const MessagesPage = lazy(() => import("./pages/messages/MessagesPage"));

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
  </div>
);

function App() {
  const location = useLocation();

  useEffect(() => {
    let lenis;
    try {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);
    } catch (error) {
      console.error("Lenis initialization skipped:", error);
    }

    return () => {
      if (lenis) lenis.destroy();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <NotificationProvider>
            <Toaster />
            <Suspense fallback={<LoadingSpinner />}>
              <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                  {/* -------- PUBLIC ROUTES -------- */}
                  <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
                  <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
                  <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
                  <Route path="/verify-email" element={<PageWrapper><VerifyEmail /></PageWrapper>} />
                  <Route path="/forgot-password" element={<PageWrapper><ForgotPassword /></PageWrapper>} />
                  <Route path="/reset-password" element={<PageWrapper><ResetPassword /></PageWrapper>} />

                  {/* -------- ADMIN ROUTES -------- */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute role="admin">
                        <PageWrapper><AdminLayout /></PageWrapper>
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<AdminDashboard />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="agents" element={<AdminAgents />} />
                    <Route path="policies" element={<AdminPolicies />} />
                    <Route path="policies/:id" element={<PolicyDetails />} />
                    <Route path="applications" element={<AdminApplications />} />
                    <Route path="commissions" element={<AdminCommissions />} />
                    <Route path="transactions" element={<AdminTransactions />} />
                    <Route path="claims" element={<AdminClaims />} />
                    <Route path="settings" element={<AdminSettings />}>
                      <Route path=":tab" element={<AdminSettings />} />
                    </Route>
                  </Route>

                  {/* -------- AGENT ROUTES -------- */}
                  <Route
                    path="/agent"
                    element={
                      <ProtectedRoute role="agent">
                        <PageWrapper><AgentLayout /></PageWrapper>
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<AgentDashboard />} />
                    <Route path="policies" element={<AgentPolicies />} />
                    <Route path="clients" element={<AgentClients />} />
                    <Route path="applications" element={<AgentApplications />} />
                    <Route path="commissions" element={<AgentCommissions />} />
                    <Route path="claims" element={<AgentClaims />} />
                    <Route path="verification" element={<AgentVerification />} />
                    <Route path="performance" element={<AgentPerformance />} />
                    <Route path="profile" element={<AgentProfile />} />
                    <Route path="settings" element={<AgentSettings />} />
                  </Route>

                  {/* -------- CUSTOMER ROUTES -------- */}
                  <Route
                    path="/customer"
                    element={
                      <ProtectedRoute role="customer">
                        <PageWrapper><CustomerLayout /></PageWrapper>
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<CustomerDashboard />} />
                    <Route path="browse" element={<BrowsePolicies />} />
                    <Route path="policies" element={<CustomerPolicies />} />
                    <Route path="policies/:id" element={<PolicyDetail />} />
                    <Route path="claims" element={<CustomerClaims />} />
                    <Route path="profile" element={<CustomerProfile />} />
                    <Route path="settings" element={<CustomerSettings />} />
                    <Route path="payments" element={<PaymentHistory />} />
                    <Route path="apply" element={<ApplicationPage />} />
                  </Route>

                  <Route path="/customer/checkout" element={<ProtectedRoute role="customer"><PageWrapper><Checkout /></PageWrapper></ProtectedRoute>} />
                  <Route path="/customer/checkout-success" element={<ProtectedRoute role="customer"><PageWrapper><CheckoutSuccess /></PageWrapper></ProtectedRoute>} />

                  {/* -------- MESSAGES ROUTE (shared) -------- */}
                  <Route path="/messages" element={<ProtectedRoute role={null}><PageWrapper><MessagesPage /></PageWrapper></ProtectedRoute>} />

                  {/* -------- DEFAULT -------- */}
                  <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
              </AnimatePresence>
            </Suspense>
          </NotificationProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;