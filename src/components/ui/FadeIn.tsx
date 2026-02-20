"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FadeInProps {
    children: ReactNode;
    delay?: number;
    duration?: number;
    className?: string;
    direction?: "up" | "down" | "left" | "right" | "none";
}

export function FadeIn({
    children,
    delay = 0,
    duration = 0.8,
    className,
    direction = "none",
}: FadeInProps) {
    const directionOffset = {
        up: { y: 20, x: 0 },
        down: { y: -20, x: 0 },
        left: { x: 20, y: 0 },
        right: { x: -20, y: 0 },
        none: { x: 0, y: 0 },
    };

    return (
        <motion.div
            initial={{
                opacity: 0,
                ...directionOffset[direction],
            }}
            whileInView={{
                opacity: 1,
                x: 0,
                y: 0,
            }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
                duration,
                delay,
                ease: [0.21, 0.47, 0.32, 0.98], // Custom sleek easing
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
