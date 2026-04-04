import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
    Menu, LogOut, User, 
    ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../hooks/use-toast";

const Header = ({ role, isSidebarOpen, setIsOpen }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            toast({
                title: "Logout Successful",
                description: "You have been securely logged out.",
            });
            navigate("/login");
        } catch (error) {
            toast({ title: "Logout Error", variant: "destructive" });
        }
    };

    // Helper to get breadcrumbs based on path
    const getBreadcrumbs = (path) => {
        const parts = path.split('/').filter(Boolean);
        return parts.map(part => part.charAt(0).toUpperCase() + part.slice(1).replace('-', ' '));
    };

    const breadcrumbs = getBreadcrumbs(location.pathname);

    return (
        <header className="fixed top-0 right-0 z-[60] left-0 md:left-64 h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8">
            {/* Left Side: Breadcrumbs */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setIsOpen(!isSidebarOpen)}
                    className="md:hidden w-10 h-10 flex items-center justify-center bg-white text-slate-600 rounded-xl shadow-sm border border-slate-100"
                >
                    <Menu size={20} />
                </button>

                <nav className="hidden sm:flex items-center gap-2 text-[13px] font-medium">
                    <span className="text-slate-400">Dashboard</span>
                    {breadcrumbs.length > 1 && (
                        <>
                            <span className="text-slate-300">/</span>
                            <span className="text-[#1a2744] font-bold">{breadcrumbs[1]}</span>
                        </>
                    )}
                </nav>
            </div>

            {/* Right Side: Profile */}
            <div className="flex items-center gap-6">
                <div className="relative">
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-3 group"
                    >
                        <div className="flex flex-col items-end hidden md:flex">
                            <span className="text-[14px] font-bold text-[#1a2744] leading-tight">{user?.name || 'Vikas Khanna'}</span>
                            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{user?.role === 'agent' ? 'Senior Agent' : user?.role || 'User'}</span>
                        </div>
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md">
                            <img 
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Vikas'}`} 
                                alt="Avatar" 
                                className="w-full h-full object-cover" 
                            />
                        </div>
                        <ChevronDown size={14} className={`text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {isProfileOpen && (
                            <>
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="fixed inset-0 z-10"
                                    onClick={() => setIsProfileOpen(false)}
                                />
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-20"
                                >
                                    <Link
                                        to={`/${role}/profile`}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-bold text-slate-700 hover:bg-slate-50 transition-all"
                                        onClick={() => setIsProfileOpen(false)}
                                    >
                                        <User size={18} /> My Profile
                                    </Link>
                                    <div className="h-px bg-slate-100 my-1.5" />
                                    <button 
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-bold text-rose-500 hover:bg-rose-50 transition-all"
                                    >
                                        <LogOut size={18} /> Logout Session
                                    </button>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
};

export default Header;
