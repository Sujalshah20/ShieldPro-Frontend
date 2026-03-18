import React, { useState, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { 
    Search, Bell, FileText, CheckCircle2, 
    AlertCircle, IndianRupee, Clipboard, 
    ChevronDown, Filter, MoreHorizontal, 
    ShieldCheck, XCircle, Clock, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../hooks/use-toast";
import Reveal from "../../components/common/Reveal";

const ClaimStatCard = ({ title, value, trend, icon: Icon, color, isNegative }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start">
            <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
                <Icon size={24} className={color.replace('bg-', 'text-')} />
            </div>
            {trend && (
                <div className={`flex items-center gap-1 font-bold text-sm ${isNegative ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {trend}
                </div>
            )}
        </div>
        <div className="mt-4 space-y-1">
            <p className="text-slate-400 text-sm font-medium">{title}</p>
            <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{value}</h3>
        </div>
    </div>
);

const AdminClaims = () => {
    const { user } = useContext(AuthContext);
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("All Claims");

    const { data: claims, isLoading } = useQuery({
        queryKey: ['adminClaims', user?.token],
        queryFn: () => api.get('/admin/claims', user.token),
        enabled: !!user?.token
    });

    const statusMutation = useMutation({
        mutationFn: (data) => api.put(`/admin/claims/${data.id}/status`, { status: data.status }, user.token),
        onSuccess: () => {
            queryClient.invalidateQueries(['adminClaims']);
            toast({ title: "Claim status updated" });
        }
    });

    const mockData = {
        Health: { tag: "Health", color: "bg-blue-50 text-blue-600", agent: "Vikram Malhotra" },
        Motor: { tag: "Motor", color: "bg-slate-50 text-slate-600", agent: "Anjali Kapoor" },
        Life: { tag: "Life", color: "bg-purple-50 text-purple-600", agent: "Rahul Sharma" },
        Property: { tag: "Property", color: "bg-emerald-50 text-emerald-600", agent: "Anjali Kapoor" }
    };

    const getPriorityStyle = (priority) => {
        switch(priority) {
            case 'HIGH': return 'bg-rose-50 text-rose-600';
            case 'MEDIUM': return 'bg-orange-50 text-orange-600';
            case 'LOW': return 'bg-blue-50 text-blue-600';
            default: return 'bg-slate-50 text-slate-600';
        }
    };

    const getStatusStyle = (status) => {
        switch(status) {
            case 'Approved': return { dot: 'bg-emerald-500', text: 'text-emerald-600' };
            case 'Pending': return { dot: 'bg-blue-500', text: 'text-blue-600' };
            case 'Rejected': return { dot: 'bg-rose-500', text: 'text-rose-600' };
            case 'Review': return { dot: 'bg-amber-500', text: 'text-amber-600' };
            default: return { dot: 'bg-slate-400', text: 'text-slate-600' };
        }
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Breadcrumb & Header */}
            <div className="flex justify-between items-center">
                <Reveal direction="left">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                            <span>Home</span>
                            <ChevronRight size={12} />
                            <span className="text-slate-300">Claims</span>
                        </div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">All Claims</h1>
                    </div>
                </Reveal>
            </div>

            {/* Metrics Stripe */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <ClaimStatCard title="Total Claims" value="12,450" trend="+12.5%" icon={Clipboard} color="bg-blue-500" />
                <ClaimStatCard title="Pending Review" value="842" trend="+5.2%" icon={Clock} color="bg-orange-500" />
                <ClaimStatCard title="Approved (Month)" value="3,120" trend="-2.1%" icon={CheckCircle2} color="bg-emerald-500" isNegative />
                <ClaimStatCard title="Total Disbursed" value="₹45.2 Cr" trend="+8.4%" icon={IndianRupee} color="bg-purple-600" />
            </div>

            {/* Table & Filters Container */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                {/* Tabs */}
                <div className="flex px-8 border-b border-slate-50 overflow-x-auto scrollbar-hide">
                    {["All Claims", "Pending", "Under Review", "Approved", "Rejected", "Settled"].map((tab) => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-6 text-sm font-bold transition-all relative whitespace-nowrap ${
                                activeTab === tab ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
                            }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <motion.div layoutId="activeTabClaims" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Filters */}
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end border-b border-slate-50 bg-slate-50/20">
                    {[
                        { label: "Date Range", val: "Last 30 Days" },
                        { label: "Claim Type", val: "All Types" },
                        { label: "Agent", val: "All Agents" },
                        { label: "Amount Range", val: "Any Amount" }
                    ].map((f, i) => (
                        <div key={i} className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">{f.label}</label>
                            <button className="w-full h-12 px-4 bg-white border border-slate-100 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-between hover:border-blue-500 transition-all">
                                {f.val} <ChevronDown size={14} className="text-slate-400" />
                            </button>
                        </div>
                    ))}
                    <button className="h-12 w-full bg-[#1e3a8a] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#1e40af] transition-all shadow-lg active:scale-95 mb-0.5">
                        <Filter size={16} /> Apply Filters
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                <th className="px-8 py-6">Claim ID</th>
                                <th className="px-8 py-6">Customer</th>
                                <th className="px-8 py-6">Policy</th>
                                <th className="px-8 py-6">Type</th>
                                <th className="px-8 py-6">Amount (₹)</th>
                                <th className="px-8 py-6">Assigned Agent</th>
                                <th className="px-8 py-6">Date</th>
                                <th className="px-8 py-6">Priority</th>
                                <th className="px-8 py-6">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr><td colSpan="9" className="px-8 py-20 text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse">Scanning Transmission Logs...</td></tr>
                            ) : claims?.map((c, i) => {
                                const typeInfo = mockData[c.policy?.policyType] || mockData.Health;
                                const statusInfo = getStatusStyle(c.status === 'Pending' ? 'Review' : c.status);
                                return (
                                    <tr key={c._id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <span className="text-sm font-bold text-blue-600 underline cursor-pointer hover:text-blue-800 transition-colors">
                                                #CLM-{c._id.slice(-5).toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-100 shadow-sm">
                                                    <img src={`https://i.pravatar.cc/100?u=${c.user?._id}`} alt="" />
                                                </div>
                                                <span className="text-xs font-bold text-slate-700">{c.user?.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-xs font-medium text-slate-500 leading-tight block max-w-[120px]">{c.policy?.policyName}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${typeInfo.color}`}>
                                                {typeInfo.tag}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-sm font-bold text-slate-800">{c.claimAmount?.toLocaleString()}</span>
                                        </td>
                                        <td className="px-8 py-6 text-xs font-medium text-slate-500">
                                            {typeInfo.agent}
                                        </td>
                                        <td className="px-8 py-6 text-xs font-medium text-slate-400 whitespace-nowrap">
                                            Oct 24, 2023
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black tracking-widest uppercase ${getPriorityStyle(i % 3 === 0 ? 'HIGH' : i % 3 === 1 ? 'MEDIUM' : 'LOW')}`}>
                                                {i % 3 === 0 ? 'HIGH' : i % 3 === 1 ? 'MEDIUM' : 'LOW'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                                                <span className={`text-[10px] font-bold ${statusInfo.text}`}>
                                                    {c.status === 'Pending' ? 'Review' : c.status}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-8 py-6 bg-slate-50/30 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">Showing 1-{claims?.length || 0} of 12,450 claims</span>
                    <div className="flex items-center gap-2">
                        <button className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-white transition-all">Previous</button>
                        <button className="px-4 py-2 bg-[#1e3a8a] text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-900/10 hover:bg-[#1e40af] transition-all">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminClaims;