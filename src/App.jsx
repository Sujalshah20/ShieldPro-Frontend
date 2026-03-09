import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./utils/QueryClient";
import { AnimatePresence, motion } from "framer-motion";
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
const AgentLayout = lazy(() => import("./pages/agent/AgentLayout"));
const AgentDashboard = lazy(() => import("./pages/agent/AgentDashboard"));
const CustomerLayout = lazy(() => import("./pages/customer/CustomerLayout"));
const CustomerDashboard = lazy(() => import("./pages/customer/CustomerDashboard"));
const Checkout = lazy(() => import("./pages/customer/CheckoutPage"));

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