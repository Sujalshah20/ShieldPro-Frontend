import React, { useState } from "react";
import { 
    Heart, Car, Home, 
    Users, Plane, Activity, CheckCircle2,
    AlertCircle, RefreshCw, Shield
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { api, API_BASE_URL } from "../../utils/api";

// Include all policy types: Health, Life, Vehicle, Home, Travel, Auto, Property
const tabs = ["All Policies", "Health", "Life", "Vehicle", "Auto", "Home", "Travel"];

// Helper to get icon based on policy type
const getPolicyIcon = (policyType) => {
    switch (policyType) {
        case 'Health': return <Heart size={22} className="text-rose-500" />;
        case 'Vehicle': 
        case 'Auto': return <Car size={22} className="text-blue-500" />;
        case 'Home': return <Home size={22} className="text-orange-500" />;
        case 'Life': return <Users size={22} className="text-purple-500" />;
        case 'Travel': return <Plane size={22} className="text-emerald-500" />;
        default: return <Activity size={22} className="text-gray-500" />;
    }
};

const BrowsePolicies = () => {
    const navigate = useNavigate();
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("All Policies");

    const fetchPolicies = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log(`[BrowsePolicies] Fetching from ${API_BASE_URL}/api/policies/available`);
            const data = await api.get('/policies/available');
            console.log(`[BrowsePolicies] Received data:`, data);
            
            // Handle both array response and wrapped { data: [] } response
            const policiesArray = Array.isArray(data) ? data : (data?.data || []);
            setPolicies(policiesArray);
            
            if (policiesArray.length === 0) {
                setError("No policies available. Please check if policies have been seeded in the database.");
            }
        } catch (err) {
            console.error("[BrowsePolicies] Fetch error:", err);
            setError(err.message || "Failed to load policies. Please try again.");
            setPolicies([]);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchPolicies();
    }, []);

    const filteredPolicies = policies.filter(policy => {
        // Normalize the comparison - handle case sensitivity
        const policyType = policy.policyType || policy.policyType || '';
        return activeTab === "All Policies" || policyType === activeTab;
    });

    if (loading) return (
        <div className="p-20 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#002b45] mx-auto mb-4"></div>
            <p className="text-gray-500 font-medium">Loading policies...</p>
        </div>
    );

    if (error) return (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 font-sans pb-12">
            <div className="bg-red-50 border border-red-100 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle size={32} className="text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-red-800 mb-2">Unable to Load Policies</h3>
                <p className="text-red-600 mb-6 max-w-md">{error}</p>
                <button 
                    onClick={fetchPolicies}
                    className="flex items-center gap-2 px-6 py-3 bg-[#002b45] text-white rounded-xl font-bold hover:bg-[#003b5c] transition-colors"
                >
                    <RefreshCw size={18} />
                    Try Again
                </button>
            </div>
        </div>
    );

    if (filteredPolicies.length === 0) return (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 font-sans pb-12">
            {/* Categories / Tabs */}
            <div className="flex items-center gap-6 border-b border-gray-200 mb-8 overflow-x-auto no-scrollbar">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-4 text-[13px] font-black whitespace-nowrap transition-colors relative ${
                            activeTab === tab ? "text-black" : "text-black/60 hover:text-black"
                        }`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <motion.div 
                                layoutId="browsePolicyTab"
                                className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-[#002b45]"
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Empty State */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                    <Shield size={40} className="text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {activeTab === "All Policies" ? "No Policies Available" : `No ${activeTab} Policies`}
                </h3>
                <p className="text-gray-500 mb-6 max-w-md">
                    {activeTab === "All Policies" 
                        ? "There are no policies available at the moment. Please check back later."
                        : `No ${activeTab} policies are currently available. Try another category or check back later.`
                    }
                </p>
                {activeTab !== "All Policies" && (
                    <button 
                        onClick={() => setActiveTab("All Policies")}
                        className="text-[#002b45] font-bold hover:underline"
                    >
                        View All Policies →
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 font-sans pb-12">
                {/* Categories / Tabs */}
                <div className="flex items-center gap-6 border-b border-gray-200 mb-8 overflow-x-auto no-scrollbar">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 text-[13px] font-black whitespace-nowrap transition-colors relative ${
                                activeTab === tab ? "text-black" : "text-black/60 hover:text-black"
                            }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <motion.div 
                                    layoutId="browsePolicyTab"
                                    className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-[#002b45]"
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPolicies.map((policy, index) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            key={policy._id} 
                            className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm relative flex flex-col hover:shadow-md transition-shadow"
                        >
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-50 flex items-center justify-center mb-4">
                                {getPolicyIcon(policy.policyType)}
                            </div>

                            <h3 className="text-lg font-black text-black mb-0.5">{policy.policyName}</h3>
                            <p className="text-[12px] text-black font-bold mb-4">Underwritten by ShieldPro Insurance</p>

                            <div className="space-y-2.5 mb-6 flex-1 text-xs">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={15} className="text-emerald-500" />
                                    <span className="text-black font-bold">Coverage: ₹{policy.coverageAmount.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={15} className="text-emerald-500" />
                                    <span>Premium: ₹{policy.premiumAmount}/mo</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={15} className="text-emerald-500" />
                                    <span>Duration: {policy.durationYears} Years</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => navigate(`/customer/policies/${policy._id}`, { state: { policy } })}
                                    className="flex-1 py-2.5 px-3 text-[12px] font-bold text-black bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Details
                                </button>
                                <button 
                                    onClick={() => navigate('/customer/apply', { state: { policy } })}
                                    className="flex-1 py-2.5 px-3 text-[12px] font-semibold text-white bg-[#10b981] border border-transparent rounded-lg hover:bg-[#059669] transition-colors shadow-sm"
                                >
                                    Buy Now
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
        </div>
    );
};

export default BrowsePolicies;
