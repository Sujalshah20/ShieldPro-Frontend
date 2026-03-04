import React, { useEffect, useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";

const Reveal = ({ children, width = "fit-content", delay = 0.25, direction = "up" }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });
    const mainControls = useAnimation();

    useEffect(() => {
        if (isInView) {
            mainControls.start("visible");
        }
    }, [isInView, mainControls]);

    const variants = {
        hidden: {
            opacity: 0,
            y: direction === "up" ? 50 : direction === "down" ? -50 : 0,
            x: direction === "left" ? 50 : direction === "right" ? -50 : 0
        },
        visible: {
            opacity: 1,
            y: 0,
            x: 0
        },
    };

    return (
        <div ref={ref} style={{ position: "relative", width, overflow: "hidden" }}>
            <motion.div
                variants={variants}
                initial="hidden"
                animate={mainControls}
                transition={{
                    duration: 0.6,
                    delay,
                    ease: [0.22, 1, 0.36, 1] // Custom cubic-bezier for premium feel
                }}
            >
                {children}
            </motion.div>
        </div>
    );
};

export default Reveal;
