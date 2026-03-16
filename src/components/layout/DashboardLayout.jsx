import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { motion, AnimatePresence } from "framer-motion";

const DashboardLayout = ({ role }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-white overflow-hidden">
            {/* Sidebar Component */}
            <Sidebar role={role} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div className="flex-1 flex flex-col min-h-screen relative">
                {/* Visual Grid for Main Content */}
                <div className="absolute inset-0 opacity-[0.015] pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(#003249 1.5px, transparent 1.5px)', backgroundSize: '40px 40px' }} />

                {/* Unified SaaS Header */}
                <Header role={role} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

                {/* Main Dashboard Region */}
                <main className="flex-1 pt-32 pb-16 relative z-10 px-6 md:px-12 w-full max-w-[1600px] mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="h-full"
                    >
                        <Outlet />
                    </motion.div>
                </main>

                {/* Status Footer */}
                <footer className="py-10 border-t border-slate-50 relative z-10">
                    <div className="px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            <p className="text-[9px] font-black uppercase tracking-[5px] text-[#003249]/30 italic line-none">ShieldPro_Quantum_Secure_Active</p>
                        </div>
                        <div className="flex items-center gap-10">
                            <p className="text-[9px] font-black uppercase tracking-[4px] text-slate-300 italic">Core_Version: 4.2.0_SIGMA</p>
                            <p className="text-[9px] font-black uppercase tracking-[4px] text-slate-400 italic">© 2026 GLOBAL_INFRASTRUCTURE</p>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default DashboardLayout;
