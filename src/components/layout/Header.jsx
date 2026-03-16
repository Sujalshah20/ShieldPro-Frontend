import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
    Shield, Search, Bell, Menu, X, 
    LogOut, User, Settings, Plus,
    ChevronDown, Layout,
    Activity,
    Lock,
    Zap,
    RefreshCcw,
    ChevronRight,
    UserCircle,
    Mail,
    BellDot
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../hooks/use-toast";

const Header = ({ role, isSidebarOpen, setIsSidebarOpen }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            toast({ 
                title: "Logout Successful", 
                description: "You have been securely logged out of your account.",
            });
            navigate("/login");
        } catch (error) {
            toast({ title: "Logout Error", description: "An error occurred during logout.", variant: "destructive" });
        }
    };

    // Get page title from location
    const getPageTitle = () => {
        const path = location.pathname.split('/').pop();
        if (!path || path === role) return "Dashboard Overview";
        return path.charAt(0).toUpperCase() + path.slice(1).replace('-', ' ');
    };

    return (
        <header className={`fixed top-0 right-0 z-[140] transition-all duration-300 px-6 lg:px-12 flex items-center justify-between h-20 ${
            scrolled ? 'bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm' : 'bg-transparent'
        }`} style={{ 
            left: isSidebarOpen ? '288px' : '0', 
            width: 'auto',
            transition: 'all 0.5s ease-in-out'
        }}>
            {/* Left Section: Breadcrumbs / Title */}
            <div className="flex items-center gap-6">
                <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                    className="md:hidden w-10 h-10 flex items-center justify-center bg-[#002b45] text-white rounded-lg shadow-lg active:scale-95 transition-all"
                >
                    {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>

                <div className="hidden md:flex flex-col">
                    <h1 className="text-xl font-bold text-[#002b45] tracking-tight">{getPageTitle()}</h1>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{role} Portal</span>
                        <div className="w-1 h-1 bg-slate-300 rounded-full" />
                        <span className="text-[10px] font-bold text-[#10b981] uppercase tracking-widest">Active Session</span>
                    </div>
                </div>
            </div>

            {/* Right Section: Actions & Profile */}
            <div className="flex items-center gap-4 lg:gap-8">
                {/* Search Bar */}
                <div className="hidden lg:flex items-center bg-slate-100/50 border border-slate-200 rounded-xl px-4 h-11 w-64 focus-within:bg-white focus-within:border-[#10b981] focus-within:shadow-lg transition-all">
                    <Search className="w-4 h-4 text-slate-400 mr-3" />
                    <input 
                        type="text" 
                        placeholder="Search resources..." 
                        className="bg-transparent border-none text-xs font-semibold text-slate-700 focus:outline-none w-full placeholder:text-slate-400"
                    />
                </div>

                {/* Notifications */}
                <div className="flex items-center gap-2">
                    <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-[#002b45] hover:bg-slate-100 rounded-xl transition-all relative group">
                        <BellDot size={20} strokeWidth={2} />
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#10b981] rounded-full border-2 border-white" />
                    </button>
                    
                    <div className="w-px h-6 bg-slate-200 hidden sm:block mx-1" />

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button 
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-3 p-1.5 pr-4 rounded-xl hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-slate-100 group"
                        >
                            <div className="w-9 h-9 rounded-lg bg-[#002b45] border-2 border-white shadow-md overflow-hidden transition-transform group-hover:scale-105">
                                 <img 
                                    src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=002b45&color=fff`} 
                                    alt="User" 
                                    className="w-full h-full object-cover" 
                                />
                            </div>
                            <div className="hidden lg:flex flex-col items-start leading-none gap-1">
                                <span className="text-xs font-bold text-[#002b45] tracking-tight">{user?.name || 'User Name'}</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user?.role}</span>
                            </div>
                            <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {isProfileOpen && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-[200] overflow-hidden"
                                >
                                    <div className="p-4 border-b border-slate-50 mb-1">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[2px] mb-1">Logged in as</p>
                                        <p className="text-xs font-bold text-[#002b45] truncate">{user?.email}</p>
                                    </div>
                                    
                                    <div className="space-y-1">
                                        <Link 
                                            to={`/${user?.role}/profile`} 
                                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-[#10b981] transition-all group"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            <User size={16} /> User Profile
                                        </Link>
                                        <Link 
                                            to={`/${user?.role}/settings`} 
                                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-[#10b981] transition-all group"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            <Settings size={16} /> Settings
                                        </Link>
                                        
                                        <div className="pt-2 mt-2 border-t border-slate-50">
                                            <button 
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 transition-all border-none"
                                            >
                                                <LogOut size={16} /> Sign Out Account
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
