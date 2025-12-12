"use client";


import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";


const variants = {
  hidden: { opacity: 0, x: 0, y: 20 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: -20 },
};


export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence
      mode="wait"
      initial={ false }
      onExitComplete={ () => window.scrollTo(0, 0) }
    >
      <motion.div
        key={ pathname }
        variants={ variants }
        initial="hidden"
        animate="enter"
        exit="exit"
        transition={ { duration: 0.4, type: "keyframes" } }
        className="flex-1"
      >
        { children }
      </motion.div>
    </AnimatePresence>
  );
}
