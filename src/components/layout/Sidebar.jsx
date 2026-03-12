import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
    LayoutDashboard,
    ShieldCheck,
    Users,
    FileText,
    Settings,
    HelpCircle,
    CreditCard
} from "lucide-react";

const ROLE_LINKS = {
    admin: [
        { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
        { name: "Users", path: "/admin/users", icon: Users },
        { name: "All Policies", path: "/admin/policies", icon: ShieldCheck },
        { name: "Applications", path: "/admin/applications", icon: FileText },
        { name: "Payouts", path: "/admin/commissions", icon: CreditCard },
        { name: "Claims", path: "/admin/claims", icon: FileText },
        { name: "Settings", path: "/admin/settings", icon: Settings },
    ],
    agent: [
        { name: "Dashboard", path: "/agent", icon: LayoutDashboard },
        { name: "My Clients", path: "/agent/clients", icon: Users },
        { name: "Applications", path: "/agent/applications", icon: FileText },
        { name: "Active Policies", path: "/agent/policies", icon: ShieldCheck },
        { name: "Earnings", path: "/agent/commissions", icon: CreditCard },
        { name: "Claims Review", path: "/agent/claims", icon: Activity },
    ],
    customer: [
        { name: "Dashboard", path: "/customer", icon: LayoutDashboard },
        { name: "My Policies", path: "/customer/policies", icon: ShieldCheck },
        { name: "My Claims", path: "/customer/claims", icon: FileText },
        { name: "Profile", path: "/customer/profile", icon: Users },
        { name: "Settings", path: "/customer/settings", icon: Settings },
        { name: "Payments", path: "/customer/checkout", icon: CreditCard },
        { name: "Support", path: "/customer/support", icon: HelpCircle },
    ]
};

const Sidebar = ({ role, isOpen, setIsOpen }) => {
    const location = useLocation();
    const links = ROLE_LINKS[role] || ROLE_LINKS.customer;

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar sidebar */}
            <aside
                className={`fixed md:sticky top-0 left-0 z-50 h-screen w-72 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-2xl border-r border-border/50 transform transition-all duration-500 ease-in-out flex flex-col ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"} md:translate-x-0 group/sidebar`}
            >
                {/* Logo Section */}
                <div className="p-8 flex items-center gap-4 border-b border-border/10">
                    <div className="relative group/logo">
                        <div className="absolute inset-0 bg-gold blur-xl opacity-20 group-hover/logo:opacity-40 transition-opacity" />
                        <div className="relative p-2.5 bg-gradient-to-br from-gold to-amber-600 rounded-2xl shadow-lg ring-1 ring-white/20">
                            <ShieldCheck className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-xl font-black tracking-tight leading-none text-foreground">
                            Shield<span className="text-gold">Pro</span>
                        </h2>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-1 opacity-60">Insurance Suite</span>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto no-scrollbar py-8 px-4 space-y-1.5 focus-visible:outline-none">
                    <div className="px-4 mb-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50">Main Menu</p>
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
                                className={`group relative flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all duration-300 ${isActive
                                        ? "bg-gold text-gold-foreground shadow-xl shadow-gold/20 font-bold"
                                        : "text-zinc-500 hover:bg-gold/5 dark:text-zinc-400 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white hover:translate-x-1"
                                    }`}
                            >
                                <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? "scale-110" : "opacity-70 group-hover:opacity-100 group-hover:scale-110"}`} />
                                <span className="text-sm tracking-tight">{link.name}</span>
                                
                                {isActive && (
                                    <motion.div 
                                        layoutId="sidebar-blob"
                                        className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full sm:opacity-50"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Section */}
                <div className="p-6">
                    <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-border shadow-sm">
                        <p className="text-[10px] font-bold text-gold uppercase tracking-widest mb-1">Premium Support</p>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-3">Our agents are here to help you 24/7.</p>
                        <button className="w-full py-2 bg-gold text-gold-foreground rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all">
                            Get Help
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
