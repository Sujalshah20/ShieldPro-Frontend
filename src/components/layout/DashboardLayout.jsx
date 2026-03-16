import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import AnimatedBackground from "../common/AnimatedBackground";

const DashboardLayout = ({ role }) => {
    // We are no longer using a persistent sidebar as per the "Same to Same" screenshots,
    // which show navigation primarily in the header and full-width content.
    
    return (
        <AnimatedBackground>
            <div className="flex flex-col min-h-screen">
                {/* Global Tactical Header */}
                <Header role={role} />

                {/* Main Content Area */}
                <main className="flex-1 pt-24 min-h-screen">
                    <div className="w-full max-w-[1700px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <Outlet />
                    </div>
                </main>

                {/* Simple Footer Buffer */}
                <div className="h-20" />
            </div>
        </AnimatedBackground>
    );
};

export default DashboardLayout;
