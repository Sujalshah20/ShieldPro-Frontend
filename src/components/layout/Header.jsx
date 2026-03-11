import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import {
    Sun, Moon, Menu, Bell, Search,
    Settings, User as UserIcon, LogOut, ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Header = ({ role, setMobileMenuOpen }) => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const [isScrolled, setIsScrolled] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Handle scroll effect for glass header
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const displayName = user?.email ? user.email.split('@')[0] : role;
    const formattedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
    const roleName = role.charAt(0).toUpperCase() + role.slice(1);

    // Generate Breadcrumbs
    const pathnames = location.pathname.split('/').filter(x => x);

    return (
        <header
            className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled
                    ? "bg-background/70 dark:bg-black/60 backdrop-blur-xl border-b border-border/50 shadow-sm"
                    : "bg-transparent border-b border-transparent"
                }`}
        >
            <div className="flex items-center justify-between px-6 py-4">
                {/* Left Side: Menu Toggle + Breadcrumbs */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setMobileMenuOpen(prev => !prev)}
                        className="p-2 -ml-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors md:hidden"
                        aria-label="Toggle menu"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="hidden sm:flex items-center text-sm font-medium text-foreground/60">
                        <span className="capitalize">{role}</span>
                        {pathnames.length > 1 && (
                            <>
                                <span className="mx-2 opacity-50">/</span>
                                <span className="text-foreground capitalize">{pathnames[pathnames.length - 1]}</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Center: Search Bar (Hidden on Mobile) */}
                <div className="hidden md:flex flex-1 max-w-md mx-6">
                    <div className="relative w-full group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            value={searchTerm}
                            placeholder={`Search ${role} resources...`}
                            className="w-full bg-black/5 dark:bg-white/5 border border-border/50 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                            onChange={e => setSearchTerm(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === 'Enter') {
                                    navigate(`/customer/browse?search=${encodeURIComponent(searchTerm)}`);
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Right Side: Actions & Profile */}
                <div className="flex items-center gap-3 sm:gap-5">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                    >
                        {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    </button>

                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={() => {
                                setShowNotifications(!showNotifications);
                                setShowProfileMenu(false);
                            }}
                            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors relative"
                        >
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-background"></span>
                        </button>

                        {/* Notification Dropdown */}
                        <AnimatePresence>
                            {showNotifications && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 mt-2 w-72 bg-card border border-border rounded-2xl shadow-xl overflow-hidden z-50 origin-top-right"
                                >
                                    <div className="p-4 border-b border-border bg-black/5 dark:bg-white/5">
                                        <h3 className="font-semibold">Notifications</h3>
                                    </div>
                                    <div className="p-4 text-sm text-center text-foreground/50">
                                        No new notifications
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => {
                                setShowProfileMenu(!showProfileMenu);
                                setShowNotifications(false);
                            }}
                            className="flex items-center gap-2 sm:gap-3 p-1 pl-1 pr-2 sm:pr-3 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors border border-transparent hover:border-border/50"
                        >
                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">
                                {formattedName.charAt(0)}
                            </div>
                            <div className="hidden sm:block text-left">
                                <div className="text-sm font-semibold leading-none">{formattedName}</div>
                                <div className="text-xs text-foreground/60 leading-tight mt-1">{roleName}</div>
                            </div>
                            <ChevronDown className="w-4 h-4 text-foreground/50 hidden sm:block" />
                        </button>

                        {/* Profile Menu Items */}
                        <AnimatePresence>
                            {showProfileMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-2xl shadow-xl overflow-hidden z-50 origin-top-right"
                                >
                                    <div className="p-4 border-b border-border/50 bg-black/5 dark:bg-white/5 sm:hidden">
                                        <div className="font-semibold">{formattedName}</div>
                                        <div className="text-xs opacity-70">{roleName}</div>
                                    </div>
                                    <div className="p-2 space-y-1">
                                        <button onClick={() => { navigate('/customer/profile'); setShowProfileMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-left">
                                            <UserIcon className="w-4 h-4 opacity-70" /> My Profile
                                        </button>
                                        <button onClick={() => { navigate('/customer/settings'); setShowProfileMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-left">
                                            <Settings className="w-4 h-4 opacity-70" /> Settings
                                        </button>
                                        <div className="h-px bg-border/50 my-1" />
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-xl hover:bg-red-500/10 text-red-600 dark:text-red-400 transition-colors text-left"
                                        >
                                            <LogOut className="w-4 h-4 opacity-70" /> Sign Out
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
