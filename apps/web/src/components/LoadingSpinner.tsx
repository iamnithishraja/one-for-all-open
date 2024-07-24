import React from "react";
import { motion } from "framer-motion";

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card rounded-lg p-8 shadow-xl">
        <motion.div
          className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mb-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p className="text-foreground text-center">Submitting...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
