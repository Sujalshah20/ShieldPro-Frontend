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
    
    // Mock data if state is missing (for testing)
    const policy = state?.policy || {
        policyName: "Health Shield Plus",
        policyNumber: "SS-HEA-2024-9842",
        coverageAmount: 500000,
        premiumAmount: 450,
        paymentMode: "Auto-pay Enabled"
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.6, staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
            {/* Minimalist Header */}
            <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 md:px-12 sticky top-0 z-50">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-[#002b45] rounded-lg flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform">
                        <Shield size={22} strokeWidth={2.5} className="text-[#134e8d]" />
                    </div>
                    <span className="text-xl font-bold text-[#002b45] tracking-tight">Secure <span className="text-[#134e8d]">Shield</span></span>
                </Link>
                <div className="flex items-center gap-6">
                    <button className="flex items-center gap-4 p-1 pl-4 bg-slate-50 border border-slate-100 rounded-full hover:shadow-md transition-all group">
                        <span className="text-[11px] font-black text-black uppercase tracking-widest group-hover:text-[#134e8d] italic">IDENT_VERIFIED</span>
                        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white shadow-inner font-black italic">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                    </button>
                </div>
            </header>

            <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-12 md:py-16">
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col items-center"
                >
                    {/* Success Icon */}
                    <motion.div 
                        variants={itemVariants}
                        className="w-24 h-24 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center text-emerald-500 mb-8 border border-emerald-100 shadow-xl shadow-emerald-500/10"
                    >
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center animate-pulse-slow">
                            <Check size={40} strokeWidth={3} />
                        </div>
                    </motion.div>

                    {/* Congratulation text */}
                    <motion.div variants={itemVariants} className="text-center space-y-4 mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-[#002b45] tracking-tight">
                    Congratulations! Your Policy is Active.
                </h1>
                        <p className="text-black font-black uppercase tracking-[3px] text-[13px] opacity-40 max-w-2xl mx-auto leading-relaxed italic">
                            Your health coverage is now live. We've sent a detailed confirmation and the policy kit to your registered email address. NODE_STATUS: SYNC_STABLE.
                        </p>
                    </motion.div>

                    {/* Cards Grid */}
                    <div className="grid lg:grid-cols-12 gap-8 w-full items-start">
                        {/* Purchase Summary Card */}
                        <motion.div variants={itemVariants} className="lg:col-span-7 bg-white p-10 rounded-[2rem] border border-slate-100 shadow-2xl shadow-slate-200/50 relative overflow-hidden h-full">
                            <div className="flex items-center justify-between mb-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-[#134e8d]/10 rounded-xl flex items-center justify-center text-[#134e8d]">
                                        <FileText size={24} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-[#002b45]">Purchase Summary</h2>
                                </div>
                                <div className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-[11px] font-black uppercase tracking-widest rounded-full border border-emerald-100 animate-pulse">
                                    ACTIVE
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="flex justify-between items-end border-b border-slate-50 pb-8">
                                    <div>
                                        <p className="text-[10px] text-black opacity-30 font-black uppercase tracking-[4px] mb-1 italic">POLICY NAME</p>
                                        <h3 className="text-2xl font-black text-black italic uppercase italic tracking-tighter">{policy.policyName}</h3>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-black opacity-30 font-black uppercase tracking-[4px] mb-1 italic">POLICY NUMBER</p>
                                        <p className="font-black text-black text-[13px] uppercase tracking-widest">{policy.policyNumber}</p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div>
                                        <p className="text-[10px] text-black opacity-30 font-black uppercase tracking-[4px] mb-1 italic">COVERAGE AMOUNT</p>
                                        <p className="text-3xl font-black text-black italic tracking-tighter">₹{policy.coverageAmount?.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-black opacity-30 font-black uppercase tracking-[4px] mb-1 italic">PREMIUM PAID</p>
                                        <p className="text-3xl font-black text-black italic tracking-tighter">₹{policy.premiumAmount?.toLocaleString()} <span className="text-sm font-black text-black opacity-20 tracking-normal italic">/ month</span></p>
                                    </div>
                                </div>

                                <div className="bg-[#f0f9ff] p-8 rounded-3xl border border-blue-50 flex flex-col md:flex-row justify-between gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-black shadow-sm border border-slate-50">
                                            <Calendar size={20} strokeWidth={3} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-black opacity-30 font-black uppercase tracking-widest italic leading-none">START DATE</p>
                                            <p className="font-black text-black text-sm italic">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-right">
                                        <div>
                                            <p className="text-[10px] text-black opacity-30 font-black uppercase tracking-widest italic leading-none">PAYMENT MODE</p>
                                            <p className="font-black text-black text-sm italic">{policy.paymentMode || 'Auto-pay Enabled'}</p>
                                        </div>
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-black shadow-sm border border-slate-50">
                                            <CreditCard size={20} strokeWidth={3} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* What Happens Next Section */}
                        <motion.div variants={itemVariants} className="lg:col-span-5 flex flex-col gap-6 h-full">
                            <div className="bg-white/50 backdrop-blur-xl p-10 rounded-[2rem] border border-white shadow-xl flex-1 flex flex-col">
                                <h4 className="text-[11px] font-black uppercase tracking-[5px] text-black opacity-30 mb-8 border-b border-slate-100 pb-4 italic">
                                    WHAT HAPPENS NEXT?
                                </h4>
                                <div className="space-y-10 flex-1">
                                    {[
                                        { icon: Mail, title: "Welcome Kit via Email", desc: "Check your inbox for a comprehensive guide on your benefits and how to file a claim.", color: "bg-blue-600" },
                                        { icon: UserCheck, title: "Physical Member Card", desc: "Your physical health card will be dispatched via courier and will reach you in 5-7 working days.", color: "bg-[#002b45]" },
                                        { icon: Shield, title: "Agent Contact", desc: "A dedicated relationship manager will call you within 24 hours to explain your policy details.", color: "bg-[#0b4870]" }
                                    ].map((step, i) => (
                                        <div key={i} className="flex gap-6 group">
                                            <div className={`w-12 h-12 ${step.color} rounded-xl flex items-center justify-center text-white font-bold shadow-lg shrink-0 group-hover:scale-110 transition-transform`}>
                                                {i + 1}
                                            </div>
                                            <div className="space-y-1">
                                                <h5 className="font-black text-black leading-none mb-1 text-sm italic uppercase tracking-tighter">{step.title}</h5>
                                                <p className="text-black opacity-40 text-[11px] font-black leading-relaxed italic">{step.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Need Help Box */}
                            <div className="bg-[#134e8d] p-8 rounded-[2rem] text-white space-y-4 shadow-2xl shadow-blue-900/20 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-150 transition-transform duration-1000">
                                    <Phone size={120} />
                                </div>
                                <div className="space-y-2 relative z-10">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-blue-200">NEED HELP?</p>
                                    <h5 className="text-lg font-bold leading-snug">Our support team is available 24/7 for you.</h5>
                                </div>
                                <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/10 relative z-10 hover:bg-white/20 transition-all cursor-pointer">
                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#134e8d]">
                                        <Phone size={20} />
                                    </div>
                                    <span className="text-xl font-black tracking-tight">1800-456-7890</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Final Action Buttons */}
                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 mt-16 w-full max-w-2xl">
                        <button className="h-16 flex-1 bg-[#002b45] text-white rounded-2xl flex items-center justify-center gap-4 hover:bg-[#0da371] hover:translate-y-[-2px] transition-all shadow-xl shadow-[#002b45]/10 group p-4">
                            <FileText size={22} className="group-hover:rotate-6 transition-transform" />
                            <div className="text-left leading-none">
                                <p className="text-sm font-bold">Download Policy</p>
                                <p className="text-[10px] opacity-70 font-semibold mt-1 uppercase tracking-tighter">Document PDF</p>
                            </div>
                        </button>
                        <button 
                            onClick={() => navigate("/customer")}
                            className="h-16 flex-1 bg-white text-[#002b45] border-2 border-[#002b45]/10 rounded-2xl flex items-center justify-center font-bold hover:bg-slate-50 hover:border-slate-200 hover:translate-y-[-2px] transition-all shadow-lg"
                        >
                            Go to My Dashboard
                        </button>
                    </motion.div>
                </motion.div>
            </main>

            {/* Footer */}
            <footer className="py-10 border-t border-slate-100 bg-white/50 backdrop-blur-md mt-auto">
                <div className="max-w-7xl mx-auto px-12 flex flex-col md:flex-row justify-between items-center gap-8 text-black opacity-30 text-[10px] font-black uppercase tracking-[5px] italic">
                    <p>© 2024 Secure Shield Insurance. All rights reserved.</p>
                    <div className="flex gap-12">
                        <Link to="#" className="hover:text-[#134e8d] transition-colors">Privacy_Protocol</Link>
                        <Link to="#" className="hover:text-[#134e8d] transition-colors">Term_Terms</Link>
                        <Link to="#" className="hover:text-[#134e8d] transition-colors">Signal_Node_Support</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default CheckoutSuccessPage;
