import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/agent.css";
import { BentoGrid } from "../../components/lightswind/bento-grid";
import { FileText, Clock, DollarSign, Activity, PieChart as PieIcon } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { CardSkeleton, TableSkeleton } from "../../components/common/Skeleton";
import { api, API_BASE_URL } from "../../utils/api";
import { Button } from "@/components/lightswind/button";

const AgentDashboard = () => {
  const { user } = useContext(AuthContext);

  const { data: agentStats, isLoading: statsLoading } = useQuery({
    queryKey: ['agentStats', user?.token],
    queryFn: () => api.get('/stats/agent', user.token),
    enabled: !!user?.token
  });

  if (statsLoading) return <div className="p-8"><TableSkeleton rows={10} cols={5} /></div>;

  const statsCards = [
    {
      title: "Assigned Policies",
      description: `${agentStats?.stats?.assignedPolicies || 0} Assigned`,
      icon: FileText,
      className: "col-span-1",
      background: <div className="absolute inset-0 bg-blue-500/10" />
    },
    {
      title: "Pending Claims",
      description: `${agentStats?.stats?.pendingClaims || 0} Awaiting Review`,
      icon: Clock,
      className: "col-span-1",
      background: <div className="absolute inset-0 bg-orange-500/10" />
    },
    {
      title: "Total Commission",
      description: `₹${agentStats?.stats?.totalCommission?.toLocaleString() || 0}`,
      icon: DollarSign,
      className: "col-span-1",
      background: <div className="absolute inset-0 bg-green-500/10" />
    }
  ];

  const claimStats = agentStats?.charts?.claimStatusDistribution || [];

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
            <Activity className="text-green-600" /> Recent Activity
          </h3>
          <div className="space-y-4">
            {/* Placeholder for recent activities */}
            <div className="flex items-center justify-between">
              <p>New claim submitted by John Doe.</p>
              <Button variant="outline" size="sm">View</Button>
            </div>
            <div className="flex items-center justify-between">
              <p>Policy "Basic Auto" sold to Jane Smith.</p>
              <Button variant="outline" size="sm">View</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default AgentDashboard;
