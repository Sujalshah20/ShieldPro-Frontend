import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import {
    LayoutDashboard,
    ShieldCheck,
    Users,
    FileText,
    LogOut,
    PlusCircle,
    Shield,
    ClipboardList,
    CreditCard,
    Compass
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
        { name: "Browse Policies", path: "/customer/browse", icon: Compass },
        { name: "My Policies", path: "/customer/policies", icon: ShieldCheck },
        { name: "My Claims", path: "/customer/claims", icon: ClipboardList },
        { name: "Submit New Claim", path: "/customer/submit-claim", icon: PlusCircle },
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

    const isCustomer = role === 'customer';

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
                <div className="p-8 pb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 text-white">
                            <Shield className="w-5 h-5" strokeWidth={2.5} />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white leading-none">Secure Shield</span>
                    </div>
                </div>

                {/* Profile Section for Customer */}
                {isCustomer && (
                    <div className="px-6 mb-8 mt-2">
                        <div className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/10">
                            <img 
                                src="https://i.pravatar.cc/150?u=rahul" 
                                alt="Rahul Sharma" 
                                className="w-10 h-10 rounded-full border-2 border-blue-500/50 object-cover shadow-sm"
                            />
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-white tracking-tight">Rahul Sharma</span>
                                <div className="flex items-center mt-0.5">
                                    <span className="text-[10px] font-black bg-white/10 text-slate-300 px-2 py-0.5 rounded-md uppercase tracking-widest border border-white/5">
                                        CUSTOMER
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

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
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 font-bold" 
                                        : "text-slate-400 hover:text-white hover:bg-white/5"
                                }`}
                            >
                                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                                <span className={`text-[13px] ${isActive ? 'font-bold' : 'font-semibold'}`}>{link.name}</span>
                            </Link>
                        );
                    })}

                    <div className="pt-8 pb-4">
                        <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Account</p>
                        <div className="space-y-1">
                            <button 
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/5 transition-all group"
                            >
                                <LogOut size={18} className="group-hover:text-rose-400 transition-colors" />
                                <span className="text-[13px] font-semibold">Logout</span>
                            </button>
                        </div>
                    </div>
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;
