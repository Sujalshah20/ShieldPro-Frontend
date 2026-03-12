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
const Home = lazy(() => import("./pages/Home"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminPolicies = lazy(() => import("./pages/admin/AdminPolicies"));
const AdminApplications = lazy(() => import("./pages/admin/AdminApplications"));
const AdminClaims = lazy(() => import("./pages/admin/AdminClaims"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminCommissions = lazy(() => import("./pages/admin/AdminCommissions"));
const AdminTransactions = lazy(() => import("./pages/admin/AdminTransactions"));
const PolicyDetails = lazy(() => import("./pages/admin/PolicyDetails"));
const AgentLayout = lazy(() => import("./pages/agent/AgentLayout"));
const AgentDashboard = lazy(() => import("./pages/agent/AgentDashboard"));
const AgentPolicies = lazy(() => import("./pages/agent/AgentPolicies"));
const AgentClaims = lazy(() => import("./pages/agent/AgentClaims"));
const AgentClients = lazy(() => import("./pages/agent/AgentClients"));
const AgentCommissions = lazy(() => import("./pages/agent/AgentCommissions"));
const AgentApplications = lazy(() => import("./pages/agent/AgentApplications"));
const CustomerLayout = lazy(() => import("./pages/customer/CustomerLayout"));
const CustomerDashboard = lazy(() => import("./pages/customer/CustomerDashboard"));
const Checkout = lazy(() => import("./pages/customer/CheckoutPage"));
const CustomerProfile = lazy(() => import("./pages/customer/CustomerProfile"));
const CustomerSettings = lazy(() => import("./pages/customer/CustomerSettings"));
const CustomerPolicies = lazy(() => import("./pages/customer/CustomerPolicies"));
const CustomerClaims = lazy(() => import("./pages/customer/CustomerClaims"));

const ApplicationPage = lazy(() => import("./pages/customer/ApplicationPage"));

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
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
                    <Route path="policies" element={<AdminPolicies />} />
                    <Route path="policies/:id" element={<PolicyDetails />} />
                    <Route path="applications" element={<AdminApplications />} />
                    <Route path="commissions" element={<AdminCommissions />} />
                    <Route path="transactions" element={<AdminTransactions />} />
                    <Route path="claims" element={<AdminClaims />} />
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
                    <Route path="policies" element={<CustomerPolicies />} />
                    <Route path="claims" element={<CustomerClaims />} />
                    <Route path="profile" element={<CustomerProfile />} />
                    <Route path="settings" element={<CustomerSettings />} />
                    <Route path="apply" element={<ApplicationPage />} />
                    <Route path="checkout" element={<Checkout />} />
                  </Route>

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