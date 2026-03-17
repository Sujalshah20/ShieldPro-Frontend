import React from "react";
import { SearchCheck } from "lucide-react";

const AgentVerification = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm mx-4">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <SearchCheck size={40} />
            </div>
            <h1 className="text-3xl font-bold text-slate-800">Document Verification</h1>
            <p className="text-slate-500 mt-4 max-w-md">The verification engine is being calibrated for the new premium interface. Please check back soon.</p>
        </div>
    );
};

export default AgentVerification;
