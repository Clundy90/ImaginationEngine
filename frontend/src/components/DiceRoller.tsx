/* frontend/src/components/DiceRoller.tsx */
import React, { useState, useEffect } from "react";
import { useEngine } from "../context/EngineContext";
import { motion, AnimatePresence } from "framer-motion";

/**
 * DiceRoller: The Geometric Engine
 * Dynamically changes shape and animation style based on the die type selected.
 */
export const DiceRoller = () => {
  const { roll, rollDice, loading } = useEngine();
  const [flickerValue, setFlickerValue] = useState<number>(1);
  const [currentSides, setCurrentSides] = useState<number>(20);

  // Helper to determine the polygon shape based on the die sides
  const getDieShape = (sides: number) => {
    switch (sides) {
      case 4:
        return "polygon(50% 0%, 0% 100%, 100% 100%)"; // Triangle
      case 6:
        return "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"; // Square
      case 8:
        return "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)"; // Diamond
      case 12:
        return "polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)"; // Hexagon-ish
      default:
        return "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)"; // Pentagon (D20/D10)
    }
  };

  useEffect(() => {
    let interval: any;
    if (loading) {
      interval = setInterval(() => {
        setFlickerValue(Math.floor(Math.random() * currentSides) + 1);
      }, 50);
    }
    return () => clearInterval(interval);
  }, [loading, currentSides]);

  const handleRoll = (sides: number) => {
    setCurrentSides(sides);
    rollDice(1, sides);
  };

  const isNat20 = roll?.total === 20 && roll?.sides === 20;
  const isCritFail = roll?.total === 1 && roll?.sides === 20;

  return (
    <div className="dice-module">
      <h2
        style={{
          color: "var(--accent-gold)",
          textAlign: "center",
          letterSpacing: "3px",
        }}
      >
        ARCANE NUMEROLOGY
      </h2>

      {/* Dice Selection Grid */}
      <div className="dice-grid" style={{ marginBottom: "40px" }}>
        {[4, 6, 8, 10, 12, 20, 100].map((s) => (
          <motion.div
            key={s}
            whileHover={{ scale: 1.1, backgroundColor: "var(--accent-purple)" }}
            whileTap={{ scale: 0.9 }}
            className="dice-card"
            style={{
              clipPath: getDieShape(s),
              background: "rgba(155, 89, 182, 0.2)",
              width: "60px",
              height: "60px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: loading ? "not-allowed" : "pointer",
            }}
            onClick={() => !loading && handleRoll(s)}
          >
            <span className="data-label" style={{ fontSize: "0.8rem" }}>
              D{s}
            </span>
          </motion.div>
        ))}
      </div>

      <div
        className="display-area"
        style={{
          height: "300px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          perspective: "1200px",
        }}
      >
        <AnimatePresence mode="wait">
          {loading ? (
            /* MOTION BLUR SPINNING DIE */
            <motion.div
              key="rolling"
              initial={{ rotateX: 0, rotateY: 0 }}
              animate={{
                rotateX: [0, 360, 720],
                rotateY: [0, 720, 1440],
                rotateZ: [0, 90, 180],
                scale: [0.8, 1.2, 0.8],
                filter: ["blur(0px)", "blur(2px)", "blur(0px)"],
              }}
              transition={{
                repeat: Infinity,
                duration: 0.5,
                ease: "easeInOut",
              }}
              style={{
                width: "120px",
                height: "120px",
                background:
                  "linear-gradient(135deg, var(--accent-purple), #6c3483)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "3rem",
                color: "white",
                clipPath: getDieShape(currentSides),
                boxShadow: "0 0 40px var(--accent-purple)",
                border: "2px solid rgba(255,255,255,0.5)",
              }}
            >
              {flickerValue}
            </motion.div>
          ) : roll ? (
            /* IMPACT & REVEAL */
            <motion.div
              key={roll.total + Date.now()}
              initial={{
                scale: 5,
                opacity: 0,
                rotateZ: -45,
                filter: "blur(10px)",
              }}
              animate={{
                scale: 1,
                opacity: 1,
                rotateZ: 0,
                filter: "blur(0px)",
              }}
              transition={{ type: "spring", damping: 10, stiffness: 150 }}
              style={{ textAlign: "center" }}
            >
              <motion.div
                animate={
                  isNat20
                    ? {
                        scale: [1, 1.1, 1],
                        filter: [
                          "brightness(1)",
                          "brightness(1.5)",
                          "brightness(1)",
                        ],
                      }
                    : {}
                }
                transition={{ repeat: Infinity, duration: 1 }}
                style={{
                  width: "150px",
                  height: "150px",
                  margin: "0 auto",
                  background: isNat20
                    ? "var(--accent-gold)"
                    : isCritFail
                      ? "#ff4444"
                      : "rgba(30, 30, 30, 0.95)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "5rem",
                  fontWeight: "900",
                  color: isNat20 || isCritFail ? "black" : "white",
                  clipPath: getDieShape(roll.sides),
                  border: `4px solid ${isNat20 ? "white" : "var(--accent-purple)"}`,
                  boxShadow: isNat20
                    ? "0 0 50px gold"
                    : "0 15px 35px rgba(0,0,0,0.8)",
                }}
              >
                {roll.total}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div
                  className="data-label"
                  style={{
                    marginTop: "20px",
                    color: isNat20
                      ? "var(--accent-gold)"
                      : isCritFail
                        ? "#ff4444"
                        : "white",
                    fontSize: "1.2rem",
                    textShadow: "2px 2px 4px black",
                  }}
                >
                  {isNat20
                    ? "✨ CRITICAL SUCCESS ✨"
                    : isCritFail
                      ? "💀 CRITICAL FAILURE 💀"
                      : "RESULT MANIFESTED"}
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <div className="data-label" style={{ opacity: 0.3 }}>
              Channelling dice energy...
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
