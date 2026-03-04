import React from "react";
import { motion } from "framer-motion";

const Toggle = ({ isOn, onToggle, labelLeft = "", labelRight = "" }) => {
    return (
        <div className="flex items-center gap-4">
            {labelLeft && <span className={`text-sm font-medium ${!isOn ? "text-blue-600" : "opacity-50"}`}>{labelLeft}</span>}
            <div
                className="w-14 h-8 flex items-center bg-slate-200 dark:bg-white/10 rounded-full p-1 cursor-pointer transition-colors duration-300"
                onClick={onToggle}
            >
                <motion.div
                    className="w-6 h-6 bg-white dark:bg-blue-500 rounded-full shadow-md"
                    layout
                    transition={{
                        type: "spring",
                        stiffness: 700,
                        damping: 30
                    }}
                    animate={{
                        x: isOn ? 24 : 0
                    }}
                />
            </div>
            {labelRight && <span className={`text-sm font-medium ${isOn ? "text-blue-600" : "opacity-50"}`}>{labelRight}</span>}
        </div>
    );
};

export default Toggle;
