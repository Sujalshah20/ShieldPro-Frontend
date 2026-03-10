import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utils/api";

const CustomerPolicies = () => {
    const { user } = useContext(AuthContext);

    const { data: myPolicies = [], isLoading } = useQuery({
        queryKey: ['myPolicies', user?.token],
        queryFn: () => api.get('/user-policies', user.token),
        enabled: !!user?.token
    });

    return (
        <div className="space-y-8">
            <h2 className="h2">My Policies</h2>
            {isLoading ? (
                <p>Loading...</p>
            ) : myPolicies.length === 0 ? (
                <p className="text-gray-500">You haven't purchased any policies yet.</p>
            ) : (
                <div className="grid grid-cols-3 gap-12">
                    {myPolicies.map(p => (
                        <div key={p._id} className="card p-6">
                            <div className="font-semibold">{p.policy?.policyName}</div>
                            <div className="text-sm text-gray-500">{p.policy?.policyType}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomerPolicies;