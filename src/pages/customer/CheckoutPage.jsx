import React, { useState, useContext } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../hooks/use-toast";
import { 
    Shield, Lock, ChevronLeft, 
    CheckCircle, ShieldCheck
} from "lucide-react";
import { motion } from "framer-motion";
import RazorpayPayment from "../../components/payment/RazorpayPayment";

const CheckoutPage = () => {
    const { user } = useContext(AuthContext);
    const queryClient = useQueryClient();
    const { state } = useLocation();
    const navigate = useNavigate();
    const { toast } = useToast();
    
    const policy = state?.policy;
    const applicationId = state?.applicationId;

    if (!policy) {
        return (
            <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mb-6 border border-rose-100 shadow-xl shadow-rose-500/10">
                    <Shield size={40} />
                </div>
                <h3 className="text-3xl font-bold text-black mb-4 tracking-tight">Access Denied</h3>
                <p className="text-black font-black uppercase tracking-widest text-[11px] opacity-40 max-w-md mb-12 italic leading-relaxed">No valid policy selection found. Please navigate back to choose a policy and start the checkout process.</p>
                <button 
                    onClick={() => navigate("/customer")} 
                    className="h-14 px-10 bg-[#002b45] text-white rounded-xl font-bold hover:bg-[#134e8d] hover:translate-y-[-2px] transition-all active:scale-95 shadow-lg shadow-blue-900/20"
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    const handleSuccess = (result) => {
        queryClient.invalidateQueries(["myPolicies"]);
        queryClient.invalidateQueries(["myApplications"]);
        
        // Pass policy details to success page
        navigate("/customer/checkout-success", { 
            state: { 
                policy: {
                    ...policy,
                    policyNumber: result.policyNumber || 'SS-GEN-2024-X123',
                    paymentMode: "Razorpay Secure"
                } 
            } 
        });
    };

    const handleFailure = (error) => {
        toast({
            title: "Payment Failed",
            description: error?.description || error?.message || "Something went wrong during the transaction.",
            variant: "destructive"
        });
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
            {/* Minimalist Header */}
            <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 md:px-12 sticky top-0 z-50">
                <div className="flex items-center gap-8">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-[#002b45] rounded-lg flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform">
                            <Shield size={22} strokeWidth={2.5} />
                        </div>
                        <span className="text-xl font-bold text-black tracking-tight">Secure <span className="text-[#134e8d]">Shield</span></span>
                    </Link>
                    <div className="h-8 w-px bg-slate-100 hidden md:block" />
                    <button 
                        onClick={() => navigate(-1)}
                        className="hidden md:flex items-center gap-2 text-sm font-bold text-black hover:text-[#134e8d] transition-colors"
                    >
                        <ChevronLeft size={18} />
                        Cancel Transaction
                    </button>
                </div>
                <div className="flex items-center gap-6">
                    <div className="hidden sm:flex items-center gap-2 text-emerald-500 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100 text-[11px] font-black uppercase tracking-widest">
                        <CheckCircle size={14} /> Secure Link
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-12 md:py-16">
                <div className="grid lg:grid-cols-12 gap-12 items-start">
                    {/* Left: Summary */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-5 space-y-8"
                    >
                        <div className="bg-white p-10 rounded-[2rem] border border-slate-100 shadow-2xl shadow-slate-200/50">
                            <h2 className="text-sm font-black text-black uppercase tracking-[3px] mb-8 border-b border-slate-50 pb-4">
                                ORDER SUMMARY
                            </h2>
                            
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-3xl font-extrabold text-black leading-none mb-2">{policy.policyName}</h3>
                                    <p className="text-black font-black uppercase text-[10px] tracking-[4px] bg-slate-50 w-fit px-3 py-1 rounded-lg border border-slate-100 italic opacity-60">
                                        {policy.policyType} INSURANCE // NODE_LOCKED
                                    </p>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-slate-50">
                                    <div className="flex justify-between items-center group">
                                        <p className="text-black font-black uppercase tracking-widest text-[9px] opacity-30">Coverage Capacity</p>
                                        <p className="text-black font-extrabold tracking-tight italic">₹{(policy.coverageAmount/100000).toFixed(1)}L</p>
                                    </div>
                                    <div className="flex justify-between items-center group">
                                        <p className="text-black font-black uppercase tracking-widest text-[9px] opacity-30">Policy Duration</p>
                                        <p className="text-black font-extrabold tracking-tight italic">{policy.durationYears} Year</p>
                                    </div>
                                    <div className="flex justify-between items-center pt-6 border-t border-slate-50">
                                        <p className="text-black font-black text-lg">Total Payable</p>
                                        <p className="text-3xl font-black text-[#134e8d] tracking-tighter">₹{policy.premiumAmount.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Security Badge */}
                        <div className="bg-[#134e8d] p-8 rounded-[2rem] text-white flex items-center gap-6 shadow-2xl shadow-blue-900/10">
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                                <Lock size={30} className="text-blue-200" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="font-bold text-lg leading-none">Safe & Secure</h4>
                                <p className="text-white/60 text-[12px] font-medium leading-relaxed">Your payment information is encrypted and processed via secure financial gateways.</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Razorpay Integration */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="lg:col-span-7"
                    >
                        <div className="bg-white p-10 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-[1.5rem] flex items-center justify-center mb-8 shadow-inner">
                                <ShieldCheck size={40} />
                            </div>
                            
                            <h2 className="text-3xl font-black text-black tracking-tight mb-2">Secure Checkout</h2>
                            <p className="text-black opacity-40 text-[11px] font-black uppercase tracking-[4px] mb-12 italic leading-relaxed max-w-sm">
                                Complete your premium payment securely using Razorpay gateway.
                            </p>

                            <div className="w-full max-w-sm space-y-8">
                                <div className="p-8 bg-slate-50 rounded-3xl border border-dashed border-slate-200 space-y-4">
                                    <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                                        <span>Premium Amount</span>
                                        <span>₹{policy?.premiumAmount?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm font-bold text-slate-500 pb-4 border-b border-slate-200">
                                        <span>Platform Fee</span>
                                        <span className="text-emerald-500">Free</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xl font-black text-black pt-2">
                                        <span>Total</span>
                                        <span className="text-[#134e8d]">₹{policy?.premiumAmount?.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4">
                                    <RazorpayPayment 
                                        amount={policy?.premiumAmount} 
                                        onSuccess={handleSuccess} 
                                        onFailure={handleFailure} 
                                    />
                                    
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[3px] italic">
                                        Supports Cards, UPI, Netbanking & Wallets
                                    </p>
                                </div>

                                <div className="flex items-center justify-center gap-3 opacity-30 pt-12 border-t border-slate-50">
                                    <Lock size={14} />
                                    <span className="text-[9px] font-bold uppercase tracking-[4px] text-black">PCI DSS Compliant Infrastructure</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Simple Footer */}
            <footer className="py-8 border-t border-slate-100 bg-white/50 text-center text-black opacity-30 text-[9px] font-black uppercase tracking-[5px] italic">
                <p>© 2026 Secure Shield Insurance Services // ALL_SYSTEMS_OPERATIONAL</p>
            </footer>
        </div>
    );
};

export default CheckoutPage;
