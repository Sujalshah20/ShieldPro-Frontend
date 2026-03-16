import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
    Shield, Search, Bell, Menu, X, 
    LogOut, User, Settings, Plus,
    ChevronDown, Globe, Activity
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../hooks/useToast";

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { addToast } = useToast();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            addToast("Session Securely Forminated", "success");
            navigate("/login");
        } catch (error) {
            addToast("Error during termination", "error");
        }
    };

    const navLinks = {
        admin: [
            { name: "Dashboard", path: "/admin" },
            { name: "Policy Management", path: "/admin/policies" },
            { name: "Claims", path: "/admin/claims" },
            { name: "Clients", path: "/admin/users" },
            { name: "Reports", path: "/admin/reports" },
        ],
        agent: [
            { name: "Dashboard", path: "/agent" },
            { name: "Active Clients", path: "/agent/clients" },
            { name: "Pending Claims", path: "/agent/claims" },
            { name: "Revenue Reports", path: "/agent/reports" },
        ],
        customer: [
            { name: "Dashboard", path: "/customer" },
            { name: "Policies", path: "/customer/policies" },
            { name: "Claims", path: "/customer/claims" },
            { name: "Support", path: "/customer/support" },
        ]
    };

    const currentLinks = user ? navLinks[user.role] : [];

    return (
        <header className={`fixed top-0 left-0 w-full z-[150] transition-all duration-300 ${scrolled ? 'bg-white shadow-xl h-20' : 'bg-white h-24 border-b border-slate-100'}`}>
            <div className="max-w-[1600px] mx-auto h-full px-8 flex items-center justify-between">
                {/* Logo Section */}
                <Link to="/" className="flex items-center gap-4 group">
                    <div className="bg-[#0082a1] p-2.5 rounded-xl shadow-lg transition-transform group-hover:rotate-[360deg] duration-1000">
                        <Shield className="w-6 h-6 text-white" strokeWidth={3} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-[#012b3f] uppercase tracking-tighter leading-none">SECURE SHIELD</h2>
                        {user && <span className="text-[10px] font-black text-[#0082a1] uppercase tracking-[3px] opacity-60 italic-none">{user.role.toUpperCase()} PORTAL</span>}
                    </div>
                </Link>

                {/* Desktop Navigation - Matching Screenshot centered links */}
                <nav className="hidden xl:flex items-center gap-10">
                    {currentLinks.map((link) => (
                        <Link 
                            key={link.path} 
                            to={link.path}
                            className={`text-xs font-black uppercase tracking-[2px] transition-all hover:text-[#0082a1] relative py-2 ${location.pathname === link.path ? 'text-[#0082a1]' : 'text-slate-400'}`}
                        >
                            {link.name}
                            {location.pathname === link.path && (
                                <motion.div layoutId="navUnderline" className="absolute bottom-0 left-0 w-full h-0.5 bg-[#0082a1]" />
                            )}
                        </Link>
                    ))}
                </nav>

                {/* Right Side Controls */}
                <div className="flex items-center gap-6">
                    {/* Search Bar - Matching Screenshot */}
                    <div className="hidden lg:flex items-center bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 w-64 group focus-within:ring-2 focus-within:ring-[#0082a1]/20 transition-all">
                        <Search className="w-4 h-4 text-slate-400 mr-3" />
                        <input 
                            type="text" 
                            placeholder="Search records..." 
                            className="bg-transparent border-none text-xs font-bold text-[#012b3f] focus:outline-none w-full placeholder:text-slate-300 placeholder:italic-none"
                        />
                    </div>

                    {/* Action Button - Role Specific */}
                    {user?.role === 'admin' && (
                        <button className="hidden sm:flex items-center gap-2 bg-[#0082a1] text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-[#012b3f] transition-all shadow-lg shadow-[#0082a1]/20">
                            <Plus size={16} strokeWidth={3} /> New Policy
                        </button>
                    )}

                    {/* Notification and Profile */}
                    <div className="flex items-center gap-4">
                        <button className="w-10 h-10 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400 transition-colors relative">
                            <Bell size={20} />
                            <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                        </button>

                        <div className="w-px h-8 bg-slate-100 mx-2" />

                        <div className="relative">
                            <button 
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-3 p-1.5 rounded-full hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
                            >
                                <div className="text-right hidden sm:block px-1">
                                    <p className="text-[10px] font-black text-[#012b3f] leading-none uppercase">{user?.name || "Marcus Chen"}</p>
                                    <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none">{user?.role || "Admin"}</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white overflow-hidden shadow-sm">
                                    <img src={`https://i.pravatar.cc/100?u=${user?._id || 'admin'}`} alt="Avatar" />
                                </div>
                                <ChevronDown size={14} className={`text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 py-4 z-[200]"
                                    >
                                        <div className="px-6 py-4 border-b border-slate-50 mb-2">
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Authenticated As</p>
                                            <p className="text-sm font-black text-[#012b3f] truncate">{user?.email}</p>
                                        </div>
                                        <Link to={`/${user?.role}/settings`} className="flex items-center gap-4 px-6 py-3 hover:bg-slate-50 transition-colors text-slate-600">
                                            <Settings size={18} />
                                            <span className="text-xs font-bold uppercase tracking-widest">Settings</span>
                                        </Link>
                                        <button 
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-4 px-6 py-3 hover:bg-rose-50 transition-colors text-rose-500"
                                        >
                                            <LogOut size={18} />
                                            <span className="text-xs font-bold uppercase tracking-widest">Logout System</span>
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Mobile Menu Trigger */}
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="xl:hidden p-2 text-slate-600">
                        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        className="fixed inset-0 top-24 bg-white z-[140] flex flex-col p-8"
                    >
                         <div className="flex flex-col gap-6">
                            {currentLinks.map((link) => (
                                <Link 
                                    key={link.path} 
                                    to={link.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-2xl font-black text-[#012b3f] uppercase tracking-tighter hover:text-[#0082a1] py-4 border-b border-slate-100"
                                >
                                    {link.name}
                                </Link>
                            ))}
                         </div>
                         <div className="mt-auto pb-20 space-y-6">
                            <button className="w-full bg-[#0082a1] text-white py-6 rounded-2xl font-black text-lg uppercase tracking-widest">
                                New Application
                            </button>
                            <button onClick={handleLogout} className="w-full bg-slate-50 text-rose-500 py-6 rounded-2xl font-black text-lg uppercase tracking-widest flex items-center justify-center gap-4">
                                <LogOut /> Terminate Session
                            </button>
                         </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;
