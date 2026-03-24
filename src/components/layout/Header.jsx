import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
    Shield, Search, Bell, Menu, X,
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
        <header className="fixed top-0 right-0 z-[60] left-0 md:left-72 h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 shadow-sm">
            {/* Breadcrumbs / Page Title */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setIsOpen(!isSidebarOpen)}
                    className="md:hidden w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-all"
                >
                    <Menu size={20} />
                </button>
                {location.pathname !== '/admin' && (
                    <div className="hidden lg:flex flex-col">
                        <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                            {getPageTitle(location.pathname)}
                        </h2>
                        <p className="text-[12px] font-medium text-slate-400 mt-0.5">
                            {location.pathname === '/admin' ? "View and manage your platform today." : "Manage and track your database records."}
                        </p>
                    </div>
                )}
            </div>

            {/* Global Search */}
            <div className={`flex-1 max-w-md relative mx-8 hidden ${location.pathname === '/customer/browse' ? 'sm:hidden' : 'sm:block'}`}>
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                    type="text"
                    placeholder="Search for anything..."
                    className="w-full pl-12 pr-4 py-2.5 bg-slate-100/50 border border-slate-200 rounded-xl text-[14px] font-medium text-slate-600 focus:ring-4 focus:ring-blue-500/5 focus:bg-white focus:border-blue-500/20 transition-all outline-none"
                />
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-6">
                {/* Notifications */}
                <button className="relative w-11 h-11 flex items-center justify-center text-slate-500 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all group">
                    <Bell size={20} strokeWidth={2} className="group-hover:scale-110 transition-transform" />
                    <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white" />
                </button>

                <div className="h-8 w-px bg-slate-200 mx-2" />

                {/* Profile Section */}
                <div className="relative">
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-3 p-1 rounded-xl transition-all group"
                    >
                        {/* User Profile */}
                        <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
                            <div className="text-right hidden sm:block">
                                <p className="text-[13px] font-bold text-white leading-none">{user?.name || 'User'}</p>
                                <p className="text-[10px] text-gray-400 font-medium mt-1 uppercase tracking-wider">{user?.role || 'Guest'}</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-[#002b45] overflow-hidden border-2 border-white shadow-sm flex items-center justify-center text-white font-bold">
                                {user?.profilePic ? (
                                    <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    user?.name?.charAt(0) || 'U'
                                )}
                            </div>
                        </div>
                        <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 hidden sm:block ${isProfileOpen ? 'rotate-180' : ''}`} />
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
                                        <p className="text-sm font-bold text-slate-800 uppercase tracking-tight">Account System</p>
                                    </div>
                                     <Link
                                        to={`/${user?.role || 'customer'}/profile`}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-all"
                                        onClick={() => setIsProfileOpen(false)}
                                    >
                                        <User size={18} /> My Profile
                                    </Link>
                                    <div className="h-px bg-slate-100 my-2" />
                                    <p className="px-4 py-1 text-[10px] text-slate-400 font-bold uppercase">Actions in Sidebar</p>
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
