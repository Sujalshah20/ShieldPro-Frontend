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
                title: "SESSION_TERMINATED",
                description: "Inbound synchronization closed. All secure channels disconnected.",
                variant: "default"
            });
            navigate("/login");
        } catch (error) {
            toast({ title: "LOGOUT_ERR_ANOMALY", variant: "destructive" });
        }
    };

    return (
        <header className={`fixed top-0 right-0 z-[140] transition-all duration-700 ease-in-out px-6 md:px-12 flex items-center justify-between h-24  ${scrolled ? 'bg-white/90 backdrop-blur-xl border-b border-slate-100 shadow-sm' : 'bg-transparent'
            }`} style={{
                left: 'var(--sidebar-width, 0)',
                width: 'auto'
            }}>
            {/* Context Left - Mobile Menu Trigger & Breadcrumb */}
            <div className="flex items-center gap-8">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="md:hidden w-12 h-12 flex items-center justify-center bg-[#003249] text-white rounded-xl shadow-xl active:scale-90 transition-all"
                >
                    {isSidebarOpen ? <X size={24} strokeWidth={3} /> : <Menu size={24} strokeWidth={3} />}
                </button>

                <div className="hidden md:flex items-center gap-6">
                    <div className="flex items-center gap-3 px-5 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl shadow-inner">
                        <Terminal size={14} className="text-[#007ea7]" strokeWidth={3} />
                        <span className="text-[10px] font-black text-[#003249] uppercase tracking-[4px] italic">CMD_TERM://</span>
                        <span className="text-[10px] font-bold text-slate-400 tracking-[1px]">{location.pathname.toUpperCase()}</span>
                    </div>
                    <div className="flex items-center gap-3 opacity-20">
                        <div className="w-1 h-1 bg-slate-400 rounded-full" />
                        <span className="text-[8px] font-black tracking-[4px]">UPLINK_STATUS: NOMINAL</span>
                    </div>
                </div>
            </div>

            {/* Controls Right */}
            <div className="flex items-center gap-8">
                {/* Search Console */}
                <div className="hidden lg:flex items-center bg-slate-50/50 border-2 border-slate-50 rounded-[1.2rem] px-6 h-14 w-80 group focus-within:bg-white focus-within:border-[#007ea7]/20 focus-within:shadow-2xl transition-all">
                    <Search className="w-4 h-4 text-slate-400 mr-4 group-focus-within:text-[#007ea7] transition-colors" strokeWidth={3} />
                    <input
                        type="text"
                        placeholder="SCAN_DATA_GRID..."
                        className="bg-transparent border-none text-[11px] font-black text-[#003249] focus:outline-none w-full placeholder:text-slate-300 tracking-[2px] italic uppercase"
                    />
                </div>

                {/* Signals */}
                <div className="flex items-center gap-4">
                    <button className="w-14 h-14 flex items-center justify-center text-slate-400 hover:text-[#003249] hover:bg-slate-50 rounded-2xl transition-all relative group shadow-sm">
                        <Bell size={22} strokeWidth={2.5} className="group-hover:rotate-12 transition-transform" />
                        <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-[#007ea7] rounded-full border-2 border-white shadow-[0_0_10px_#007ea7]" />
                    </button>

                    <div className="w-px h-8 bg-slate-100 hidden sm:block mx-2" />

                    {/* Operative Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-5 p-2 pr-6 rounded-[1.5rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl transition-all group active:scale-95"
                        >
                            <div className="w-11 h-11 rounded-xl bg-[#003249] p-0.5 border border-white shadow-xl overflow-hidden group-hover:rotate-6 transition-transform">
                                <img src={`https://i.pravatar.cc/100?u=${user?._id}`} alt="User" className="w-full h-full object-cover rounded-[0.5rem] grayscale group-hover:grayscale-0 transition-all" />
                            </div>
                            <div className="hidden md:flex flex-col items-start transition-opacity group-hover:opacity-100">
                                <span className="text-[10px] font-black text-[#003249] uppercase tracking-[3px] italic leading-none mb-1.5">{user?.name || 'FIELD_OPERATIVE_X'}</span>
                                <span className="text-[8px] font-black text-[#007ea7] uppercase tracking-[4px] italic leading-none opacity-60 group-hover:opacity-100">{user?.role}</span>
                            </div>
                            <ChevronDown size={16} className={`text-slate-300 transition-transform duration-500 ${isProfileOpen ? 'rotate-180' : ''}`} strokeWidth={3} />
                        </button>

                        <AnimatePresence>
                            {isProfileOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                                    className="absolute right-0 mt-6 w-72 bg-white rounded-[2.5rem] shadow-3xl border-2 border-slate-50 p-6 z-[200] overflow-hidden"
                                >
                                    {/* Decorative Blob */}
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#007ea7]/5 blur-2xl rounded-full" />

                                    <div className="px-6 py-6 border-b-2 border-slate-50 mb-4 relative z-10">
                                        <div className="flex items-center gap-4 mb-4">
                                            <Fingerprint size={20} className="text-[#007ea7]" strokeWidth={3} />
                                            <span className="text-[10px] font-black text-[#007ea7] uppercase tracking-[5px] italic">Auth_Node_Status</span>
                                        </div>
                                        <p className="text-[11px] font-black text-[#003249] truncate tracking-[2px] italic">{user?.email}</p>
                                    </div>

                                    <div className="space-y-2 relative z-10">
                                        <Link
                                            to={`/${user?.role}/settings`}
                                            className="flex items-center justify-between px-6 py-4 rounded-2xl text-[11px] font-black text-[#003249] uppercase tracking-[3px] hover:bg-slate-50 transition-all group/item italic"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            <div className="flex items-center gap-4">
                                                <Settings size={18} className="text-slate-300 group-hover/item:text-[#007ea7] transition-colors" strokeWidth={3} /> Config_Matrix
                                            </div>
                                            <ChevronRight size={14} className="opacity-0 group-hover/item:opacity-100 transition-all group-hover/item:translate-x-1" strokeWidth={4} />
                                        </Link>
                                        <Link
                                            to={`/${user?.role}/profile`}
                                            className="flex items-center justify-between px-6 py-4 rounded-2xl text-[11px] font-black text-[#003249] uppercase tracking-[3px] hover:bg-slate-50 transition-all group/item italic"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            <div className="flex items-center gap-4">
                                                <User size={18} className="text-slate-300 group-hover/item:text-[#007ea7] transition-colors" strokeWidth={3} /> Identity_Vault
                                            </div>
                                            <ChevronRight size={14} className="opacity-0 group-hover/item:opacity-100 transition-all group-hover/item:translate-x-1" strokeWidth={4} />
                                        </Link>

                                        <div className="pt-4 border-t-2 border-slate-50 mt-4">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full h-16 flex items-center justify-center gap-4 bg-rose-50 text-rose-500 rounded-2xl text-[11px] font-black uppercase tracking-[5px] hover:bg-rose-500 hover:text-white transition-all shadow-lg shadow-rose-500/10 italic group"
                                            >
                                                <LogOut size={20} strokeWidth={3} className="group-hover:rotate-12 transition-transform" /> TERMINATE_SYNC
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
