import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "../../utils/api";
import { useToast } from "../../hooks/use-toast";
import { CreditCard, ShieldCheck, Lock, ChevronLeft } from "lucide-react";

const CheckoutPage = () => {
    const { user } = useContext(AuthContext);
    const queryClient = useQueryClient();
    const { state } = useLocation();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const policy = state?.policy;

    if (!policy) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen pt-20">
                <p>No policy selected for checkout.</p>
                <button onClick={() => navigate("/customer")} className="btn-primary mt-4">Go to Dashboard</button>
            </div>
        );
    }

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await api.post("/transactions/process", {
                policyId: policy._id,
                applicationId: applicationId,
                amount: policy.premiumAmount,
                paymentMethod: "Credit Card"
            }, user.token);

            if (result.success) {
                toast({
                    title: "Security Active!",
                    description: `Policy SP-${result.userPolicy.policyNumber} is now live. Safe travels!`,
                    variant: "success"
                });
                queryClient.invalidateQueries(["myPolicies"]);
                queryClient.invalidateQueries(["myApplications"]);
                
                // Simulation of PDF Generation
                setTimeout(() => {
                    toast({
                        title: "Document Ready",
                        description: "Your policy PDF has been generated and sent to your email.",
                    });
                }, 2000);

                navigate("/customer");
            }
        } catch (error) {
            toast.error({
                title: "Payment Failed",
                description: error.message || "An error occurred during payment."
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkout-page min-h-screen premium-gradient py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-8"
                >
                    <ChevronLeft size={20} />
                    <span className="font-medium">Back to Policies</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column: Summary */}
                    <div className="space-y-6">
                        <div className="glass p-8 rounded-3xl">
                            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-white/5">
                                    <div>
                                        <div className="font-bold text-lg">{policy.policyName}</div>
                                        <div className="text-sm opacity-60">{policy.policyType} Insurance</div>
                                    </div>
                                    <div className="font-bold">₹{policy.premiumAmount}</div>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <div className="text-slate-500">Duration</div>
                                    <div className="font-medium">{policy.durationYears} Year(s)</div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="text-slate-500">Total Coverage</div>
                                    <div className="font-medium text-green-600">₹{policy.coverageAmount}</div>
                                </div>
                                <div className="flex justify-between items-center pt-6 text-xl font-bold">
                                    <span>Total Amount</span>
                                    <span className="text-blue-600">₹{policy.premiumAmount}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                            <ShieldCheck className="text-blue-600 mt-1" size={24} />
                            <div>
                                <h4 className="font-bold">ShieldPro Protection</h4>
                                <p className="text-sm opacity-70">Your payment and data are protected by industry-standard encryption.</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Payment Form */}
                    <div className="glass p-8 rounded-3xl">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold">Payment Method</h2>
                            <div className="flex gap-2 text-slate-400">
                                <CreditCard size={20} />
                                <Lock size={20} />
                            </div>
                        </div>

                        <form onSubmit={handlePayment} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Cardholder Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. John Doe"
                                    required
                                    className="w-full p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Card Number</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="0000 0000 0000 0000"
                                        required
                                        className="w-full p-4 pl-12 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10"
                                    />
                                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Expiry Date</label>
                                    <input
                                        type="text"
                                        placeholder="MM / YY"
                                        required
                                        className="w-full p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">CVV</label>
                                    <input
                                        type="password"
                                        placeholder="***"
                                        required
                                        className="w-full p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 dark:shadow-none transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                            >
                                {loading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                                ) : (
                                    <>Pay ₹{policy.premiumAmount}</>
                                )}
                            </button>

                            <p className="text-center text-xs opacity-50 mt-4">
                                By completing this purchase, you agree to our Terms of Service and Privacy Policy.
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
