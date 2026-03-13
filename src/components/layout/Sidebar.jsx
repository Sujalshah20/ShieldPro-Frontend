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
    Lock
} from "lucide-react";

const ROLE_LINKS = {
    admin: [
        { name: "Command Center", path: "/admin", icon: LayoutDashboard },
        { name: "Entity Roster", path: "/admin/users", icon: Users },
        { name: "Asset Catalog", path: "/admin/policies", icon: ShieldCheck },
        { name: "Deployment Queue", path: "/admin/applications", icon: FileText },
        { name: "Payout Matrix", path: "/admin/commissions", icon: CreditCard },
        { name: "FinOps Ledger", path: "/admin/transactions", icon: DollarSign },
        { name: "Incident Log", path: "/admin/claims", icon: Activity },
        { name: "System Protocols", path: "/admin/settings", icon: Settings },
    ],
    agent: [
        { name: "Sector Overview", path: "/agent", icon: LayoutDashboard },
        { name: "Client Assets", path: "/agent/clients", icon: Users },
        { name: "Submission Pipeline", path: "/agent/applications", icon: FileText },
        { name: "Active Safeguards", path: "/agent/policies", icon: ShieldCheck },
        { name: "Yield Tracking", path: "/agent/commissions", icon: DollarSign },
        { name: "Case Review", path: "/agent/claims", icon: Activity },
    ],
    customer: [
        { name: "Safehouse Hub", path: "/customer", icon: LayoutDashboard },
        { name: "My Safeguards", path: "/customer/policies", icon: ShieldCheck },
        { name: "Incident Reports", path: "/customer/claims", icon: Activity },
        { name: "Identity Profile", path: "/customer/profile", icon: Users },
        { name: "Hub Settings", path: "/customer/settings", icon: Settings },
        { name: "Payment Portal", path: "/customer/checkout", icon: CreditCard },
    ]
};

const Sidebar = ({ role, isOpen, setIsOpen }) => {
    const location = useLocation();
    const links = ROLE_LINKS[role] || ROLE_LINKS.customer;

    return (
        <>
            {/* Tactical Overlay */}
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

            {/* Tactical Chassis */}
            <aside
                className={`fixed md:sticky top-0 left-0 z-[70] h-screen w-80 bg-white dark:bg-[#0c1a15] border-r border-border transform transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) flex flex-col ${isOpen ? "translate-x-0 shadow-[50px_0_100px_rgba(0,0,0,0.2)]" : "-translate-x-full"} md:translate-x-0 group/sidebar overflow-hidden`}
            >
                {/* Visual Architecture Flare */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03] dark:opacity-[0.05] z-0">
                    <div className="absolute top-10 left-[-100px] w-64 h-64 bg-primary rounded-full blur-[100px]" />
                    <div className="absolute bottom-40 right-[-100px] w-64 h-64 bg-accent rounded-full blur-[100px]" />
                </div>

                {/* Tactical Header */}
                <div className="p-10 flex items-center gap-6 border-b border-border/50 relative z-10">
                    <div className="relative group/logo cursor-pointer" onClick={() => window.location.href = '/'}>
                        <div className="absolute inset-0 bg-primary blur-2xl opacity-20 group-hover/logo:opacity-60 transition-all duration-500 scale-150" />
                        <div className="relative w-14 h-14 bg-zinc-900 dark:bg-zinc-800 rounded-[1.25rem] flex items-center justify-center shadow-2xl border border-white/10 group-hover:rotate-[360deg] transition-all duration-1000 ease-in-out">
                            <Shield className="w-7 h-7 text-primary" strokeWidth={3} />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-2xl font-black tracking-tighter leading-none text-foreground uppercase italic flex items-center gap-1">
                            SECURE<span className="text-primary italic-none not-italic">SHIELD</span>
                        </h2>
                        <div className="flex items-center gap-2 mt-2">
                             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
                             <span className="text-[9px] font-black uppercase tracking-[3px] text-muted-foreground opacity-40 italic">Elite Operation</span>
                        </div>
                    </div>
                </div>

                {/* Primary Navigation System */}
                <nav className="flex-1 overflow-y-auto no-scrollbar py-10 px-6 space-y-2 relative z-10">
                    <div className="px-6 mb-8 flex items-center justify-between">
                        <p className="text-[10px] font-black uppercase tracking-[4px] text-primary italic opacity-60">System Core</p>
                        <Settings size={12} className="opacity-20" />
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
                                className={`group relative flex items-center gap-5 px-6 py-5 rounded-[1.5rem] transition-all duration-500 ${isActive
                                        ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_40px_-10px_rgba(255,255,255,0.1)] scale-[1.03] z-10"
                                        : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-white/[0.03] hover:translate-x-2"
                                    }`}
                            >
                                <div className={`flex items-center justify-center transition-all duration-500 ${isActive ? "scale-110" : "group-hover:scale-110"}`}>
                                    <Icon size={20} strokeWidth={isActive ? 3 : 2} className={isActive ? (role === 'admin' ? 'text-primary' : 'text-accent') : 'opacity-50'} />
                                </div>
                                <span className={`text-[11px] font-black uppercase tracking-[3px] italic ${isActive ? "opacity-100" : "opacity-60 group-hover:opacity-100"}`}>
                                    {link.name}
                                </span>
                                
                                {isActive && (
                                    <motion.div 
                                        layoutId="sidebar-active-marker"
                                        className="absolute right-6 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_15px_#FF5A00] animate-pulse"
                                    />
                                )}

                                {!isActive && (
                                    <Zap size={10} className="absolute right-6 opacity-0 group-hover:opacity-20 transition-opacity" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Tactical Footer: Operator Dossier Preview */}
                <div className="p-8 relative z-10 border-t border-border/50 bg-zinc-50 dark:bg-white/[0.01]">
                    <div className="p-8 bg-zinc-900 dark:bg-zinc-800 rounded-[2.5rem] border border-white/5 shadow-2xl relative group/support overflow-hidden transition-all hover:translate-y-[-5px]">
                        <div className="absolute top-[-20%] right-[-10%] opacity-10 group-hover/support:scale-125 transition-transform duration-700">
                             <Satellite size={100} className="text-primary rotate-12" />
                        </div>
                        
                        <div className="flex items-center gap-3 mb-4">
                            <Compass size={14} className="text-primary animate-spin-slow" />
                            <p className="text-[10px] font-black text-primary uppercase tracking-[4px] italic">Strategic Support</p>
                        </div>
                        <p className="text-[11px] font-black text-white/50 uppercase tracking-[1px] leading-relaxed mb-6 italic">24/7 Orbital Assistance established.</p>
                        
                        <button className="w-full py-4 bg-white text-zinc-900 rounded-2xl text-[9px] font-black uppercase tracking-[4px] hover:bg-primary hover:text-white transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3">
                            INITIALIZE COMMS <Target size={14} strokeWidth={3} />
                        </button>
                    </div>

                    <div className="mt-8 flex items-center justify-center gap-6 opacity-20">
                         <Fingerprint size={16} />
                         <div className="w-px h-4 bg-foreground" />
                         <Lock size={16} />
                         <div className="w-px h-4 bg-foreground" />
                         <Cpu size={16} />
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
