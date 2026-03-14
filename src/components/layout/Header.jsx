import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../utils/api";
import {
    Menu, Bell, Search,
    Settings, User as UserIcon, LogOut, ChevronDown,
    CheckCheck, Info, AlertTriangle, XCircle, CheckCircle,
    Layout, Activity, ShieldCheck
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

    return (
        <header
            className={`sticky top-0 z-40 transition-all duration-500 ${isScrolled
                    ? "bg-white/80 backdrop-blur-2xl border-b border-border shadow-2xl"
                    : "bg-transparent border-b border-transparent"
                }`}
        >
            <div className="flex items-center justify-between px-8 py-5">
                {/* Left Side: Navigation Context */}
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => setMobileMenuOpen(prev => !prev)}
                        className="p-3 rounded-2xl bg-white border border-border shadow-sm hover:scale-110 active:scale-95 transition-all md:hidden"
                    >
                        <Menu size={20} className="text-primary" strokeWidth={3} />
                    </button>

                    <div className="hidden sm:flex items-center gap-4">
                        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate(`/${role}`)}>
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                <Layout size={18} strokeWidth={3} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-[3px] opacity-30 italic leading-none">{roleName} PORTAL</span>
                                <span className="text-sm font-black italic uppercase tracking-tighter">SHIELD PRO</span>
                            </div>
                        </div>
                        <div className="h-6 w-px bg-border/50 mx-2" />
                        <div className="flex items-center gap-2">
                             <span className="text-[9px] font-black uppercase tracking-[3px] opacity-20 italic">Location:</span>
                             <span className="text-[11px] font-black uppercase tracking-[2px] text-primary italic">
                                {pathnames.length > 1 ? pathnames[pathnames.length - 1] : 'Dashboard'}
                             </span>
                        </div>
                    </div>
                </div>

                {/* Center: Global Search */}
                <div className="hidden md:flex flex-1 max-w-lg mx-12">
                    <div className="relative w-full group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-primary transition-colors" strokeWidth={3} />
                        <input
                            type="text"
                            value={searchTerm}
                            placeholder="SEARCH_POLICIES_OR_CLIENTS..."
                            className="w-full bg-zinc-50 border border-border/50 rounded-2xl pl-16 pr-6 py-4 text-xs font-black uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
                            onChange={e => setSearchTerm(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === 'Enter') navigate(`/customer/browse?search=${encodeURIComponent(searchTerm)}`);
                            }}
                        />
                    </div>
                </div>

                {/* Right Side: Controls */}
                <div className="flex items-center gap-4">
                    {/* Notifications */}
                    <div className="relative" ref={notifRef}>
                        <button
                            onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
                            className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all relative group border ${showNotifications ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-zinc-50 border-border/50 hover:bg-zinc-100'}`}
                        >
                            <Bell size={20} className={showNotifications ? 'text-white' : 'text-zinc-400 group-hover:text-primary'} strokeWidth={3} />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] bg-accent text-white text-[9px] font-black rounded-full flex items-center justify-center px-1.5 border-2 border-white shadow-sm animate-bounce">
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
                                    className="absolute right-0 mt-4 w-96 bg-white border border-border rounded-[2.5rem] shadow-2xl overflow-hidden z-50 origin-top-right backdrop-blur-3xl"
                                >
                                    <div className="p-8 border-b border-border/50 flex items-center justify-between bg-zinc-50/50">
                                        <div>
                                            <h3 className="text-sm font-black italic uppercase tracking-widest">System Notifications</h3>
                                            <p className="text-[10px] opacity-30 font-black uppercase tracking-[2px] mt-1">Updates on policies and claims</p>
                                        </div>
                                        {unreadCount > 0 && (
                                            <button
                                                onClick={() => markAllMutation.mutate()}
                                                className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center gap-2 border border-primary/20"
                                            >
                                                <CheckCheck size={12} strokeWidth={3} /> CLEAR ALL
                                            </button>
                                        )}
                                    </div>
                                    <div className="max-h-[450px] overflow-y-auto no-scrollbar divide-y divide-border/30">
                                        {safeNotifications.length === 0 ? (
                                            <div className="p-16 text-center">
                                                <Activity size={40} className="mx-auto mb-4 opacity-10 text-primary" strokeWidth={3} />
                                                <p className="text-[10px] font-black uppercase tracking-[4px] opacity-20">No new notifications</p>
                                            </div>
                                        ) : (
                                            safeNotifications.map(n => (
                                                <button
                                                    key={n._id}
                                                    onClick={() => markOneMutation.mutate(n._id)}
                                                    className={`w-full text-left p-6 flex items-start gap-4 hover:bg-zinc-50 transition-all group ${!n.isRead ? 'bg-primary/[0.03]' : ''}`}
                                                >
                                                    {notifIcon(n.type)}
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-xs font-black uppercase tracking-tighter mb-1 ${!n.isRead ? 'text-primary' : 'text-zinc-500'}`}>{n.title}</p>
                                                        <p className="text-[11px] opacity-60 font-medium leading-relaxed mb-3">{n.message}</p>
                                                        <div className="flex items-center gap-3 opacity-30">
                                                            <Activity size={10} />
                                                            <span className="text-[9px] font-black uppercase tracking-[2px]">{new Date(n.createdAt).toLocaleTimeString()}</span>
                                                        </div>
                                                    </div>
                                                    {!n.isRead && <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0 mt-4 shadow-[0_0_10px_rgba(255,90,0,0.5)]" />}
                                                </button>
                                            ))
                                        )}
                                    </div>
                                    {safeNotifications.length > 0 && (
                                        <div className="p-4 bg-zinc-50 text-center">
                                            <button className="text-[9px] font-black uppercase tracking-[3px] opacity-30 hover:opacity-100 transition-opacity">View All Notifications</button>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
                            className={`flex items-center gap-4 p-2 pr-5 rounded-2xl transition-all border ${showProfileMenu ? 'bg-zinc-900 border-primary shadow-lg' : 'bg-white border-border hover:border-primary/50 shadow-sm'}`}
                        >
                            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-black text-lg italic shadow-lg shadow-primary/20">
                                {formattedName.charAt(0)}
                            </div>
                            <div className="hidden lg:block text-left">
                                <div className={`text-xs font-black uppercase tracking-tighter leading-none mb-1 ${showProfileMenu ? 'text-white' : 'text-foreground'}`}>{formattedName}</div>
                                <div className={`text-[9px] font-black uppercase tracking-[3px] italic leading-none opacity-40 ${showProfileMenu ? 'text-primary' : 'text-foreground'}`}>{roleName}</div>
                            </div>
                            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showProfileMenu ? 'rotate-180 text-primary' : 'text-zinc-400'}`} strokeWidth={3} />
                        </button>

                        <AnimatePresence>
                            {showProfileMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                    className="absolute right-0 mt-4 w-72 bg-white border border-border rounded-[2.5rem] shadow-2xl overflow-hidden z-50 origin-top-right p-3"
                                >
                                    <div className="p-4 mb-2 bg-zinc-50 rounded-[1.5rem] border border-border/50 text-center">
                                        <div className="w-16 h-16 bg-primary rounded-2xl mx-auto mb-4 flex items-center justify-center text-white text-2xl font-black italic shadow-xl shadow-primary/20">
                                            {formattedName.charAt(0)}
                                        </div>
                                        <p className="text-sm font-black uppercase tracking-tighter mb-1">{formattedName}</p>
                                        <p className="text-[9px] font-black uppercase tracking-[4px] text-primary italic">{roleName} Account</p>
                                    </div>

                                    <div className="space-y-1">
                                        <button onClick={() => { navigate(`/${role}/profile`); setShowProfileMenu(false); }} className="w-full flex items-center justify-between px-6 py-4 text-[10px] font-black uppercase tracking-[3px] rounded-2xl hover:bg-primary hover:text-white transition-all group">
                                            <div className="flex items-center gap-4">
                                                <UserIcon size={16} className="text-primary group-hover:text-white transition-colors" /> MY_PROFILE
                                            </div>
                                            <Activity size={12} className="opacity-20" />
                                        </button>
                                        <button onClick={() => { navigate(`/${role}/settings`); setShowProfileMenu(false); }} className="w-full flex items-center justify-between px-6 py-4 text-[10px] font-black uppercase tracking-[3px] rounded-2xl hover:bg-primary hover:text-white transition-all group">
                                            <div className="flex items-center gap-4">
                                                <Settings size={16} className="text-primary group-hover:text-white transition-colors" /> SETTINGS
                                            </div>
                                            <Activity size={12} className="opacity-20" />
                                        </button>
                                        <div className="h-px bg-border/50 my-2 mx-6" />
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center justify-between px-6 py-5 text-[10px] font-black uppercase tracking-[4px] rounded-2xl bg-rose-500/5 hover:bg-rose-500 text-rose-500 hover:text-white transition-all group shadow-sm"
                                        >
                                            <div className="flex items-center gap-4">
                                                <LogOut size={16} strokeWidth={3} /> LOGOUT
                                            </div>
                                            <ShieldCheck size={16} strokeWidth={3} className="opacity-20" />
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
