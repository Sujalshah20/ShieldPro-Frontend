import React from "react";
import { User } from "lucide-react";

const AgentProfile = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm mx-4">
            <div className="w-20 h-20 bg-slate-50 text-slate-600 rounded-2xl flex items-center justify-center mb-6">
                <User size={40} />
            </div>
            <h1 className="text-3xl font-bold text-slate-800">Agent Profile</h1>
            <p className="text-slate-500 mt-4 max-w-md">Personal identity armor is being updated for Sarah Jenkins. Profile management tools will be live soon.</p>
        </div>
    );
};

export default AgentProfile;
