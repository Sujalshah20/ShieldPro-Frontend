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
} from "lucide-react";
import { useToast } from "../../hooks/use-toast";



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


  /* live data – falls back to mock gracefully */
  const { data: apiClaims, isLoading } = useQuery({
    queryKey: ["adminClaims", user?.token],
    queryFn: () => api.get("/admin/claims", user.token),
    enabled: !!user?.token,
  });

  const statusMutation = useMutation({
    mutationFn: (data) =>
      api.put(`/admin/claims/${data.id}/status`, { status: data.status }, user.token),
    onSuccess: () => {
      queryClient.invalidateQueries(["adminClaims"]);
      toast({ title: "Claim status updated" });
    },
  });

  /* Use API data */
  const displayClaims = apiClaims || [];

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
                ].map((col) => (
                  <th
                    key={col}
                    className="px-4 py-3 text-[10px] uppercase tracking-widest font-semibold text-slate-400 whitespace-nowrap"
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

                    {/* Status */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${statusInfo.dot}`} />
                        <span className={`text-xs font-medium ${statusInfo.text}`}>
                          {c.status}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>


      </div>
    </div>
  );
};

export default AdminClaims;