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
      title: "Assigned Customers",
      description: `${agentStats?.stats?.assignedCustomers || 0} active clients`,
      icon: Users,
      className: "col-span-1",
      background: <div className="absolute inset-0 bg-gold/5" />
    },
    {
      title: "Pending Apps",
      description: `${agentStats?.stats?.pendingApplications || 0} under review`,
      icon: Clock,
      className: "col-span-1",
      background: <div className="absolute inset-0 bg-orange-500/5" />
    },
    {
      title: "Active Policies",
      description: `${agentStats?.stats?.activePolicies || 0} live plans`,
      icon: ShieldCheck,
      className: "col-span-1",
      background: <div className="absolute inset-0 bg-green-500/5" />
    },
    {
        title: "Total Commission",
        description: `₹${agentStats?.stats?.totalCommission?.toLocaleString() || 0}`,
        icon: DollarSign,
        className: "col-span-1",
        background: <div className="absolute inset-0 bg-gold/10" />
      }
  ];

  const claimStats = agentStats?.charts?.claimStatusDistribution || [];

  const COLORS = ["#f59e0b", "#10b981", "#ef4444"];

  return (
    <div className="agent-dashboard p-8 premium-gradient min-h-screen">
      <div className="mb-10">
        <h2 className="text-4xl font-black mb-2 tracking-tight">Agent <span className="text-gold">Workspace</span></h2>
        <p className="opacity-70 font-medium">Service customers and manage claims efficiently with real-time insights.</p>
      </div>

      {/* Stats Cards Section */}
      <div className="mb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((card, idx) => (
              <div key={idx} className="glass p-8 rounded-[2rem] border border-border/50 relative overflow-hidden group hover:border-gold/30 transition-all">
                  {card.background}
                  <div className="relative z-10">
                      <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center text-gold mb-4 group-hover:bg-gold group-hover:text-gold-foreground transition-all">
                          <card.icon size={24} />
                      </div>
                      <h3 className="text-sm font-bold opacity-50 uppercase tracking-widest mb-1">{card.title}</h3>
                      <p className="text-2xl font-black">{card.description}</p>
                  </div>
              </div>
          ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="glass p-8 rounded-[2.5rem]">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <PieIcon className="text-gold" /> Claims Status Distribution
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={claimStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {claimStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px' }}
                    itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass p-8 rounded-[2.5rem]">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Activity className="text-gold" /> Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
              <Link to="/agent/clients" className="p-6 bg-gold/5 border border-gold/10 rounded-3xl hover:bg-gold/10 transition-colors group">
                  <Users className="text-gold mb-3 group-hover:scale-110 transition-transform" />
                  <h4 className="font-bold">Manage Clients</h4>
                  <p className="text-xs opacity-50 mt-1">View assigned list</p>
              </Link>
              <Link to="/agent/policies" className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-3xl hover:bg-blue-500/10 transition-colors group">
                  <ShieldCheck className="text-blue-500 mb-3 group-hover:scale-110 transition-transform" />
                  <h4 className="font-bold">Recommendation</h4>
                  <p className="text-xs opacity-50 mt-1">Propose new plans</p>
              </Link>
          </div>
        </div>
      </div>
    </div>
  );
};


export default AgentDashboard;
