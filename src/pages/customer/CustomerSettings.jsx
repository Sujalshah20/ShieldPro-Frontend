import React, { useState } from "react";

const CustomerSettings = () => {
    const [darkMode, setDarkMode] = useState(false);

    return (
        <div className="max-w-2xl mx-auto glass p-8 rounded-lg">
            <h2 className="h2 mb-6">Settings</h2>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Dark Mode</span>
                    <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
                </div>
                <p className="text-sm text-gray-500">More settings coming soon.</p>
            </div>
        </div>
    );
};

export default CustomerSettings;