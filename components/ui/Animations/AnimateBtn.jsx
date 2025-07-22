"use client";
import { motion } from "framer-motion";

const AnimateBtn = ({ children, animate, style }) => {
  return (
    <motion.div
      className={style}
      whileHover="hover"
      whileTap="tap"
      variants={animate}
    >
      {children}
    </motion.div>
  );
};

export default AnimateBtn;
