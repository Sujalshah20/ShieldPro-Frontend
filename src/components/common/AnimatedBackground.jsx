import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground = ({ children }) => {
    return (
        <div className="relative min-h-screen overflow-hidden bg-background text-foreground transition-colors duration-300">
            {/* Animated Mesh Base */}
            <div className="absolute inset-0 z-0 opacity-30 dark:opacity-20 mesh-gradient-premium" />

            {/* Floating Blobs */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        x: [0, 100, 0],
                        y: [0, -150, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/20 blur-[100px] rounded-full"
                />
                <motion.div
                    animate={{
                        x: [0, -120, 0],
                        y: [0, 100, 0],
                        scale: [1, 0.8, 1],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-500/20 blur-[120px] rounded-full"
                />
                <motion.div
                    animate={{
                        x: [0, 80, 0],
                        y: [0, 80, 0],
                    }}
                    transition={{
                        duration: 18,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-cyan-500/15 blur-[80px] rounded-full"
                />
            </div>

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};

export default AnimatedBackground;
