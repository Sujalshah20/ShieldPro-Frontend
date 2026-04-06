import React, { useState, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";
import {
  ChevronRight,
  FileText,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Edit,
  Eye,
  Trash2,
  X,
  User,
  Shield,
  Activity,
  Calendar,
  AlertCircle,
  MapPin,
  Mail,
  Phone,
  AlertTriangle,
} from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";



/* ─── Type badge colours ─── */
const TYPE_STYLES = {
  Health: "bg-blue-50 text-blue-600",
  Motor: "bg-orange-50 text-orange-600",
  Life: "bg-purple-50 text-purple-600",
  Property: "bg-emerald-50 text-emerald-600",
};

/* ─── Priority badge colours ─── */
const PRIORITY_STYLES = {
  HIGH: "text-red-600 font-extrabold",
  MEDIUM: "text-orange-500 font-extrabold",
  LOW: "text-slate-500 font-semibold",
};

/* ─── Status dot + label ─── */
const STATUS_STYLES = {
  Review: { dot: "bg-amber-400", text: "text-amber-600" },
  Approved: { dot: "bg-emerald-500", text: "text-emerald-600" },
  Pending: { dot: "bg-blue-500", text: "text-blue-600" },
  Rejected: { dot: "bg-red-500", text: "text-red-600" },
  Settled: { dot: "bg-slate-400", text: "text-slate-500" },
};

/* ─── Stat Card ─── */
const StatCard = ({ icon: Icon, iconBg, label, value, trend, isNeg }) => (
  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col gap-3">
    <div className="flex items-start justify-between">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg}`}>
        <Icon size={20} className="text-white" />
      </div>
      <span
        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
          isNeg ? "bg-red-50 text-red-500" : "bg-green-50 text-green-600"
        }`}
      >
        {isNeg ? (
          <span className="inline-flex items-center gap-0.5">
            <ArrowDownRight size={12} /> {trend}
          </span>
        ) : (
          <span className="inline-flex items-center gap-0.5">
            <ArrowUpRight size={12} /> {trend}
          </span>
        )}
      </span>
    </div>
    <div>
      <p className="text-xs text-slate-400 font-medium mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-800 tracking-tight">{value}</p>
    </div>
  </div>
);

/* ─── Avatar ─── */
const Avatar = ({ src, initials }) =>
  src ? (
    <img
      src={src}
      alt={initials}
      className="w-8 h-8 rounded-full object-cover border border-slate-200"
      onError={(e) => {
        e.target.style.display = "none";
        e.target.nextSibling.style.display = "flex";
      }}
    />
  ) : (
    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 text-[11px] font-bold flex items-center justify-center">
      {initials}
    </div>
  );

/* ─── Main Component ─── */
const AdminClaims = () => {
  const { user } = useContext(AuthContext);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [selectedClaim, setSelectedClaim] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);


  /* live data – falls back to mock gracefully */
  const { data: apiClaims, isLoading } = useQuery({
    queryKey: ["adminClaims", user?.token],
    queryFn: () => api.get("/admin/claims", user.token),
    enabled: !!user?.token,
  });

  const statusMutation = useMutation({
    mutationFn: (data) =>
      api.patch(`/admin/claims/${data.id}/status`, { status: data.status }, user.token),
    onSuccess: () => {
      queryClient.invalidateQueries(["adminClaims"]);
      toast({ title: "Claim status updated ✨", description: "The claim status has been changed successfully.", variant: "success" });
      setIsEditModalOpen(false);
    },
    onError: (err) => {
        toast({ title: "Update failed", description: err.message || "Failed to update claim status", variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) =>
      api.delete(`/admin/claims/${id}`, user.token),
    onSuccess: () => {
      queryClient.invalidateQueries(["adminClaims"]);
      toast({ title: "Claim deleted successfully", variant: "success" });
    },
    onError: (err) => {
        toast({ title: "Delete failed", description: err.message, variant: "destructive" });
    }
  });

  const displayClaims = apiClaims || [];

  const handleEdit = (claim) => {
    setSelectedClaim(claim);
    setIsEditModalOpen(true);
  };

  const handleView = (claim) => {
    setSelectedClaim(claim);
    setIsViewModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to PERMANENTLY delete this claim? This action cannot be undone.")) {
      deleteMutation.mutate(id);
    }
  };

  const updateStatus = (status) => {
      if (!selectedClaim) return;
      statusMutation.mutate({ id: selectedClaim._id, status });
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-6 pb-12">
      {/* ── Breadcrumb + Title ── */}
      <div className="mb-6">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
          <span className="hover:text-slate-600 cursor-pointer">Home</span>
          <ChevronRight size={12} className="text-slate-300" />
          <span className="text-slate-600 font-medium">Claims</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-800">All Claims</h1>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={FileText}
          iconBg="bg-blue-500"
          label="Total Claims"
          value={displayClaims.length.toString()}
          trend="Latest"
          isNeg={false}
        />
        <StatCard
          icon={Clock}
          iconBg="bg-orange-400"
          label="Pending Review"
          value={displayClaims.filter(c => c.status === 'Pending').length.toString()}
          trend="Action Required"
          isNeg={false}
        />
        <StatCard
          icon={CheckCircle2}
          iconBg="bg-emerald-500"
          label="Approved"
          value={displayClaims.filter(c => c.status === 'Approved').length.toString()}
          trend="All Time"
          isNeg={false}
        />
      </div>

      {/* ── Main Card ── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">


        {/* ── Table ── */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                {[
                  "Claim ID",
                  "Customer",
                  "Policy",
                  "Type",
                  "Amount (₹)",
                  "Assigned Agent",
                  "Date",
                  "Priority",
                  "Status",
                  "Actions",
                ].map((col) => (
                  <th
                    key={col}
                    className={`px-4 py-3 text-[10px] uppercase tracking-widest font-semibold text-slate-400 whitespace-nowrap ${col === 'Actions' ? 'text-center' : ''}`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayClaims.map((c) => {
                const claimType = c.userPolicy?.policy?.policyType || "General";
                const typeStyle = TYPE_STYLES[claimType] || "bg-slate-50 text-slate-600";
                const statusInfo = STATUS_STYLES[c.status] || STATUS_STYLES.Pending;
                return (
                  <tr
                    key={c._id}
                    className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors"
                  >
                    {/* Claim ID */}
                    <td className="px-4 py-4">
                      <span className="text-xs font-semibold text-slate-700">#CLM-{c._id.slice(-6).toUpperCase()}</span>
                    </td>

                    {/* Customer */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                          {c.user?.name?.charAt(0) || "U"}
                        </div>
                        <span className="text-sm font-semibold text-slate-800 leading-tight whitespace-nowrap">
                          {c.user?.name || "Unknown"}
                        </span>
                      </div>
                    </td>

                    {/* Policy */}
                    <td className="px-4 py-4">
                      <span className="text-sm text-slate-600 leading-snug block max-w-[140px]">
                        {c.userPolicy?.policy?.policyName || "N/A"}
                      </span>
                    </td>

                    {/* Type */}
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${typeStyle}`}>
                        {claimType}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="px-4 py-4">
                      <span className="text-sm font-semibold text-slate-800">₹{c.amount?.toLocaleString()}</span>
                    </td>

                    {/* Assigned Agent */}
                    <td className="px-4 py-4">
                      <span className="text-sm text-slate-600 whitespace-nowrap">{c.userPolicy?.agent?.name || "N/A"}</span>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-4">
                      <span className="text-sm text-slate-500 whitespace-nowrap">{new Date(c.createdAt).toLocaleDateString()}</span>
                    </td>

                    {/* Priority (Not present in real data, so removed or simplified) */}
                    <td className="px-4 py-4">
                      <span className={`text-xs uppercase tracking-wide text-slate-500 font-semibold`}>
                        NORMAL
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-3 text-slate-400">
                            <button 
                                onClick={() => handleEdit(c)}
                                className="hover:text-slate-600 transition-colors p-1"
                                title="Edit Claim"
                            >
                                <Edit size={16} strokeWidth={2} />
                            </button>
                            <button 
                                onClick={() => handleView(c)}
                                className="hover:text-slate-600 transition-colors p-1"
                                title="View Details"
                            >
                                <Eye size={16} strokeWidth={2} />
                            </button>
                            <button 
                                onClick={() => handleDelete(c._id)}
                                className="hover:text-rose-500 transition-colors p-1"
                                title="Delete Claim"
                            >
                                <Trash2 size={16} strokeWidth={2} />
                            </button>
                        </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>


      </div>

      {/* ── View Modal ── */}
      <AnimatePresence>
        {isViewModalOpen && selectedClaim && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 leading-tight">Claim Details</h3>
                    <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">#{selectedClaim._id?.slice(-8).toUpperCase()}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsViewModalOpen(false)}
                  className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-slate-600 transition-all border border-transparent hover:border-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-2 gap-8">
                  {/* Left Column: Claim Info */}
                  <div className="space-y-6">
                    <section>
                      <h4 className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-3 flex items-center gap-1.5">
                        <Shield size={12} className="text-blue-500" />
                        Policy Information
                      </h4>
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-500">Policy Name</span>
                          <span className="text-sm font-semibold text-slate-800">{selectedClaim.userPolicy?.policy?.policyName || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-500">Type</span>
                          <span className="text-sm font-semibold text-slate-800">{selectedClaim.userPolicy?.policy?.policyType || 'General'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-500">Claim Amount</span>
                          <span className="text-sm font-bold text-emerald-600">₹{selectedClaim.amount?.toLocaleString()}</span>
                        </div>
                      </div>
                    </section>

                    <section>
                       <h4 className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-3 flex items-center gap-1.5">
                        <Activity size={12} className="text-orange-500" />
                        Status & Priority
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                         <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                             <p className="text-[9px] uppercase font-bold text-slate-400 mb-1">Status</p>
                             <div className="flex items-center gap-1.5">
                                <span className={`w-2 h-2 rounded-full ${STATUS_STYLES[selectedClaim.status]?.dot || 'bg-slate-300'}`} />
                                <span className="text-sm font-bold text-slate-700">{selectedClaim.status}</span>
                             </div>
                         </div>
                         <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                             <p className="text-[9px] uppercase font-bold text-slate-400 mb-1">Priority</p>
                             <p className="text-sm font-bold text-slate-700 text-orange-500 italic">Normal Review</p>
                         </div>
                      </div>
                    </section>
                  </div>

                  {/* Right Column: User Info */}
                  <div className="space-y-6">
                    <section>
                      <h4 className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-3 flex items-center gap-1.5">
                        <User size={12} className="text-emerald-500" />
                        Customer Information
                      </h4>
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm">
                            {selectedClaim.user?.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">{selectedClaim.user?.name || 'Unknown'}</p>
                            <p className="text-xs text-slate-400 truncate max-w-[150px]">{selectedClaim.user?.email || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="pt-2 border-t border-slate-200/60 space-y-2">
                           <div className="flex items-center gap-2 text-xs text-slate-500">
                              <Mail size={12} /> {selectedClaim.user?.email || 'N/A'}
                           </div>
                           <div className="flex items-center gap-2 text-xs text-slate-500">
                              <Phone size={12} /> {selectedClaim.user?.phone || 'Not Provided'}
                           </div>
                        </div>
                      </div>
                    </section>

                    <section>
                       <h4 className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-3 flex items-center gap-1.5">
                        <Calendar size={12} className="text-purple-500" />
                        Submission Data
                      </h4>
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-500">Filed On</span>
                          <span className="text-sm font-semibold text-slate-800">{new Date(selectedClaim.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-500">Assigned Agent</span>
                          <span className="text-sm font-semibold text-slate-800">{selectedClaim.userPolicy?.agent?.name || 'Not Assigned'}</span>
                        </div>
                      </div>
                    </section>
                  </div>

                  {/* Bottom Strip: Description */}
                  <div className="col-span-2">
                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-3 flex items-center gap-1.5">
                        <AlertCircle size={12} className="text-slate-400" />
                        Claim Statement
                    </h4>
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                       <p className="text-sm text-slate-600 leading-relaxed italic">
                         "{selectedClaim.description || 'No description provided by user.'}"
                       </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <button 
                  onClick={() => setIsViewModalOpen(false)}
                  className="px-6 py-2 rounded-lg bg-slate-800 text-white text-sm font-bold shadow-lg shadow-slate-200 hover:bg-black transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Edit Modal ── */}
      <AnimatePresence>
        {isEditModalOpen && selectedClaim && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-200">
                    <Edit size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 leading-tight">Review Claim</h3>
                    <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">Update status for #{selectedClaim._id?.slice(-8).toUpperCase()}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 space-y-8">
                  {/* Summary Card */}
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 shadow-inner flex items-center gap-5">
                      <div className="w-14 h-14 rounded-full bg-white border-4 border-slate-200 flex items-center justify-center font-bold text-slate-700 text-lg shadow-sm">
                          {selectedClaim.user?.name?.charAt(0) || 'U'}
                      </div>
                      <div className="flex-1">
                          <p className="text-base font-bold text-slate-800">{selectedClaim.user?.name || 'Unknown'}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                              <Shield size={10} className="text-blue-500" />
                              {selectedClaim.userPolicy?.policy?.policyName || 'General Policy'}
                          </p>
                      </div>
                      <div className="text-right">
                          <p className="text-lg font-extrabold text-emerald-600 tracking-tight">₹{selectedClaim.amount?.toLocaleString()}</p>
                          <p className="text-[10px] uppercase font-bold text-slate-400">Claim Amount</p>
                      </div>
                  </div>

                  {/* Actions Grid */}
                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-4 text-center">Select New Status</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <button 
                            onClick={() => updateStatus('Approved')}
                            disabled={statusMutation.isLoading}
                            className={`group h-24 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 
                                ${selectedClaim.status === 'Approved' ? 'bg-emerald-50 border-emerald-500 text-emerald-600' : 'bg-white border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30'}`}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${selectedClaim.status === 'Approved' ? 'bg-emerald-500 text-white' : 'bg-emerald-50 text-emerald-600 group-hover:scale-110'}`}>
                                <CheckCircle2 size={20} />
                            </div>
                            <span className="text-sm font-bold">Approve</span>
                        </button>

                        <button 
                            onClick={() => updateStatus('Pending')}
                            disabled={statusMutation.isLoading}
                            className={`group h-24 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 
                                ${selectedClaim.status === 'Pending' ? 'bg-amber-50 border-amber-500 text-amber-600' : 'bg-white border-slate-100 hover:border-amber-200 hover:bg-amber-50/30'}`}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${selectedClaim.status === 'Pending' ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-600 group-hover:scale-110'}`}>
                                <Clock size={20} />
                            </div>
                            <span className="text-sm font-bold">Pending</span>
                        </button>

                        <button 
                            onClick={() => updateStatus('Review')}
                            disabled={statusMutation.isLoading}
                            className={`group h-24 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 
                                ${selectedClaim.status === 'Review' ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-slate-100 hover:border-blue-200 hover:bg-blue-50/30'}`}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${selectedClaim.status === 'Review' ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-600 group-hover:scale-110'}`}>
                                <Activity size={20} />
                            </div>
                            <span className="text-sm font-bold">In Review</span>
                        </button>

                        <button 
                            onClick={() => updateStatus('Rejected')}
                            disabled={statusMutation.isLoading}
                            className={`group h-24 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 
                                ${selectedClaim.status === 'Rejected' ? 'bg-rose-50 border-rose-500 text-rose-600' : 'bg-white border-slate-100 hover:border-rose-200 hover:bg-rose-50/30'}`}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${selectedClaim.status === 'Rejected' ? 'bg-rose-500 text-white' : 'bg-rose-50 text-rose-600 group-hover:scale-110'}`}>
                                <AlertTriangle size={20} />
                            </div>
                            <span className="text-sm font-bold">Reject</span>
                        </button>
                    </div>
                  </div>

                  <div className="pt-2">
                      <div className="p-4 bg-orange-50/50 rounded-xl border border-orange-100 flex items-start gap-4">
                          <AlertCircle className="text-orange-400 mt-0.5 flex-shrink-0" size={18} />
                          <p className="text-xs text-orange-700 leading-relaxed font-medium">
                              Updating the status will send an automated email notification to the customer with the new claim state and relevant instructions.
                          </p>
                      </div>
                  </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-center">
                 <p className="text-[10px] text-slate-400 font-medium">SHIELDPRO ADMINISTRATIVE CONSOLE</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminClaims;