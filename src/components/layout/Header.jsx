import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../utils/api";
import {
    Menu, Bell, Search,
    Settings, User as UserIcon, LogOut, ChevronDown,
    CheckCheck, Info, AlertTriangle, XCircle, CheckCircle,
    Layout, Activity, ShieldCheck, Shield
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Header = ({ role, setMobileMenuOpen }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();
    const notifRef = useRef(null);

    const [isScrolled, setIsScrolled] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch notifications
    const { data: notifications = [] } = useQuery({
        queryKey: ['notifications', user?.token],
        queryFn: () => api.get('/notifications', user.token),
        enabled: !!user?.token,
        refetchInterval: 30000
    });

    const safeNotifications = Array.isArray(notifications) ? notifications : [];
    const unreadCount = safeNotifications.filter(n => !n.isRead).length;

    const markAllMutation = useMutation({
        mutationFn: () => api.put('/notifications/read-all', {}, user.token),
        onSuccess: () => queryClient.invalidateQueries(['notifications'])
    });

    const markOneMutation = useMutation({
        mutationFn: (id) => api.put(`/notifications/${id}/read`, {}, user.token),
        onSuccess: () => queryClient.invalidateQueries(['notifications'])
    });

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClick = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = () => { logout(); navigate("/login"); };

    const displayName = user?.name || (user?.email ? user.email.split('@')[0] : role);
    const formattedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
    const roleName = role.charAt(0).toUpperCase() + role.slice(1);

    const pathnames = location.pathname.split('/').filter(x => x);

    const notifIcon = (type) => {
        switch(type) {
            case 'success': return <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500"><CheckCircle size={16} /></div>;
            case 'warning': return <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500"><AlertTriangle size={16} /></div>;
            case 'error': return <div className="p-2 bg-rose-500/10 rounded-lg text-rose-500"><XCircle size={16} /></div>;
            default: return <div className="p-2 bg-primary/10 rounded-lg text-primary"><Info size={16} /></div>;
        }
    };

    const navLinks = [
        { name: "Dashboard", path: `/${role}` },
        { name: "Policy Management", path: `/${role}/policies` },
        { name: "Claims", path: `/${role}/claims` },
        { name: "Clients", path: `/${role}/users` },
        { name: "Reports", path: `/${role}/transactions` },
    ];

    return (
        <header
            className={`sticky top-0 z-40 transition-all duration-300 bg-[#012b3f] text-white ${isScrolled ? "shadow-xl py-2" : "py-4"}`}
        >
            <div className="max-w-[1600px] mx-auto flex items-center justify-between px-8">
                {/* Left Side: Branding */}
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => setMobileMenuOpen(prev => !prev)}
                        className="p-3 rounded-xl bg-white/10 border border-white/20 shadow-sm xl:hidden"
                    >
                        <Menu size={20} className="text-white" strokeWidth={3} />
                    </button>
                    <div
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => navigate(`/${role}`)}
                    >
                        <div className="w-10 h-10 bg-[#0082a1] rounded-xl flex items-center justify-center text-white shadow-lg">
                            <Shield size={20} strokeWidth={3} />
                        </div>
                        <span className="text-xl font-black uppercase tracking-tighter">
                            SECURE<span className="text-[#0082a1]">SHIELD</span>
                        </span>
                    </div>
                </div>

                {/* Center: Navigation Menu */}
                <nav className="hidden xl:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <button
                            key={link.name}
                            onClick={() => navigate(link.path)}
                            className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                                location.pathname === link.path
                                ? "bg-[#0082a1] text-white shadow-lg shadow-[#0082a1]/20"
                                : "text-slate-400 hover:text-white"
                            }`}
                        >
                            {link.name}
                        </button>
                    ))}
                </nav>

                {/* Right Side: Search & Controls */}
                <div className="flex items-center gap-5">
                    {/* Search */}
                    <div className="hidden lg:flex relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-[11px] font-bold w-48 focus:w-64 focus:bg-white/10 focus:outline-none transition-all placeholder:text-slate-500"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === 'Enter') navigate(`/customer/browse?search=${encodeURIComponent(searchTerm)}`);
                            }}
                        />
                    </div>

                    {/* New Action */}
                    {(role === 'admin' || role === 'agent') && (
                        <button className="hidden sm:flex items-center gap-2 bg-[#0082a1] hover:bg-white hover:text-[#012b3f] text-white px-5 py-2.5 rounded-full text-[11px] font-black transition-all shadow-lg active:scale-95">
                            <ShieldCheck size={14} /> NEW POLICY
                        </button>
                    )}

                    {/* Notifications */}
                    <div className="relative" ref={notifRef}>
                        <button
                            onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
                            className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all relative group border ${showNotifications ? 'bg-header-bg text-white border-header-bg' : 'bg-slate-50 border-slate-200 hover:border-primary'}`}
                        >
                            <Bell size={20} className={showNotifications ? 'text-white' : 'text-slate-400 group-hover:text-primary'} />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] bg-primary text-white text-[9px] font-black rounded-full flex items-center justify-center px-1.5 border-2 border-white shadow-sm">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        <AnimatePresence>
                            {showNotifications && (
                                <motion.div
                                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                    className="absolute right-0 mt-4 w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50 origin-top-right"
                                >
                                    <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                                        <h3 className="text-xs font-black uppercase tracking-widest text-header-bg">Notifications</h3>
                                        {unreadCount > 0 && (
                                            <button
                                                onClick={() => markAllMutation.mutate()}
                                                className="text-[9px] font-black uppercase tracking-widest text-primary hover:underline transition-all"
                                            >
                                                Clear All
                                            </button>
                                        )}
                                    </div>
                                    <div className="max-h-[400px] overflow-y-auto no-scrollbar divide-y divide-slate-100 font-display">
                                        {safeNotifications.length === 0 ? (
                                            <div className="p-12 text-center">
                                                <Info size={32} className="mx-auto mb-4 opacity-10" />
                                                <p className="text-[10px] font-black uppercase tracking-[4px] opacity-20 text-slate-400">No new alerts</p>
                                            </div>
                                        ) : (
                                            safeNotifications.map(n => (
                                                <button
                                                    key={n._id}
                                                    onClick={() => markOneMutation.mutate(n._id)}
                                                    className={`w-full text-left p-6 flex items-start gap-4 hover:bg-slate-50 transition-all ${!n.isRead ? 'bg-primary/5' : ''}`}
                                                >
                                                    {notifIcon(n.type)}
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-xs font-bold uppercase mb-1 ${!n.isRead ? 'text-header-bg' : 'text-slate-500'}`}>{n.title}</p>
                                                        <p className="text-[11px] text-slate-500 leading-relaxed mb-1">{n.message}</p>
                                                        <span className="text-[9px] font-bold text-slate-400 uppercase">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
                            className={`flex items-center gap-3 pl-3 pr-4 py-1.5 rounded-xl transition-all border ${showProfileMenu ? 'bg-slate-50 border-primary' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                        >
                            <div className="hidden lg:block text-right">
                                <p className="text-xs font-bold text-header-bg leading-none mb-1">{formattedName}</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">{roleName}</p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-header-bg flex items-center justify-center text-white font-bold text-base shadow-sm">
                                {formattedName.charAt(0)}
                            </div>
                        </button>

                        <AnimatePresence>
                            {showProfileMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                    className="absolute right-0 mt-4 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50 origin-top-right p-2 font-display"
                                >
                                    <div className="space-y-1">
                                        <button onClick={() => { navigate(`/${role}/profile`); setShowProfileMenu(false); }} className="w-full flex items-center gap-4 px-5 py-4 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-primary rounded-xl transition-all">
                                            <UserIcon size={16} /> Profile Information
                                        </button>
                                        <button onClick={() => { navigate(`/${role}/settings`); setShowProfileMenu(false); }} className="w-full flex items-center gap-4 px-5 py-4 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-primary rounded-xl transition-all">
                                            <Settings size={16} /> System Settings
                                        </button>
                                        <div className="h-px bg-slate-100 my-2 mx-4" />
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-4 px-5 py-4 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                        >
                                            <LogOut size={16} /> Account Logout
                                        </button>
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
