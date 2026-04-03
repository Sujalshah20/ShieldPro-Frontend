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
        <header className="fixed top-0 right-0 z-[60] left-0 md:left-64 h-20 bg-white/80 backdrop-blur-xl border-b border-slate-50 flex items-center justify-between px-8 shadow-sm">
            {/* Left Side: Breadcrumbs / Page Title */}
            <div className="flex items-center gap-6">
                {/* Mobile Menu Toggle */}
                <button
                    onClick={() => setIsOpen(!isSidebarOpen)}
                    className="md:hidden w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-all shadow-sm"
                >
                    <Menu size={20} />
                </button>

                <div className="hidden lg:flex flex-col">
                    <h2 className="text-xl font-black text-slate-800 tracking-tight leading-none">
                        {getPageTitle(location.pathname)}
                    </h2>
                    <p className="text-[10px] font-black text-slate-400 mt-1.5 uppercase tracking-widest opacity-80">
                        {location.pathname === '/admin' ? "Platform Control Center" : "Database Records Management"}
                    </p>
                </div>
            </div>

            {/* Right Side: Profile Section */}
            <div className="relative">
                <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-3 py-1.5 px-3 rounded-2xl hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-100"
                >
                    <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white bg-slate-50 flex items-center justify-center shadow-sm">
                        {user?.profilePic ? (
                            <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <img 
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`} 
                                alt="Avatar" 
                                className="w-full h-full object-cover" 
                            />
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[14px] font-black text-slate-800 tracking-tight">{user?.name || 'Rahul Sharma'}</span>
                        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} strokeWidth={3} />
                    </div>
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
                                className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 p-2 z-20"
                            >
                                <div className="px-4 py-2.5 border-b border-slate-50 mb-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Account Settings</p>
                                </div>
                                    <Link
                                    to={`/${user?.role || 'customer'}/profile`}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-bold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-all"
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
        </header>
    );
};

export default Header;
