import React, { useState, useEffect, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/customer.css";
import { BentoGrid } from "../../components/lightswind/bento-grid";
import { useNavigate } from "react-router-dom";
import { User, Shield, Clock, Plus, ArrowRight, Wallet, History, FileText, CheckCircle, AlertCircle, ClipboardList, Search, Filter } from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import { api, API_BASE_URL } from "../../utils/api";
import { useNotifications } from "../../context/NotificationContext";
import { generatePolicyPDF } from "../../utils/pdfUtils";
import Reveal from "../../components/common/Reveal";
import Parallax from "../../components/common/Parallax";
import Toggle from "../../components/common/Toggle";
import AnimatedBackground from "../../components/common/AnimatedBackground";
import WaveDivider from "../../components/common/WaveDivider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/lightswind/dialog";
import { CardSkeleton, TableSkeleton } from "../../components/common/Skeleton";

const CustomerDashboard = () => {
  const { user, profile, setProfile = () => { } } = useContext(AuthContext);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("browse");
  const [isAnnual, setIsAnnual] = useState(true);

  // Claim Modal State
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [selectedPolicyForClaim, setSelectedPolicyForClaim] = useState(null);
  const [claimForm, setClaimForm] = useState({
    amount: "",
    description: "",
    files: []
  });

  const { addNotification } = useNotifications();

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");

  // Fetch available policies
  const {
    data: availablePolicies = [],
    isLoading: isAvailLoading
  } = useQuery({
    queryKey: ['availablePolicies'],
    queryFn: () => api.get('/policies/available')
  });

  // Fetch my policies
  const {
    data: myPolicies = [],
    isLoading: isMyPolLoading
  } = useQuery({
    queryKey: ['myPolicies', user?.token],
    queryFn: () => api.get('/user-policies', user.token),
    enabled: !!user?.token
  });

  // Fetch my claims
  const {
    data: myClaims = [],
    isLoading: isClaimsLoading
  } = useQuery({
    queryKey: ['myClaims', user?.token],
    queryFn: () => api.get('/claims', user.token),
    enabled: !!user?.token
  });


  // Track status changes for notifications
  useEffect(() => {
    if (myClaims.length > 0) {
      const prevStatuses = JSON.parse(localStorage.getItem(`claim_statuses_${user?._id}`) || "{}");
      const currentStatuses = {};

      myClaims.forEach(claim => {
        currentStatuses[claim._id] = claim.status;

        // If status changed and it's not pending, notify!
        if (prevStatuses[claim._id] && prevStatuses[claim._id] !== claim.status) {
          addNotification({
            title: "Claim Status Update",
            message: `Your claim for policy #${claim.userPolicy?.policyNumber} has been ${claim.status}.`,
            type: claim.status === 'Approved' ? 'success' : 'error'
          });
        }
      });

      localStorage.setItem(`claim_statuses_${user?._id}`, JSON.stringify(currentStatuses));
    }
  }, [myClaims, user?._id]);

  const loading = isAvailLoading || isMyPolLoading || isClaimsLoading;

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleUpdateProfile = () => {
    toast.success({
      title: "Profile Updated",
      description: "Your profile has been updated successfully!"
    });
  };

  const handleBuyPolicy = (policy) => {
    if (myPolicies?.some(p => p.policy._id === policy._id)) {
      toast.warning({
        title: "Policy Owned",
        description: "You already own this policy!"
      });
      return;
    }

    // Redirect to Checkout Page
    navigate("checkout", { state: { policy } });
  };

  const handleRenewPolicy = (policy) => {
    toast.info({
      title: "Coming Soon",
      description: "Renewal functionality coming soon!"
    });
  };

  const handleCancelPolicy = (policy) => {
    toast.info({
      title: "Coming Soon",
      description: "Cancellation functionality coming soon!"
    });
  };

  const handleFileClaim = (policy) => {
    setSelectedPolicyForClaim(policy);
    setIsClaimModalOpen(true);
  };

  const submitClaim = async (e) => {
    e.preventDefault();
    if (!claimForm.amount || !claimForm.description) return;

    try {
      const formData = new FormData();
      formData.append('userPolicyId', selectedPolicyForClaim._id);
      formData.append('amount', Number(claimForm.amount));
      formData.append('description', claimForm.description);

      if (claimForm.files && claimForm.files.length > 0) {
        for (let i = 0; i < claimForm.files.length; i++) {
          formData.append('documents', claimForm.files[i]);
        }
      }

      const newClaim = await api.postForm('/claims', formData, user.token);

      setMyClaims([...myClaims, newClaim]);
      toast.success({
        title: "Claim Submitted",
        description: "Your claim has been submitted successfully!"
      });
      setIsClaimModalOpen(false);
      setClaimForm({ amount: "", description: "", files: [] });
      setActiveTab("claims");
    } catch (error) {
      console.error("Error filing claim:", error);
      toast.error({
        title: "Submission Failed",
        description: error.message || "Something went wrong while submitting the claim."
      });
    }
  };

  const statsCards = [
    {
      title: "My Policies",
      description: `${myPolicies.length} Total Insured`,
      icon: Shield,
      className: "col-span-1",
      background: <div className="absolute inset-0 bg-blue-500/10" />
    },
    {
      title: "Active Status",
      description: `${myPolicies.filter(p => p.status?.toLowerCase() === "active").length} Policies Live`,
      icon: CheckCircle,
      className: "col-span-1",
      background: <div className="absolute inset-0 bg-green-500/10" />
    },
    {
      title: "Pending Claims",
      description: `${myClaims.filter(c => c.status === 'Pending').length} In Review`,
      icon: ClipboardList,
      className: "col-span-1",
      background: <div className="absolute inset-0 bg-purple-500/10" />
    }
  ];

  const filteredPolicies = availablePolicies.filter(policy => {
    const matchesSearch = policy.policyName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "All" || policy.policyType === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <AnimatedBackground>
      <div className="customer-dashboard min-h-screen relative overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
        {/* Parallax Background Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] blur-[120px] opacity-10 pointer-events-none">
          <Parallax offset={100}>
            <div className="w-full h-full bg-blue-600 rounded-full" />
          </Parallax>
        </div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] blur-[150px] opacity-10 pointer-events-none">
          <Parallax offset={-120}>
            <div className="w-full h-full bg-purple-600 rounded-full" />
          </Parallax>
        </div>

        <div className="mb-10 flex justify-between items-center relative z-10">
          <div>
            <h2 className="text-3xl font-bold mb-2">Welcome Back, {profile?.name?.split(' ')[0] || user?.name?.split(' ')[0]}</h2>
            <p className="opacity-70 font-medium">Manage your protection and claims from your personal dashboard.</p>
          </div>
          <div className="flex items-center gap-3 bg-white dark:bg-white/5 p-3 rounded-2xl shadow-sm border border-slate-100 dark:border-white/10">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <User className="text-blue-600 dark:text-blue-400 w-5 h-5" />
            </div>
            <div className="text-sm">
              <div className="font-bold">{profile?.name || user?.name}</div>
              <div className="opacity-60 text-xs">Customer ID: #{user?._id?.substring(user._id.length - 6).toUpperCase()}</div>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <Reveal width="100%" direction="up">
            <BentoGrid cards={statsCards} columns={3} />
          </Reveal>
        </div>

        <WaveDivider color="rgba(37, 99, 235, 0.05)" className="mb-10" />

        <div className="dashboard-section relative z-20">
          <div className="dashboard-tabs">
            <button
              className={`tab ${activeTab === "browse" ? "active" : ""}`}
              onClick={() => setActiveTab("browse")}
            >
              Browse Policies
            </button>
            <button
              className={`tab ${activeTab === "mypolicies" ? "active" : ""}`}
              onClick={() => setActiveTab("mypolicies")}
            >
              My Policies
            </button>
            <button
              className={`tab ${activeTab === "claims" ? "active" : ""}`}
              onClick={() => setActiveTab("claims")}
            >
              My Claims
            </button>
            <button
              className={`tab ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              Profile
            </button>
          </div>

          {activeTab === "browse" && (
            <div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div className="flex flex-col gap-2">
                  <h3 className="section-title mb-0">Browse Available Policies</h3>
                  <p className="text-sm opacity-60">Find the perfect plan for your needs</p>
                </div>

                <div className="flex flex-wrap items-center gap-6">
                  <Toggle
                    isOn={isAnnual}
                    onToggle={() => setIsAnnual(!isAnnual)}
                    labelLeft="Monthly"
                    labelRight="Annual (Save 20%)"
                  />

                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                      <input
                        type="text"
                        placeholder="Search policies..."
                        className="pl-10 pr-4 py-2 rounded-xl glass border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <select
                      className="px-4 py-2 rounded-xl glass border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                    >
                      <option value="All">All Types</option>
                      <option value="Life">Life</option>
                      <option value="Health">Health</option>
                      <option value="Vehicle">Vehicle</option>
                      <option value="Property">Property</option>
                    </select>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="policies-grid">
                  {[1, 2, 3, 4].map(i => <CardSkeleton key={i} />)}
                </div>
              ) : filteredPolicies.length === 0 ? (
                <div className="empty-state">
                  <p>No policies found matching your criteria.</p>
                </div>
              ) : (
                <div className="policies-grid">
                  {filteredPolicies.map((policy) => (
                    <div key={policy._id} className="policy-card card-premium">
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

                      <button className="btn-block btn-tactile mt-4" onClick={() => handleBuyPolicy(policy)}>
                        Purchase Policy
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "mypolicies" && (
            <div>
              <h3 className="section-title">My Policies</h3>
              {loading ? (
                <div className="policies-list">
                  {[1, 2].map(i => <div key={i} className="glass p-8 rounded-3xl mb-4"><TableSkeleton rows={2} /></div>)}
                </div>
              ) : myPolicies.length === 0 ? (
                <div className="empty-state">
                  <p>You haven't purchased any policies yet.</p>
                  <button className="btn-link" onClick={() => setActiveTab("browse")}>Browse Policies</button>
                </div>
              ) : (
                <div className="policies-list">
                  {myPolicies.map((userPolicy) => (
                    <div key={userPolicy._id} className="purchased-policy-card card-premium">
                      <div className="pp-header">
                        <div>
                          <h3 className="pp-title">{userPolicy.policy?.policyName}</h3>
                          <div className="pp-id">Policy #{userPolicy.policyNumber}</div>
                          <span className="policy-type">{userPolicy.policy?.policyType}</span>
                        </div>
                        <span className={`badge ${userPolicy.status?.toLowerCase() === 'active' ? 'badge-active' : 'badge-inactive'}`}>
                          {userPolicy.status}
                        </span>
                      </div>

                      <div className="pp-details-grid">
                        <div className="pp-item">
                          <label>Premium Paid</label>
                          <div className="pp-value">₹{userPolicy.premiumPaid}</div>
                        </div>
                        <div className="pp-item">
                          <label>Coverage</label>
                          <div className="pp-value">₹{userPolicy.policy?.coverageAmount}</div>
                        </div>
                        <div className="pp-item">
                          <label>Purchased On</label>
                          <div className="pp-value">{new Date(userPolicy.purchaseDate).toLocaleDateString()}</div>
                        </div>
                        <div className="pp-item">
                          <label>Expiry Date</label>
                          <div className="pp-value">{new Date(userPolicy.expiryDate).toLocaleDateString()}</div>
                        </div>
                      </div>

                      <div className="pp-actions mt-6 grid grid-cols-2 gap-3">
                        <button className="btn-outline btn-tactile flex items-center justify-center gap-2" onClick={() => generatePolicyPDF(userPolicy)}>
                          <FileText size={16} />
                          Certificate
                        </button>
                        <button className="btn-primary btn-tactile flex items-center justify-center gap-2" onClick={() => handleFileClaim(userPolicy)}>
                          <Plus size={16} />
                          File Claim
                        </button>
                        <button className="btn-outline btn-tactile text-slate-400 text-xs" onClick={() => handleRenewPolicy(userPolicy)}>Renew</button>
                        <button className="btn-danger-outline btn-tactile text-xs" onClick={() => handleCancelPolicy(userPolicy)}>Cancel</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "claims" && (
            <div>
              <h3 className="section-title">My Claims</h3>
              {loading ? (
                <div className="glass p-6 rounded-3xl">
                  <TableSkeleton rows={5} />
                </div>
              ) : myClaims.length === 0 ? (
                <div className="empty-state">
                  <p>You haven't filed any claims yet.</p>
                </div>
              ) : (
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>POLICY</th>
                        <th>CLAIM ID</th>
                        <th>AMOUNT</th>
                        <th>DATE</th>
                        <th>STATUS</th>
                        <th>DOCS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myClaims.map((claim) => (
                        <tr key={claim._id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                          <td className="font-medium">{claim.userPolicy?.policy?.policyName || claim.userPolicy?.policyName || "Multi-Risk Health"}</td>
                          <td className="font-mono text-xs opacity-70">#{claim._id?.substring(claim._id.length - 8).toUpperCase()}</td>
                          <td className="font-bold">₹{claim.amount}</td>
                          <td>{new Date(claim.claimDate || claim.createdAt).toLocaleDateString()}</td>
                          <td>
                            <span className={`badge ${claim.status?.toLowerCase() === 'approved' ? 'badge-active' : claim.status?.toLowerCase() === 'rejected' ? 'badge-inactive' : 'badge-pending'}`}>
                              {claim.status}
                            </span>
                          </td>
                          <td>
                            {claim.documents && claim.documents.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {claim.documents.map((doc, idx) => (
                                  <a
                                    key={idx}
                                    href={`${API_BASE_URL}${doc.url}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100 hover:bg-blue-100"
                                  >
                                    Doc {idx + 1}
                                  </a>
                                ))}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "profile" && (
            <div className="glass p-8 rounded-3xl max-w-2xl">
              <h3 className="text-xl font-bold mb-6">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profile?.name || ""}
                    onChange={handleProfileChange}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10"
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={profile?.email || ""}
                    disabled
                    className="w-full p-3 rounded-xl bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 opacity-60"
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={profile?.phone || ""}
                    onChange={handleProfileChange}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10"
                  />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    name="address"
                    value={profile?.address || ""}
                    onChange={handleProfileChange}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10"
                  />
                </div>
              </div>
              <button className="btn-primary mt-8 px-8" onClick={handleUpdateProfile}>Save Changes</button>
            </div>
          )}
        </div>

        {/* File Claim Dialog */}
        <Dialog open={isClaimModalOpen} onOpenChange={setIsClaimModalOpen}>
          <DialogContent className="dark:bg-[#0a0a0a] dark:border-white/10 sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="dark:text-white text-2xl">File Insurance Claim</DialogTitle>
              <DialogDescription className="dark:text-slate-400">
                Submit a new claim for {selectedPolicyForClaim?.policy?.policyName}. Please provide accurate details.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={submitClaim} className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium dark:text-slate-200">Claim Amount (₹)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  required
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 dark:text-white"
                  value={claimForm.amount}
                  onChange={(e) => setClaimForm({ ...claimForm, amount: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium dark:text-slate-200">Description</label>
                <textarea
                  placeholder="Describe the incident or reason for claim..."
                  required
                  rows={4}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 dark:text-white"
                  value={claimForm.description}
                  onChange={(e) => setClaimForm({ ...claimForm, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium dark:text-slate-200">Upload Evidence (Max 5 files)</label>
                <input
                  type="file"
                  multiple
                  accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 dark:text-white text-sm"
                  onChange={(e) => setClaimForm({ ...claimForm, files: Array.from(e.target.files) })}
                />
                <p className="text-[10px] text-slate-500 italic">Allowed: JPG, PNG, PDF, DOC (Max 5MB each)</p>
              </div>
              <DialogFooter className="pt-4">
                <button
                  type="button"
                  className="btn-outline px-6"
                  onClick={() => setIsClaimModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary px-8">
                  Submit Claim
                </button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AnimatedBackground>
  );
};

export default CustomerDashboard;
