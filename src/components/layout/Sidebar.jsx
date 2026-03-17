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
    LogOut
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
    agent: [
        { name: "Command Center", path: "/agent", icon: LayoutDashboard, tag: "ALPHA" },
        { name: "Client Grid", path: "/agent/clients", icon: Users, tag: "NODES" },
        { name: "Protocol Queue", path: "/agent/applications", icon: ClipboardList, tag: "DEPLOY" },
        { name: "Active Perimeter", path: "/agent/policies", icon: ShieldCheck, tag: "SYNC" },
        { name: "Earnings Stream", path: "/agent/commissions", icon: DollarSign, tag: "FISCAL" },
        { name: "Incident Logs", path: "/agent/claims", icon: FileText, tag: "TRACE" },
    ],
    customer: {
        main: [
            { name: "Dashboard", path: "/customer", icon: LayoutDashboard },
            { name: "Browse Policies", path: "/customer/browse", icon: Compass },
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

            {/* Sidebar Chassis — Clean Navy Theme */}
            <aside
                className={`fixed top-0 left-0 z-[70] h-[100dvh] w-72 bg-[#124C89] text-white shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
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
                            <span className="text-sm font-bold text-white truncate max-w-[120px]">{user?.name || 'Rahul Sharma'}</span>
                            <span className="text-[10px] font-bold text-white/50 bg-white/10 px-2 py-0.5 rounded-full w-fit mt-1">CUSTOMER</span>
                        </div>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto no-scrollbar px-6 space-y-8">
                    {/* Main Section */}
                    <div className="space-y-2">
                        {role === 'customer' ? (
                            <>
                                {links.main.map((link) => {
                                    const Icon = link.icon;
                                    const isActive = location.pathname === link.path;
                                    return (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${isActive ? "bg-white/10 text-white shadow-lg" : "text-white/60 hover:text-white hover:bg-white/5"}`}
                                        >
                                            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                            <span className="text-[15px] font-semibold">{link.name}</span>
                                        </Link>
                                    );
                                })}
                            </>
                        ) : (
                            links.map((link) => {
                                const Icon = link.icon;
                                const isActive = location.pathname === link.path;
                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${isActive ? "bg-white/10 text-white" : "text-white/60 hover:text-white hover:bg-white/5"}`}
                                    >
                                        <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                        <span className="text-[15px] font-semibold">{link.name}</span>
                                    </Link>
                                );
                            })
                        )}
                    </div>

                    {/* Account Section */}
                    {role === 'customer' && (
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
