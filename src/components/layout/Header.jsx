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

    return (
        <header className="fixed top-0 right-0 z-[60] left-0 md:left-64 h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8">
            {/* Breadcrumbs / Page Title */}
            <div className="hidden lg:flex flex-col">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span className="hover:text-slate-600 cursor-pointer">Dashboard</span>
                    <ChevronRight size={10} className="text-slate-300" />
                    <span className="text-slate-600 transition-colors">
                        {location.pathname === '/agent' ? 'Overview' : 
                         location.pathname === '/agent/clients' ? 'My Customers' :
                         location.pathname === '/agent/applications' ? 'Policy Applications' :
                         'Current Page'}
                    </span>
                </div>
            </div>

            {/* Global Search */}
            <div className="flex-1 max-w-sm relative ml-8 hidden md:block">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search applications, policies..."
                            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[12px] font-medium text-slate-600 focus:ring-4 focus:ring-slate-100 focus:bg-white transition-all outline-none"
                        />
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-6 ml-8">
                {/* Mobile Menu Toggle */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="md:hidden w-10 h-10 flex items-center justify-center bg-slate-100 text-[#124C89] rounded-xl active:scale-95 transition-all"
                >
                   <Menu size={20} strokeWidth={2.5} />
                </button>

                {/* Notifications */}
                <button className="relative w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-50 rounded-xl transition-all group">
                    <Bell size={20} strokeWidth={2} className="group-hover:rotate-12 transition-transform" />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
                </button>

                <div className="h-8 w-px bg-slate-100 mx-2" />

                {/* Profile Section */}
                <div className="relative">
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-3 p-1 rounded-xl transition-all group"
                    >
                        <div className="text-right hidden sm:block">
                            <p className="text-[13px] font-bold text-slate-800 leading-none">{user?.name || 'Vikas Khanna'}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">{user?.role === 'agent' ? 'Senior Agent' : user?.role?.toUpperCase()}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md shadow-slate-200">
                             <img src={`https://i.pravatar.cc/100?u=${user?._id}`} alt="User" className="w-full h-full object-cover" />
                        </div>
                        <ChevronDown size={14} className={`text-slate-300 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {isProfileOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-[100]"
                            >
                                <Link
                                    to={`/${user?.role}/profile`}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all"
                                    onClick={() => setIsProfileOpen(false)}
                                >
                                    <User size={18} /> My Profile
                                </Link>
                                <Link
                                    to={`/${user?.role}/settings`}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all"
                                    onClick={() => setIsProfileOpen(false)}
                                >
                                    <Settings size={18} /> Settings
                                </Link>
                                <div className="h-px bg-slate-50 my-2" />
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-50 transition-all text-left"
                                >
                                    <LogOut size={18} /> Logout
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
};

export default Header;
