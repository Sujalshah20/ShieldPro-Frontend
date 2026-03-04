import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const Parallax = ({ children, offset = 50, direction = "up" }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const y = useTransform(
        scrollYProgress,
        [0, 1],
        direction === "up" ? [offset, -offset] : [-offset, offset]
    );

    return (
        <motion.div ref={ref} style={{ y }}>
            {children}
        </motion.div>
    );
};

export default Parallax;
