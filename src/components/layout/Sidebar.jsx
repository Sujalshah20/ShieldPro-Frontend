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
    Headphones
} from "lucide-react";

const ROLE_LINKS = {
    admin: [
        { name: "Admin Dashboard", path: "/admin", icon: LayoutDashboard },
        { name: "Users Directory", path: "/admin/users", icon: Users },
        { name: "Insurance Policies", path: "/admin/policies", icon: ShieldCheck },
        { name: "Policy Applications", path: "/admin/applications", icon: ClipboardList },
        { name: "Agent Commissions", path: "/admin/commissions", icon: Briefcase },
        { name: "Transaction Records", path: "/admin/transactions", icon: CreditCard },
        { name: "Claims Management", path: "/admin/claims", icon: FileText },
        { name: "Settings", path: "/admin/settings", icon: Settings },
    ],
    agent: [
        { name: "Agent Portal", path: "/agent", icon: LayoutDashboard },
        { name: "Client Directory", path: "/agent/clients", icon: Users },
        { name: "Submissions", path: "/agent/applications", icon: ClipboardList },
        { name: "Active Policies", path: "/agent/policies", icon: ShieldCheck },
        { name: "Commission Earnings", path: "/agent/commissions", icon: DollarSign },
        { name: "Claims Review", path: "/agent/claims", icon: FileText },
    ],
    customer: [
        { name: "Customer Home", path: "/customer", icon: LayoutDashboard },
        { name: "My Policies", path: "/customer/policies", icon: ShieldCheck },
        { name: "My Claims", path: "/customer/claims", icon: Activity },
        { name: "Account Profile", path: "/customer/profile", icon: Users },
        { name: "Account Settings", path: "/customer/settings", icon: Settings },
        { name: "Buy Insurance", path: "/customer/checkout", icon: CreditCard },
    ]
};

const Sidebar = ({ role, isOpen, setIsOpen }) => {
    const location = useLocation();
    const links = ROLE_LINKS[role] || ROLE_LINKS.customer;

    return (
        <>
            {/* Professional Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-zinc-950/80 z-[60] md:hidden backdrop-blur-md"
                        onClick={() => setIsOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Chassis — Nav Blue Theme */}
            <aside
                className={`fixed md:sticky top-0 left-0 z-[70] h-screen w-80 bg-header-bg border-r border-white/5 transform transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) flex flex-col ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"} md:translate-x-0 group/sidebar overflow-hidden`}
            >
                {/* Header Section */}
                <div className="p-10 flex items-center gap-6 border-b border-white/5 relative z-10">
                    <div className="relative group/logo cursor-pointer" onClick={() => window.location.href = '/'}>
                        <div className="absolute inset-0 bg-primary blur-2xl opacity-20 group-hover/logo:opacity-60 transition-all duration-500 scale-150" />
                        <div className="relative w-14 h-14 bg-primary rounded-xl flex items-center justify-center shadow-2xl group-hover:rotate-[360deg] transition-all duration-1000 ease-in-out">
                            <Shield className="w-7 h-7 text-white" strokeWidth={3} />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-2xl font-black tracking-tighter leading-none text-white uppercase flex items-center gap-1">
                            SECURE<span className="text-primary tracking-normal ml-1">SHIELD</span>
                        </h2>
                        <div className="flex items-center gap-2 mt-2">
                             <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_8px_#007ea8]" />
                             <span className="text-[9px] font-black uppercase tracking-[3px] text-slate-400">Enterprise Solutions</span>
                        </div>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto no-scrollbar py-10 px-6 space-y-2 relative z-10">
                    <div className="px-6 mb-8 flex items-center justify-between">
                        <p className="text-[10px] font-black uppercase tracking-[4px] text-primary opacity-60">Control Panel</p>
                        <PieChart size={12} className="text-white opacity-20" />
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
                                className={`group relative flex items-center gap-5 px-6 py-5 rounded-2xl transition-all duration-500 ${isActive
                                        ? "bg-primary text-white shadow-xl shadow-primary/20 scale-[1.03] z-10"
                                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                <div className={`flex items-center justify-center transition-all duration-500 ${isActive ? "scale-110" : "group-hover:scale-110"}`}>
                                    <Icon size={20} className={isActive ? 'text-white' : 'opacity-40 group-hover:opacity-100'} />
                                </div>
                                <span className={`text-[11px] font-black uppercase tracking-[3px] ${isActive ? "opacity-100" : "opacity-60 group-hover:opacity-100"}`}>
                                    {link.name}
                                </span>
                                
                                {isActive && (
                                    <motion.div 
                                        layoutId="sidebar-active-marker"
                                        className="absolute right-6 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_15px_#fff] animate-pulse"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Section */}
                <div className="p-8 relative z-10 border-t border-white/5 bg-header-bg">
                    <div className="p-6 bg-white/5 rounded-2xl border border-white/5 shadow-2xl relative group/support overflow-hidden transition-all hover:bg-white/10">
                        <div className="flex items-center gap-3 mb-4">
                            <Headphones size={14} className="text-primary" />
                            <p className="text-[10px] font-black text-primary uppercase tracking-[4px]">Verified Hub</p>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[1px] leading-relaxed mb-6">24/7 Security Operations Center</p>
                        
                        <button className="w-full py-3 bg-primary text-white rounded-xl text-[9px] font-black uppercase tracking-[4px] hover:bg-white hover:text-header-bg transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3">
                            UPLINK SUPPORT <MessageSquare size={14} />
                        </button>
                    </div>

                    <div className="mt-8 flex items-center justify-center gap-6 opacity-10 text-white">
                         <ShieldCheck size={16} />
                         <div className="w-px h-4 bg-white/20" />
                         <Lock size={16} />
                         <div className="w-px h-4 bg-white/20" />
                         <Activity size={16} />
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
