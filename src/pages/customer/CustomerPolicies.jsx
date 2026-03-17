import React, { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { 
    Activity, Car, Home, Shield, Globe, FileText, 
    MoreVertical, Download, Plus, ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const CustomerPolicies = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("Active Policies");

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

    const filteredPolicies = activeTab === "Active Policies" 
        ? myPolicies.filter(p => new Date(p.expiryDate) > new Date())
        : activeTab === "Expired Policies" 
        ? myPolicies.filter(p => new Date(p.expiryDate) <= new Date())
        : myPolicies;

    const tabs = ["Active Policies", "Expired Policies", "All Policies"];

    if (isLoading) return (
        <div className="flex items-center justify-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#002b45]"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 font-sans pb-24">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[#002b45] mb-2">My Policies</h1>
                    <p className="text-gray-500 text-sm">Manage and track your active insurance coverage</p>
                </div>
                <button 
                    onClick={() => navigate('/customer/browse')}
                    className="flex items-center justify-center gap-2 bg-[#002b45] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#003b5c] transition-colors shadow-sm"
                >
                    <Plus size={20} /> Get New Policy
                </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-8 border-b border-gray-200 mb-8 overflow-x-auto no-scrollbar">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-4 text-sm font-semibold whitespace-nowrap transition-colors relative ${
                            activeTab === tab ? "text-[#002b45]" : "text-gray-500 hover:text-gray-800"
                        }`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <motion.div 
                                layoutId="policyTab"
                                className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-[#002b45]"
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Policy List */}
            {filteredPolicies.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <Shield size={64} className="mx-auto text-gray-200 mb-6" />
                    <h3 className="text-xl font-bold text-[#002b45] mb-2">No policies found</h3>
                    <p className="text-gray-500 mb-8">You don't have any {activeTab.toLowerCase()} right now.</p>
                    <button 
                        onClick={() => navigate('/customer/browse')}
                        className="bg-[#10b981] text-white px-8 py-3 rounded-xl font-medium hover:bg-[#0ea5e9] transition-colors"
                    >
                        Browse Policies
                    </button>
                </div>
            ) : (
                <div className="space-y-6 mb-12">
                    {filteredPolicies.map((p, idx) => {
                        const timeStatus = calculateTimeRemaining(p.expiryDate);
                        
                        return (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                key={p._id} 
                                className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col xl:flex-row xl:items-center gap-8 relative hover:shadow-md transition-shadow"
                            >
                                {/* Active Badge */}
                                <div className="absolute top-6 right-6 flex items-center gap-3">
                                    {timeStatus.isUrgent ? (
                                        <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 uppercase tracking-wide">
                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> RENEW SOON
                                        </span>
                                    ) : (
                                        <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 uppercase tracking-wide">
                                            ACTIVE
                                        </span>
                                    )}
                                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                        <MoreVertical size={20} />
                                    </button>
                                </div>

                                <div className="flex items-center gap-6 xl:w-1/3">
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${getIconBg(p.policy?.policyType)}`}>
                                        {getPolicyIcon(p.policy?.policyType)}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#002b45] mb-1">{p.policy?.policyName}</h3>
                                        <p className="text-sm text-gray-500 flex items-center gap-2">
                                            <span>No: {p.policyNumber.toUpperCase()}</span> 
                                            <span className="hidden sm:inline">•</span> 
                                            <span className="hidden sm:inline">ShieldPro Coverage</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-8 border-t border-gray-100 xl:border-t-0 xl:pt-0">
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Premium</p>
                                        <p className="text-lg font-bold text-[#002b45]">
                                            ₹{p.policy?.premiumAmount?.toLocaleString() || '1,200'} <span className="text-sm text-gray-400 font-medium">/mo</span>
                                        </p>
                                    </div>
                                    
                                    <div className="w-full xl:max-w-xs">
                                        <div className="flex justify-between items-end mb-2">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Time Remaining</p>
                                            <p className={`text-xs font-bold ${timeStatus.isUrgent ? 'text-amber-600' : 'text-[#002b45]'}`}>{timeStatus.text}</p>
                                        </div>
                                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full transition-all duration-1000 ${timeStatus.isUrgent ? 'bg-amber-500' : 'bg-[#002b45]'}`}
                                                style={{ width: `${timeStatus.progress}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-gray-100 xl:border-t-0 xl:pt-0 xl:justify-end xl:w-auto">
                                    <button className="w-10 h-10 border border-gray-200 rounded-xl flex items-center justify-center text-gray-400 hover:text-[#002b45] hover:bg-gray-50 transition-colors">
                                        <Download size={18} />
                                    </button>
                                    <button className="flex-1 xl:flex-none border border-gray-300 text-gray-700 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-colors min-w-[120px] text-center">
                                        View Details
                                    </button>
                                    {timeStatus.isUrgent ? (
                                        <button className="flex-1 xl:flex-none bg-amber-500 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-amber-600 transition-colors min-w-[120px] text-center">
                                            Renew Now
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => navigate('/customer/claims', { state: { policyId: p._id } })}
                                            className="flex-1 xl:flex-none bg-[#002b45] text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-[#003b5c] transition-colors min-w-[120px] text-center"
                                        >
                                            Submit Claim
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Bottom Stats Row */}
            {filteredPolicies.length > 0 && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gray-50 rounded-3xl p-6 md:p-8 flex flex-col lg:flex-row items-center justify-between gap-8 border border-gray-200"
                >
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 md:gap-16">
                        <div>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Total Active Policies</p>
                            <p className="text-3xl font-black text-[#002b45]">{myPolicies.length < 10 ? `0${myPolicies.length}` : myPolicies.length}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Monthly Premium</p>
                            <p className="text-3xl font-black text-[#002b45]">₹{totalPremium.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Total Coverage</p>
                            <p className="text-3xl font-black text-[#002b45]">₹{displayCoverage}</p>
                        </div>
                    </div>

                    <button 
                        onClick={() => navigate('/customer/browse')}
                        className="text-right flex items-center gap-4 group"
                    >
                        <div className="flex flex-col items-end">
                            <span className="text-sm font-medium text-gray-500">Need a custom plan?</span>
                            <span className="text-[#002b45] font-bold group-hover:text-amber-500 transition-colors">Talk to our experts</span>
                        </div>
                        <ArrowRight size={24} className="text-[#002b45] group-hover:text-amber-500 transition-colors group-hover:translate-x-1" />
                    </button>
                </motion.div>
            )}
        </div>
    );
};

export default CustomerPolicies;