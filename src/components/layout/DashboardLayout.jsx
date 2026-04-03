import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { motion } from "framer-motion";

const DashboardLayout = ({ role }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const isAdmin = role === 'admin';

    return (
        <div className="min-h-screen bg-white font-sans overflow-x-hidden">
            {/* Sidebar Component */}
            <Sidebar role={role} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div className="flex flex-col min-h-screen relative md:ml-64 transition-all duration-300">
                {/* Global Header */}
                {role !== 'admin' && <Header role={role} isSidebarOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />}

                {/* Main Dashboard Region */}
                <main className={`flex-1 ${isAdmin ? 'pt-8' : 'pt-20'} pb-0 relative z-10 w-full max-w-[1400px] mx-auto`}>
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                        className="h-full px-4 md:px-8"
                    >
                        <Outlet />
                    </motion.div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
