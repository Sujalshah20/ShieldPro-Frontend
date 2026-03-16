import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
    FileCheck,
    Users2,
    BriefcaseIcon,
    Wallet,
    Bell,
    UserCircle
} from "lucide-react";

/**
 * Professional Navigation Links for Secure Shield
 * Moving away from tactical terminology to corporate/insurance terms
 */
const ROLE_LINKS = {
    admin: [
        { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
        { name: "Manage Users", path: "/admin/users", icon: Users2 },
        { name: "Insurance Plans", path: "/admin/policies", icon: ShieldCheck },
        { name: "Policy Applications", path: "/admin/applications", icon: FileCheck },
        { name: "Agent Commissions", path: "/admin/commissions", icon: DollarSign },
        { name: "Transaction History", path: "/admin/transactions", icon: Wallet },
        { name: "Claims Requests", path: "/admin/claims", icon: FileText },
        { name: "System Settings", path: "/admin/settings", icon: Settings },
    ],
    agent: [
        { name: "Agent Dashboard", path: "/agent", icon: LayoutDashboard },
        { name: "My Clients", path: "/agent/clients", icon: Users },
        { name: "Applications Queue", path: "/agent/applications", icon: ClipboardList },
        { name: "Active Policies", path: "/agent/policies", icon: ShieldCheck },
        { name: "My Commissions", path: "/agent/commissions", icon: DollarSign },
        { name: "Claims Status", path: "/agent/claims", icon: FileText },
    ],
    customer: [
        { name: "My Dashboard", path: "/customer", icon: LayoutDashboard },
        { name: "My Policies", path: "/customer/policies", icon: ShieldCheck },
        { name: "My Claims", path: "/customer/claims", icon: Activity },
        { name: "Personal Profile", path: "/customer/profile", icon: UserCircle },
        { name: "Account Settings", path: "/customer/settings", icon: Settings },
        { name: "Browse Policies", path: "/customer/checkout", icon: BriefcaseIcon },
        { name: "Message Center", path: "/customer/messages", icon: MessageSquare },
    ]
};

const Sidebar = ({ role, isOpen, setIsOpen }) => {
    const location = useLocation();
    const links = ROLE_LINKS[role] || ROLE_LINKS.customer;

    return (
        <>
            {/* Mobile Overlay */}
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

            {/* Sidebar Shell */}
            <aside
                className={`fixed md:sticky top-0 left-0 z-[70] h-screen w-72 bg-[#002b45] border-r border-slate-800 transform transition-all duration-500 ease-in-out flex flex-col ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"} md:translate-x-0 group/sidebar overflow-hidden`}
            >
                {/* Branding Section */}
                <div className="p-8 flex items-center gap-4 border-b border-slate-800">
                    <Link to="/" className="w-10 h-10 bg-[#10b981] rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/20">
                        <Shield className="w-6 h-6 text-white" strokeWidth={2.5} />
                    </Link>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold tracking-tight text-white">Secure <span className="text-[#10b981]">Shield</span></span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mt-1">Enterprise Pro</span>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto no-scrollbar py-8 px-4 space-y-2">
                    <div className="px-4 mb-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Navigation Menu</p>
                    </div>
                    
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = link.path === `/${role}`
                            ? location.pathname === link.path
                            : location.pathname.startsWith(link.path);

                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={`group flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 ${isActive
                                        ? "bg-white/10 text-[#10b981] shadow-lg"
                                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                <div className={`flex items-center justify-center transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`}>
                                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                </div>
                                <span className={`text-sm font-semibold tracking-tight ${isActive ? "text-white" : ""}`}>
                                    {link.name}
                                </span>
                                
                                {isActive && (
                                    <motion.div 
                                        layoutId="sidebar-active-indicator"
                                        className="ml-auto w-1.5 h-1.5 bg-[#10b981] rounded-full shadow-[0_0_10px_#10b981]"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Account / Support Footer */}
                <div className="p-4 mt-auto">
                    <div className="p-5 bg-white/5 rounded-2xl border border-slate-800 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]" />
                            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Active Services</p>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed">Your account is fully synchronized and protected.</p>
                        
                        <button className="w-full h-10 bg-slate-800 text-white rounded-xl text-[11px] font-bold uppercase tracking-wider hover:bg-[#10b981] transition-all flex items-center justify-center gap-2">
                            <Headphones size={14} /> Support Center
                        </button>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-center text-[9px] font-bold text-slate-600 uppercase tracking-[2px]">
                        © 2026 Secure Shield Insurance
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
