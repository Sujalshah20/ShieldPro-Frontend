import React, { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { 
    Activity, Car, Home, Shield, Globe, FileText, 
    ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const CustomerPolicies = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();


    const { data: myPolicies = [], isLoading } = useQuery({
        queryKey: ['myPolicies', user?.token],
        queryFn: () => api.get('/user-policies', user.token),
        enabled: !!user?.token
    });

    const getPolicyIcon = (type) => {
        const iconProps = { size: 28 };
        switch(type) {
            case 'Health': return <Activity {...iconProps} className="text-[#3b82f6]" />;
            case 'Vehicle': case 'Auto': return <Car {...iconProps} className="text-[#a855f7]" />;
            case 'Property': case 'Home': return <Home {...iconProps} className="text-[#f97316]" />;
            case 'Life': return <Shield {...iconProps} className="text-[#10b981]" />;
            case 'Travel': return <Globe {...iconProps} className="text-[#14b8a6]" />;
            default: return <FileText {...iconProps} className="text-gray-500" />;
        }
    };

    const getIconBg = (type) => {
        switch(type) {
            case 'Health': return "bg-blue-50";
            case 'Vehicle': case 'Auto': return "bg-purple-50";
            case 'Property': case 'Home': return "bg-orange-50";
            case 'Life': return "bg-emerald-50";
            case 'Travel': return "bg-teal-50";
            default: return "bg-gray-50";
        }
    };

    const calculateTimeRemaining = (expiryDate) => {
        const total = Date.parse(expiryDate) - Date.now();
        const days = Math.floor(total / (1000 * 60 * 60 * 24));
        const months = Math.floor(days / 30);
        const years = (days / 365).toFixed(1);

        if (days < 0) return { text: "Expired", progress: 0, isUrgent: true };
        if (days <= 30) return { text: `${days} Days left`, progress: 95, isUrgent: true };
        if (months < 12) return { text: `${months} Months left`, progress: (months/12)*100, isUrgent: false };
        return { text: `${years} Years left`, progress: Math.min((years/5)*100, 100), isUrgent: false };
    };

    const totalPremium = myPolicies.reduce((acc, curr) => acc + (curr.policy?.premiumAmount || 0), 0);
    const totalCoverage = myPolicies.reduce((acc, curr) => acc + (curr.policy?.coverageAmount || 0), 0);
    const displayCoverage = totalCoverage > 100000 ? `${(totalCoverage/100000).toFixed(1)}L` : totalCoverage.toLocaleString();

    const filteredPolicies = myPolicies;

    if (isLoading) return (
        <div className="flex items-center justify-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#002b45]"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 font-sans pb-20">
            
            {/* Header */}
            <div className="mb-10">
                <h1 className="text-2xl font-bold text-slate-800 mb-1">My Policies</h1>
                <p className="text-slate-500 text-sm font-medium">Manage and track your insurance policies and renewals.</p>
            </div>

            {/* Tabs section removed */}

            {/* Policy List */}
            {filteredPolicies.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Shield size={40} className="text-slate-200" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">No policies found</h3>
                    <p className="text-slate-400 text-sm font-medium mb-10 max-w-sm mx-auto">You don't have any policies at the moment. Explore our coverage options to secure your future.</p>
                    <button 
                        onClick={() => navigate('/customer/browse')}
                        className="bg-emerald-500 text-white px-10 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100"
                    >
                        Browse All Policies
                    </button>
                </div>
            ) : (
                <div className="space-y-6 mb-12">
                    {filteredPolicies.map((p, idx) => {
                        const timeStatus = calculateTimeRemaining(p.endDate);
                        
                        return (
                            <motion.div 
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                key={p._id} 
                                className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm flex flex-col xl:flex-row xl:items-center gap-8 relative hover:shadow-xl hover:shadow-blue-50/50 transition-all group"
                            >
                                {/* Status badge and menu removed */}

                                <div className="flex items-center gap-6 xl:w-1/3">
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${getIconBg(p.policy?.policyType)}`}>
                                        {React.cloneElement(getPolicyIcon(p.policy?.policyType), { size: 28 })}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800 mb-1">{p.policy?.policyName}</h3>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                                            <span>#{p.policyNumber.toUpperCase()}</span> 
                                            <span className="w-1 h-1 rounded-full bg-slate-200" /> 
                                            <span>Verified Enrollment</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-8 border-t border-slate-50 xl:border-t-0 xl:pt-0">
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Monthly Premium</p>
                                        <div className="flex items-baseline gap-1.5">
                                            <span className="text-xl font-bold text-slate-800">₹{(p.policy?.premiumAmount || 0).toLocaleString()}</span>
                                            <span className="text-[12px] text-slate-400 font-bold">/month</span>
                                        </div>
                                    </div>
                                    
                                    <div className="w-full xl:max-w-xs">
                                        <div className="flex justify-between items-end mb-2">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Policy Lifespan</p>
                                            <p className={`text-[11px] font-bold uppercase tracking-widest ${timeStatus.isUrgent ? 'text-amber-600' : 'text-slate-600'}`}>{timeStatus.text}</p>
                                        </div>
                                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${timeStatus.progress}%` }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                                className={`h-full rounded-full ${timeStatus.isUrgent ? 'bg-amber-500' : 'bg-[#134e8d]'}`}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Action buttons row removed */}
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Bottom Stats Row */}
            {filteredPolicies.length > 0 && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-[#134e8d] rounded-3xl p-8 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl shadow-blue-100"
                >
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 md:gap-16">
                        <div className="text-center md:text-left">
                            <p className="text-[10px] font-bold text-blue-100/60 uppercase tracking-widest mb-2">Active Enrollments</p>
                            <div className="flex items-baseline gap-2">
                                <p className="text-2xl font-bold text-white">{myPolicies.length}</p>
                                <span className="text-[10px] font-bold text-blue-100/40 uppercase">Policies</span>
                            </div>
                        </div>
                        <div className="text-center md:text-left border-slate-100/10 md:border-l md:pl-16">
                            <p className="text-[10px] font-bold text-blue-100/60 uppercase tracking-widest mb-2">Monthly Commitment</p>
                            <p className="text-2xl font-bold text-white">₹{totalPremium.toLocaleString()}</p>
                        </div>
                        <div className="text-center md:text-left border-slate-100/10 md:border-l md:pl-16">
                            <p className="text-[10px] font-bold text-blue-100/60 uppercase tracking-widest mb-2">Total Life Coverage</p>
                            <p className="text-2xl font-bold text-white">₹{displayCoverage}</p>
                        </div>
                    </div>

                    <button 
                        onClick={() => navigate('/customer/browse')}
                        className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl transition-all border border-white/10 flex items-center gap-4 group"
                    >
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Need more cover?</span>
                            <span className="text-sm font-bold">Explore Premium Plans</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all">
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                    </button>
                </motion.div>
            )}
        </div>
    );
};

export default CustomerPolicies;