import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import {
    LayoutDashboard, ShieldCheck, Users, FileText,
    LogOut, Shield, ClipboardList, CreditCard,
    Compass, User, ChevronDown
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
    ],
    customer: [
        { name: "Dashboard", path: "/customer", icon: LayoutDashboard },
        { name: "Browse Policies", path: "/customer/browse", icon: Compass },
        { name: "My Policies", path: "/customer/policies", icon: ShieldCheck },
        { name: "My Claims", path: "/customer/claims", icon: ClipboardList },
        { name: "Payment History", path: "/customer/payments", icon: CreditCard },
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
                className={`fixed top-0 left-0 z-[70] h-screen w-64 bg-[#1a2744] text-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
            >
                {/* Logo Section */}
                <div className="p-8 pb-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 text-white">
                            <Shield className="w-6 h-6" strokeWidth={2.5} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-black tracking-tight text-white leading-none">Secure Shield</span>
                            <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-[0.2em] opacity-60">Agent Portal</span>
                        </div>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = location.pathname === link.path;
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all group ${
                                    isActive 
                                        ? "bg-white/10 text-white border border-white/5" 
                                        : "text-slate-400 hover:text-white hover:bg-white/5"
                                }`}
                            >
                                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-white" : "text-slate-400 group-hover:text-white"} />
                                <span className={`text-[13.5px] ${isActive ? 'font-bold' : 'font-semibold'}`}>{link.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Section */}
                <div className="p-4 border-t border-white/5 space-y-1">
                    {role !== 'agent' && (
                        <Link
                            to={`/${role}/profile`}
                            className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all group"
                        >
                            <User size={20} />
                            <span className="text-[13.5px] font-semibold">Profile</span>
                        </Link>
                    )}
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/5 transition-all group"
                    >
                        <LogOut size={20} className="group-hover:text-rose-400 transition-colors" />
                        <span className="text-[13.5px] font-semibold">Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
