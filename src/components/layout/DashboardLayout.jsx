import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import AnimatedBackground from "../common/AnimatedBackground";

const DashboardLayout = ({ role }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <AnimatedBackground>
            <div className="flex min-h-screen">
                {/* Sidebar */}
                <Sidebar
                    role={role}
                    isOpen={mobileMenuOpen}
                    setIsOpen={setMobileMenuOpen}
                />

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col md:ml-64 w-full min-w-0 transition-all duration-300">
                    <Header
                        role={role}
                        setMobileMenuOpen={setMobileMenuOpen}
                    />

                    {/* Outlet for child routes */}
                    <main className="flex-1 p-6 md:p-8 w-full mx-auto overflow-x-hidden">
                        <Outlet />
                    </main>
                </div>
            </div>
        </AnimatedBackground>
    );
};

export default DashboardLayout;
