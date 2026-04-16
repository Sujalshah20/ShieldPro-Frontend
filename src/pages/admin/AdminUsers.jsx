import React, { useState, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { 
    Users, Search, Plus, 
    Download, ChevronDown, Calendar, 
    Eye, Edit, Trash2, MoreHorizontal,
    Mail, Phone, ShieldCheck, ClipboardList,
    X, LogOut, ChevronRight, Bell
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../hooks/use-toast";
import Reveal from "../../components/common/Reveal";
import { User, Activity, MapPin, CheckCircle, Clock } from "lucide-react";

const AdminUsers = () => {
    const { user } = useContext(AuthContext);
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState(null);
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", status: "" });

    // Debounce search term
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1); // Reset to page 1 on search
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const { data, isLoading } = useQuery({
        queryKey: ['adminCustomers', user?.token, debouncedSearch, currentPage],
        queryFn: () => api.get(`/admin/customers?search=${debouncedSearch}&page=${currentPage}&limit=10`, user.token),
        enabled: !!user?.token
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => api.delete(`/admin/customers/${id}`, user.token),
        onSuccess: (res) => {
            queryClient.invalidateQueries(['adminCustomers']);
            queryClient.invalidateQueries(['adminStats']); // Refresh dashboard stats
            toast({ 
                title: "Customer deleted successfully", 
                description: res.message, 
                variant: "success",
                icon: <Trash2 className="w-4 h-4" />
            });
            setIsDeleteModalOpen(false);
            setCustomerToDelete(null);
        },
        onError: (err) => {
            toast({ 
                title: "Delete Failed", 
                description: err.message, 
                variant: "destructive" 
            });
        }
    });

    const updateMutation = useMutation({
        mutationFn: (updateData) => {
            const { _id, ...payload } = updateData;
            if (!_id) throw new Error("Missing Customer ID for update");
            return api.patch(`/admin/customers/${_id}`, payload, user.token);
        },
        onSuccess: (updatedCustomer) => {
            queryClient.invalidateQueries(['adminCustomers']);
            toast({ 
                title: "Changes saved! ✨", 
                description: `The profile for ${updatedCustomer.name || 'the customer'} has been updated successfully.`, 
                variant: "success" 
            });
            setIsEditModalOpen(false);
        },
        onError: (err) => {
            const errorMessage = err.message || "Failed to update customer";
            const errorTitle = err.status === 404 ? "Endpoint Not Found" : "Update Failed";
            
            toast({ 
                title: errorTitle,
                description: errorMessage, 
                variant: "destructive" 
            });
        }
    });

    const handleViewClick = (u) => {
        setSelectedCustomer(u);
        setIsViewModalOpen(true);
    };

    const handleEditClick = (u) => {
        setSelectedCustomer(u);
        setFormData({
            name: u.name || "",
            email: u.email || "",
            phone: u.phone || "",
            status: u.status || "active"
        });
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (u) => {
        setCustomerToDelete(u);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (customerToDelete) {
            deleteMutation.mutate(customerToDelete._id);
        }
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        updateMutation.mutate({ ...formData, _id: selectedCustomer._id });
    };

    const customers = data?.customers || [];
    const totalPages = data?.pages || 1;
    const totalCount = data?.total || 0;

    const displayCustomers = customers;

    return (
        <div className="space-y-6 pb-10 max-w-[1400px] mx-auto font-sans">
            <div className="hidden">
                {/* Skipped rendering since typically header is outside. Kept class structure to emulate if needed. */}
            </div>

            {/* Title Section */}
            <div className="flex flex-col mb-6">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">Customer Management</h1>
                <p className="text-sm text-slate-500">Manage your assigned customers and their policy statuses.</p>
            </div>

            {/* Filter Bar */}
            <div className="bg-white px-5 py-5 rounded-[12px] border border-slate-200 flex flex-wrap items-end gap-5 shadow-sm">
                <div className="flex-1 min-w-[220px] space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Search Customer</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Name or email..." 
                            className="w-full pl-9 pr-4 h-10 bg-white border border-slate-200 focus:border-slate-300 rounded-lg text-sm outline-none transition-all placeholder:text-slate-400 font-medium text-slate-700"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="w-full sm:w-[180px] space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Policy Type</label>
                    <div className="relative">
                        <select className="w-full h-10 bg-white border border-slate-200 focus:border-slate-300 rounded-lg pl-3 pr-8 text-sm font-medium text-slate-700 outline-none transition-all appearance-none cursor-pointer">
                            <option value="All Types">All Types</option>
                            <option value="Health">Health</option>
                            <option value="Life">Life</option>
                            <option value="Auto">Auto</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                    </div>
                </div>
                <div className="w-full sm:w-[180px] space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Status</label>
                    <div className="relative">
                        <select className="w-full h-10 bg-white border border-slate-200 focus:border-slate-300 rounded-lg pl-3 pr-8 text-sm font-medium text-slate-700 outline-none transition-all appearance-none cursor-pointer">
                            <option value="All Statuses">All Statuses</option>
                            <option value="Active">Active</option>
                            <option value="Pending KYC">Pending KYC</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                    </div>
                </div>
                <div className="w-full sm:w-[180px] space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Join Date</label>
                    <div className="relative">
                        <input 
                            type="date"
                            placeholder="dd-mm-yyyy"
                            className="w-full h-10 bg-white border border-slate-200 focus:border-slate-300 rounded-lg px-3 text-sm font-medium text-slate-700 outline-none transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Table Module */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-widest bg-white border-b border-slate-100">
                                <th className="px-6 py-5 whitespace-nowrap">ID</th>
                                <th className="px-6 py-5 whitespace-nowrap">Customer</th>
                                <th className="px-6 py-5 whitespace-nowrap text-center">Phone</th>
                                <th className="px-6 py-5 whitespace-nowrap text-center">Status</th>
                                <th className="px-6 py-5 whitespace-nowrap text-center">Claims</th>
                                <th className="px-6 py-5 whitespace-nowrap text-center">Joined Date</th>
                                <th className="px-6 py-5 whitespace-nowrap text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-16 text-center text-slate-400 font-medium">Loading...</td>
                                </tr>
                            ) : displayCustomers.map((u, i) => {
                                
                                return (
                                <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-5 text-[13px] text-slate-500 font-medium uppercase tracking-wider">
                                        #SH-{u._id.slice(-4)}
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 shrink-0">
                                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`} alt={u.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[14px] font-bold text-slate-800 leading-snug">{u.name}</span>
                                                <span className="text-[12px] text-slate-500">{u.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center text-[13px] font-medium text-slate-600">
                                        {u.phone || '+1 (555) 000-0000'}
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                                            u.status === 'suspended' ? 'bg-rose-50 text-rose-600 ring-1 ring-rose-200' : 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200'
                                        }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${u.status === 'suspended' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                                            {u.status || 'active'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-center text-[14px] font-bold text-slate-800">
                                        {u.claims || 0}
                                    </td>
                                    <td className="px-6 py-5 text-center text-[13px] text-slate-500 font-medium whitespace-nowrap">
                                        {u.createdAt.length < 15 ? u.createdAt : new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex justify-end gap-3 text-slate-400">
                                            <button 
                                                onClick={() => handleViewClick(u)}
                                                className="hover:text-blue-600 transition-colors"
                                            >
                                                <Eye size={16} strokeWidth={2.5} />
                                            </button>
                                            <button 
                                                onClick={() => handleEditClick(u)}
                                                className="hover:text-slate-600 transition-colors"
                                            >
                                                <Edit size={16} strokeWidth={2.5} />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteClick(u)}
                                                className="hover:text-rose-600 transition-colors"
                                            >
                                                <Trash2 size={16} strokeWidth={2.5} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-5 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-[13px] text-slate-500 font-medium">
                        Showing {totalCount > 0 ? (currentPage - 1) * 10 + 1 : 0}-
                        {Math.min(currentPage * 10, totalCount)} of {totalCount} customers
                    </span>
                    <div className="flex items-center gap-1">
                        <button 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-800 disabled:opacity-30 transition-colors"
                        >
                            <ChevronRight size={16} strokeWidth={3} className="rotate-180" />
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button 
                                key={i + 1} 
                                onClick={() => setCurrentPage(i + 1)}
                                className={`w-8 h-8 flex items-center justify-center rounded-md text-[13px] font-bold transition-all ${
                                currentPage === i + 1 ? "bg-[#1F2937] text-white" : "text-slate-700 hover:bg-slate-100"
                            }`}>
                                {i + 1}
                            </button>
                        ))}
                        <button 
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-800 disabled:opacity-30 transition-colors"
                        >
                            <ChevronRight size={16} strokeWidth={3} />
                        </button>
                    </div>
                </div>
            </div>

            {/* View Modal */}
            <AnimatePresence>
                {isViewModalOpen && selectedCustomer && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden"
                        >
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800 leading-tight">Customer Profile</h3>
                                        <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-0.5">SH-ID: {selectedCustomer._id?.slice(-8).toUpperCase()}</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsViewModalOpen(false)} className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-slate-600 transition-all">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-8">
                                <div className="flex flex-col items-center mb-8">
                                    <div className="w-24 h-24 rounded-full border-4 border-slate-100 p-1 mb-4">
                                        <div className="w-full h-full rounded-full overflow-hidden">
                                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedCustomer.name}`} alt={selectedCustomer.name} className="w-full h-full object-cover" />
                                        </div>
                                    </div>
                                    <h4 className="text-xl font-bold text-slate-900">{selectedCustomer.name}</h4>
                                    <p className="text-sm text-slate-500 font-medium">{selectedCustomer.email}</p>
                                    <div className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ring-1 uppercase tracking-wide ${
                                        selectedCustomer.status === 'suspended' ? 'bg-rose-50 text-rose-600 ring-rose-100' : 'bg-emerald-50 text-emerald-600 ring-emerald-100'
                                    }`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${selectedCustomer.status === 'suspended' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                                        {selectedCustomer.status || 'Active'}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Contact Number</span>
                                        <div className="flex items-center gap-2.5 text-slate-700">
                                            <Phone size={14} className="text-slate-400" />
                                            <span className="text-sm font-semibold">{selectedCustomer.phone || 'N/A'}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Join Date</span>
                                        <div className="flex items-center gap-2.5 text-slate-700">
                                            <Calendar size={14} className="text-slate-400" />
                                            <span className="text-sm font-semibold">{new Date(selectedCustomer.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Assigned Agent</span>
                                        <div className="flex items-center gap-2.5 text-slate-700">
                                            <ShieldCheck size={14} className="text-slate-400" />
                                            <span className="text-sm font-semibold">{selectedCustomer.assignedAgent?.name || 'Not Managed'}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Claims Count</span>
                                        <div className="flex items-center gap-2.5 text-slate-700">
                                            <Activity size={14} className="text-slate-400" />
                                            <span className="text-sm font-semibold">{selectedCustomer.claims || 0} Claim(s)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                                <button 
                                    onClick={() => setIsViewModalOpen(false)}
                                    className="px-6 py-2 rounded-lg bg-slate-800 text-white text-sm font-bold shadow-lg shadow-slate-200 hover:bg-black transition-all"
                                >
                                    Close Details
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Edit Modal */}
            <AnimatePresence>
                {isEditModalOpen && selectedCustomer && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden font-sans"
                        >
                            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-white shadow-lg shadow-slate-200">
                                        <Edit size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800 leading-tight">Edit Customer</h3>
                                        <p className="text-xs text-slate-400 font-medium">SH-ID: {selectedCustomer._id?.slice(-8).toUpperCase()}</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-all">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleEditSubmit} className="p-8 space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                                        <input 
                                            type="text" 
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            className="w-full h-11 bg-slate-50 border border-slate-100 focus:border-slate-300 rounded-xl px-4 text-[14px] font-semibold text-slate-700 outline-none transition-all shadow-inner"
                                            placeholder="Enter customer name"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                                        <input 
                                            type="email" 
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            className="w-full h-11 bg-slate-50 border border-slate-100 focus:border-slate-300 rounded-xl px-4 text-[14px] font-semibold text-slate-700 outline-none transition-all shadow-inner"
                                            placeholder="customer@example.com"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Number</label>
                                            <input 
                                                type="text" 
                                                value={formData.phone}
                                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                                className="w-full h-11 bg-slate-50 border border-slate-100 focus:border-slate-300 rounded-xl px-4 text-[14px] font-semibold text-slate-700 outline-none transition-all shadow-inner"
                                                placeholder="+91 00000 00000"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Account Status</label>
                                                <select 
                                                    value={formData.status}
                                                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                                                    className="w-full h-11 bg-slate-50 border border-slate-100 focus:border-slate-300 rounded-xl px-3 text-[14px] font-semibold text-slate-700 outline-none transition-all shadow-inner cursor-pointer"
                                                >
                                                    <option value="active">Active</option>
                                                    <option value="suspended">Suspended</option>
                                                </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button 
                                        type="button"
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="flex-1 h-11 rounded-xl bg-slate-100 text-slate-600 text-sm font-bold hover:bg-slate-200 transition-all border border-slate-200"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={updateMutation.isPending}
                                        className="flex-1 h-11 rounded-xl bg-slate-800 text-white text-sm font-bold shadow-lg shadow-slate-200 hover:bg-black transition-all disabled:opacity-50"
                                    >
                                        {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            
            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {isDeleteModalOpen && customerToDelete && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden font-sans"
                        >
                            <div className="p-8 text-center">
                                <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mx-auto mb-6 ring-8 ring-rose-50/50">
                                    <AlertCircle size={40} strokeWidth={2.5} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">Delete Customer?</h3>
                                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                                    Are you sure you want to delete <span className="text-slate-900 font-bold">{customerToDelete.name}</span>? 
                                    All associated policy data and claim records might be affected. This action cannot be undone.
                                </p>
                            </div>

                            <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                                <button 
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="flex-1 h-12 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-100 transition-all active:scale-95"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleConfirmDelete}
                                    disabled={deleteMutation.isPending}
                                    className="flex-1 h-12 rounded-xl bg-rose-600 text-white text-sm font-bold shadow-lg shadow-rose-200 hover:bg-rose-700 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {deleteMutation.isPending ? 'Deleting...' : 'Delete Customer'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminUsers;