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
    DollarSign,
    Shield,
    LogOut,
    PlusCircle,
    User,
    Bell,
    Search,
    LineChart,
    Briefcase,
    ClipboardList,
    ChevronRight,
    Mail,
    Database
} from "lucide-react";

const ROLE_LINKS = {
    admin: [
        { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
        { name: "Manage Policies", path: "/admin/policies", icon: ShieldCheck },
        { name: "Manage Customers", path: "/admin/users", icon: Users },
        { name: "Manage Agents", path: "/admin/agents", icon: Briefcase },
        { name: "All Claims", path: "/admin/claims", icon: FileText },
        { name: "Financial Ledger", path: "/admin/transactions", icon: DollarSign },
        { name: "Reports & Analytics", path: "/admin/commissions", icon: LineChart },
    ],
    settings: [
        { name: "General", path: "/admin/settings/general", icon: Settings },
        { name: "Email Templates", path: "/admin/settings/email", icon: Mail },
        { name: "Payment Gateway", path: "/admin/settings/payment", icon: CreditCard },
        { name: "Roles & Permissions", path: "/admin/settings/roles", icon: Shield },
        { name: "Backup", path: "/admin/settings/backup", icon: Database },
    ],
    agent: {
        main: [
            { name: "Dashboard", path: "/agent", icon: LayoutDashboard },
            { name: "My Customers", path: "/agent/clients", icon: Users },
            { name: "Policy Applications", path: "/agent/applications", icon: FileText },
            { name: "Claims to Process", path: "/agent/claims", icon: ClipboardList },
            { name: "Settings", path: "/agent/settings", icon: Settings },
        ],
        footer: [
            { name: "Profile", path: "/agent/profile", icon: User },
            { name: "Logout", path: "/logout", icon: LogOut },
        ]
    },
    customer: {
        main: [
            { name: "Dashboard", path: "/customer", icon: LayoutDashboard },
            { name: "Browse Policies", path: "/customer/browse", icon: Search },
            { name: "My Policies", path: "/customer/policies", icon: ShieldCheck },
            { name: "My Claims", path: "/customer/claims", icon: ClipboardList },
            { name: "Submit New Claim", path: "/customer/claims", state: { openNewClaim: true }, icon: PlusCircle },
            { name: "Payment History", path: "/customer/payments", icon: CreditCard },
        ],
        account: [
            { name: "My Profile", path: "/customer/profile", icon: User },
            { name: "Notifications", path: "/customer/notifications", icon: Bell },
            { name: "Logout", path: "/logout", icon: LogOut },
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

    const isSettings = location.pathname.includes('/admin/settings');
    const settingsLinks = ROLE_LINKS.settings;
    const adminLinks = ROLE_LINKS.admin;
    
    // Determine which links to show
    const getLinks = () => {
        if (role === 'admin' && isSettings) return settingsLinks;
        if (role === 'agent') return links.main;
        if (role === 'admin') return links;
        return links.main;
    };

    const currentLinks = getLinks();

    return (
        <>
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

            <aside
                className={`fixed top-0 left-0 z-[70] h-screen w-64 bg-white text-[#002b45] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 border-r border-slate-100`}
            >
                <div className="p-8 pb-6 flex flex-col gap-1">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#134e8d] rounded-xl flex items-center justify-center border border-[#134e8d]/10 shadow-lg relative overflow-hidden group">
                           <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <Shield className="w-7 h-7 text-white relative z-10" strokeWidth={2.5} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold tracking-tight text-[#134e8d] leading-none">Secure Shield</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[2px] mt-1.5">Management</span>
                        </div>
                    </div>
                </div>

                {isSettings && (
                    <div className="px-6 pb-4">
                        <Link 
                            to="/admin"
                            className="flex items-center gap-3 px-5 py-3 rounded-xl bg-slate-50 text-slate-500 hover:text-[#134e8d] transition-all text-xs font-bold uppercase tracking-wider border border-slate-100 hover:border-[#134e8d]/20 shadow-sm group"
                        >
                            <ChevronRight size={14} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                            Back to Home
                        </Link>
                    </div>
                )}

                <nav className="flex-1 overflow-y-auto no-scrollbar px-6 space-y-2 py-4">
                    <div className="space-y-1">
                        {currentLinks.map((link) => {
                            const Icon = link.icon;
                            const isActive = location.pathname === link.path;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    state={link.state}
                                    className={`flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all relative group ${
                                        isActive 
                                            ? "bg-blue-50 text-[#134e8d] shadow-sm border border-blue-100" 
                                            : "text-slate-500 hover:text-[#134e8d] hover:bg-slate-50"
                                    }`}
                                >
                                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-[#134e8d]" : "group-hover:text-[#134e8d] transition-colors"} />
                                    <span className={`text-[13px] font-bold tracking-tight ${isActive ? "text-[#134e8d]" : "group-hover:translate-x-1 transition-transform"}`}>{link.name}</span>
                                    {isActive && (
                                        <motion.div 
                                            layoutId="sidebar-active"
                                            className="absolute right-3 w-1.5 h-1.5 bg-[#134e8d] rounded-full shadow-[0_0_10px_rgba(19,78,141,0.3)]" 
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                <div className="p-6 mt-auto border-t border-slate-100 space-y-4 bg-slate-50/50">
                    <div className="flex items-center gap-4 rounded-2xl bg-white p-4 border border-slate-200 shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#134e8d] flex items-center justify-center overflow-hidden border border-slate-200 shadow-inner font-bold">
                            {user?.profilePic ? (
                                <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                user?.name?.charAt(0) || user?.email?.charAt(0).toUpperCase()
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-bold text-[#1e293b] leading-none mb-1 truncate">
                                {user?.name || 'User'}
                            </p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                {user?.role || 'Member'}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <Link
                            to={`/${role}/profile`}
                            className={`flex items-center gap-4 px-5 py-3 rounded-xl transition-all text-slate-500 hover:text-[#134e8d] hover:bg-slate-50 group ${location.pathname.includes('profile') ? 'text-[#134e8d] bg-blue-50' : ''}`}
                        >
                            <User size={18} />
                            <span className="text-[13px] font-semibold">My Profile</span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-4 px-5 py-3 rounded-xl transition-all text-slate-500 hover:text-rose-600 hover:bg-rose-50 group font-bold"
                        >
                            <LogOut size={18} className="text-slate-400 group-hover:text-rose-500 transition-colors" />
                            <span className="text-[13px]">Logout Session</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
