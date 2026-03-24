import React, { useState, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { 
    Search, Bell, FileText, CheckCircle2, 
    AlertCircle, IndianRupee, Clipboard, 
    ChevronDown, Filter, MoreHorizontal, 
    ShieldCheck, XCircle, Clock, ChevronRight,
    ArrowUpRight, ArrowDownRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../hooks/use-toast";
import Reveal from "../../components/common/Reveal";

const ClaimStatCard = ({ title, value, trend, icon: Icon, color, isNegative }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between group hover:border-blue-500/20 transition-all duration-300">
        <div className="flex justify-between items-start">
            <div className={`p-4 rounded-2xl ${color} bg-opacity-10 ${color.replace('bg-', 'text-')} group-hover:scale-110 transition-transform`}>
                <Icon size={24} />
            </div>
            {trend && (
                <div className={`flex items-center gap-1 font-bold text-xs px-2 py-1 rounded-lg ${isNegative ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'}`}>
                    {isNegative ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
                    {trend}
                </div>
            )}
        </div>
        <div className="mt-4 space-y-1">
            <p className="text-black/30 text-[9px] font-black uppercase tracking-[2px]">{title}</p>
            <h3 className="text-2xl font-black text-black tracking-tight italic">{value}</h3>
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
            case 'HIGH': return 'bg-rose-50 text-rose-600 border-rose-100';
            case 'MEDIUM': return 'bg-orange-50 text-orange-600 border-orange-100';
            case 'LOW': return 'bg-blue-50 text-blue-600 border-blue-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    const getStatusStyle = (status) => {
        switch(status) {
            case 'Approved': return { dot: 'bg-emerald-500', text: 'text-emerald-600', bg: 'bg-emerald-50' };
            case 'Pending': return { dot: 'bg-blue-500', text: 'text-blue-600', bg: 'bg-blue-50' };
            case 'Rejected': return { dot: 'bg-rose-500', text: 'text-rose-600', bg: 'bg-rose-50' };
            case 'Review': return { dot: 'bg-amber-500', text: 'text-amber-600', bg: 'bg-amber-50' };
            default: return { dot: 'bg-slate-400', text: 'text-slate-600', bg: 'bg-slate-50' };
        }
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Header Module */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <Reveal direction="left">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] font-black text-black/30 uppercase tracking-[3px] mb-2">
                            <span>Admin</span>
                            <ChevronRight size={12} className="text-black/20" />
                            <span className="text-black">Claims Management</span>
                        </div>
                        <h1 className="text-2xl font-black text-black tracking-tight italic uppercase">All Insurance Claims</h1>
                        <p className="text-[10px] font-black text-black/40 uppercase tracking-[2px] italic leading-none">Monitor and process client reimbursement requests</p>
                    </div>
                </Reveal>
                <div className="flex gap-4">
                    <button className="h-12 px-6 bg-white border border-slate-100 text-black rounded-xl text-[10px] font-black uppercase tracking-[3px] flex items-center gap-2 hover:bg-black hover:text-white transition-all shadow-xl italic">
                        <FileText size={18} strokeWidth={3} /> EXPORT_AUDIT
                    </button>
                </div>
            </div>

            {/* Metrics Stripe */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <ClaimStatCard title="Total Claims" value="12,450" trend="+12.5%" icon={Clipboard} color="bg-blue-500" />
                <ClaimStatCard title="Pending Review" value="842" trend="+5.2%" icon={Clock} color="bg-orange-500" />
                <ClaimStatCard title="Approved (Month)" value="3,120" trend="-2.1%" icon={CheckCircle2} color="bg-emerald-500" isNegative />
                <ClaimStatCard title="Total Disbursed" value="₹45.2 Cr" trend="+8.4%" icon={IndianRupee} color="bg-purple-600" />
            </div>

            {/* Table & Filters Container */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {/* Tabs */}
                <div className="flex px-10 border-b border-slate-50 overflow-x-auto scrollbar-hide bg-slate-50/20">
                    {["All Claims", "Pending", "Under Review", "Approved", "Rejected", "Settled"].map((tab) => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-6 text-[10px] font-black uppercase tracking-widest transition-all relative whitespace-nowrap italic ${
                                activeTab === tab ? "text-black" : "text-black/30 hover:text-black"
                            }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <motion.div layoutId="activeTabClaims" className="absolute bottom-0 left-0 right-0 h-1.5 bg-black rounded-t-full shadow-[0_0_10px_rgba(0,0,0,0.2)]" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Filters */}
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end border-b border-slate-50">
                    {[
                        { label: "Temporal Range", val: "Last 30 Days" },
                        { label: "Policy Type", val: "All Categories" },
                        { label: "Origin Agent", val: "All Personnel" },
                        { label: "Valuation", val: "Any Amount" }
                    ].map((f, i) => (
                        <div key={i} className="space-y-3">
                            <label className="text-[10px] font-black text-black/20 uppercase tracking-[3px] pl-1 italic">{f.label}</label>
                            <button className="w-full h-13 px-4 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-black text-black/60 flex items-center justify-between hover:bg-white hover:border-black/10 hover:shadow-xl transition-all italic uppercase tracking-widest">
                                {f.val} <ChevronDown size={14} className="text-black/20" />
                            </button>
                        </div>
                    ))}
                    <button className="h-13 w-full bg-black text-white rounded-xl font-black text-[10px] uppercase tracking-[3px] flex items-center justify-center gap-2 hover:bg-black/90 transition-all shadow-3xl active:scale-95 italic">
                        <Filter size={16} strokeWidth={3} /> APPLY_FILTERS
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] border-b border-slate-50 bg-slate-50/10">
                                <th className="px-6 py-4">Identity</th>
                                <th className="px-6 py-4">Beneficiary</th>
                                <th className="px-6 py-4">Asset_Policy</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4 text-right">Valuation (₹)</th>
                                <th className="px-6 py-4">Temporal_Stamp</th>
                                <th className="px-6 py-4">Priority</th>
                                <th className="px-6 py-4">Status_State</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="8" className="px-10 py-32 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                            <span className="text-xs font-black text-slate-400 uppercase tracking-[4px] italic">Retrieving Claim Registry...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : claims?.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-10 py-32 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <AlertCircle size={48} className="text-slate-300" />
                                            <span className="text-xs font-black text-slate-400 uppercase tracking-[4px] italic">No Claims Found</span>
                                            <p className="text-sm font-medium text-slate-500">Adjust your filters or check back later.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : claims?.map((c, i) => {
                                const typeInfo = mockData[c.policy?.policyType] || mockData.Health;
                                const statusInfo = getStatusStyle(c.status === 'Pending' ? 'Review' : c.status);
                                return (
                                    <tr key={c._id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg border border-blue-100 italic">
                                                #CLM-{c._id.slice(-5).toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-xl overflow-hidden border-2 border-white shadow-sm group-hover:shadow-md transition-shadow">
                                                    <img src={`https://i.pravatar.cc/100?u=${c.user?._id}`} alt="" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[12px] font-black text-black tracking-tighter italic leading-none mb-1 uppercase">{c.user?.name}</span>
                                                    <span className="text-[9px] font-black text-black/30 uppercase tracking-[2px] leading-none italic">REGISTERED_CLIENT</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[11px] font-black text-black leading-tight block max-w-[150px] italic uppercase tracking-tighter">{c.policy?.policyName}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-black/5 shadow-sm italic ${typeInfo.color}`}>
                                                {typeInfo.tag}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-[14px] font-black text-black italic tracking-tighter uppercase">₹{c.claimAmount?.toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-4 text-[10px] font-bold text-slate-400 whitespace-nowrap italic">
                                            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-lg text-[9px] font-black tracking-widest uppercase border italic ${getPriorityStyle(i % 3 === 0 ? 'HIGH' : i % 3 === 1 ? 'MEDIUM' : 'LOW')}`}>
                                                {i % 3 === 0 ? 'HIGH' : i % 3 === 1 ? 'MEDIUM' : 'LOW'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-lg border border-black/5 ${statusInfo.bg}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot} shadow-[0_0_8px] ${statusInfo.dot.replace('bg-', 'shadow-')}`} />
                                                <span className={`text-[9px] font-black uppercase tracking-widest italic ${statusInfo.text}`}>
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
                <div className="px-10 py-8 bg-slate-50/20 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[3px] italic">Displaying 1-{claims?.length || 0} of 12,450 records</span>
                    <div className="flex items-center gap-3">
                        <button className="h-11 px-5 border-2 border-slate-100 rounded-xl text-xs font-bold text-slate-500 hover:bg-white hover:border-blue-500/20 hover:text-blue-600 transition-all italic">Previous</button>
                        {[1, 2, 3, "...", 12].map((p, i) => (
                            <button key={i} className={`w-11 h-11 flex items-center justify-center rounded-xl text-xs font-bold transition-all ${p === 1 ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" : "text-slate-400 hover:bg-white hover:text-blue-600"}`}>
                                {p}
                            </button>
                        ))}
                        <button className="h-11 px-5 bg-[#1e293b] text-white rounded-xl text-xs font-bold shadow-lg shadow-slate-900/20 hover:bg-[#0f172a] transition-all italic">Next Cluster</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminClaims;