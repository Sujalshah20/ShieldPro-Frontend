import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";

const CustomerClaims = () => {
    const { user } = useContext(AuthContext);

    const { data: myClaims = [], isLoading } = useQuery({
        queryKey: ['myClaims', user?.token],
        queryFn: () => api.get('/claims', user.token),
        enabled: !!user?.token
    });

    return (
        <div className="space-y-8">
            <h2 className="h2">My Claims</h2>
            {isLoading ? (
                <p>Loading...</p>
            ) : myClaims.length === 0 ? (
                <p className="text-gray-500">You have not filed any claims yet.</p>
            ) : (
                <div className="space-y-4">
                    {myClaims.map(c => (
                        <div key={c._id} className="card p-6">
                            <div className="font-semibold">Claim #{c.userPolicy?.policyNumber}</div>
                            <div className="text-sm text-gray-500">Status: {c.status}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomerClaims;