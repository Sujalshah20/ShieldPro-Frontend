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
    LogOut,
    PlusCircle,
    User,
    Shield,
    ClipboardList,
    ChevronRight,
    HeadphonesIcon
} from "lucide-react";

const ROLE_LINKS = {
    admin: [
        { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
        { name: "Manage Policies", path: "/admin/policies", icon: ShieldCheck },
        { name: "Manage Customers", path: "/admin/users", icon: Users },
        { name: "All Claims", path: "/admin/claims", icon: FileText },
    ],
    agent: [
        { name: "Dashboard", path: "/agent", icon: LayoutDashboard },
        { name: "My Customers", path: "/agent/clients", icon: Users },
        { name: "Policy Applications", path: "/agent/applications", icon: FileText },
        { name: "Claims to Process", path: "/agent/claims", icon: ClipboardList },
        { name: "Commission", path: "/agent/commission", icon: Shield },
    ],
    customer: [
        { name: "Dashboard", path: "/customer", icon: LayoutDashboard },
        { name: "My Policies", path: "/customer/policies", icon: ShieldCheck },
        { name: "My Claims", path: "/customer/claims", icon: ClipboardList },
    ]
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
                className={`fixed top-0 left-0 z-[70] h-screen w-64 bg-[#1e293b] text-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
            >
                {/* Logo Section */}
                <div className="p-8 pb-10">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#0ea5e9] rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Shield className="w-6 h-6 text-white" strokeWidth={2.5} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-bold tracking-tight text-white leading-none">Secure Shield</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[2px] mt-1.5">Agent Portal</span>
                        </div>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-4 space-y-1.5">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = location.pathname === link.path;
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all group ${
                                    isActive 
                                        ? "bg-[#14b8a6] text-white shadow-lg shadow-teal-500/20" 
                                        : "text-slate-400 hover:text-white hover:bg-white/5"
                                }`}
                            >
                                <Icon size={20} />
                                <span className="text-[14px] font-semibold">{link.name}</span>
                            </Link>
                        );
                    })}

                    <div className="pt-8 pb-4">
                        <p className="px-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4">Support & Account</p>
                        <div className="space-y-1.5">
                            <Link to={`/${role}/settings`} className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                                <Settings size={20} />
                                <span className="text-[14px] font-semibold">Settings</span>
                            </Link>
                            <Link to={`/${role}/help`} className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                                <HelpCircle size={20} />
                                <span className="text-[14px] font-semibold">Help Center</span>
                            </Link>
                        </div>
                    </div>
                </nav>

                {/* Footer Actions */}
                <div className="p-4 mt-auto space-y-3 bg-[#111827]/50">
                    <button className="w-full h-11 bg-white/10 hover:bg-white/20 text-white rounded-xl flex items-center justify-center gap-3 transition-all font-bold text-[13px] border border-white/5">
                        <PlusCircle size={18} /> New Customer
                    </button>
                    
                    <button 
                        onClick={handleLogout}
                        className="w-full h-11 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-xl flex items-center justify-center gap-3 transition-all font-bold text-[13px] border border-rose-500/10"
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
