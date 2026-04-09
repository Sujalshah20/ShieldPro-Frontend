import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { 
    Check, FileText, LayoutDashboard, Phone, 
    Bell, User, Shield, CreditCard, Calendar, 
    ArrowRight, Mail, UserCheck
} from "lucide-react";
import { motion } from "framer-motion";

import { useAuth } from "../../context/AuthContext";

const CheckoutSuccessPage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const policy = state?.policy || {
        policyName: "Policy Confirmed",
        policyNumber: "SP-" + Math.floor(100000 + Math.random() * 900000),
        coverageAmount: 0,
        premiumAmount: 0,
        paymentId: "PAY_" + Math.floor(100000 + Math.random() * 900000)
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-[#fcfdfe] flex flex-col font-sans text-slate-900">
            {/* Elegant Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
                <div className="max-w-5xl mx-auto h-16 px-6 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-[#0c2e59] rounded-lg flex items-center justify-center text-white shadow-sm">
                            <Shield size={18} strokeWidth={2.5} />
                        </div>
                        <span className="text-base font-bold tracking-tight text-slate-800">ShieldPro</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100 shadow-sm">
                        <div className="w-5 h-5 bg-[#0c2e59] rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                            {user?.name?.charAt(0)}
                        </div>
                        <span className="text-[11px] font-bold text-slate-600">{user?.name}</span>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-12 md:py-20 lg:py-24">
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col items-center"
                >
                    {/* Centered Success Hero */}
                    <div className="text-center mb-16">
                        <motion.div 
                            variants={itemVariants}
                            className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-6 shadow-sm border border-emerald-100/50"
                        >
                            <Check size={28} strokeWidth={3} />
                        </motion.div>
                        <motion.h1 
                            variants={itemVariants} 
                            className="text-3xl md:text-4xl font-black text-slate-900 mb-4"
                        >
                            Payment Successful!
                        </motion.h1>
                        <motion.p 
                            variants={itemVariants} 
                            className="text-slate-500 text-sm max-w-lg mx-auto leading-relaxed"
                        >
                            Your policy is now active. We've sent your official protection kit and tax receipt to <span className="text-slate-900 font-bold">{user?.email}</span>.
                        </motion.p>
                    </div>

                    {/* Information Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-stretch">
                        
                        {/* Summary Card */}
                        <motion.div variants={itemVariants} className="lg:col-span-12 xl:col-span-7">
                            <div className="h-full bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200/60 shadow-sm relative overflow-hidden flex flex-col">
                                {/* Subtle Background Design */}
                                <div className="absolute top-0 right-0 p-6 opacity-[0.02] pointer-events-none">
                                    <Shield size={200} strokeWidth={1} />
                                </div>
                                
                                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                                    <div className="flex items-center gap-3.5">
                                        <div className="w-11 h-11 bg-blue-50 text-[#134e8d] rounded-xl flex items-center justify-center border border-blue-100/50">
                                            <FileText size={20} />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold text-slate-900">Policy Activation Summary</h2>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ref ID:</span>
                                                <span className="text-xs font-mono font-bold text-slate-600 uppercase tracking-tighter">
                                                    #{policy.paymentId?.split('_')[1] || policy.paymentId?.slice(-8).toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-emerald-100 shadow-sm">
                                        Status: Enrolled
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                    <div className="space-y-6">
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Selected Plan</p>
                                            <p className="text-base font-bold text-[#0c2e59]">{policy.policyName}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Policy Number</p>
                                            <p className="text-sm font-mono font-bold text-slate-700 border-b border-slate-100 w-fit pb-0.5">{policy.policyNumber}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-6 md:text-right">
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Max Coverage Pool</p>
                                            <p className="text-2xl font-black text-slate-900 tracking-tight">₹{policy.coverageAmount?.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Premium Commitment</p>
                                            <p className="text-2xl font-black text-[#134e8d] tracking-tight">₹{policy.premiumAmount?.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-auto p-5 bg-slate-50/50 rounded-2xl border border-slate-100 flex flex-wrap justify-between items-center gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm shrink-0">
                                            <Calendar size={14} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5 leading-none">Commencement</p>
                                            <p className="font-bold text-slate-800 text-xs">{new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5 leading-none">Security Method</p>
                                            <p className="font-bold text-slate-800 text-xs">Verified Gateway</p>
                                        </div>
                                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm shrink-0">
                                            <CreditCard size={14} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Action List Section */}
                        <motion.div variants={itemVariants} className="lg:col-span-12 xl:col-span-5 flex flex-col gap-5">
                            <div className="bg-white p-8 rounded-[2rem] border border-slate-200/60 shadow-sm flex-1">
                                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[2px] mb-8 pb-3 border-b border-slate-50">
                                    NEXT STEPS
                                </h3>
                                <div className="space-y-6">
                                    {[
                                        { icon: Mail, title: "Policy Kit Arrival", desc: "Check your email for the detailed policy contract." },
                                        { icon: Shield, title: "Risk Consultant", desc: "Orientation call scheduled within 24 hours." },
                                        { icon: UserCheck, title: "Member ID Card", desc: "Physical card dispatched via express courier." }
                                    ].map((step, i) => (
                                        <div key={i} className="flex gap-4 group">
                                            <div className="w-9 h-9 bg-finish-50 border border-slate-100 rounded-lg flex items-center justify-center text-[#0c2e59] text-[13px] font-bold shrink-0 group-hover:bg-blue-50 transition-colors">
                                                {i + 1}
                                            </div>
                                            <div className="pt-0.5">
                                                <h5 className="font-bold text-slate-800 text-sm mb-0.5">{step.title}</h5>
                                                <p className="text-slate-500 text-xs leading-relaxed font-medium">{step.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-[#0c2e59] p-6 rounded-[2rem] text-white flex items-center gap-5 shadow-lg shadow-blue-900/10">
                                <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center text-white shrink-0 border border-white/10">
                                    <Phone size={18} />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-blue-200">24/7 Priority Support</p>
                                    <h4 className="text-lg font-black tracking-tight leading-none italic uppercase">1800-456-7890</h4>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Footer Actions */}
                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mt-16 w-full max-w-xl px-4">
                        <button className="h-12 flex-1 bg-white text-slate-800 border border-slate-200 rounded-xl flex items-center justify-center gap-2.5 hover:bg-slate-50 transition-all font-bold text-[13px] shadow-sm group">
                            <FileText size={16} className="text-slate-400 group-hover:text-blue-500" />
                            Policy Kit (PDF)
                        </button>
                        <button 
                            onClick={() => navigate("/customer")}
                            className="h-12 flex-1 bg-[#134e8d] text-white rounded-xl flex items-center justify-center gap-2 hover:bg-[#0c2e59] transition-all font-bold text-[13px] shadow-md shadow-blue-900/10 group"
                        >
                            My Dashboard
                            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </motion.div>
                </motion.div>
            </main>

            {/* Clean Footer */}
            <footer className="py-12 border-t border-slate-100 bg-white/50">
                <div className="max-w-5xl mx-auto px-6 text-center">
                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest leading-none mb-1">
                        ShieldPro Insurance Group © 2026
                    </p>
                    <p className="text-[10px] text-slate-300 font-medium italic">
                        All financial transactions are secured by end-to-end encryption kernels.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default CheckoutSuccessPage;
