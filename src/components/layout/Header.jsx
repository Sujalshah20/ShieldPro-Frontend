import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
    Shield, Search, Menu, X,
    LogOut, User, Settings, Plus,
    ChevronDown, Layout,
    Activity,
    Terminal,
    Cpu,
    Lock,
    Zap,
    RefreshCcw,
    ChevronRight,
    SearchCheck,
    Satellite,
    Fingerprint
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

    // Helper to get page title based on path
    const getPageTitle = (path) => {
        if (path === '/admin') return 'Dashboard';
        if (path === '/admin/policies') return 'Manage Policies';
        if (path === '/admin/users') return 'Manage Customers';
        if (path === '/admin/agents') return 'Manage Agents';
        if (path === '/admin/claims') return 'All Claims';
        if (path === '/admin/transactions') return 'Transactions';
        if (path === '/admin/settings') return 'Settings';
        return 'Overview';
    };

    return (
        <header className="fixed top-0 right-0 z-[60] left-0 md:left-72 h-20 bg-white/80 backdrop-blur-xl border-b border-slate-50 flex items-center justify-between px-10 shadow-sm">
            {/* Breadcrumbs / Page Title */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setIsOpen(!isSidebarOpen)}
                    className="md:hidden w-10 h-10 flex items-center justify-center bg-slate-50/50 text-black rounded-xl hover:bg-slate-50 transition-all font-black shadow-inner"
                >
                    <Menu size={20} />
                </button>
                {location.pathname !== '/admin' && (
                    <div className="hidden lg:flex flex-col">
                        <h2 className="text-xl font-bold text-black tracking-tight">
                            {getPageTitle(location.pathname)}
                        </h2>
                        <p className="text-[12px] font-bold text-black mt-0.5">
                            {location.pathname === '/admin' ? "View and manage your platform today." : "Manage and track your database records."}
                        </p>
                    </div>
                )}
            </div>

            {/* Global Search */}
            <div className={`flex-1 max-w-md relative mx-8 hidden ${location.pathname === '/customer/browse' ? 'sm:hidden' : 'sm:block'}`}>
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} strokeWidth={2.5} />
                <input
                    type="text"
                    placeholder="Search database records..."
                    className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium text-slate-700 focus:ring-4 focus:ring-blue-100 focus:bg-white focus:border-[#134e8d]/30 transition-all outline-none"
                />
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-6">


                {/* Profile Section */}
                <div className="relative">
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-3 p-1 rounded-xl transition-all group"
                    >
                        {/* User Profile */}
                        <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
                            <div className="text-right hidden sm:block">
                                <p className="text-[13px] font-bold text-slate-800 leading-none">{user?.name || 'User'}</p>
                                <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">{user?.role || 'Guest'}</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-[#134e8d] overflow-hidden border-2 border-white shadow-md flex items-center justify-center text-white font-bold">
                                {user?.profilePic ? (
                                    <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    user?.name?.charAt(0) || 'U'
                                )}
                            </div>
                        </div>
                        <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 hidden sm:block ${isProfileOpen ? 'rotate-180' : ''}`} strokeWidth={2.5} />
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
                                    className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 p-2 z-20"
                                >
                                    <div className="px-4 py-3 border-b border-slate-50 mb-1">
                                        <p className="text-sm font-bold text-slate-800">Account Control</p>
                                    </div>
                                     <Link
                                        to={`/${user?.role || 'customer'}/profile`}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-[#134e8d] transition-all"
                                        onClick={() => setIsProfileOpen(false)}
                                    >
                                        <User size={18} /> My Profile
                                    </Link>
                                    <div className="h-px bg-slate-100 my-2" />
                                    <p className="px-4 py-1 text-[9px] text-slate-400 font-bold uppercase tracking-wider">Session Actions</p>
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
