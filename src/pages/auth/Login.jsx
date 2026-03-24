import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
    Shield, Mail, Lock, Eye, EyeOff, 
    Chrome, Activity, Zap, ShieldCheck, Loader2, ArrowRight, Facebook
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../hooks/use-toast";
import Reveal from "../../components/common/Reveal";
import loginIllustration from "../../assets/login_security_illustration.png";
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { api } from "../../utils/api";

const CustomGoogleLoginButton = ({ onSuccess, onError }) => {
    const login = useGoogleLogin({
        onSuccess,
        onError
    });
    return (
        <button 
            type="button" 
            onClick={() => login()}
            className="flex-1 h-14 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-center gap-4 text-white font-bold text-sm hover:bg-slate-50 hover:border-[#134e8d]/20 transition-all group"
        >
            <Chrome size={20} className="text-slate-400 group-hover:text-[#134e8d] transition-colors" />
            Google
        </button>
    );
};

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [failedAttempts, setFailedAttempts] = useState(0);
    const [errors, setErrors] = useState({});
    const [captchaVerified, setCaptchaVerified] = useState(false);
    
    const { login, setAuthData } = useAuth(); // Assuming setAuthData exists or we add it later
    const navigate = useNavigate();
    const { toast } = useToast();

    // Validation Rules
    const validateField = (name, value) => {
        let error = "";
        switch (name) {
            case "email":
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    error = "Please enter a valid email address.";
                } else if ((value.match(/@/g) || []).length > 1) {
                    error = "Only one @ allowed.";
                } else if (/\s/.test(value)) {
                    error = "No spaces allowed in email.";
                }
                break;
            case "password":
                if (value.length < 8) {
                    error = "Password must be at least 8 characters.";
                }
                break;
            default:
                break;
        }
        return error;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // Stop typing immediately for hard limits
        if (name === "password" && value.length > 20) return;

        setFormData(prev => ({ ...prev, [name]: value }));
        
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleKeyDown = (e, field) => {
        const allowedControls = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Enter'];
        if (allowedControls.includes(e.key) || e.ctrlKey || e.metaKey) return;

        switch (field) {
            case "email":
                if (e.key === ' ') {
                    e.preventDefault();
                    toast({ title: 'Invalid Input', description: 'Email cannot contain spaces', variant: 'destructive' });
                }
                break;
            case "password":
                if (formData.password.length >= 20 && e.key.length === 1) {
                    e.preventDefault();
                    toast({ title: 'Limit Exceeded', description: 'Password maximum 20 characters allowed', variant: 'destructive' });
                }
                break;
            default:
                break;
        }
    };

    const getOuterClass = (fieldName) => {
        const value = formData[fieldName];
        if (!value) return "border-slate-50 focus:border-[#134e8d]/20";
        if (errors[fieldName]) return "border-red-400 focus:border-red-500";
        return "border-emerald-500 focus:border-emerald-600";
    };

    const isFormValid = 
        Object.values(errors).every(err => err === "") &&
        formData.email.trim() !== "" &&
        formData.password !== "" &&
        (failedAttempts < 3 || captchaVerified);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!isFormValid || isLoading) return;

        setIsLoading(true);
        try {
            const user = await login(formData.email.trim(), formData.password, rememberMe);
            setFailedAttempts(0);
            toast({ 
                title: "Login Successful", 
                description: "Welcome back to Secure Shield.",
                variant: "default"
            });
            
            setTimeout(() => {
                if (user.role === 'admin') navigate('/admin');
                else if (user.role === 'agent') navigate('/agent');
                else navigate('/customer');
            }, 500);
        } catch (error) {
            const newAttempts = failedAttempts + 1;
            setFailedAttempts(newAttempts);
            
            const msg = error.response?.data?.message || "Invalid email or password. Please try again.";
            let description = msg;

            if (msg.toLowerCase().includes('not found')) {
                description = "No account found with this email. Please register first.";
            } else if (msg.toLowerCase().includes('lock')) {
                 description = msg;
            } else {
                 if (newAttempts < 5) {
                     description = `${msg} You have ${5 - newAttempts} attempts remaining.`;
                 } else {
                     description = "Too many failed attempts. Account locked for 15 minutes.";
                 }
            }

            toast({ 
                title: "Login Failed", 
                description, 
                variant: "destructive" 
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleOAuthSuccess = async (provider, response) => {
        try {
            setIsLoading(true);
            const { data } = await api.post(`/auth/oauth`, { provider, token: response.access_token || response.accessToken });
            
            // Need to update auth context directly since we bypassed login()
            // We'll trust that navigating will trigger a session check or we set local user
            if (setAuthData) setAuthData(data);
            
            toast({ title: "Login Successful", description: `Logged in via ${provider}` });
            setTimeout(() => {
                if (data.role === 'admin') navigate('/admin');
                else if (data.role === 'agent') navigate('/agent');
                else navigate('/customer');
            }, 500);
        } catch (error) {
            toast({ 
                title: `${provider} Login Failed`, 
                description: error.response?.data?.message || `Failed to authenticate with ${provider}.`,
                variant: "destructive" 
            });
        } finally {
            setIsLoading(false);
        }
    };

    const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "mock-client-id.apps.googleusercontent.com";
    const FACEBOOK_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID || "mock-app-id";

    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center p-4 md:p-10 selection:bg-[#10b981] selection:text-white font-sans">
                 <div className="w-full max-w-7xl flex flex-col lg:grid lg:grid-cols-12 shadow-2xl rounded-[3.5rem] overflow-hidden bg-white min-h-[90vh]">
                    
                    {/* Left Panel: Branding & Features */}
                    <div className="hidden lg:flex lg:col-span-4 bg-[#124C89] p-12 flex-col justify-between text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 blur-[100px] rounded-full -mr-40 -mt-40" />
                        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/5 blur-[80px] rounded-full -ml-20 -mb-20" />
                        
                        <div className="relative z-10">
                            <Link to="/" className="w-16 h-16 bg-white/5 backdrop-blur-xl rounded-[1.2rem] flex items-center justify-center border border-white/10 mb-12 hover:bg-white/10 transition-all group overflow-hidden">
                                <Shield size={32} className="text-white group-hover:scale-110 transition-transform" strokeWidth={2.5} />
                            </Link>
                            
                            <div className="space-y-12">
                                <Reveal direction="down">
                                    <div className="relative group perspective-1000">
                                        <div className="absolute -inset-8 bg-white/5 blur-[60px] rounded-full opacity-50 group-hover:opacity-80 transition-all" />
                                        <img 
                                            src={loginIllustration} 
                                            alt="Security Visualization" 
                                            className="relative z-10 w-full rounded-3xl shadow-3xl hover:translate-y-[-10px] transition-transform duration-700 pointer-events-none"
                                        />
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
                             © 2024 Secure Shield
                        </div>
                    </div>

                    {/* Right Panel: Login Form */}
                    <div className="flex-1 lg:col-span-8 flex flex-col justify-center items-center py-12 px-8 md:px-20 lg:px-32 relative bg-white overflow-y-auto no-scrollbar">
                        <div className="w-full max-w-xl space-y-10">
                            <div className="space-y-4">
                                 <div className="lg:hidden mb-10 text-center">
                                    <Link to="/" className="inline-flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[#134e8d] rounded-lg flex items-center justify-center text-white">
                                            <Shield size={24} strokeWidth={2.5} />
                                        </div>
                                        <span className="text-2xl font-bold text-white">Secure Shield</span>
                                    </Link>
                                 </div>
                                <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Login</h2>
                                <p className="text-slate-500 text-lg font-medium">Please enter your credentials to access your account.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-widest pl-1">Email Address</label>
                                    <div className="relative">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 transition-colors">
                                            <Mail size={20} strokeWidth={2.5} />
                                        </div>
                                        <input 
                                            type="email" 
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            onKeyDown={(e) => handleKeyDown(e, 'email')}
                                            className={`w-full h-14 bg-slate-50 border-2 rounded-2xl pl-16 pr-6 text-white font-bold text-base outline-none focus:bg-white transition-all placeholder:text-slate-300 ${getOuterClass('email')}`}
                                            placeholder="yourname@example.com"
                                            autoFocus
                                        />
                                    </div>
                                    {errors.email && <p className="text-red-500 text-xs mt-1 pl-2 font-medium">{errors.email}</p>}
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[12px] font-bold text-slate-500 uppercase tracking-widest pl-1">Password</label>
                                        <Link to="/forgot-password" className="text-[11px] font-bold text-[#134e8d] hover:underline uppercase tracking-wider">Forgot Password?</Link>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 transition-colors">
                                            <Lock size={20} strokeWidth={2.5} />
                                        </div>
                                        <input 
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            onKeyDown={(e) => handleKeyDown(e, 'password')}
                                            className={`w-full h-14 bg-slate-50 border-2 rounded-2xl pl-16 pr-16 text-white font-bold text-base outline-none focus:bg-white transition-all placeholder:text-slate-300 ${getOuterClass('password')}`}
                                            placeholder="Min 8 characters"
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={20} strokeWidth={2.5} /> : <Eye size={20} strokeWidth={2.5} />}
                                        </button>
                                    </div>
                                    {errors.password && <p className="text-red-500 text-xs mt-1 pl-2 font-medium">{errors.password}</p>}
                                </div>

                                <div className="flex items-center gap-3">
                                    <input 
                                        type="checkbox" 
                                        id="remember" 
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="w-5 h-5 rounded-lg border-2 border-slate-200 text-[#10b981] transition-all focus:ring-0 cursor-pointer" 
                                    />
                                    <label htmlFor="remember" className="text-sm font-medium text-slate-500 cursor-pointer select-none">Remember me for 30 days</label>
                                </div>

                                {failedAttempts >= 3 && failedAttempts < 5 && (
                                    <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <input 
                                                type="checkbox" 
                                                id="captcha" 
                                                checked={captchaVerified}
                                                onChange={(e) => setCaptchaVerified(e.target.checked)}
                                                className="w-5 h-5 rounded-sm border-2 border-slate-300 text-[#134e8d] focus:ring-0 cursor-pointer" 
                                            />
                                            <label htmlFor="captcha" className="text-sm font-bold text-white cursor-pointer">I am not a robot</label>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <ShieldCheck size={24} className={captchaVerified ? "text-emerald-500 mb-1" : "text-slate-400 mb-1"} />
                                            <span className="text-[10px] text-slate-400 font-bold uppercase">reCAPTCHA</span>
                                        </div>
                                    </div>
                                )}

                                {failedAttempts >= 5 && (
                                    <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-200 text-red-600 text-sm font-bold text-center">
                                        Too many failed attempts. Account locked for 15 minutes.
                                    </div>
                                )}

                                <button 
                                    type="submit"
                                    disabled={isLoading || !isFormValid || failedAttempts >= 5}
                                    className="w-full h-14 bg-[#10b981] text-white rounded-2xl text-[16px] font-bold shadow-xl shadow-emerald-500/20 hover:bg-[#0da371] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                >
                                    {isLoading ? (
                                        <><Loader2 className="animate-spin" /> Logging you in...</>
                                    ) : (
                                        <>Login <ArrowRight size={20} /></>
                                    )}
                                </button>
                            </form>

                            <div className="space-y-6">
                                <div className="relative flex items-center gap-4">
                                    <div className="h-[1px] flex-1 bg-slate-100" />
                                    <div className="text-[11px] font-bold text-slate-300 uppercase tracking-[4px]">Or login with</div>
                                    <div className="h-[1px] flex-1 bg-slate-100" />
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <CustomGoogleLoginButton 
                                        onSuccess={(res) => handleOAuthSuccess('Google', res)} 
                                        onError={() => toast({ title: "Login Failed", description: "Google login failed. Please try again.", variant: "destructive" })}
                                    />
                                    
                                    <FacebookLogin
                                        appId={FACEBOOK_APP_ID}
                                        autoLoad={false}
                                        fields="name,email,picture"
                                        callback={(res) => {
                                            if (res.error || !res.accessToken) {
                                                toast({ title: "Login Failed", description: "Facebook login failed. Please try again.", variant: "destructive" });
                                            } else {
                                                handleOAuthSuccess('Facebook', res);
                                            }
                                        }}
                                        render={renderProps => (
                                            <button 
                                                onClick={renderProps.onClick}
                                                disabled={renderProps.isDisabled}
                                                className="flex-1 h-14 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-center gap-4 text-white font-bold text-sm hover:bg-slate-50 hover:border-[#134e8d]/20 transition-all group"
                                            >
                                                <Facebook size={20} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                                                Facebook
                                            </button>
                                        )}
                                    />
                                </div>

                                <p className="text-center text-slate-500 font-medium text-sm pt-4">
                                    Don't have an account? <Link to="/register" className="text-[#134e8d] font-bold hover:underline">Register Now</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </GoogleOAuthProvider>
    );
};

export default Login;
