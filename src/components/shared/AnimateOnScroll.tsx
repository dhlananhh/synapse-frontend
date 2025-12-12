"use client";


import React from "react";
import {
  motion,
  useAnimation
} from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { cn } from "@/libs/utils";


const animationVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};


interface AnimateOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}


export function AnimateOnScroll({
  children,
  className,
  delay = 0,
  duration = 0.5
}: AnimateOnScrollProps) {
  const controls = useAnimation();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [ controls, inView ]);

  return (
    <motion.div
      ref={ ref }
      initial="hidden"
      animate={ controls }
      variants={ animationVariants }
      transition={ { duration, delay } }
      className={ cn(className) }
    >
      { children }
    </motion.div>
  );
} 
