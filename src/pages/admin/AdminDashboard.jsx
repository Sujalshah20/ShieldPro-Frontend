import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/admin.css";
import { BentoGrid } from "../../components/lightswind/bento-grid";
import { Shield, Users, UserCheck, Activity, Globe as GlobeIcon, FileText } from "lucide-react";
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
import { Button } from "@/components/lightswind/button";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);

  // Fetch dashboard stats
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['adminStats', user?.token],
    queryFn: () => api.get('/stats/admin', user.token),
    enabled: !!user?.token
  });

  if (statsLoading) {
    return <div className="p-8"><TableSkeleton rows={10} cols={5} /></div>;
  }

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
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="glass p-6 rounded-3xl">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Activity className="text-green-600" /> Recent Activity
        </h3>
        <div className="space-y-4">
          {statsData?.recentActivities?.map((activity, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full">
                  {activity.type === 'new_user' && <Users className="h-5 w-5 text-gray-600 dark:text-gray-300" />}
                  {activity.type === 'new_policy' && <Shield className="h-5 w-5 text-gray-600 dark:text-gray-300" />}
                  {activity.type === 'new_claim' && <FileText className="h-5 w-5 text-gray-600 dark:text-gray-300" />}
                </div>
                <div>
                  <p className="font-semibold">{activity.description}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(activity.date).toLocaleString()}</p>
                </div>
              </div>
              <Button variant="outline" size="sm">View</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
