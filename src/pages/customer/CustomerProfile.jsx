import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "../../hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../utils/api";

const CustomerProfile = () => {
    const { user, profile, setProfile } = useContext(AuthContext);
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['profile', user?.token],
        queryFn: () => api.get('/users/profile', user.token),
        enabled: !!user?.token,
        onSuccess: data => {
            setForm(data);
            setProfile(data);
        }
    });

    const [form, setForm] = useState({ name: '', phone: '', address: '' });

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            const updated = await api.put('/users/profile', form, user.token);
            setProfile(updated);
            toast.success({ title: "Profile updated" });
            queryClient.invalidateQueries(['profile', user?.token]);
        } catch (err) {
            toast.error({ title: "Update failed", description: err.message });
        }
    };

    if (isLoading) return <p>Loading profile...</p>;

    return (
        <div className="max-w-2xl mx-auto glass p-8 rounded-lg">
            <h2 className="h2 mb-6">My Profile</h2>
            <div className="grid grid-cols-1 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm"
                        name="name" value={form.name || ""} onChange={handleChange}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm bg-gray-100"
                        name="email" value={profile?.email || ""} disabled
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm"
                        name="phone" value={form.phone || ""} onChange={handleChange}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <input
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm"
                        name="address" value={form.address || ""} onChange={handleChange}
                    />
                </div>
                <button onClick={handleSave} className="btn-primary w-full">Save</button>
            </div>
        </div>
    );
};

export default CustomerProfile;