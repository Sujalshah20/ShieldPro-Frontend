import React, { useState } from "react";
import { 
    Heart, Car, Home, 
    Users, Plane, Activity, CheckCircle2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { api } from "../../utils/api";

const tabs = ["All Policies", "Health", "Life", "Vehicle", "Home", "Travel"];

const BrowsePolicies = () => {
    const navigate = useNavigate();
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("All Policies");

    React.useEffect(() => {
        const fetchPolicies = async () => {
            try {
                const data = await api.get('/policies/available');
                setPolicies(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error fetching policies:", error);
                setPolicies([]);
            } finally {
                setLoading(false);
            }
        };
        fetchPolicies();
    }, []);

    const filteredPolicies = policies.filter(policy => {
        return activeTab === "All Policies" || policy.policyType === activeTab;
    });

    if (loading) return <div className="p-20 text-center font-bold text-black">Loading policies...</div>;

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
                                {policy.policyType === 'Health' ? <Heart size={22} className="text-rose-500" /> :
                                 policy.policyType === 'Vehicle' ? <Car size={22} className="text-blue-500" /> :
                                 policy.policyType === 'Home' ? <Home size={22} className="text-orange-500" /> :
                                 policy.policyType === 'Life' ? <Users size={22} className="text-purple-500" /> :
                                 policy.policyType === 'Travel' ? <Plane size={22} className="text-emerald-500" /> :
                                 <Activity size={22} className="text-gray-500" />}
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
