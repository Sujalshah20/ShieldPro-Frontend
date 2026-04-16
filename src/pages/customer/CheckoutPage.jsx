import React, { useContext } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { api } from "../../utils/api";
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

    const { data: myApplications } = useQuery({
        queryKey: ['myApplications', user?.token],
        queryFn: () => api.get('/applications/my', user.token),
        enabled: !!user?.token
    });

    React.useEffect(() => {
        if (!policy || !applicationId) {
            navigate("/customer");
            return;
        }

        if (myApplications) {
            const currentApp = myApplications.find(a => a._id === applicationId);
            if (!currentApp || currentApp.status !== 'Approved') {
                toast({ 
                    title: "Access Denied", 
                    description: "Payment page is locked. Your application must be APPROVED first.", 
                    variant: "destructive" 
                });
                navigate("/customer");
            }
        }
    }, [myApplications, policy, applicationId, navigate, toast]);

    if (!policy || (myApplications && !myApplications.find(a => a._id === applicationId && a.status === 'Approved'))) {
        return (
            <div className="min-h-screen bg-[#fcfdfe] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-300 mb-6 shadow-sm border border-slate-100">
                    <Shield size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Session Terminated</h3>
                <p className="text-slate-500 text-xs max-w-xs mb-8">Your secure checkout session has expired. Please re-initiate from the dashboard.</p>
                <button 
                    onClick={() => navigate("/customer")} 
                    className="px-6 py-2.5 bg-[#0c2e59] text-white rounded-xl font-bold text-xs hover:bg-[#134e8d] transition-all shadow-md shadow-blue-900/10"
                >
                    Return to Dashboard
                </button>
            </div>
        );
    }

    const handleSuccess = (result) => {
        queryClient.invalidateQueries(["myPolicies"]);
        queryClient.invalidateQueries(["myApplications"]);
        queryClient.invalidateQueries(["myTransactions"]);
        
        navigate("/customer/checkout-success", { 
            state: { 
                policy: {
                    ...policy,
                    policyNumber: result.policyNumber || 'SP-' + Math.floor(100000 + Math.random() * 900000),
                    paymentId: result.razorpay_payment_id
                } 
            } 
        });
    };

    const handleFailure = (error) => {
        toast({
            title: "Transaction Failed",
            description: error?.message || "Secure gateway encountered an error.",
            variant: "destructive"
        });
    };

    return (
        <div className="min-h-screen bg-[#fcfdfe] flex flex-col font-sans text-slate-900">
            {/* Sleek Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
                <div className="max-w-5xl mx-auto h-16 px-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#0c2e59] rounded-xl flex items-center justify-center text-white shadow-sm">
                            <Shield size={20} strokeWidth={2.5} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold tracking-tight text-slate-900 leading-none mb-0.5">ShieldPro</span>
                            <span className="text-[9px] font-bold text-blue-600 uppercase tracking-wider leading-none">Secure Terminal</span>
                        </div>
                    </div>
                    <Link 
                        to="/customer" 
                        className="text-[11px] font-bold text-slate-400 hover:text-slate-800 transition-colors flex items-center gap-1.5 px-3 py-1.5 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-200"
                    >
                        <ChevronLeft size={14} />
                        Abort Checkout
                    </Link>
                </div>
            </header>

            <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-12 md:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    
                    {/* Left Column: Details */}
                    <div className="lg:col-span-12 xl:col-span-7 space-y-6">
                        <section className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200/60 shadow-sm relative overflow-hidden">
                            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-8 border-b border-slate-50 pb-4">
                                PROTECTION PLAN DETAILS
                            </h2>
                            
                            <div className="flex items-start justify-between gap-6 mb-10">
                                <div className="space-y-3">
                                    <h3 className="text-2xl md:text-3xl font-black text-[#0c2e59] tracking-tight leading-tight">{policy.policyName}</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="px-2.5 py-1 bg-blue-50/50 text-[#134e8d] text-[9px] font-bold uppercase rounded-md border border-blue-100 italic">
                                            {policy.policyType} Enrollment
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Standard Premium</p>
                                    <p className="text-3xl font-black text-slate-900 tracking-tight">₹{policy.premiumAmount?.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Coverage Ceiling</p>
                                    <p className="text-lg font-bold text-slate-800 tracking-tight">₹{(policy.coverageAmount/100000).toFixed(1)} Lakhs</p>
                                </div>
                                <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Protection Term</p>
                                    <p className="text-lg font-bold text-slate-800 tracking-tight">{policy.durationYears || 1} Year Plan</p>
                                </div>
                            </div>
                        </section>

                        <section className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200/60 shadow-sm">
                            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-8 border-b border-slate-50 pb-4">
                                VERIFIED POLICYHOLDER
                            </h2>
                            <div className="space-y-6">
                                <div className="flex justify-between items-center text-sm border-b border-slate-50 pb-4">
                                    <span className="text-slate-400 font-medium">Full Legal Name</span>
                                    <span className="font-bold text-slate-800">{user?.name}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm border-b border-slate-50 pb-4">
                                    <span className="text-slate-400 font-medium">Communication Channel</span>
                                    <span className="font-bold text-slate-800">{user?.email}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400 font-medium">Authentication Status</span>
                                    <div className="flex items-center gap-1.5 text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-full text-xs uppercase border border-emerald-100">
                                        <CheckCircle size={10} strokeWidth={3} /> Identity Confirmed
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Sidebar */}
                    <aside className="lg:col-span-12 xl:col-span-5 space-y-6 lg:sticky lg:top-24">
                        <section className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-200/60 shadow-xl shadow-slate-200/30 flex flex-col">
                            <h2 className="text-base font-black text-slate-900 mb-8 flex items-center gap-2">
                                <Lock size={18} className="text-slate-300" />
                                Payment Summary
                            </h2>
                            
                            <div className="space-y-4 mb-10">
                                <div className="flex justify-between text-[13px] text-slate-500 font-medium">
                                    <span>Base Premium</span>
                                    <span className="text-slate-800 font-bold">₹{policy?.premiumAmount?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-[13px] text-slate-400 font-medium">
                                    <span>Taxes & Levies</span>
                                    <span className="italic">Inclusive</span>
                                </div>
                                <div className="pt-6 mt-6 border-t border-slate-100 flex justify-between items-end">
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Total Payable</p>
                                        <p className="text-xs font-bold text-slate-300 line-through leading-none decoration-slate-200 decoration-1">₹{((policy?.premiumAmount || 0) * 1.18).toFixed(0)}</p>
                                    </div>
                                    <span className="text-3xl font-black text-[#134e8d] tracking-tighter italic">₹{policy?.premiumAmount?.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <RazorpayPayment 
                                    amount={policy?.premiumAmount} 
                                    onSuccess={handleSuccess} 
                                    onFailure={handleFailure} 
                                    user={user}
                                    policyId={policy?._id}
                                    applicationId={applicationId}
                                />
                                <div className="flex flex-col items-center gap-4 py-4 px-2 rounded-2xl bg-slate-50/50 border border-slate-100/50">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <ShieldCheck size={14} strokeWidth={2.5} className="text-emerald-500" />
                                        <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">E2E ENCRYPTED CHECKOUT</span>
                                    </div>
                                    <p className="text-[9px] text-slate-400 font-medium text-center leading-relaxed">
                                        Secure transaction protocol active. By proceeding, you verify authorized consent for this payment.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Order Help */}
                        <div className="p-6 bg-[#0c2e59] rounded-3xl text-white flex items-center gap-5 shadow-lg shadow-blue-900/10">
                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/5">
                                <Shield size={18} className="text-blue-100" />
                            </div>
                            <div className="space-y-0.5">
                                <h4 className="font-bold text-xs uppercase tracking-wider">Claims Guarantee</h4>
                                <p className="text-white/50 text-[10px] leading-tight">Fast-track settlements for all active members.</p>
                            </div>
                        </div>

                        <div className="text-center px-4">
                            <p className="text-[10px] font-bold text-slate-400 mb-1">Need assistance?</p>
                            <Link to="/support" className="text-[10px] font-bold text-[#134e8d] hover:underline uppercase tracking-wider decoration-blue-100">Live Support Access</Link>
                        </div>
                    </aside>
                </div>
            </main>

            {/* Clean Footer */}
            <footer className="py-12 border-t border-slate-100 bg-white/50">
                <div className="max-w-5xl mx-auto px-6 flex flex-col items-center gap-4 text-center">
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">© 2026 ShieldPro Financial Services</p>
                    <div className="flex items-center gap-6">
                         <div className="flex items-center gap-1.5 grayscale opacity-50">
                            <div className="size-1.5 rounded-full bg-emerald-500" />
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Gateway: Online</span>
                         </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default CheckoutPage;
