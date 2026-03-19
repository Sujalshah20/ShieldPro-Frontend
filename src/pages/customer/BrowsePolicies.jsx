import React, { useState } from "react";
import { 
    Search, Heart, Car, Home, 
    Users, Plane, Activity, CheckCircle2, ChevronDown,
    ChevronLeft, ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const policyData = [
    {
        id: 1,
        title: "Elite Health Plus",
        provider: "Guardian Life Insurance Co.",
        type: "Health",
        tag: "BEST SELLER",
        tagColor: "bg-emerald-500",
        icon: <Heart size={28} className="text-[#002b45]" />,
        features: [
            "Coverage: Up to $1,000,000",
            "Premium: $120/mo",
            "Claim Settlement: 98.4%",
            "Cashless Hospitals: 5000+"
        ]
    },
    {
        id: 2,
        title: "AutoGuard Premier",
        provider: "Swift Auto Insurance",
        type: "Vehicle",
        icon: <Car size={28} className="text-[#002b45]" />,
        features: [
            "Coverage: Comprehensive & Theft",
            "Premium: $85/mo",
            "24/7 Roadside Assistance",
            "Zero Depreciation Cover"
        ]
    },
    {
        id: 3,
        title: "SecureHome Shield",
        provider: "Everest Property Group",
        type: "Home",
        tag: "RECOMMENDED",
        tagColor: "bg-[#002b45]",
        icon: <Home size={28} className="text-[#002b45]" />,
        features: [
            "Coverage: Fire & Natural Disasters",
            "Premium: $45/mo",
            "Home Content Protection",
            "Temporary Living Expenses"
        ]
    },
    {
        id: 4,
        title: "Legacy Life Term",
        provider: "Prudential Heritage",
        type: "Life",
        icon: <Users size={28} className="text-[#002b45]" />,
        features: [
            "Coverage: $500,000 Payout",
            "Premium: $65/mo",
            "Flexible Term: 10-30 Years",
            "Critical Illness Rider"
        ]
    },
    {
        id: 5,
        title: "Globetrotter Travel",
        provider: "Nomad Insurance Co.",
        type: "Travel",
        tag: "BEST SELLER",
        tagColor: "bg-emerald-500",
        icon: <Plane size={28} className="text-[#002b45]" />,
        features: [
            "Global Medical Coverage",
            "Premium: $25 per trip",
            "Trip Cancellation Protection",
            "Baggage Delay/Loss Cover"
        ]
    },
    {
        id: 6,
        title: "Basic Health Saver",
        provider: "Core Care Insurers",
        type: "Health",
        icon: <Activity size={28} className="text-[#002b45]" />,
        features: [
            "Coverage: Essential Care",
            "Premium: $55/mo",
            "Annual Health Checkups",
            "Tele-consultation Included"
        ]
    }
];

const tabs = ["All Policies", "Health", "Life", "Vehicle", "Home", "Travel"];

const BrowsePolicies = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("All Policies");

    const filteredPolicies = activeTab === "All Policies" 
        ? policyData 
        : policyData.filter(p => p.type === activeTab);

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 font-sans pb-12">
            {/* Search & Filters */}
                <div className="bg-white p-3 rounded-lg border border-gray-200 flex flex-col md:flex-row gap-3 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search for insurance policies, companies..." 
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#002b45]/20 focus:border-[#002b45] transition-all"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[12px] font-medium text-gray-600 flex items-center justify-between min-w-[120px] hover:bg-gray-100 transition-colors">
                            Type <ChevronDown size={14} />
                        </button>
                        <button className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[12px] font-medium text-gray-600 flex items-center justify-between min-w-[120px] hover:bg-gray-100 transition-colors">
                            Price Range <ChevronDown size={14} />
                        </button>
                        <button className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[12px] font-medium text-gray-600 flex items-center justify-between min-w-[120px] hover:bg-gray-100 transition-colors">
                            Duration <ChevronDown size={14} />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-6 border-b border-gray-200 mb-6 overflow-x-auto no-scrollbar">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-3 text-[13px] font-medium whitespace-nowrap transition-colors relative ${
                                activeTab === tab ? "text-[#002b45]" : "text-gray-500 hover:text-gray-800"
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {filteredPolicies.map((policy, index) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            key={policy.id} 
                            className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm relative flex flex-col"
                        >
                            {policy.tag && (
                                <div className={`absolute top-4 right-4 ${policy.tagColor} text-white text-[10px] font-bold px-3 py-1 rounded uppercase tracking-wider`}>
                                    {policy.tag}
                                </div>
                            )}

                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-50 flex items-center justify-center mb-4">
                                {React.cloneElement(policy.icon, { size: 22 })}
                            </div>

                            <h3 className="text-lg font-bold text-[#002b45] mb-0.5">{policy.title}</h3>
                            <p className="text-[12px] text-gray-500 mb-4">{policy.provider}</p>

                            <div className="space-y-2.5 mb-6 flex-1">
                                {policy.features.map((feature, i) => (
                                    <div key={i} className="flex items-start gap-2.5">
                                        <CheckCircle2 size={15} className="text-[#10b981] shrink-0 mt-0.5" />
                                        <span className="text-xs text-gray-600">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => navigate(`/customer/policies/${policy.id}`, { state: { policy: {
                                        policyName: policy.title,
                                        provider: policy.provider,
                                        policyType: policy.type,
                                        premiumAmount: parseInt(policy.features[1].split('$')[1].split('/')[0]) * 80, // rough conversion
                                        coverageAmount: 500000,
                                        description: "Comprehensive insurance coverage tailored to your needs."
                                    }}})}
                                    className="flex-1 py-2 px-3 text-[12px] font-semibold text-[#002b45] bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Details
                                </button>
                                <button 
                                    onClick={() => navigate('/customer/apply', { state: { policy: {
                                        policyName: policy.title,
                                        provider: policy.provider,
                                        policyType: policy.type,
                                        premiumAmount: parseInt(policy.features[1].split('$')[1].split('/')[0]) * 80, // rough conversion
                                        coverageAmount: 500000,
                                        _id: policy.id
                                    }}})}
                                    className="flex-1 py-2 px-3 text-[12px] font-semibold text-white bg-[#10b981] border border-transparent rounded-lg hover:bg-[#059669] transition-colors shadow-sm"
                                >
                                    Buy Now
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                    <p className="text-sm text-gray-500">
                        Showing {filteredPolicies.length} of 42 policies
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors disabled:opacity-50" disabled>
                            <ChevronLeft size={18} />
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#002b45] text-white font-medium text-sm transition-colors">
                            1
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-sm transition-colors">
                            2
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-sm transition-colors">
                            3
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
        </div>
    );
};

export default BrowsePolicies;
