import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import AnimatedBackground from "../common/AnimatedBackground";

const DashboardLayout = ({ role }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <AnimatedBackground>
            <div className="flex min-h-screen bg-background/50 backdrop-blur-sm">
                {/* Sidebar */}
                <Sidebar
                    role={role}
                    isOpen={mobileMenuOpen}
                    setIsOpen={setMobileMenuOpen}
                />

                {/* Main content wrapper */}
                <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                    {/* Header */}
                    <Header
                        role={role}
                        setMobileMenuOpen={setMobileMenuOpen}
                    />

                    {/* Content Area */}
                    <main className="flex-1 overflow-y-auto overflow-x-hidden">
                        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="max-w-7xl mx-auto">
                                <Outlet />
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        </AnimatedBackground>
    );
};

export default DashboardLayout;
