import React from "react";
import { TrendingUp } from "lucide-react";

const AgentPerformance = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm mx-4">
            <div className="w-20 h-20 bg-blue-50 text-[#124C89] rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp size={40} />
            </div>
            <h1 className="text-3xl font-bold text-slate-800">Performance Report</h1>
            <p className="text-slate-500 mt-4 max-w-md">Your analytics and yield mapping modules are being synchronized. Full operational reports will be available shortly.</p>
        </div>
    );
};

export default AgentPerformance;
