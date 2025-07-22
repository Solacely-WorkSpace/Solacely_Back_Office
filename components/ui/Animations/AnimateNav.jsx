"use client";
import { motion } from "framer-motion";

const AnimateNav = ({ children, animation, style }) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={animation}
      className={style}
    >
      {children}
    </motion.div>
  );
};

export default AnimateNav;
