import React, { useState, useEffect, useContext } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/agent.css";
import { BentoGrid } from "../../components/lightswind/bento-grid";
import { FileText, Clock, DollarSign, Activity, PieChart as PieIcon, ShieldCheck } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { useToast } from "../../hooks/use-toast";
import { CardSkeleton, TableSkeleton } from "../../components/common/Skeleton";
import { api, API_BASE_URL } from "../../utils/api";

const AgentDashboard = () => {
  const { user } = useContext(AuthContext);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("policies");

  // Fetch available policies
  const { data: policies = [], isLoading: polLoading } = useQuery({
    queryKey: ['agentPolicies'],
    queryFn: () => api.get('/policies/available')
  });

  // Fetch all claims
  const { data: claims = [], isLoading: claimsLoading } = useQuery({
    queryKey: ['allClaims', user?.token],
    queryFn: () => api.get('/claims/all', user.token),
    enabled: !!user?.token
  });

  const loading = polLoading || claimsLoading;

  const handleStatusUpdate = async (claimId, status) => {
    try {
      await api.put(`/claims/${claimId}/status`, { status }, user.token);
      toast.success({
        title: "Status Updated",
        description: `Claim ${status} successfully!`
      });
      queryClient.invalidateQueries(['allClaims']);
    } catch (error) {
      console.error("Error updating claim status:", error);
      toast.error({
        title: "Error",
        description: "Something went wrong while updating status."
      });
    }
  };

  const statsCards = [
    {
      title: "Available Policies",
      description: `${policies.length} Ready to Sell`,
      icon: FileText,
      className: "col-span-1",
      background: <div className="absolute inset-0 bg-blue-500/10" />
    },
    {
      title: "Pending Claims",
      description: `${claims.filter(c => c.status === 'Pending').length} Awaiting Review`,
      icon: Clock,
      className: "col-span-1",
      background: <div className="absolute inset-0 bg-orange-500/10" />
    },
    {
      title: "Total Claims",
      description: `${claims.length} Processed Overall`,
      icon: DollarSign,
      className: "col-span-1",
      background: <div className="absolute inset-0 bg-green-500/10" />
    }
  ];

  const claimStats = [
    { name: "Pending", value: claims.filter(c => c.status === 'Pending').length },
    { name: "Approved", value: claims.filter(c => c.status === 'Approved').length },
    { name: "Rejected", value: claims.filter(c => c.status === 'Rejected').length },
  ];

  const COLORS = ["#f59e0b", "#10b981", "#ef4444"];

  return (
    <div className="agent-dashboard p-8 premium-gradient min-h-screen">
      <div className="mb-10">
        <h2 className="text-3xl font-bold mb-2">Agent Workspace</h2>
        <p className="opacity-70 font-medium">Service customers and manage claims efficiently with real-time insights.</p>
      </div>

      {/* Stats Cards Section */}
      <div className="mb-10">
        <BentoGrid cards={statsCards} columns={3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="glass p-6 rounded-3xl">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <PieIcon className="text-blue-600" /> Claims Status Distribution
          </h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={claimStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {claimStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-6 rounded-3xl">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <ShieldCheck className="text-green-600" /> Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setActiveTab('claims')}
              className="p-4 bg-orange-500/10 dark:bg-orange-500/20 rounded-2xl border border-orange-500/20 flex flex-col items-center gap-2 hover:bg-orange-500/30 transition-colors"
            >
              <Clock className="text-orange-600 dark:text-orange-400" />
              <span className="font-bold text-orange-700 dark:text-orange-300">Review Claims</span>
            </button>
            <button
              onClick={() => setActiveTab('policies')}
              className="p-4 bg-blue-500/10 dark:bg-blue-500/20 rounded-2xl border border-blue-500/20 flex flex-col items-center gap-2 hover:bg-blue-500/30 transition-colors"
            >
              <FileText className="text-blue-600 dark:text-blue-400" />
              <span className="font-bold text-blue-700 dark:text-blue-300">View Policies</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Section */}
      <div className="dashboard-section">
        {/* Tabs */}
        <div className="dashboard-tabs">
          <button
            className={`tab ${activeTab === "policies" ? "active" : ""}`}
            onClick={() => setActiveTab("policies")}
          >
            Available Policies
          </button>
          <button
            className={`tab ${activeTab === "claims" ? "active" : ""}`}
            onClick={() => setActiveTab("claims")}
          >
            Claim Processing
          </button>
        </div>

        {/* Content */}
        {activeTab === "policies" && (
          <div>
            <h3 className="section-title">Available Insurance Policies</h3>
            <div className="policies-grid">
              {loading ? (
                [1, 2, 3].map(i => <CardSkeleton key={i} />)
              ) : policies.map((policy) => (
                <div key={policy._id} className="policy-card">
                  <div className="policy-header">
                    <div>
                      <h3 className="policy-name">{policy.policyName}</h3>
                      <span className="policy-type">{policy.policyType}</span>
                    </div>
                    <div className="policy-price-container">
                      <div className="policy-premium">₹{policy.premiumAmount}</div>
                      <div className="policy-period">per {policy.durationYears} Year(s)</div>
                    </div>
                  </div>

                  <p className="policy-description">{policy.description || "Comprehensive insurance coverage."}</p>

                  <div className="policy-details">
                    <div className="detail-item">
                      <span className="detail-label">Coverage:</span>
                      <span className="detail-value">₹{policy.coverageAmount}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Duration:</span>
                      <span className="detail-value">{policy.durationYears} Year(s)</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "claims" && (
          <div className="claims-processing-container">
            <h3 className="section-title">Pending Claims Processing</h3>
            {loading ? (
              <div className="glass p-6 rounded-3xl">
                <TableSkeleton rows={4} />
              </div>
            ) : claims.length === 0 ? (
              <div className="empty-state">
                <p>No claims found in the system.</p>
              </div>
            ) : (
              <div className="claims-list">
                {claims.map((claim) => (
                  <div key={claim._id} className="claim-card-agent">
                    <div className="claim-header">
                      <div>
                        <h3 className="claim-title">Claim #{claim._id.substring(claim._id.length - 6).toUpperCase()}</h3>
                        <div className="claim-user">
                          <strong>Customer:</strong> {claim.user?.name} ({claim.user?.email})
                        </div>
                        <div className="claim-policy">
                          <strong>Policy:</strong> {claim.userPolicy?.policy?.policyName} (#{claim.userPolicy?.policyNumber})
                        </div>
                      </div>
                      <span className={`badge ${claim.status?.toLowerCase() === 'approved' ? 'badge-active' : claim.status?.toLowerCase() === 'rejected' ? 'badge-inactive' : 'badge-pending'}`}>
                        {claim.status}
                      </span>
                    </div>

                    <div className="claim-body">
                      <div className="claim-info-grid">
                        <div className="info-item">
                          <label>Requested Amount</label>
                          <div className="amount-value">₹{claim.amount}</div>
                        </div>
                        <div className="info-item">
                          <label>Date Filed</label>
                          <div>{new Date(claim.claimDate).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div className="claim-description-box">
                        <label>Description</label>
                        <p>{claim.description}</p>
                      </div>
                      {claim.documents && claim.documents.length > 0 && (
                        <div className="mt-4">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Attached Evidence</label>
                          <div className="flex flex-wrap gap-2">
                            {claim.documents.map((doc, idx) => (
                              <a
                                key={idx}
                                href={`${API_BASE_URL}${doc.url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 bg-card dark:bg-white/5 border border-border dark:border-white/10 px-3 py-2 rounded-xl hover:border-blue-500 transition-colors group"
                              >
                                <FileText size={14} className="text-blue-500" />
                                <span className="text-sm font-medium group-hover:text-blue-500">{doc.name || `Document ${idx + 1}`}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {claim.status === 'Pending' && (
                      <div className="claim-actions">
                        <button
                          className="btn-approve"
                          onClick={() => handleStatusUpdate(claim._id, 'Approved')}
                        >
                          Approve Claim
                        </button>
                        <button
                          className="btn-reject"
                          onClick={() => handleStatusUpdate(claim._id, 'Rejected')}
                        >
                          Reject Claim
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};


export default AgentDashboard;
