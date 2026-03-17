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
    SearchCheck
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
            { name: "Claims to Process", path: "/agent/claims", icon: ShieldCheck },
            { name: "Document Verification", path: "/agent/verification", icon: SearchCheck },
            { name: "My Commission", path: "/agent/commissions", icon: DollarSign },
            { name: "Performance Report", path: "/agent/performance", icon: TrendingUp },
        ],
        account: [
            { name: "Profile", path: "/agent/profile", icon: User },
            { name: "Logout", path: "/logout", icon: LogOut, action: "logout" },
        ]
    },
    customer: {
        main: [
            { name: "Dashboard", path: "/customer", icon: LayoutDashboard },
            { name: "Browse Policies", path: "/customer/browse", icon: Search }, // Modified: Changed icon from Compass to Search
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
    const { user, logout } = useAuth();
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
                        className="fixed inset-0 bg-[#002b45]/60 z-[60] md:hidden backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Chassis — Clean Navy/Teal Theme */}
            <aside
                className={`fixed top-0 left-0 z-[70] h-[100dvh] w-72 ${
                    role === 'agent' ? 'bg-[#064e3b]' : 'bg-[#124C89]'
                } text-white shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
            >
                {/* Header Section */}
                <div className="p-8 flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                        <Shield className="w-6 h-6 text-white" strokeWidth={2.5} />
                    </div>
                    <span className="text-xl font-bold tracking-tight">Secure Shield</span>
                </div>

                {/* User Profile Section */}
                <div className="px-8 py-4 mb-6">
                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                        <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white/20">
                            <img src={`https://i.pravatar.cc/150?u=${user?._id}`} alt="User" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-white truncate max-w-[120px]">{user?.name || 'Sarah Jenkins'}</span>
                            <div className="flex flex-col gap-0.5 mt-1">
                                <span className="text-[9px] font-black text-white/50 bg-white/10 px-2 py-0.5 rounded-full w-fit uppercase tracking-wider">
                                    {role === 'customer' ? 'Customer' : role === 'agent' ? 'Senior Agent' : 'Admin'}
                                </span>
                                {role === 'agent' && (
                                    <span className="text-[8px] font-bold text-white/30 ml-2">AGT-9921</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto no-scrollbar px-6 pb-24 space-y-8">
                    {/* Main Section */}
                    <div className="space-y-2">
                        {links.main.map((link) => {
                            const Icon = link.icon;
                            const isActive = location.pathname === link.path;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${
                                        isActive 
                                            ? "bg-white/10 text-white shadow-lg" 
                                            : "text-white/60 hover:text-white hover:bg-white/5"
                                    }`}
                                >
                                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                    <span className="text-[15px] font-semibold">{link.name}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Account Section */}
                    {links.account && (
                        <div className="space-y-4">
                             <div className="px-4 text-[11px] font-bold text-white/30 uppercase tracking-widest">Account</div>
                             <div className="space-y-2">
                                {links.account.map((link) => {
                                    const Icon = link.icon;
                                    const isActive = location.pathname === link.path;
                                    return link.action === 'logout' ? (
                                        <button
                                            key={link.path}
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all text-left"
                                        >
                                            <Icon size={20} strokeWidth={2} />
                                            <span className="text-[15px] font-semibold">{link.name}</span>
                                        </button>
                                    ) : (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${isActive ? "bg-white/10 text-white" : "text-white/60 hover:text-white hover:bg-white/5"}`}
                                        >
                                            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                            <span className="text-[15px] font-semibold">{link.name}</span>
                                        </Link>
                                    );
                                })}
                             </div>
                        </div>
                    )}
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;
