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
        { name: "Node Overview", path: "/admin", icon: LayoutDashboard, tag: "DASHBOARD" },
        { name: "Operative Directory", path: "/admin/users", icon: Users, tag: "REGISTRY" },
        { name: "Protocol Matrix", path: "/admin/policies", icon: ShieldCheck, tag: "VAULT" },
        { name: "Artifact Submissions", path: "/admin/applications", icon: ClipboardList, tag: "QUEUE" },
        { name: "Fiscal Commissions", path: "/admin/commissions", icon: Briefcase, tag: "LEDGER" },
        { name: "Transaction Manifest", path: "/admin/transactions", icon: CreditCard, tag: "RECORDS" },
        { name: "Incident Handling", path: "/admin/claims", icon: FileText, tag: "RESOLVE" },
        { name: "System Config", path: "/admin/settings", icon: Settings, tag: "CORE" },
    ],
    agent: {
        main: [
            { name: "Dashboard", path: "/agent", icon: LayoutDashboard },
            { name: "My Customers", path: "/agent/clients", icon: Users },
            { name: "Policy Applications", path: "/agent/applications", icon: FileText },
            { name: "Claims to Process", path: "/agent/claims", icon: ClipboardList },
            { name: "Document Verification", path: "/agent/verification", icon: ShieldCheck },
            { name: "My Commission", path: "/agent/commissions", icon: DollarSign },
            { name: "Performance Report", path: "/agent/performance", icon: LineChart },
        ],
        support: [
            { name: "Settings", path: "/agent/profile", icon: Settings },
            { name: "Help Center", path: "/help", icon: HelpCircle },
        ],
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
                className={`fixed top-0 left-0 z-[70] h-screen w-64 ${
                    role === 'agent' ? 'bg-[#1a2b4b]' : 'bg-[#124C89]'
                } text-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
            >
                {/* Header Section */}
                <div className="p-6 pb-8 flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#0ea5e9] rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/20">
                            <Shield className="w-6 h-6 text-white" strokeWidth={2.5} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold tracking-tight text-white leading-none">Secure Shield</span>
                            {role === 'agent' && (
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">AGENT PORTAL</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto no-scrollbar px-3 space-y-8">
                    {/* Main Section */}
                    <div className="space-y-1">
                        {(role === 'agent' ? links.main : (role === 'admin' ? links : links.main)).map((link) => {
                            const Icon = link.icon;
                            const isActive = location.pathname === link.path;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                                        isActive 
                                            ? "bg-[#14b8a6] text-white shadow-lg shadow-teal-500/10" 
                                            : "text-slate-400 hover:text-white hover:bg-white/5"
                                    }`}
                                >
                                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                    <span className="text-[13px] font-bold">{link.name}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Support Section for Agent */}
                    {role === 'agent' && (
                        <div className="space-y-4 pt-4">
                            <span className="px-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Support & Account</span>
                            <div className="space-y-1">
                                {links.support.map((link) => {
                                    const Icon = link.icon;
                                    const isActive = location.pathname === link.path;
                                    return (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                                                isActive 
                                                    ? "bg-[#14b8a6] text-white shadow-lg" 
                                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                                            }`}
                                        >
                                            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                            <span className="text-[13px] font-bold">{link.name}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </nav>

                {/* Persistent Action & Profile Area */}
                <div className="p-4 mt-auto border-t border-white/5 space-y-4">
                    {role === 'agent' && (
                        <button 
                            onClick={() => navigate('/agent/clients')} 
                            className="w-full flex items-center justify-center gap-3 bg-[#ffffff15] hover:bg-[#ffffff25] text-white px-4 py-3.5 rounded-xl transition-all border border-white/5 group"
                        >
                            <PlusCircle size={18} className="group-hover:rotate-90 transition-transform" />
                            <span className="text-[13px] font-bold tracking-tight">New Customer</span>
                        </button>
                    )}

                    {/* Agent Profile Summary */}
                    {role === 'agent' && (
                        <div className="flex items-center gap-3 px-2 py-2">
                            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden border border-white/10">
                                <User size={20} className="text-slate-400" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[13px] font-bold text-white line-clamp-1">Marcus Thorne</span>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Senior Agent</span>
                            </div>
                        </div>
                    )}

                    {/* Logout Option */}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-slate-400 hover:text-rose-400 hover:bg-rose-500/5 group"
                    >
                        <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[13px] font-bold">Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
