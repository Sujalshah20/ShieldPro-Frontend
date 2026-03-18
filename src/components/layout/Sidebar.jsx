import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import {
    LayoutDashboard,
    ShieldCheck,
    Users,
    FileText,
    Settings,
    HelpCircle,
    CreditCard,
    Activity,
    DollarSign,
    Shield,
    Zap,
    Target,
    Fingerprint,
    Compass,
    Satellite,
    Cpu,
    Lock,
    ClipboardList,
    Briefcase,
    PieChart,
    MessageSquare,
    Layout,
    Headphones,
    Terminal,
    ChevronRight,
    RefreshCcw,
    PlusCircle,
    User,
    Bell,
    LogOut,
    Search,
    TrendingUp,
    SearchCheck,
    LineChart,
    ClipboardCheck
} from "lucide-react";

const ROLE_LINKS = {
    admin: [
        { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
        { name: "Manage Policies", path: "/admin/policies", icon: ShieldCheck },
        { name: "Manage Customers", path: "/admin/users", icon: Users },
        { name: "Manage Agents", path: "/admin/agents", icon: Briefcase },
        { name: "All Claims", path: "/admin/claims", icon: FileText },
        { name: "Transactions", path: "/admin/transactions", icon: DollarSign },
        { name: "Reports & Analytics", path: "/admin/commissions", icon: LineChart },
        { name: "Settings", path: "/admin/settings", icon: Settings },
    ],
    agent: {
        main: [
            { name: "Dashboard", path: "/agent", icon: LayoutDashboard },
            { name: "My Customers", path: "/agent/clients", icon: Users },
            { name: "Policy Applications", path: "/agent/applications", icon: FileText },
            { name: "Claims to Process", path: "/agent/claims", icon: ClipboardList },
            { name: "Settings", path: "/agent/settings", icon: Settings },
        ],
        support: [],
        footer: [
            { name: "Profile", path: "/agent/profile", icon: User },
            { name: "Logout", path: "/logout", icon: LogOut, action: "logout" },
        ]
    },
    customer: {
        main: [
            { name: "Dashboard", path: "/customer", icon: LayoutDashboard },
            { name: "Browse Policies", path: "/customer/browse", icon: Search },
            { name: "My Policies", path: "/customer/policies", icon: ShieldCheck },
            { name: "My Claims", path: "/customer/claims", icon: ClipboardList },
            { name: "Submit New Claim", path: "/customer/claims/new", icon: PlusCircle },
            { name: "Payment History", path: "/customer/payments", icon: CreditCard },
        ],
        account: [
            { name: "My Profile", path: "/customer/profile", icon: User },
            { name: "Notifications", path: "/customer/notifications", icon: Bell },
            { name: "Logout", path: "/logout", icon: LogOut, action: "logout" },
        ]
    }
};

const Sidebar = ({ role, isOpen, setIsOpen }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const links = ROLE_LINKS[role] || ROLE_LINKS.customer;

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <>
            {/* Professional Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/60 z-[60] md:hidden backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Chassis — Premium Navy Theme */}
            <aside
                className={`fixed top-0 left-0 z-[70] h-screen w-72 bg-[#1a2332] text-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
            >
                {/* Header Section */}
                <div className="p-8 pb-10 flex flex-col gap-1">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/10 shadow-lg backdrop-blur-md relative overflow-hidden group">
                           <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <Shield className="w-7 h-7 text-white relative z-10" strokeWidth={2} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold tracking-tight text-white leading-none">Secure Shield</span>
                            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-[2px] mt-1.5 opacity-60 italic">Admin Portal</span>
                        </div>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto no-scrollbar px-6 space-y-2">
                    {/* Main Section */}
                    <div className="space-y-1.5">
                        {(role === 'agent' ? links.main : (role === 'admin' ? links : links.main)).map((link) => {
                            const Icon = link.icon;
                            const isActive = location.pathname === link.path;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all relative group ${
                                        isActive 
                                            ? "bg-white/10 text-white shadow-xl border-l-[3px] border-blue-500" 
                                            : "text-slate-400 hover:text-white hover:bg-white/5"
                                    }`}
                                >
                                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-blue-400" : "group-hover:text-white transition-colors"} />
                                    <span className={`text-[14px] font-semibold tracking-wide ${isActive ? "text-white" : "group-hover:translate-x-1 transition-transform"}`}>{link.name}</span>
                                    {isActive && (
                                        <motion.div 
                                            layoutId="sidebar-active"
                                            className="absolute right-3 w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]" 
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                {/* Persistent Action & Profile Area */}
                <div className="p-6 mt-auto border-t border-white/5 space-y-4 bg-black/10">
                    {/* Settings Option */}
                     <Link
                        to={`/${role}/settings`}
                        className={`flex items-center gap-4 px-5 py-3 rounded-xl transition-all text-slate-400 hover:text-white hover:bg-white/5 group ${location.pathname.includes('settings') ? 'text-white bg-white/5' : ''}`}
                    >
                        <Settings size={20} />
                        <span className="text-[14px] font-semibold">Settings</span>
                    </Link>

                    {/* Logout Option */}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-5 py-3 rounded-xl transition-all text-rose-400/70 hover:text-rose-400 hover:bg-rose-500/10 group font-bold"
                    >
                        <LogOut size={20} className="text-rose-500/60 group-hover:text-rose-500 transition-colors" />
                        <span className="text-[14px]">Logout</span>
                    </button>
                    
                    {/* User Profile Mini Card */}
                    {role === 'admin' && (
                         <div className="pt-4 flex flex-col gap-4">
                            <button className="w-full bg-[#3b82f6]/10 hover:bg-[#3b82f6]/20 text-white/90 py-3 rounded-xl border border-[#3b82f6]/20 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95 group">
                                <HelpCircle size={16} className="text-[#3b82f6] group-hover:rotate-12 transition-transform" /> Support Center
                            </button>
                            <div className="flex items-center gap-3 px-2">
                                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/10 shadow-lg">
                                     <img src="https://i.pravatar.cc/100?u=admin" alt="Admin" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[12px] font-bold text-white tracking-tight">Admin User</span>
                                    <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">Super Admin</span>
                                </div>
                            </div>
                         </div>
                    )}
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
