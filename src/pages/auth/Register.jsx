import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
    Shield, CheckCircle2, ArrowRight, Loader2, Eye, EyeOff
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../hooks/use-toast";
import Reveal from "../../components/common/Reveal";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "", email: "", phone: "", password: "", confirmPassword: ""
    });
    const [terms, setTerms] = useState(false);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const { register } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    // Validation Rules
    const validateField = (name, value) => {
        let error = "";
        switch (name) {
            case "name":
                if (value.length < 3) error = "Full Name must be at least 3 characters.";
                break;
            case "email":
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Please enter a valid email address.";
                break;
            case "phone":
                if (!/^[0-9]{10}$/.test(value)) error = "Phone number must be exactly 10 digits.";
                break;
            case "password":
                if (value.length < 8) {
                    error = "Password must be at least 8 characters.";
                } else if (!/(?=.*[a-z])/.test(value)) {
                    error = "Password must include at least 1 lowercase letter.";
                } else if (!/(?=.*[A-Z])/.test(value)) {
                    error = "Password must include at least 1 uppercase letter.";
                } else if (!/(?=.*\d)/.test(value)) {
                    error = "Password must include at least 1 number.";
                } else if (!/(?=.*[@$!%*?&])/.test(value)) {
                    error = "Password must include at least 1 special character (@, #, etc.)";
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
        setFormData(prev => ({ ...prev, [name]: value }));
        
        const error = validateField(name, value);
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));

        // Special case: if password changes, revalidate confirmPassword if it has a value
        if (name === 'password' && formData.confirmPassword) {
             const confirmError = value !== formData.confirmPassword ? "Passwords do not match." : "";
             setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
        }
    };

    const isFormValid = 
        Object.values(errors).every(err => err === "") &&
        Object.values(formData).every(val => val.trim() !== "") &&
        terms;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!isFormValid) return;

        setIsLoading(true);
        try {
            await register({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password
            });
            toast({ 
                title: "Registration Successful", 
                description: "Your account has been created. Please check your email to verify your account." 
            });
            navigate("/login");
        } catch (error) {
            toast({ 
                title: "Registration Failed", 
                description: error.response?.data?.message || "There was an error creating your account.", 
                variant: "destructive" 
            });
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
                                    <span className="text-xl font-bold text-[#002b45]">Secure Shield</span>
                                </Link>
                             </div>
                            <h1 className="text-4xl font-extrabold text-[#002b45] tracking-tight">Create Account</h1>
                            <p className="text-slate-500 font-medium text-sm">Please fill in your details to get started.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[12px] font-bold text-slate-500 uppercase tracking-widest pl-1">Full Name</label>
                                <input 
                                    name="name" value={formData.name} onChange={handleInputChange}
                                    className={`w-full h-14 bg-slate-50 border-2 rounded-2xl px-6 text-[#002b45] font-bold text-sm focus:bg-white transition-all outline-none ${errors.name ? 'border-red-400/50 focus:border-red-500' : 'border-slate-50 focus:border-[#134e8d]/20'}`}
                                    placeholder="Enter your full name" 
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1 pl-2 font-medium">{errors.name}</p>}
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[12px] font-bold text-slate-500 uppercase tracking-widest pl-1">Email Address</label>
                                <input 
                                    type="email" name="email" value={formData.email} onChange={handleInputChange}
                                    className={`w-full h-14 bg-slate-50 border-2 rounded-2xl px-6 text-[#002b45] font-bold text-sm focus:bg-white transition-all outline-none ${errors.email ? 'border-red-400/50 focus:border-red-500' : 'border-slate-50 focus:border-[#134e8d]/20'}`}
                                    placeholder="yourname@example.com" 
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1 pl-2 font-medium">{errors.email}</p>}
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[12px] font-bold text-slate-500 uppercase tracking-widest pl-1">Phone Number</label>
                                <input 
                                    name="phone" value={formData.phone} onChange={handleInputChange}
                                    className={`w-full h-14 bg-slate-50 border-2 rounded-2xl px-6 text-[#002b45] font-bold text-sm focus:bg-white transition-all outline-none ${errors.phone ? 'border-red-400/50 focus:border-red-500' : 'border-slate-50 focus:border-[#134e8d]/20'}`}
                                    placeholder="10-digit number" 
                                />
                                {errors.phone && <p className="text-red-500 text-xs mt-1 pl-2 font-medium">{errors.phone}</p>}
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[12px] font-bold text-slate-500 uppercase tracking-widest pl-1">Password</label>
                                <div className="relative">
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        name="password" value={formData.password} onChange={handleInputChange}
                                        className={`w-full h-14 bg-slate-50 border-2 rounded-2xl px-6 pr-16 text-[#002b45] font-bold text-sm focus:bg-white transition-all outline-none ${errors.password ? 'border-red-400/50 focus:border-red-500' : 'border-slate-50 focus:border-[#134e8d]/20'}`}
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
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[12px] font-bold text-slate-500 uppercase tracking-widest pl-1">Confirm Password</label>
                                <div className="relative">
                                    <input 
                                        type={showConfirmPassword ? "text" : "password"} 
                                        name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange}
                                        className={`w-full h-14 bg-slate-50 border-2 rounded-2xl px-6 pr-16 text-[#002b45] font-bold text-sm focus:bg-white transition-all outline-none ${errors.confirmPassword ? 'border-red-400/50 focus:border-red-500' : 'border-slate-50 focus:border-[#134e8d]/20'}`}
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
                                <label htmlFor="terms" className="text-[13px] font-medium text-slate-500 select-none cursor-pointer">
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
                                
                                <p className="text-center text-slate-500 font-medium text-sm mt-10">
                                    Already have an account? <Link to="/login" className="text-[#134e8d] font-bold hover:underline">Log in</Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
