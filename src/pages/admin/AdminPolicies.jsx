import React, { useState, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { 
    Search, Plus, Edit, Trash2, 
    ChevronDown, Eye, CheckCircle2, 
    Play, X, Layout, Filter, ChevronRight,
    Briefcase, Shield, Zap, Target
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../hooks/use-toast";
import Reveal from "../../components/common/Reveal";

const AdminPolicies = () => {
    const { user } = useContext(AuthContext);
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [activeTab, setActiveTab] = useState("All Policies");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedType, setSelectedType] = useState("All");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedPolicy, setSelectedPolicy] = useState(null);

    const [newPolicy, setNewPolicy] = useState({
        policyName: "",
        items: [{ title: "", description: "" }],
        policyType: "Health",
        description: "",
        premiumAmount: "",
        coverageAmount: "",
        durationYears: 1
    });

    const [editPolicy, setEditPolicy] = useState({
        policyName: "",
        items: [{ title: "", description: "" }],
        policyType: "Health",
        description: "",
        premiumAmount: "",
        coverageAmount: "",
        durationYears: 1
    });

    // Debounce search term
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1); // Reset to page 1 on search
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Handle Tab Change
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    const { data, isLoading } = useQuery({
        queryKey: ['adminPolicies', user?.token, debouncedSearch, activeTab, selectedType, currentPage],
        queryFn: () => api.get(`/policies?search=${debouncedSearch}&status=${activeTab}&type=${selectedType}&page=${currentPage}&limit=8`, user.token),
        enabled: !!user?.token
    });

    const policies = data?.policies || [];
    const totalPages = data?.pages || 1;
    const totalCount = data?.total || 0;

    const createMutation = useMutation({
        mutationFn: (data) => api.post('/policies', data, user.token),
        onSuccess: () => {
            queryClient.invalidateQueries(['adminPolicies']);
            toast({ title: "Policy created successfully" });
            setIsModalOpen(false);
            setNewPolicy({ policyName: "", policyType: "Health", description: "", premiumAmount: "", coverageAmount: "", durationYears: 1 });
        },
        onError: () => toast({ title: "Failed to create policy", variant: "destructive" })
    });

    const updateMutation = useMutation({
        mutationFn: (data) => api.put(`/policies/${data._id}`, data, user.token),
        onSuccess: () => {
            queryClient.invalidateQueries(['adminPolicies']);
            toast({ title: "Policy updated successfully" });
            setIsEditModalOpen(false);
            setSelectedPolicy(null);
        },
        onError: (err) => toast({ 
            title: "Update failed", 
            description: err.message, 
            variant: "destructive" 
        })
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => api.delete(`/policies/${id}`, user.token),
        onSuccess: () => {
            queryClient.invalidateQueries(['adminPolicies']);
            toast({ title: "Policy deleted successfully" });
        },
        onError: (err) => toast({ 
            title: "Delete failed", 
            description: err.message, 
            variant: "destructive" 
        })
    });

    const handleEditClick = (p) => {
        setSelectedPolicy(p);
        setEditPolicy({ ...p });
        setIsEditModalOpen(true);
    };

    const handleViewClick = (p) => {
        setSelectedPolicy(p);
        setIsViewModalOpen(true);
    };

    const handleDeleteClick = (p) => {
        setSelectedPolicy(p);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (selectedPolicy) {
            deleteMutation.mutate(selectedPolicy._id);
            setIsDeleteModalOpen(false);
        }
    };

    const mockStats = {
        Health: { range: "$120 - $450/mo", duration: "12 Months", customers: "1,248", status: "Active" },
        Life: { range: "$200 - $1,200/mo", duration: "Term (20y)", customers: "854", status: "Active" },
        Auto: { range: "$45 - $150/mo", duration: "6 Months", customers: "0", status: "Draft" },
        Home: { range: "$80 - $220/mo", duration: "12 Months", customers: "321", status: "Inactive" }
    };

    return (
        <div className="space-y-6 pb-10 max-w-7xl mx-auto font-sans">
            {/* Header Module */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                    <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">Policy Management</h1>
                    <p className="text-[15px] text-slate-500">Create, edit, and oversee all insurance policy configurations.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="h-[42px] px-5 bg-[#1F2937] text-white rounded-lg text-sm font-medium hover:bg-[#111827] transition-all shadow-sm flex items-center gap-2 border border-[#111827]"
                >
                    <Plus size={18} strokeWidth={2.5} /> Create New Policy
                </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white px-4 py-3 rounded-[12px] border border-slate-200 flex flex-wrap items-center gap-4 shadow-sm">
                <div className="relative flex-1 min-w-[280px]">
                    <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by policy ID or name..." 
                        className="w-full pl-8 pr-4 h-10 bg-transparent border-none text-[14px] font-medium text-slate-700 outline-none placeholder:text-slate-400 placeholder:font-normal"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <select 
                            className="h-10 pl-4 pr-9 bg-slate-50 border border-slate-100 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-all appearance-none outline-none cursor-pointer"
                            value={selectedType}
                            onChange={(e) => { setSelectedType(e.target.value); setCurrentPage(1); }}
                        >
                            <option value="All">Policy Type</option>
                            <option value="Health">Health</option>
                            <option value="Life">Life</option>
                            <option value="Auto">Auto</option>
                            <option value="Home">Home</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} strokeWidth={2} />
                    </div>
                    <div className="relative">
                        <select className="h-10 pl-4 pr-9 bg-slate-50 border border-slate-100 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-all appearance-none outline-none cursor-pointer">
                            <option value="All">Status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Draft">Draft</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} strokeWidth={2} />
                    </div>
                    <div className="relative hidden md:block">
                        <select className="h-10 pl-4 pr-9 bg-slate-50 border border-slate-100 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-all appearance-none outline-none cursor-pointer">
                            <option value="All">Price Range</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} strokeWidth={2} />
                    </div>
                    <button onClick={() => { setSearchTerm(""); setSelectedType("All"); }} className="text-sm font-bold text-[#1F2937] px-3 transition-colors">
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                {/* Tabs */}
                <div className="flex px-4 pt-1 border-b border-slate-100">
                    {["All Policies", "Active", "Inactive", "Draft"].map((tab) => (
                        <button 
                            key={tab}
                            onClick={() => handleTabChange(tab)}
                            className={`px-5 py-4 text-sm font-bold transition-all relative ${
                                activeTab === tab ? "text-[#1F2937]" : "text-slate-500 hover:text-slate-700 font-medium"
                            }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <motion.div layoutId="activeTabPolicies" className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-[#3B4256] rounded-t-sm" />
                            )}
                        </button>
                    ))}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-widest bg-white border-b border-slate-100">
                                <th className="px-6 py-5 whitespace-nowrap">Policy ID</th>
                                <th className="px-6 py-5 whitespace-nowrap">Name</th>
                                <th className="px-6 py-5 whitespace-nowrap">Type</th>
                                <th className="px-6 py-5 whitespace-nowrap">Premium Range</th>
                                <th className="px-6 py-5 whitespace-nowrap">Duration</th>
                                <th className="px-6 py-5 whitespace-nowrap text-center">Customers</th>
                                <th className="px-6 py-5 whitespace-nowrap text-center">Status</th>
                                <th className="px-6 py-5 whitespace-nowrap text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-16 text-center text-slate-400 font-medium">Loading...</td>
                                </tr>
                            ) : policies.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-16 text-center text-slate-400 font-medium">No policies found.</td>
                                </tr>
                            ) : policies.map((p, i) => {
                                const stats = mockStats[p.policyType] || mockStats.Health;
                                return (
                                    <tr key={p._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-6 text-[13px] text-slate-500 font-medium uppercase tracking-wider">
                                            POL -<br/>{p._id.slice(-4)}
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className="text-[14px] font-bold text-slate-800 tracking-tight leading-snug block max-w-[150px]">{p.policyName}</span>
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className={`inline-flex px-3 py-1 rounded-md text-[12px] font-bold tracking-wide ${
                                                p.policyType === 'Health' ? 'bg-blue-50 text-blue-500' :
                                                p.policyType === 'Life' ? 'bg-purple-50 text-[#C165DD]' :
                                                p.policyType === 'Auto' ? 'bg-orange-50 text-[#FF8A4C]' :
                                                'bg-[#E0F7FA] text-[#00BCD4]'
                                            }`}>
                                                {p.policyType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6 text-[14px] font-bold text-slate-600">
                                            {stats.range.split(' - ')[0]} -<br/>{stats.range.split(' - ')[1]}
                                        </td>
                                        <td className="px-6 py-6 text-[14px] text-slate-500 font-medium">
                                            {stats.duration.includes('Term') ? <>Term<br/>(20y)</> : <>{(stats.duration.split(' ')[0])}<br/>{stats.duration.split(' ')[1]}</>}
                                        </td>
                                        <td className="px-6 py-6 text-center text-[14px] font-bold text-slate-800">
                                            {stats.customers}
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex justify-center">
                                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold ${
                                                    stats.status === 'Active' ? 'bg-[#E3F6EC] text-[#28A960]' : 
                                                    stats.status === 'Inactive' ? 'bg-[#FBE9E9] text-[#E03A3E]' : 
                                                    'bg-slate-100 text-slate-500'
                                                }`}>
                                                    <div className={`w-[5px] h-[5px] rounded-full ${stats.status === 'Active' ? 'bg-[#28A960]' : stats.status === 'Inactive' ? 'bg-[#E03A3E]' : 'bg-slate-400'}`} />
                                                    {stats.status}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex justify-end gap-3 text-slate-400">
                                                <button onClick={() => handleEditClick(p)} className="hover:text-blue-600 transition-colors"><Edit size={16} strokeWidth={2.5} /></button>
                                                <button onClick={() => handleViewClick(p)} className="hover:text-slate-600 transition-colors">
                                                    {stats.status === 'Draft' ? <CheckCircle2 size={16} strokeWidth={2.5} /> : stats.status === 'Inactive' ? <Play size={16} strokeWidth={2.5} className="fill-current" /> : <Eye size={16} strokeWidth={2.5} />}
                                                </button>
                                                <button onClick={() => handleDeleteClick(p)} className="hover:text-rose-600 transition-colors"><Trash2 size={16} strokeWidth={2.5} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-5 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-[13px] text-slate-500 font-medium">Showing {Math.min(policies.length, 4)} of 24 policies</span>
                    <div className="flex items-center gap-1">
                        <button 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-800 disabled:opacity-30 transition-colors"
                        >
                            <ChevronRight size={16} strokeWidth={3} className="rotate-180" />
                        </button>
                        {[1, 2, 3].map((i) => (
                            <button 
                                key={i} 
                                onClick={() => setCurrentPage(i)}
                                className={`w-8 h-8 flex items-center justify-center rounded-md text-[13px] font-bold transition-all ${
                                currentPage === i ? "bg-[#1F2937] text-white" : "text-slate-700 hover:bg-slate-100"
                            }`}>
                                {i}
                            </button>
                        ))}
                        <button 
                            disabled={currentPage === 3}
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-800 disabled:opacity-30 transition-colors"
                        >
                            <ChevronRight size={16} strokeWidth={3} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Create Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm sm:p-6">
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 10 }}
                            className="bg-white rounded-xl w-full max-w-[550px] shadow-xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden"
                        >
                            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white z-10 shrink-0">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-800">Create New Policy</h2>
                                    <p className="text-sm text-slate-500 mt-0.5">Fill in the details to add a new policy to the system.</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                                    <X size={20} strokeWidth={2.5} />
                                </button>
                            </div>
                            <div className="overflow-y-auto p-6 flex-1">
                                <form 
                                    className="space-y-5"
                                    onSubmit={(e) => { e.preventDefault(); createMutation.mutate(newPolicy); }}
                                    id="createPolicyForm"
                                >
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[13px] font-bold text-slate-700">Policy Name</label>
                                            <input 
                                                className="w-full h-10 bg-white border border-slate-200 rounded-lg px-3 text-sm text-slate-800 outline-none focus:border-[#1F2937] focus:ring-1 focus:ring-[#1F2937] transition-all placeholder:text-slate-400"
                                                placeholder="e.g. Health Plus Plan"
                                                value={newPolicy.policyName}
                                                onChange={e => setNewPolicy({...newPolicy, policyName: e.target.value})}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[13px] font-bold text-slate-700">Policy Type</label>
                                            <div className="relative">
                                                <select 
                                                    className="w-full h-10 bg-white border border-slate-200 rounded-lg pl-3 pr-8 text-sm text-slate-800 outline-none focus:border-[#1F2937] focus:ring-1 focus:ring-[#1F2937] transition-all appearance-none cursor-pointer"
                                                    value={newPolicy.policyType}
                                                    onChange={e => setNewPolicy({...newPolicy, policyType: e.target.value})}
                                                >
                                                    <option>Health</option>
                                                    <option>Life</option>
                                                    <option>Auto</option>
                                                    <option>Home</option>
                                                </select>
                                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} strokeWidth={2} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[13px] font-bold text-slate-700">Coverage Details</label>
                                        <textarea 
                                            className="w-full h-24 bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-[#1F2937] focus:ring-1 focus:ring-[#1F2937] transition-all resize-none placeholder:text-slate-400"
                                            placeholder="Provide a detailed description of what is covered..."
                                            value={newPolicy.description}
                                            onChange={e => setNewPolicy({...newPolicy, description: e.target.value})}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[13px] font-bold text-slate-700">Base Premium (₹)</label>
                                            <input 
                                                type="number"
                                                className="w-full h-10 bg-white border border-slate-200 rounded-lg px-3 text-sm text-slate-800 outline-none focus:border-[#1F2937] focus:ring-1 focus:ring-[#1F2937] transition-all placeholder:text-slate-400"
                                                placeholder="e.g. 5000"
                                                value={newPolicy.premiumAmount}
                                                onChange={e => setNewPolicy({...newPolicy, premiumAmount: Number(e.target.value)})}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[13px] font-bold text-slate-700">Coverage Limit (₹)</label>
                                            <input 
                                                type="number"
                                                className="w-full h-10 bg-white border border-slate-200 rounded-lg px-3 text-sm text-slate-800 outline-none focus:border-[#1F2937] focus:ring-1 focus:ring-[#1F2937] transition-all placeholder:text-slate-400"
                                                placeholder="e.g. 1000000"
                                                value={newPolicy.coverageAmount}
                                                onChange={e => setNewPolicy({...newPolicy, coverageAmount: Number(e.target.value)})}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[13px] font-bold text-slate-700">Duration (Years)</label>
                                        <input 
                                            type="number"
                                            className="w-full h-10 bg-white border border-slate-200 rounded-lg px-3 text-sm text-slate-800 outline-none focus:border-[#1F2937] focus:ring-1 focus:ring-[#1F2937] transition-all placeholder:text-slate-400"
                                            placeholder="e.g. 1"
                                            value={newPolicy.durationYears}
                                            onChange={e => setNewPolicy({...newPolicy, durationYears: parseInt(e.target.value) || 1})}
                                        />
                                    </div>
                                </form>
                            </div>
                            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 shrink-0">
                                <button 
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="h-[38px] px-5 bg-white border border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-lg text-sm font-semibold transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    form="createPolicyForm"
                                    disabled={createMutation.isPending}
                                    className="h-[38px] px-6 bg-[#1F2937] text-white rounded-lg text-sm font-semibold hover:bg-[#111827] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
                                >
                                    {createMutation.isPending ? "Creating..." : "Create Policy"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Edit Modal */}
            <AnimatePresence>
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm sm:p-6">
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 10 }}
                            className="bg-white rounded-xl w-full max-w-[550px] shadow-xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden"
                        >
                            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white z-10 shrink-0">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-800">Edit Policy Details</h2>
                                    <p className="text-sm text-slate-500 mt-0.5">Update configuration for {editPolicy.policyName}</p>
                                </div>
                                <button onClick={() => setIsEditModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                                    <X size={20} strokeWidth={2.5} />
                                </button>
                            </div>
                            <div className="overflow-y-auto p-6 flex-1">
                                <form 
                                    className="space-y-5"
                                    onSubmit={(e) => { e.preventDefault(); updateMutation.mutate(editPolicy); }}
                                    id="editPolicyForm"
                                >
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[13px] font-bold text-slate-700">Policy Name</label>
                                            <input 
                                                className="w-full h-10 bg-white border border-slate-200 rounded-lg px-3 text-sm text-slate-800 outline-none focus:border-[#1F2937] focus:ring-1 focus:ring-[#1F2937] transition-all"
                                                value={editPolicy.policyName}
                                                onChange={e => setEditPolicy({...editPolicy, policyName: e.target.value})}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[13px] font-bold text-slate-700">Policy Type</label>
                                            <div className="relative">
                                                <select 
                                                    className="w-full h-10 bg-white border border-slate-200 rounded-lg pl-3 pr-8 text-sm text-slate-800 outline-none focus:border-[#1F2937] focus:ring-1 focus:ring-[#1F2937] transition-all appearance-none cursor-pointer"
                                                    value={editPolicy.policyType}
                                                    onChange={e => setEditPolicy({...editPolicy, policyType: e.target.value})}
                                                >
                                                    <option>Health</option>
                                                    <option>Life</option>
                                                    <option>Auto</option>
                                                    <option>Home</option>
                                                </select>
                                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} strokeWidth={2} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[13px] font-bold text-slate-700">Coverage Details</label>
                                        <textarea 
                                            className="w-full h-24 bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-[#1F2937] focus:ring-1 focus:ring-[#1F2937] transition-all resize-none"
                                            value={editPolicy.description}
                                            onChange={e => setEditPolicy({...editPolicy, description: e.target.value})}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[13px] font-bold text-slate-700">Base Premium (₹)</label>
                                            <input 
                                                type="number"
                                                className="w-full h-10 bg-white border border-slate-200 rounded-lg px-3 text-sm text-slate-800 outline-none focus:border-[#1F2937] focus:ring-1 focus:ring-[#1F2937] transition-all"
                                                value={editPolicy.premiumAmount}
                                                onChange={e => setEditPolicy({...editPolicy, premiumAmount: Number(e.target.value)})}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[13px] font-bold text-slate-700">Coverage Limit (₹)</label>
                                            <input 
                                                type="number"
                                                className="w-full h-10 bg-white border border-slate-200 rounded-lg px-3 text-sm text-slate-800 outline-none focus:border-[#1F2937] focus:ring-1 focus:ring-[#1F2937] transition-all"
                                                value={editPolicy.coverageAmount}
                                                onChange={e => setEditPolicy({...editPolicy, coverageAmount: Number(e.target.value)})}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[13px] font-bold text-slate-700">Duration (Years)</label>
                                        <input 
                                            type="number"
                                            className="w-full h-10 bg-white border border-slate-200 rounded-lg px-3 text-sm text-slate-800 outline-none focus:border-[#1F2937] focus:ring-1 focus:ring-[#1F2937] transition-all"
                                            value={editPolicy.durationYears}
                                            onChange={e => setEditPolicy({...editPolicy, durationYears: parseInt(e.target.value) || 1})}
                                        />
                                    </div>
                                </form>
                            </div>
                            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 shrink-0">
                                <button 
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="h-[38px] px-5 bg-white border border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-lg text-sm font-semibold transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    form="editPolicyForm"
                                    disabled={updateMutation.isPending}
                                    className="h-[38px] px-6 bg-[#1F2937] text-white rounded-lg text-sm font-semibold hover:bg-[#111827] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
                                >
                                    {updateMutation.isPending ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* View Modal */}
            <AnimatePresence>
                {isViewModalOpen && selectedPolicy && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm sm:p-6">
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 10 }}
                            className="bg-white rounded-xl w-full max-w-[550px] shadow-xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden"
                        >
                            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white z-10 shrink-0">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-800">Policy Information</h2>
                                    <p className="text-sm text-slate-500 mt-0.5">Read-only view of the policy details.</p>
                                </div>
                                <button onClick={() => setIsViewModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                                    <X size={20} strokeWidth={2.5} />
                                </button>
                            </div>
                            <div className="overflow-y-auto p-6 flex-1 bg-slate-50/50">
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                                        <div className="space-y-1">
                                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Policy ID</span>
                                            <span className="text-sm font-semibold text-slate-800">POL-{selectedPolicy._id.slice(-6).toUpperCase()}</span>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Policy Type</span>
                                            <span className="text-sm font-semibold text-slate-800">{selectedPolicy.policyType}</span>
                                        </div>
                                        <div className="col-span-2 space-y-1">
                                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Policy Name</span>
                                            <span className="text-base font-bold text-slate-800">{selectedPolicy.policyName}</span>
                                        </div>
                                        <div className="col-span-2 space-y-1.5 p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Coverage Details</span>
                                            <p className="text-sm text-slate-700 leading-relaxed">{selectedPolicy.description}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Base Premium</span>
                                            <span className="text-base font-semibold text-emerald-600">₹{selectedPolicy.premiumAmount.toLocaleString()}</span>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Coverage Limit</span>
                                            <span className="text-base font-semibold text-blue-600">₹{selectedPolicy.coverageAmount.toLocaleString()}</span>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Duration</span>
                                            <span className="text-sm font-semibold text-slate-800">{selectedPolicy.durationYears} Year(s)</span>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Created By</span>
                                            <span className="text-sm font-semibold text-slate-800">{selectedPolicy.user?.substring(0, 8) || 'SYSTEM'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="px-6 py-4 border-t border-slate-100 bg-white shrink-0">
                                <button 
                                    onClick={() => setIsViewModalOpen(false)}
                                    className="w-full h-[38px] bg-[#1F2937] text-white rounded-lg text-sm font-semibold hover:bg-[#111827] transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {isDeleteModalOpen && selectedPolicy && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm sm:p-6">
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 10 }}
                            className="bg-white rounded-xl w-full max-w-[400px] overflow-hidden shadow-xl border border-slate-200"
                        >
                            <div className="p-6 space-y-5 text-center">
                                <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto border border-rose-100">
                                    <Trash2 size={28} className="text-rose-500" strokeWidth={2.5} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-lg font-bold text-slate-800">Delete Policy</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed px-2">
                                        Are you sure you want to delete <span className="font-semibold text-slate-800">{selectedPolicy.policyName}</span>? This action cannot be undone.
                                    </p>
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button 
                                        onClick={() => setIsDeleteModalOpen(false)}
                                        className="flex-1 h-10 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={confirmDelete}
                                        className="flex-1 h-10 bg-rose-600 text-white rounded-lg text-sm font-semibold hover:bg-rose-700 transition-colors"
                                    >
                                        Delete Policy
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminPolicies;