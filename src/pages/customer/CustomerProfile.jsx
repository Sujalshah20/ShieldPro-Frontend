import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "../../hooks/use-toast";

const CustomerProfile = () => {
    const { profile, setProfile } = useContext(AuthContext);
    const { toast } = useToast();
    const [form, setForm] = useState({ ...profile });

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        setProfile(form);
        toast.success({ title: "Profile saved" });
    };

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
                        name="email" value={form.email || ""} disabled
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm"
                        name="phone" value={form.phone || ""} onChange={handleChange}
                    />
                </div>
                <button onClick={handleSave} className="btn-primary w-full">Save</button>
            </div>
        </div>
    );
};

export default CustomerProfile;