import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface DieProps {
  value: number;
  sides: number;
  isRolling: boolean;
}

export const AnimatedDie = ({ value, sides, isRolling }: DieProps) => {
  const [displayValue, setDisplayValue] = useState(value);

  // Rapidly cycle numbers while rolling to simulate a real roll
  useEffect(() => {
    let interval: any;
    if (isRolling) {
      interval = setInterval(() => {
        setDisplayValue(Math.floor(Math.random() * sides) + 1);
      }, 50);
    } else {
      setDisplayValue(value);
    }
    return () => clearInterval(interval);
  }, [isRolling, value, sides]);

  const isCrit = value === 20 && sides === 20;

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <motion.div
        animate={
          isRolling
            ? {
                x: [-2, 2, -2, 2, 0],
                rotate: [-5, 5, -5, 5, 0],
              }
            : { scale: isCrit ? [1, 1.2, 1] : 1 }
        }
        transition={
          isRolling ? { repeat: Infinity, duration: 0.1 } : { duration: 0.3 }
        }
        style={{
          width: "60px",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: isCrit ? "var(--accent-gold)" : "rgba(155, 89, 182, 0.2)",
          border: `2px solid ${isCrit ? "white" : "var(--accent-purple)"}`,
          borderRadius: sides === 6 ? "8px" : "50%", // Boxy for d6, round for d20
          boxShadow: isRolling ? "0 0 20px var(--accent-purple)" : "none",
          fontSize: "1.5rem",
          fontWeight: "bold",
          color: isCrit ? "black" : "white",
        }}
      >
        {displayValue}
      </motion.div>

      {/* Critical Burst Effect */}
      <AnimatePresence>
        {isCrit && !isRolling && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: "50%",
              background: "radial-gradient(circle, gold 0%, transparent 70%)",
              zIndex: -1,
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
