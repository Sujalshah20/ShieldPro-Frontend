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
    RefreshCcw
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
    customer: [
        { name: "Personal Grid", path: "/customer", icon: LayoutDashboard, tag: "STATUS" },
        { name: "Active Protocols", path: "/customer/policies", icon: ShieldCheck, tag: "VAULT" },
        { name: "Incident Tracking", path: "/customer/claims", icon: Activity, tag: "REPORTS" },
        { name: "Identity Profile", path: "/customer/profile", icon: Users, tag: "MANIFEST" },
        { name: "Node Settings", path: "/customer/settings", icon: Settings, tag: "CONFIG" },
        { name: "Deploy Protocols", path: "/customer/checkout", icon: CreditCard, tag: "ACQUIRE" },
        { name: "Secure Comms", path: "/customer/messages", icon: MessageSquare, tag: "SIGNAL" },
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
                        className="fixed inset-0 bg-[#003249]/80 z-[60] md:hidden backdrop-blur-xl"
                        onClick={() => setIsOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Chassis — Nav Blue Theme */}
            <aside
                className={`fixed md:sticky top-0 left-0 z-[70] h-screen w-80 bg-[#003249] border-r border-white/5 transform transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) flex flex-col ${isOpen ? "translate-x-0 shadow-3xl" : "-translate-x-full"} md:translate-x-0 group/sidebar overflow-hidden`}
            >
                {/* Visual Grid Background */}
                 <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#007ea7 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }} />

                {/* Header Section */}
                <div className="p-10 flex items-center gap-6 border-b border-white/5 relative z-10 bg-[#003249]/50 backdrop-blur-lg">
                    <Link to="/" className="relative group/logo">
                        <div className="absolute inset-0 bg-[#007ea7] blur-2xl opacity-20 group-hover/logo:opacity-60 transition-all duration-500 scale-150" />
                        <div className="relative w-14 h-14 bg-[#007ea7] rounded-[1.2rem] flex items-center justify-center shadow-2xl group-hover:rotate-[360deg] transition-all duration-1000 ease-in-out border border-white/10">
                            <Shield className="w-8 h-8 text-[#003249]" strokeWidth={3} />
                        </div>
                    </Link>
                    <div className="flex flex-col">
                        <Link to="/" className="text-2xl font-black tracking-tighter leading-none text-white uppercase flex items-center group">
                            SHIELD<span className="text-[#007ea7] tracking-normal ml-1">PRO</span>
                        </Link>
                        <div className="flex items-center gap-2 mt-3">
                             <div className="w-1.5 h-1.5 bg-[#007ea7] rounded-full animate-pulse shadow-[0_0_10px_#007ea7]" />
                             <span className="text-[8px] font-black uppercase tracking-[4px] text-white/40 italic">Global_Node_v4.2</span>
                        </div>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto no-scrollbar py-10 px-6 space-y-4 relative z-10">
                    <div className="px-6 mb-10 flex items-center justify-between opacity-30">
                        <div className="flex items-center gap-3">
                            <Terminal size={14} className="text-[#007ea7]" strokeWidth={3} />
                            <p className="text-[10px] font-black uppercase tracking-[5px] text-white italic">Control_Nodes</p>
                        </div>
                        <div className="w-2 h-2 bg-white/20 rounded-full" />
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
                                className={`group relative flex items-center gap-5 px-6 py-5 rounded-[1.5rem] transition-all duration-500 overflow-hidden ${isActive
                                        ? "bg-white text-[#003249] shadow-3xl scale-[1.03] z-10"
                                        : "text-white/40 hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                {isActive && (
                                    <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-100 opacity-95 group-hover:scale-110 transition-transform duration-1000" />
                                )}
                                <div className={`flex items-center justify-center transition-all duration-500 relative z-10 ${isActive ? "scale-110" : "group-hover:scale-110"}`}>
                                    <Icon size={20} strokeWidth={isActive ? 3 : 2} className={isActive ? 'text-[#007ea7]' : 'opacity-40 group-hover:opacity-100'} />
                                </div>
                                <div className="flex flex-col relative z-10">
                                    <span className={`text-[11px] font-black uppercase tracking-[3px] italic ${isActive ? "text-[#003249]" : ""}`}>
                                        {link.name}
                                    </span>
                                    {isActive && (
                                        <span className="text-[8px] font-black uppercase tracking-[4px] text-[#007ea7] italic leading-none mt-1">OPERATIONAL</span>
                                    )}
                                </div>
                                
                                {isActive && (
                                    <motion.div 
                                        layoutId="sidebar-active-marker"
                                        className="absolute right-6 w-2 h-2 bg-[#007ea7] rounded-full shadow-[0_0_15px_#007ea7] animate-pulse z-10"
                                    />
                                )}
                                {!isActive && (
                                     <span className="absolute right-6 text-[8px] font-black text-white/10 uppercase tracking-widest italic group-hover:opacity-0 transition-opacity">{link.tag}</span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Section */}
                <div className="p-8 relative z-10 border-t border-white/5 bg-[#003249]/80 backdrop-blur-md">
                    <div className="p-8 bg-white/5 rounded-[2rem] border border-white/10 shadow-2xl relative group/support overflow-hidden transition-all hover:bg-white/10">
                        <div className="flex items-center gap-4 mb-4">
                            <Activity size={16} className="text-[#007ea7]" strokeWidth={3} />
                            <p className="text-[10px] font-black text-[#007ea7] uppercase tracking-[5px] italic leading-none">Status_Ready</p>
                        </div>
                        <p className="text-[9px] font-black text-white/30 uppercase tracking-[2px] leading-relaxed mb-8 italic">Direct uplink to global security operations center active.</p>
                        
                        <button className="w-full h-14 bg-white text-[#003249] rounded-2xl text-[10px] font-black uppercase tracking-[6px] hover:bg-[#007ea7] hover:text-white transition-all shadow-xl active:scale-95 flex items-center justify-center gap-4 group/btn italic">
                            SIGNAL_HUB <ChevronRight size={16} strokeWidth={3} className="group-hover/btn:translate-x-2 transition-transform" />
                        </button>
                    </div>

                    <div className="mt-10 flex items-center justify-between px-4">
                         <div className="flex gap-6 opacity-20 text-white">
                             <Satellite size={16} strokeWidth={2} />
                             <Fingerprint size={16} strokeWidth={2} />
                         </div>
                         <div className="flex items-center gap-2 opacity-20">
                            <span className="text-[8px] font-black text-white uppercase tracking-widest italic">SYNC://99.9%</span>
                         </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
