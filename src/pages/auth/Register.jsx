import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Shield, User, Mail, Lock, Phone, Calendar, 
    MapPin, Users, ArrowRight, ArrowLeft, CheckCircle2, 
    AlertCircle, Info, ShieldCheck
} from "lucide-react";
import { z } from "zod";
import Reveal from "../../components/common/Reveal";
import HeroScene from "../../components/3d/HeroScene";

const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters").regex(/[A-Z]/, "Must contain an uppercase letter").regex(/[0-9]/, "Must contain a number"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    dob: z.string().min(1, "Date of Birth is required"),
    gender: z.enum(["Male", "Female", "Other"]),
    address: z.string().min(5, "Address must be at least 5 characters"),
});

const Register = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        dob: "",
        gender: "Male",
        address: "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [passStrength, setPassStrength] = useState(0);

    const navigate = useNavigate();
    const { register } = useAuth();

    // Password strength logic
    useEffect(() => {
        let strength = 0;
        if (formData.password.length >= 8) strength += 25;
        if (/[A-Z]/.test(formData.password)) strength += 25;
        if (/[0-9]/.test(formData.password)) strength += 25;
        if (/[!@#$%^&*]/.test(formData.password)) strength += 25;
        setPassStrength(strength);
    }, [formData.password]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError("");
    };

    const nextStep = () => {
        // Simple validation for current step
        if (step === 1) {
            if (!formData.name || !formData.email || formData.password.length < 8) {
                setError("Please complete all account details correctly.");
                return;
            }
        } else if (step === 2) {
            if (!formData.phone || !formData.dob) {
                setError("Please provide your contact and birth details.");
                return;
            }
        }
        setStep(prev => prev + 1);
        setError("");
    };

    const prevStep = () => setStep(prev => prev - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            registerSchema.parse(formData);
            await register(formData);
            navigate("/login");
        } catch (err) {
            if (err instanceof z.ZodError) {
                setError(err.errors[0].message);
            } else {
                setError(err.message || "An unexpected error occurred.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const renderStep = () => {
        switch(step) {
            case 1:
                return (
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-5"
                    >
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[2px]">Step 1/3: Account Details</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-gold transition-colors" />
                                <input
                                    name="name"
                                    type="text"
                                    placeholder="Full Name"
                                    className="w-full bg-background/50 border border-border rounded-2xl px-12 py-3.5 focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-gold transition-colors" />
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="Email Address"
                                    className="w-full bg-background/50 border border-border rounded-2xl px-12 py-3.5 focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-gold transition-colors" />
                                <input
                                    name="password"
                                    type="password"
                                    placeholder="Secure Password"
                                    className="w-full bg-background/50 border border-border rounded-2xl px-12 py-3.5 focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            {/* Password Strength Meter */}
                            <div className="px-2 pt-1">
                                <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden flex gap-1">
                                    <div 
                                        className={`h-full transition-all duration-500 ${
                                            passStrength <= 25 ? 'bg-red-500 w-1/4' : 
                                            passStrength <= 50 ? 'bg-orange-500 w-2/4' : 
                                            passStrength <= 75 ? 'bg-yellow-500 w-3/4' : 'bg-green-500 w-full'
                                        }`}
                                        style={{ width: `${passStrength}%` }}
                                    />
                                </div>
                                <p className="text-[10px] mt-1.5 font-medium opacity-60 flex items-center gap-1">
                                    <ShieldCheck className="w-3 h-3" />
                                    Security: {passStrength <= 25 ? 'Weak' : passStrength <= 50 ? 'Fair' : passStrength <= 75 ? 'Good' : 'Strong'}
                                </p>
                            </div>
                        </div>
                        <button type="button" onClick={nextStep} className="w-full btn-gold py-4 rounded-2xl flex items-center justify-center gap-2 group">
                            Next Step <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-5"
                    >
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[2px]">Step 2/3: Personal Info</label>
                            <div className="relative group">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-gold transition-colors" />
                                <input
                                    name="phone"
                                    type="tel"
                                    placeholder="Phone Number"
                                    className="w-full bg-background/50 border border-border rounded-2xl px-12 py-3.5 focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="relative group">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-gold transition-colors" />
                                <input
                                    name="dob"
                                    type="date"
                                    className="w-full bg-background/50 border border-border rounded-2xl px-12 py-3.5 focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all"
                                    value={formData.dob}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="relative group">
                                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-gold transition-colors" />
                                <select
                                    name="gender"
                                    className="w-full bg-background/50 border border-border rounded-2xl px-12 py-3.5 focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all appearance-none cursor-pointer"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button type="button" onClick={prevStep} className="w-20 border border-border rounded-2xl flex items-center justify-center hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <button type="button" onClick={nextStep} className="flex-1 btn-gold py-4 rounded-2xl flex items-center justify-center gap-2 group">
                                Continue <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </motion.div>
                );
            case 3:
                return (
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-5"
                    >
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[2px]">Step 3/3: Address</label>
                            <div className="relative group">
                                <MapPin className="absolute left-4 top-4 w-5 h-5 text-slate-400 group-focus-within:text-gold transition-colors" />
                                <textarea
                                    name="address"
                                    placeholder="Full Residential Address"
                                    rows="4"
                                    className="w-full bg-background/50 border border-border rounded-2xl px-12 py-4 focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all resize-none"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button type="button" onClick={prevStep} className="w-20 border border-border rounded-2xl flex items-center justify-center hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <button type="submit" disabled={isLoading} className="flex-1 btn-gold py-4 rounded-2xl flex items-center justify-center gap-2 group">
                                {isLoading ? <div className="w-5 h-5 border-2 border-gold-foreground border-t-transparent rounded-full animate-spin" /> : "Complete Registration"}
                                {!isLoading && <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                            </button>
                        </div>
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen w-full premium-gradient flex items-center justify-center p-4 relative overflow-hidden bg-transparent-overlay">
            <HeroScene />
            <div className="auth-container w-full flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md glass-premium gradient-border-animate p-8 sm:p-10 rounded-[32px] relative overflow-visible shadow-2xl"
                >
                    <div className="relative z-10 text-center">
                        <Reveal width="100%" direction="down">
                            <motion.div
                                initial={{ scale: 0.8, rotate: -10 }}
                                animate={{ scale: 1, rotate: 0 }}
                                className="flex justify-center mb-6"
                            >
                                <div className="p-4 bg-gold rounded-3xl shadow-[0_0_40px_rgba(255,184,0,0.3)] border border-gold/50 flex items-center justify-center group pointer-events-none">
                                    <Shield className="w-10 h-10 text-gold-foreground animate-pulse" />
                                </div>
                            </motion.div>

                            <h1 className="text-3xl font-extrabold mb-1 tracking-tight text-foreground">Join ShieldPro</h1>
                            <p className="opacity-60 mb-8 font-medium text-sm">Secure your future in three easy steps</p>
                        </Reveal>

                        {/* Step Indicator */}
                        <div className="flex gap-2 mb-8 justify-center">
                            {[1, 2, 3].map(i => (
                                <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${step >= i ? 'bg-gold w-8' : 'bg-slate-200 dark:bg-white/10 w-4'}`} />
                            ))}
                        </div>

                        <form onSubmit={handleSubmit}>
                            <AnimatePresence mode="wait">
                                {renderStep()}
                            </AnimatePresence>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex items-center gap-3 text-red-600 bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/20 text-xs font-bold mt-5 text-left"
                                >
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    {error}
                                </motion.div>
                            )}
                        </form>

                        <Reveal width="100%" delay={0.4} direction="up">
                            <p className="mt-8 opacity-60 text-sm font-medium">
                                Already have a policy?{" "}
                                <Link to="/login" className="text-blue-600 font-bold hover:underline">
                                    Sign In
                                </Link>
                            </p>
                        </Reveal>
                    </div>
                </motion.div>
            </div>

            {/* Verification Step Indicator (Mock UI Suggestion) */}
            <div className="fixed bottom-6 right-6 hidden md:block">
                <div className="glass-premium p-4 rounded-2xl flex items-center gap-3 border border-border max-w-xs shadow-xl animate-bounce-subtle">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 font-bold">
                        <Info className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Note</p>
                        <p className="text-xs font-medium opacity-80">Full profiles get 10% faster claim approvals.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
