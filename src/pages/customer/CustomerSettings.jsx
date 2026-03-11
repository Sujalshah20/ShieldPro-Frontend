import React from "react";
import { useTheme } from "../../context/ThemeContext";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const CustomerSettings = () => {
    const { theme, toggleTheme } = useTheme();
    const { user } = useContext(AuthContext);

    return (
        <div className="max-w-2xl mx-auto glass p-8 rounded-lg">
            <h2 className="h2 mb-6">Settings</h2>
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-sm font-medium text-gray-700">Dark Mode</div>
                        <div className="text-xs text-gray-500">Current: {theme}</div>
                    </div>
                    <button
                        onClick={toggleTheme}
                        className="btn-primary px-4 py-2"
                    >
                        Toggle
                    </button>
                </div>
                <div>
                    <div className="text-sm font-medium text-gray-700">Email</div>
                    <div className="text-gray-600">{user?.email}</div>
                </div>
            </div>
        </div>
    );
};

export default CustomerSettings;