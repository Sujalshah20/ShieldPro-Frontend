import React, { useState, useEffect, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/admin.css";
import { BentoGrid } from "../../components/lightswind/bento-grid";
import { Shield, Users, UserCheck, CheckCircle, FileText, Activity, Globe as GlobeIcon } from "lucide-react";
import Globe from "../../components/lightswind/globe";
import { api } from "../../utils/api";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "../../components/lightswind/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { useToast } from "../../hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/lightswind/alert-dialog";
import { TableSkeleton } from "../../components/common/Skeleton";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("policies");

  // Fetch policies using React Query
  const { data: policiesRAW = [], isLoading: loading } = useQuery({
    queryKey: ['adminPolicies', user?.token],
    queryFn: () => api.get('/policies', user.token),
    enabled: !!user?.token
  });

  // Fetch dashboard stats
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['adminStats', user?.token],
    queryFn: () => api.get('/stats/admin', user.token),
    enabled: !!user?.token
  });

  // Map policies for display
  const policies = policiesRAW.map(p => ({
    id: p._id,
    name: p.policyName,
    type: p.policyType,
    premium: `₹${p.premiumAmount}`,
    coverage: `₹${p.coverageAmount}`,
    duration: `${p.durationYears} Year(s)`,
    status: p.status.toLowerCase()
  }));

  const customers = statsData?.recentUsers || [];
  const agents = statsData?.recentAgents || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [policyToDelete, setPolicyToDelete] = useState(null);
  const [newPolicy, setNewPolicy] = useState({
    name: "",
    type: "Health",
    premium: "",
    coverage: "",
    duration: "",
  });

  // Actions
  const handleCreatePolicy = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewPolicy({
      name: "",
      type: "Health",
      premium: "",
      coverage: "",
      duration: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPolicy({ ...newPolicy, [name]: value });
  };

  const handleSubmitPolicy = async (e) => {
    e.preventDefault();

    const policyData = {
      policyName: newPolicy.name,
      policyType: newPolicy.type,
      premiumAmount: Number(newPolicy.premium),
      coverageAmount: Number(newPolicy.coverage),
      durationYears: parseInt(newPolicy.duration) || 1
    };

    try {
      const savedPolicy = await api.post('/policies', policyData, user.token);
      if (savedPolicy) {
        toast.success({
          title: "Policy Created",
          description: "Policy created successfully!"
        });
        queryClient.invalidateQueries(['adminPolicies']);
        closeModal();
      } else {
        const errorData = await response.json();
        toast.error({
          title: "Error",
          description: errorData.message
        });
      }
    } catch (error) {
      console.error("Error creating policy:", error);
      toast.error({
        title: "Error",
        description: "Something went wrong while saving the policy."
      });
    }
  };

  const togglePolicyStatus = (id) => {
    setPolicies(
      policies.map((policy) =>
        policy.id === id
          ? {
            ...policy,
            status: policy.status === "active" ? "inactive" : "active",
          }
          : policy
      )
    );
  };

  const deletePolicy = (id) => {
    setPolicyToDelete(id);
  };

  const confirmDelete = async () => {
    if (policyToDelete) {
      try {
        await api.delete(`/policies/${policyToDelete}`, user.token);
        toast.success({
          title: "Policy Deleted",
          description: "The policy has been removed successfully."
        });
        queryClient.invalidateQueries(['adminPolicies']);
      } catch (error) {
        toast.error({
          title: "Delete Failed",
          description: error.message || "Failed to delete the policy."
        });
      } finally {
        setPolicyToDelete(null);
      }
    }
  };

  const statsCards = [
    {
      title: "Global Reach",
      description: "Monitoring worldwide policy distribution",
      icon: GlobeIcon,
      className: "col-span-1 md:col-span-2 row-span-2",
      background: <div className="absolute inset-0 flex items-center justify-center opacity-40"><Globe className="w-full h-full" /></div>
    },
    {
      title: "Total Revenue",
      description: `₹${statsData?.stats?.totalRevenue?.toLocaleString() || 0}`,
      icon: Activity,
      className: "col-span-1",
      background: <div className="absolute inset-0 bg-blue-500/10" />
    },
    {
      title: "Active Policies",
      description: `${statsData?.stats?.activePolicies || 0} Guaranteed`,
      icon: Shield,
      className: "col-span-1",
      background: <div className="absolute inset-0 bg-green-500/10" />
    },
    {
      title: "Total Customers",
      description: `${statsData?.stats?.totalCustomers || 0} Registered`,
      icon: Users,
      className: "col-span-1",
      background: <div className="absolute inset-0 bg-purple-500/10" />
    },
    {
      title: "Active Agents",
      description: `${statsData?.stats?.totalAgents || 0} On Duty`,
      icon: UserCheck,
      className: "col-span-1",
      background: <div className="absolute inset-0 bg-orange-500/10" />
    }
  ];

  const chartData = statsData?.charts?.policyDistribution || [];
  const claimData = statsData?.charts?.claimStatusDistribution || [];
  const performanceData = statsData?.charts?.performanceData || [];

  const COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444"];

  return (
    <div className="admin-dashboard p-8 premium-gradient min-h-screen">
      <div className="mb-10">
        <h2 className="text-3xl font-bold mb-2">Administrator Control Center</h2>
        <p className="opacity-70 font-medium tracking-tight">System-wide monitoring, policy orchestration, and claim management.</p>
      </div>

      {/* Stats Cards Section */}
      <div className="mb-10">
        <BentoGrid cards={statsCards} columns={4} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="glass p-6 rounded-3xl">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Activity className="text-blue-600" /> Policy Distribution
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
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
            <Shield className="text-purple-600" /> Recent Performance
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
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
            Policies
          </button>
          <button
            className={`tab ${activeTab === "customers" ? "active" : ""}`}
            onClick={() => setActiveTab("customers")}
          >
            Customers
          </button>
          <button
            className={`tab ${activeTab === "agents" ? "active" : ""}`}
            onClick={() => setActiveTab("agents")}
          >
            Agents
          </button>
        </div>

        {/* Header & Actions */}
        <div className="section-header">
          <h3>
            {activeTab === "policies"
              ? "Policy Management"
              : activeTab === "customers"
                ? "Customer Management"
                : "Agent Management"}
          </h3>
          {activeTab === "policies" && (
            <button className="btn-primary" onClick={handleCreatePolicy}>
              + Create New Policy
            </button>
          )}
        </div>

        {/* Content */}
        <div className="table-container">
          {(loading || statsLoading) ? (
            <div className="glass p-8 rounded-3xl">
              <TableSkeleton rows={8} />
            </div>
          ) : activeTab === "policies" && (
            <table className="table">
              <thead>
                <tr>
                  <th>POLICY NAME</th>
                  <th>TYPE</th>
                  <th>PREMIUM</th>
                  <th>COVERAGE</th>
                  <th>DURATION</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {policies.map((policy) => (
                  <tr key={policy.id}>
                    <td>
                      <strong>{policy.name}</strong>
                    </td>
                    <td>{policy.type}</td>
                    <td>{policy.premium}</td>
                    <td>{policy.coverage}</td>
                    <td>{policy.duration}</td>
                    <td>
                      <span
                        className={`badge ${policy.status === "active"
                          ? "badge-active"
                          : "badge-inactive"
                          }`}
                      >
                        {policy.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="action-btn text-blue-600 dark:text-blue-400"
                        onClick={() => togglePolicyStatus(policy.id)}
                      >
                        {policy.status === "active" ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        className="action-btn text-red-600 dark:text-red-400"
                        onClick={() => deletePolicy(policy.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === "customers" && (
            <table className="table">
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>EMAIL</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td>
                      <strong>{customer.name}</strong>
                    </td>
                    <td>{customer.email}</td>
                    <td>
                      <span className="badge badge-active">Active</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === "agents" && (
            <table className="table">
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>EMAIL</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {agents.map((agent) => (
                  <tr key={agent.id}>
                    <td>
                      <strong>{agent.name}</strong>
                    </td>
                    <td>{agent.email}</td>
                    <td>
                      <span className="badge badge-active">Active</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create New Policy</h3>
              <button className="close-btn" onClick={closeModal}>
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmitPolicy}>
              <div className="form-group">
                <label>Policy Name</label>
                <input
                  type="text"
                  name="name"
                  value={newPolicy.name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Health Shield Basic"
                />
              </div>

              <div className="form-group">
                <label>Type</label>
                <select
                  name="type"
                  value={newPolicy.type}
                  onChange={handleInputChange}
                >
                  <option value="Health">Health</option>
                  <option value="Life">Life</option>
                  <option value="Auto">Auto</option>
                  <option value="Property">Property</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Premium (₹)</label>
                  <input
                    type="number"
                    name="premium"
                    value={newPolicy.premium}
                    onChange={handleInputChange}
                    required
                    placeholder="5000"
                  />
                </div>
                <div className="form-group">
                  <label>Coverage (₹)</label>
                  <input
                    type="number"
                    name="coverage"
                    value={newPolicy.coverage}
                    onChange={handleInputChange}
                    required
                    placeholder="500000"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Duration</label>
                <input
                  type="text"
                  name="duration"
                  value={newPolicy.duration}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. 1 Year"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Policy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Alert */}
      <AlertDialog open={!!policyToDelete} onOpenChange={(open) => !open && setPolicyToDelete(null)}>
        <AlertDialogContent className="dark:bg-[#0a0a0a] dark:border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="dark:text-white">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="dark:text-slate-400">
              This action cannot be undone. This will permanently delete the policy from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="dark:bg-white/5 dark:text-white dark:border-white/10">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white border-none"
            >
              Delete Policy
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminDashboard;
