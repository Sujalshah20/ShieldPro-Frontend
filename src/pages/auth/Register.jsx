import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
    Shield, CheckCircle2, ArrowRight, Loader2, Eye, EyeOff, Chrome, Facebook
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../hooks/use-toast";
import Reveal from "../../components/common/Reveal";
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
            className="flex-1 h-14 bg-white border-2 border-slate-50 rounded-2xl flex items-center justify-center gap-4 text-black font-bold text-sm hover:bg-slate-50 hover:border-[#134e8d]/20 transition-all group"
        >
            <Chrome size={20} className="text-slate-400 group-hover:text-[#134e8d] transition-colors" />
            Google
        </button>
    );
};

const Register = () => {
    const [formData, setFormData] = useState({
        name: "", email: "", phone: "", password: "", confirmPassword: ""
    });
    const [terms, setTerms] = useState(false);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const { register, setAuthData } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleOAuthSuccess = async (provider, response) => {
        try {
            setIsLoading(true);
            const { data } = await api.post(`/auth/oauth`, { provider, token: response.access_token || response.accessToken });
            
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

    // Password Strength
    const passwordStrength = (password) => {
        if (!password) return { label: '', color: 'bg-transparent', width: 'w-0' };
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/(?=.*[a-z])/.test(password)) strength++;
        if (/(?=.*[A-Z])/.test(password)) strength++;
        if (/(?=.*\d)/.test(password)) strength++;
        if (/(?=.*[@$!%*?&])/.test(password)) strength++;
        
        if (strength <= 2) return { label: 'Weak', color: 'bg-red-500', width: 'w-1/3' };
        if (strength <= 4) return { label: 'Medium', color: 'bg-yellow-500', width: 'w-2/3' };
        return { label: 'Strong', color: 'bg-emerald-500', width: 'w-full' };
    };

    const pStrength = passwordStrength(formData.password);

    // Validation Rules
    const validateField = (name, value) => {
        let error = "";
        switch (name) {
            case "name":
                if (value.trim().length < 3 || value.trim().length > 50) {
                    error = "Full Name must be between 3 and 50 characters.";
                } else if (!/^[a-zA-Z\s]*$/.test(value)) {
                    error = "Name can only contain letters and spaces.";
                }
                break;
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
            case "phone":
                if (!/^[0-9]{10}$/.test(value)) error = "Mobile number must be exactly 10 digits.";
                break;
            case "password":
                if (value.length < 8 || value.length > 20) {
                    error = "Password must be 8-20 characters.";
                } else if (!/(?=.*[a-z])/.test(value)) {
                    error = "Include at least 1 lowercase letter.";
                } else if (!/(?=.*[A-Z])/.test(value)) {
                    error = "Include at least 1 uppercase letter.";
                } else if (!/(?=.*\d)/.test(value)) {
                    error = "Include at least 1 number.";
                } else if (!/(?=.*[@$!%*?&])/.test(value)) {
                    error = "Include at least 1 special character (@, $, !, %, *, ?, &)";
                }
                break;
            case "confirmPassword":
                if (value !== formData.password) error = "Passwords do not match.";
                break;
            default:
                break;
        }
        return error;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // Stop typing immediately for hard limits
        if (name === "name" && value.length > 50) return;
        if (name === "phone" && value.length > 10) return;
        if (name === "password" && value.length > 20) return;

        setFormData(prev => ({ ...prev, [name]: value }));
        
        const error = validateField(name, value);
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));

        // Cross-revalidation for confirmPassword
        if (name === 'password' && formData.confirmPassword) {
             const confirmError = value !== formData.confirmPassword ? "Passwords do not match." : "";
             setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
        }
    };

    const handleKeyDown = (e, field) => {
        const allowedControls = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Enter'];
        if (allowedControls.includes(e.key) || e.ctrlKey || e.metaKey) return;

        switch (field) {
            case "name":
                if (!/^[a-zA-Z\s]$/.test(e.key)) {
                    e.preventDefault();
                    toast({ title: 'Invalid Character', description: 'Name can only contain letters and spaces', variant: 'destructive' });
                }
                break;
            case "phone":
                if (!/^[0-9]$/.test(e.key)) {
                    e.preventDefault();
                    toast({ title: 'Invalid Input', description: 'Only numbers are allowed', variant: 'destructive' });
                }
                if (formData.phone.length >= 10 && e.key.length === 1) {
                    e.preventDefault();
                    toast({ title: 'Limit Exceeded', description: 'Mobile number must be exactly 10 digits', variant: 'destructive' });
                }
                break;
            case "email":
                if (e.key === ' ') {
                    e.preventDefault();
                    toast({ title: 'Invalid Input', description: 'Email cannot contain spaces', variant: 'destructive' });
                }
                break;
            case "password":
                if (formData.password.length >= 20 && e.key.length === 1) {
                    e.preventDefault();
                    toast({ title: 'Limit Exceeded', description: 'Maximum 20 characters allowed', variant: 'destructive' });
                }
                break;
            default:
                break;
        }
    };

    const handlePaste = (e, field) => {
        const paste = (e.clipboardData || window.clipboardData).getData('text');
        let isValid = true;
        switch(field) {
            case 'name':
                if (!/^[a-zA-Z\s]+$/.test(paste)) isValid = false;
                break;
            case 'phone':
                if (!/^\d+$/.test(paste)) isValid = false;
                break;
            case 'email':
                if (/\s/.test(paste)) isValid = false;
                break;
            default:
                break;
        }
        if (!isValid) {
            e.preventDefault();
            toast({ title: 'Invalid Paste', description: 'The pasted text contains invalid characters.', variant: 'destructive' });
        }
    };

    // Determine field borders based on validity
    const getOuterClass = (fieldName) => {
        const value = formData[fieldName];
        if (!value) return "border-slate-50 focus:border-[#134e8d]/20";
        if (errors[fieldName]) return "border-red-400 focus:border-red-500";
        return "border-emerald-500 focus:border-emerald-600";
    };

    const isFormValid = 
        Object.values(errors).every(err => err === "") &&
        Object.values(formData).every(val => val.trim() !== "") &&
        terms;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Prevent double submit manually or trim check
        if (!isFormValid || isLoading) return;

        // Submitting with trimmed data
        const submitData = {
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            password: formData.password
        };

        setIsLoading(true);
        try {
            await register(submitData);
            toast({ 
                title: "OTP Sent", 
                description: "A 6-digit verification code has been sent to your email.",
                variant: 'default'
            });
            setTimeout(() => {
                navigate(`/verify-email?email=${encodeURIComponent(formData.email.trim())}&type=verification`);
            }, 1000);
        } catch (error) {
            // Check if it's existing email error based on backend message
            const msg = error.response?.data?.message || "There was an error creating your account.";
            if (msg.includes('exists')) {
                 toast({ 
                     title: "Registration Failed", 
                     description: "This email is already registered. Please login instead.", 
                     variant: "destructive" 
                 });
            } else {
                 toast({ 
                     title: "Registration Failed", 
                     description: msg, 
                     variant: "destructive" 
                 });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center p-4 md:p-10 selection:bg-[#10b981] selection:text-white">
            <div className="w-full max-w-6xl flex flex-col lg:grid lg:grid-cols-12 shadow-2xl rounded-[3rem] overflow-hidden bg-white min-h-[85vh]">
                
                {/* Left Panel: Aesthetic Section */}
                <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-[#002b45] to-[#134e8d] p-16 flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 blur-[100px] rounded-full -mr-40 -mt-40" />
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/5 blur-[80px] rounded-full -ml-20 -mb-20" />
                    
                    <div className="relative z-10 space-y-8">
                        <Link to="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white border border-white/20">
                                <Shield size={24} strokeWidth={2.5} />
                            </div>
                            <span className="text-2xl font-bold text-white tracking-tight">Secure Shield</span>
                        </Link>
                        
                        <div className="pt-10">
                            <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6">
                                Join India's Most Trusted Network
                            </h2>
                            <p className="text-white/70 text-lg font-medium">
                                Secure your future and protect your loved ones with our comprehensive insurance solutions.
                            </p>
                        </div>
                    </div>

                    <div className="relative z-10 space-y-6">
                        {[
                            { title: "Quick & Easy Paperwork", desc: "100% digital process, no physical documents needed." },
                            { title: "Instant Policies", desc: "Receive your policy instantly in your email." },
                            { title: "Dedicated Support", desc: "Our experts are available 24/7 to assist you." }
                        ].map((item, i) => (
                            <Reveal key={i} direction="up" delay={0.1 * i}>
                                <div className="flex items-start gap-4 p-5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 group hover:bg-white/10 transition-all cursor-default">
                                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-emerald-400 shrink-0">
                                        <CheckCircle2 size={20} strokeWidth={3} />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-sm mb-1">{item.title}</h4>
                                        <p className="text-white/50 text-[12px] font-medium leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>

                    <div className="relative z-10 pt-10">
                         <p className="text-white/30 text-[12px] font-bold uppercase tracking-widest">© 2024 Secure Shield Insurance</p>
                    </div>
                </div>

                {/* Right Panel: Registration Form */}
                <div className="flex-1 lg:col-span-7 p-8 md:p-16 bg-white overflow-y-auto no-scrollbar">
                    <div className="max-w-xl mx-auto space-y-8">
                        <div className="space-y-2">
                             <div className="lg:hidden mb-10">
                                <Link to="/" className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-[#134e8d] rounded-lg flex items-center justify-center text-white">
                                        <Shield size={20} strokeWidth={2.5} />
                                    </div>
                                    <span className="text-xl font-bold text-black">Secure Shield</span>
                                </Link>
                             </div>
                            <h1 className="text-4xl font-extrabold text-black tracking-tight">Create Account</h1>
                            <p className="text-black font-medium text-sm">Please fill in your details to get started.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[12px] font-bold text-black uppercase tracking-widest pl-1">Full Name</label>
                                <input 
                                    name="name" 
                                    value={formData.name} 
                                    onChange={handleInputChange}
                                    onKeyDown={(e) => handleKeyDown(e, 'name')}
                                    onPaste={(e) => handlePaste(e, 'name')}
                                    autoFocus
                                    className={`w-full h-14 bg-slate-50 border-2 rounded-2xl px-6 text-black font-bold text-sm bg-transparent transition-all outline-none ${getOuterClass('name')}`}
                                    placeholder="Enter your full name" 
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1 pl-2 font-medium">{errors.name}</p>}
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[12px] font-bold text-black uppercase tracking-widest pl-1">Email Address</label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    value={formData.email} 
                                    onChange={handleInputChange}
                                    onKeyDown={(e) => handleKeyDown(e, 'email')}
                                    onPaste={(e) => handlePaste(e, 'email')}
                                    className={`w-full h-14 bg-slate-50 border-2 rounded-2xl px-6 text-black font-bold text-sm bg-transparent transition-all outline-none ${getOuterClass('email')}`}
                                    placeholder="yourname@example.com" 
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1 pl-2 font-medium">{errors.email}</p>}
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[12px] font-bold text-black uppercase tracking-widest pl-1">Phone Number</label>
                                <input 
                                    name="phone" 
                                    value={formData.phone} 
                                    onChange={handleInputChange}
                                    onKeyDown={(e) => handleKeyDown(e, 'phone')}
                                    onPaste={(e) => handlePaste(e, 'phone')}
                                    className={`w-full h-14 bg-slate-50 border-2 rounded-2xl px-6 text-black font-bold text-sm bg-transparent transition-all outline-none ${getOuterClass('phone')}`}
                                    placeholder="10-digit number" 
                                />
                                {errors.phone && <p className="text-red-500 text-xs mt-1 pl-2 font-medium">{errors.phone}</p>}
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[12px] font-bold text-black uppercase tracking-widest pl-1">Password</label>
                                <div className="relative">
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        name="password" 
                                        value={formData.password} 
                                        onChange={handleInputChange}
                                        onKeyDown={(e) => handleKeyDown(e, 'password')}
                                        className={`w-full h-14 bg-slate-50 border-2 rounded-2xl px-6 pr-16 text-black font-bold text-sm bg-transparent transition-all outline-none ${getOuterClass('password')}`}
                                        placeholder="••••••••" 
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-500 text-xs mt-1 pl-2 font-medium leading-relaxed">{errors.password}</p>}
                                {formData.password.length > 0 && (
                                    <div className="flex items-center gap-3 mt-2 pl-2">
                                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div className={`h-full ${pStrength.width} ${pStrength.color} transition-all duration-300`}></div>
                                        </div>
                                        <span className={`text-[10px] uppercase font-bold ${pStrength.color.replace('bg-', 'text-')}`}>
                                            {pStrength.label}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[12px] font-bold text-slate-500 uppercase tracking-widest pl-1">Confirm Password</label>
                                <div className="relative">
                                    <input 
                                        type={showConfirmPassword ? "text" : "password"} 
                                        name="confirmPassword" 
                                        value={formData.confirmPassword} 
                                        onChange={handleInputChange}
                                        className={`w-full h-14 bg-slate-50 border-2 rounded-2xl px-6 pr-16 text-black font-bold text-sm bg-transparent transition-all outline-none ${getOuterClass('confirmPassword')}`}
                                        placeholder="••••••••" 
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 pl-2 font-medium">{errors.confirmPassword}</p>}
                            </div>

                            <div className="md:col-span-2 flex items-center gap-3 py-2">
                                <input 
                                    type="checkbox" 
                                    id="terms" 
                                    checked={terms}
                                    onChange={(e) => setTerms(e.target.checked)}
                                    className="w-5 h-5 rounded-lg border-2 border-slate-200 text-[#10b981] transition-all focus:ring-0 cursor-pointer" 
                                />
                                <label htmlFor="terms" className="text-[13px] font-medium text-black select-none cursor-pointer">
                                    By registering, I agree to the <a href="#" className="text-[#134e8d] font-bold hover:underline">Terms & Conditions</a>.
                                </label>
                            </div>

                            <div className="md:col-span-2 pt-4">
                                <button 
                                    type="submit"
                                    disabled={isLoading || !isFormValid}
                                    className="w-full h-16 bg-[#10b981] text-white rounded-2xl text-[16px] font-bold shadow-xl shadow-emerald-500/20 hover:bg-[#0da371] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                >
                                    {isLoading ? (
                                        <><Loader2 className="animate-spin" /> Creating Account...</>
                                    ) : (
                                        <>Create Account <ArrowRight size={20} /></>
                                    )}
                                </button>
                                
                                <div className="mt-10 space-y-6">
                                    <div className="relative flex items-center gap-4">
                                        <div className="h-[1px] flex-1 bg-slate-100" />
                                        <div className="text-[11px] font-bold text-slate-300 uppercase tracking-[4px]">Or register with</div>
                                        <div className="h-[1px] flex-1 bg-slate-100" />
                                    </div>

                                    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
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
                                                        className="flex-1 h-14 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-center gap-4 text-black font-bold text-sm hover:bg-slate-50 hover:border-[#134e8d]/20 transition-all group"
                                                    >
                                                        <Facebook size={20} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                                                        Facebook
                                                    </button>
                                                )}
                                            />
                                        </div>
                                    </GoogleOAuthProvider>

                                    <p className="text-center text-black font-medium text-sm pt-4">
                                        Already have an account? <Link to="/login" className="text-[#134e8d] font-bold hover:underline">Log in</Link>
                                    </p>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
