import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    ShieldCheck,
    Users,
    FileText,
    Settings,
    HelpCircle,
    CreditCard
} from "lucide-react";

export const ROLE_LINKS = {
    admin: [
        { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
        { name: "Users", path: "/admin/users", icon: Users },
        { name: "All Policies", path: "/admin/policies", icon: ShieldCheck },
        { name: "Claims", path: "/admin/claims", icon: FileText },
        { name: "Settings", path: "/admin/settings", icon: Settings },
    ],
    agent: [
        { name: "Dashboard", path: "/agent", icon: LayoutDashboard },
        { name: "My Clients", path: "/agent/clients", icon: Users },
        { name: "Active Policies", path: "/agent/policies", icon: ShieldCheck },
        { name: "Claims Review", path: "/agent/claims", icon: FileText },
    ],
    customer: [
        { name: "Dashboard", path: "/customer", icon: LayoutDashboard },
        { name: "My Policies", path: "/customer/policies", icon: ShieldCheck },
        { name: "My Claims", path: "/customer/claims", icon: FileText },
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
                className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 glass-premium bg-background/80 dark:bg-black/40 border-r border-border/50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
            >
                <div className="p-6 flex items-center gap-3 border-b border-border/50">
                    <div className="p-2 bg-gold/20 rounded-xl">
                        <ShieldCheck className="w-6 h-6 text-gold" />
                    </div>
                    <h2 className="text-xl font-bold m-0 leading-tight">Shield<span className="text-gold">Pro</span></h2>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                    {links.map((link) => {
                        const Icon = link.icon;
                        // Exact match for dashboard root, otherwise startsWith for nested routes
                        const isActive = link.path === `/${role}`
                            ? location.pathname === link.path
                            : location.pathname.startsWith(link.path);

                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                        ? "bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 font-semibold"
                                        : "text-foreground/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground"
                                    }`}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? "" : "opacity-70"}`} />
                                {link.name}
                                {isActive && (
                                    <div className="absolute left-0 w-1 h-8 bg-blue-600 dark:bg-blue-400 rounded-r-full" />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
