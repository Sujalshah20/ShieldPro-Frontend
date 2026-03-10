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
                {/* Sidebar: fixed width desktop nav; remains sticky on scroll */}
                <Sidebar
                    role={role}
                    isOpen={mobileMenuOpen}
                    setIsOpen={setMobileMenuOpen}
                    className="sidebar"
                />

                {/* Main content wrapper */}
                <div className="flex-1 flex flex-col ml-[256px]">
                    {/* top header with comfortable vertical padding */}
                    <header className="py-12 px-16 bg-white shadow-sm flex justify-between items-center">
                        <Header
                            role={role}
                            setMobileMenuOpen={setMobileMenuOpen}
                        />
                    </header>

                    <main className="flex-1 py-16">
                        <div className="customer-dashboard">
                            {/* child routes will render inside dashboard container */}
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>
        </AnimatedBackground>
    );
};

export default DashboardLayout;
