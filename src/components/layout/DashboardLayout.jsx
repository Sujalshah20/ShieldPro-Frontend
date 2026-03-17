import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { motion, AnimatePresence } from "framer-motion";

const DashboardLayout = ({ role }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Sidebar Component */}
            <Sidebar role={role} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div className="flex flex-col min-h-screen relative md:ml-72 transition-all duration-300">
                {/* Unified Premium Header */}
                <Header role={role} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

                {/* Main Dashboard Region */}
                <main className="flex-1 pt-28 pb-12 relative z-10 px-6 md:px-10 w-full max-w-[1600px] mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="h-full"
                    >
                        <Outlet />
                    </motion.div>
                </main>

                {/* Modern Footer */}
                <footer className="py-8 bg-white/50 border-t border-slate-100 relative z-10">
                    <div className="px-10 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-[#124C89] rounded-full" />
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">ShieldPro Secure</p>
                        </div>
                        <div className="flex items-center gap-8">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Version 4.2.0</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">© 2026 ShieldPro Insurance</p>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default DashboardLayout;
