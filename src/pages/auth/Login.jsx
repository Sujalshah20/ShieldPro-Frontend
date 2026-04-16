import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
    Shield, Mail, Lock, Eye, EyeOff, 
    Activity, Zap, ShieldCheck, Loader2, ArrowRight,
    User, Briefcase, KeyRound
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../hooks/use-toast";
import Reveal from "../../components/common/Reveal";
import { api } from "../../utils/api";

// ─── Role Configuration ────────────────────────────────────────────────
const ROLES = {
    customer: {
        key: "customer",
        label: "Customer",
        icon: User,
        title: "Welcome back",
        subtitle: "Sign in to manage your policies and claims.",
        emailPlaceholder: "yourname@example.com",
        emailHint: null,
        buttonLabel: "Sign In",
        registerLink: true,
        rememberMeDefault: true,
        show2FA: false,
        // Tailwind accent classes
        accent:        "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30",
        accentRing:    "focus-within:ring-emerald-400/20 focus-within:border-emerald-400",
        accentValid:   "border-emerald-500",
        accentTab:     "bg-emerald-500 text-white shadow-emerald-500/20",
        accentTabText: "text-emerald-600",
        accentBadge:   "bg-emerald-50 text-emerald-700 ring-emerald-200",
    },
    agent: {
        key: "agent",
        label: "Agent",
        icon: Briefcase,
        title: "Agent Portal",
        subtitle: "Access your client pipeline and commissions.",
        emailPlaceholder: "agent@shieldpro.com",
        emailHint: "Use your registered agent email address",
        buttonLabel: "Access Portal",
        registerLink: false,
        rememberMeDefault: true,
        show2FA: false,
        accent:        "bg-[#134e8d] hover:bg-[#0f3d70] shadow-blue-700/30",
        accentRing:    "focus-within:ring-blue-400/20 focus-within:border-blue-400",
        accentValid:   "border-blue-500",
        accentTab:     "bg-[#134e8d] text-white shadow-blue-700/20",
        accentTabText: "text-[#134e8d]",
        accentBadge:   "bg-blue-50 text-blue-700 ring-blue-200",
    },
    admin: {
        key: "admin",
        label: "Admin",
        icon: KeyRound,
        title: "Admin Access",
        subtitle: "Restricted to authorised personnel only.",
        emailPlaceholder: "admin@shieldpro.com",
        emailHint: "Admin accounts are provisioned by the system.",
        buttonLabel: "Secure Login",
        registerLink: false,
        rememberMeDefault: false,
        show2FA: true,
        accent:        "bg-slate-900 hover:bg-black shadow-slate-900/30",
        accentRing:    "focus-within:ring-slate-400/20 focus-within:border-slate-500",
        accentValid:   "border-slate-600",
        accentTab:     "bg-slate-900 text-white shadow-slate-900/20",
        accentTabText: "text-slate-800",
        accentBadge:   "bg-slate-100 text-slate-700 ring-slate-300",
    },
};

// ─── Component ─────────────────────────────────────────────────────────
const Login = () => {
    const [activeRole, setActiveRole] = useState("customer");
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);
    const [failedAttempts, setFailedAttempts] = useState(0);
    const [errors, setErrors] = useState({});
    const [captchaVerified, setCaptchaVerified] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    // BUG FIX: Handle global session expiration redirect from api.js
    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('expired')) {
            toast({
                title: "Session Expired",
                description: "Your session has expired or is invalid. Please login again.",
                variant: "destructive"
            });
            // Clear the query param without refreshing to prevent toast from reappearing on manual refresh
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, [toast]);

    const role = ROLES[activeRole];

    // Switch role → reset form
    const handleRoleSwitch = (key) => {
        setActiveRole(key);
        setFormData({ email: "", password: "" });
        setErrors({});
        setRememberMe(ROLES[key].rememberMeDefault);
        setFailedAttempts(0);
        setCaptchaVerified(false);
    };

    const validateField = (name, value) => {
        let error = "";
        switch (name) {
            case "email": {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) error = "Please enter a valid email address.";
                else if (/\s/.test(value)) error = "No spaces allowed in email.";
                break;
            }
            case "password":
                if (value.length < 8) error = "Password must be at least 8 characters.";
                break;
            default: break;
        }
        return error;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "password" && value.length > 20) return;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    };

    const handleKeyDown = (e, field) => {
        const allowed = ['Backspace','Tab','ArrowLeft','ArrowRight','Delete','Enter'];
        if (allowed.includes(e.key) || e.ctrlKey || e.metaKey) return;
        if (field === "email" && e.key === ' ') {
            e.preventDefault();
            toast({ title: 'Invalid Input', description: 'Email cannot contain spaces', variant: 'destructive' });
        }
        if (field === "password" && formData.password.length >= 20 && e.key.length === 1) {
            e.preventDefault();
        }
    };

    const getBorderClass = (fieldName) => {
        const value = formData[fieldName];
        if (!value) return "border-slate-200";
        if (errors[fieldName]) return "border-red-400";
        return role.accentValid;
    };

    const isFormValid =
        Object.values(errors).every(e => e === "") &&
        formData.email.trim() !== "" &&
        formData.password !== "" &&
        (failedAttempts < 3 || captchaVerified);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid || isLoading) return;
        setIsLoading(true);
        try {
            const user = await login(formData.email.trim(), formData.password, rememberMe, activeRole);
            setFailedAttempts(0);
            toast({ title: "Login Successful", description: "Welcome back to ShieldPro.", variant: "default" });
            setTimeout(() => {
                if (user.role === 'admin') navigate('/admin');
                else if (user.role === 'agent') navigate('/agent');
                else navigate('/customer');
            }, 500);
        } catch (error) {
            const status = error.status || error.response?.status;
            const msg = error.response?.data?.message || error.message || "Invalid credentials.";

            // ── Role mismatch (403) — specific portal error ──
            if (status === 403 && !msg.toLowerCase().includes('locked')) {
                toast({
                    title: "Wrong Portal",
                    description: msg,
                    variant: "destructive"
                });
                setIsLoading(false);
                return; // Don't increment failed attempts for role mismatch
            }

            const newAttempts = failedAttempts + 1;
            setFailedAttempts(newAttempts);
            let description = msg;
            if (msg.toLowerCase().includes("failed to fetch")) description = "Cannot connect to server.";
            else if (msg.toLowerCase().includes('not found')) description = "No account found with this email.";
            else if (newAttempts < 5) description = `${msg} ${5 - newAttempts} attempts remaining.`;
            else description = "Too many failed attempts. Account locked for 15 minutes.";
            toast({ title: "Login Failed", description, variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-white flex selection:bg-[#10b981] selection:text-white font-sans">
            <div className="w-full flex flex-col lg:grid lg:grid-cols-12">

                {/* ── LEFT PANEL ── */}
                <div className="hidden lg:flex lg:col-span-4 bg-[#124C89] p-8 lg:p-12 flex-col justify-between text-white relative overflow-hidden min-h-screen">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 blur-[100px] rounded-full -mr-40 -mt-40" />
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/5 blur-[80px] rounded-full -ml-20 -mb-20" />
                    <div className="relative z-10">
                        <Link to="/" className="w-16 h-16 bg-white/5 backdrop-blur-xl rounded-[1.2rem] flex items-center justify-center border border-white/10 mb-12 hover:bg-white/10 transition-all group overflow-hidden">
                            <Shield size={32} className="text-white group-hover:scale-110 transition-transform" strokeWidth={2.5} />
                        </Link>
                        <div className="space-y-12">
                            <Reveal direction="down">
                                <div className="relative group p-8 bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-4xl overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 blur-3xl rounded-full" />
                                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400/10 blur-3xl rounded-full" />
                                    <div className="relative z-10 space-y-8 text-center lg:text-left">
                                        <div className="inline-flex items-center px-3 py-1 bg-emerald-400/10 border border-emerald-400/20 rounded-full text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
                                            Why Choose ShieldPro?
                                        </div>
                                        <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                                            Your Safety, <br />
                                            <span className="text-emerald-400">Our Priority.</span>
                                        </h2>
                                        <p className="text-white/70 text-base font-medium leading-relaxed">
                                            Secure your family's future with India's most trusted digital insurance partner. From health to assets, we've got you covered with 24/7 expert support and lightning-fast claim settlements.
                                        </p>
                                        <div className="pt-4 grid grid-cols-2 gap-4">
                                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                                <p className="text-white font-bold text-lg">99.9%</p>
                                                <p className="text-white/40 text-[9px] font-bold uppercase tracking-wider mt-1">Settlement Rate</p>
                                            </div>
                                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                                <p className="text-white font-bold text-lg">10k+</p>
                                                <p className="text-white/40 text-[9px] font-bold uppercase tracking-wider mt-1">Secure Families</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Reveal>
                            <div className="space-y-6 pt-10 border-t border-white/10">
                                {[
                                    { icon: ShieldCheck, label: "Secure Data Encryption" },
                                    { icon: Activity, label: "Instant Policy Updates" },
                                    { icon: Zap, label: "Fast Claim Statistics" }
                                ].map((item, i) => (
                                    <Reveal key={i} direction="up" delay={0.4 + (i * 0.1)}>
                                        <div className="flex items-center gap-5 group">
                                            <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center text-emerald-400 shrink-0 border border-white/10 group-hover:rotate-6 transition-transform">
                                                <item.icon size={22} strokeWidth={2.5} />
                                            </div>
                                            <span className="text-[15px] font-bold text-white/90 group-hover:text-white transition-colors">{item.label}</span>
                                        </div>
                                    </Reveal>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="relative z-10 pt-8 border-t border-white/10 text-white/30 text-[12px] font-bold uppercase tracking-widest">
                        © 2026 ShieldPro
                    </div>
                </div>

                {/* ── RIGHT PANEL ── */}
                <div className="flex-1 lg:col-span-8 flex flex-col items-center py-12 px-6 md:px-16 lg:px-24 relative bg-white min-h-screen">
                    <div className="w-full max-w-[460px] space-y-8 my-auto">

                        {/* Mobile logo */}
                        <div className="lg:hidden mb-2 text-center">
                            <Link to="/" className="inline-flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#134e8d] rounded-lg flex items-center justify-center text-white">
                                    <Shield size={24} strokeWidth={2.5} />
                                </div>
                                <span className="text-2xl font-bold text-black">ShieldPro</span>
                            </Link>
                        </div>

                        {/* ── Role Selector Tabs ── */}
                        <div className="bg-slate-100 p-1.5 rounded-2xl grid grid-cols-3 gap-1">
                            {Object.values(ROLES).map((r) => {
                                const isActive = activeRole === r.key;
                                const Icon = r.icon;
                                return (
                                    <button
                                        key={r.key}
                                        type="button"
                                        onClick={() => handleRoleSwitch(r.key)}
                                        className={`relative flex items-center justify-center gap-2 h-11 rounded-xl text-[13px] font-bold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400 ${
                                            isActive
                                                ? `${r.accentTab} shadow-lg`
                                                : `text-slate-500 hover:text-slate-800 hover:bg-white/60`
                                        }`}
                                        aria-pressed={isActive}
                                        aria-label={`Login as ${r.label}`}
                                    >
                                        <Icon size={15} strokeWidth={2.5} />
                                        {r.label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* ── Header ── */}
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-3">
                                {(() => {
                                    const Icon = role.icon;
                                    return <Icon size={28} className={role.accentTabText} strokeWidth={2.5} />;
                                })()}
                                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                                    {role.title}
                                </h2>
                            </div>
                            <p className="text-slate-500 text-[15px] font-medium pl-1">{role.subtitle}</p>

                            {/* Admin-only warning badge */}
                            {activeRole === "admin" && (
                                <div className={`inline-flex items-center gap-2 mt-2 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-widest ring-1 ${role.accentBadge}`}>
                                    <KeyRound size={12} strokeWidth={3} />
                                    Admin access only — provisioned accounts
                                </div>
                            )}
                            {activeRole === "agent" && (
                                <div className={`inline-flex items-center gap-2 mt-2 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-widest ring-1 ${role.accentBadge}`}>
                                    <Briefcase size={12} strokeWidth={3} />
                                    Authorised agents only
                                </div>
                            )}
                        </div>

                        {/* ── Form ── */}
                        <form onSubmit={handleSubmit} className="space-y-5" noValidate>

                            {/* Email */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-0.5">
                                    Email Address
                                </label>
                                <div className={`relative flex items-center border-2 rounded-2xl bg-slate-50 transition-all focus-within:bg-white ${getBorderClass('email')}`}>
                                    <div className="absolute left-4 text-slate-400 pointer-events-none">
                                        <Mail size={18} strokeWidth={2.5} />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        onKeyDown={(e) => handleKeyDown(e, 'email')}
                                        className="w-full h-[52px] bg-transparent pl-11 pr-4 text-slate-900 font-semibold text-[15px] outline-none placeholder:text-slate-300 rounded-2xl"
                                        placeholder={role.emailPlaceholder}
                                        autoComplete="email"
                                        autoFocus
                                    />
                                </div>
                                {role.emailHint && !errors.email && (
                                    <p className="text-[11px] text-slate-400 font-medium pl-1 mt-1">{role.emailHint}</p>
                                )}
                                {errors.email && (
                                    <p className="text-[11px] text-red-500 font-semibold pl-1 mt-1 flex items-center gap-1">
                                        <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-0.5">
                                        Password
                                    </label>
                                    <Link
                                        to="/forgot-password"
                                        className={`text-[11px] font-bold hover:underline transition-colors ${role.accentTabText}`}
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className={`relative flex items-center border-2 rounded-2xl bg-slate-50 transition-all focus-within:bg-white ${getBorderClass('password')}`}>
                                    <div className="absolute left-4 text-slate-400 pointer-events-none">
                                        <Lock size={18} strokeWidth={2.5} />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        onKeyDown={(e) => handleKeyDown(e, 'password')}
                                        className="w-full h-[52px] bg-transparent pl-11 pr-12 text-slate-900 font-semibold text-[15px] outline-none placeholder:text-slate-300 rounded-2xl"
                                        placeholder="Min. 8 characters"
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 text-slate-400 hover:text-slate-600 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <EyeOff size={18} strokeWidth={2.5} /> : <Eye size={18} strokeWidth={2.5} />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-[11px] text-red-500 font-semibold pl-1 mt-1 flex items-center gap-1">
                                        <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Remember me + Admin 2FA placeholder */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2.5 cursor-pointer select-none group">
                                    <input
                                        type="checkbox"
                                        id="remember"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="w-[18px] h-[18px] rounded-md border-2 border-slate-300 cursor-pointer accent-current"
                                    />
                                    <span className="text-[13px] font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                                        Remember me
                                    </span>
                                </label>

                                {/* Admin 2FA notice */}
                                {activeRole === "admin" && (
                                    <span className="text-[11px] text-slate-400 font-semibold bg-slate-100 px-2.5 py-1 rounded-lg">
                                        2FA coming soon
                                    </span>
                                )}
                            </div>

                            {/* CAPTCHA after 3 failed attempts */}
                            {failedAttempts >= 3 && failedAttempts < 5 && (
                                <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 flex items-center justify-between">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            id="captcha"
                                            checked={captchaVerified}
                                            onChange={(e) => setCaptchaVerified(e.target.checked)}
                                            className="w-5 h-5 rounded-sm border-2 border-slate-300 cursor-pointer"
                                        />
                                        <span className="text-sm font-bold text-slate-700">I am not a robot</span>
                                    </label>
                                    <div className="flex flex-col items-center">
                                        <ShieldCheck size={22} className={captchaVerified ? "text-emerald-500" : "text-slate-300"} />
                                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">reCAPTCHA</span>
                                    </div>
                                </div>
                            )}

                            {/* Account locked */}
                            {failedAttempts >= 5 && (
                                <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-200 text-red-600 text-[13px] font-bold text-center">
                                    Too many failed attempts. Account locked for 15 minutes.
                                </div>
                            )}

                            {/* Submit CTA */}
                            <button
                                type="submit"
                                disabled={isLoading || !isFormValid || failedAttempts >= 5}
                                className={`w-full h-[54px] rounded-2xl text-white text-[15px] font-bold shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 mt-2 ${role.accent}`}
                            >
                                {isLoading ? (
                                    <><Loader2 size={18} className="animate-spin" /> Signing in...</>
                                ) : (
                                    <>{role.buttonLabel} <ArrowRight size={18} strokeWidth={2.5} /></>
                                )}
                            </button>
                        </form>

                        {/* Footer link */}
                        <p className="text-center text-slate-500 font-medium text-[13px] pt-2">
                            {activeRole === "admin" ? (
                                <>Need access? <Link to="/admin/request-access" className="text-slate-800 font-bold hover:underline">Request Access</Link></>
                            ) : activeRole === "agent" ? (
                                <>Not an agent yet? <Link to="/agent/apply" className="text-[#134e8d] font-bold hover:underline">Apply to join</Link></>
                            ) : (
                                <>Don't have an account? <Link to="/register" className="text-emerald-600 font-bold hover:underline">Register Now</Link></>
                            )}
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Login;
