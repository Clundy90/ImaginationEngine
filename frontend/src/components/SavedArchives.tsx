/* frontend/src/components/SavedArchives.tsx */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export const SavedArchives = () => {
  const [savedItems, setSavedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchArchives = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/favorites");
      setSavedItems(response.data);
    } catch (err) {
      console.error("Vault Access Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const banishItem = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/favorites/${id}`);
      setSavedItems((prev) =>
        prev.filter((item) => (item.id || item._id) !== id),
      );
    } catch (err) {
      console.error("Banishment failed:", err);
    }
  };

  /**
   * renderValue: Restored Recursive Grid
   * This ensures Monster stats (STR, DEX, etc.) look like professional stat blocks.
   */
  const renderValue = (val: any): React.ReactNode => {
    if (val === null || val === undefined) return "N/A";

    if (typeof val === "object" && !Array.isArray(val)) {
      return (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
            gap: "10px",
            background: "rgba(0,0,0,0.2)",
            padding: "12px",
            borderRadius: "4px",
            border: "1px solid rgba(155, 89, 182, 0.2)",
          }}
        >
          {Object.entries(val).map(([k, v]) => (
            <div key={k} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "0.6rem",
                  color: "var(--accent-gold)",
                  textTransform: "uppercase",
                }}
              >
                {k}
              </div>
              <div
                style={{
                  fontSize: "1.1rem",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                {String(v)}
              </div>
            </div>
          ))}
        </div>
      );
    }
    return String(val);
  };

  /**
   * renderCharacterSheet: Restored Official Layout
   * Fixes the overlapping data seen in the screenshot.
   */
  const renderCharacterSheet = (char: any) => {
    return (
      <div className="character-sheet-container" style={{ width: "100%" }}>
        {/* Top Header Block */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr 1fr 0.5fr",
            gap: "20px",
            marginBottom: "25px",
            paddingBottom: "15px",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div>
            <label className="data-label">NAME</label>
            <div
              className="data-value"
              style={{ fontSize: "1.4rem", color: "var(--accent-gold)" }}
            >
              {char.name}
            </div>
          </div>
          <div>
            <label className="data-label">RACE</label>
            <div className="data-value">{char.race}</div>
          </div>
          <div>
            <label className="data-label">CLASS</label>
            <div className="data-value">{char.class}</div>
          </div>
          <div>
            <label className="data-label">LVL</label>
            <div className="data-value">{char.level}</div>
          </div>
        </div>

        {/* Ability Score Block */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: "12px",
            marginBottom: "25px",
          }}
        >
          {char.stats &&
            Object.entries(char.stats).map(([stat, val]) => (
              <div
                key={stat}
                className="stat-card"
                style={{
                  textAlign: "center",
                  background: "rgba(155, 89, 182, 0.05)",
                  padding: "15px 5px",
                  border: "1px solid var(--accent-purple)",
                  borderRadius: "4px",
                }}
              >
                <div
                  className="data-label"
                  style={{ fontSize: "0.65rem", marginBottom: "5px" }}
                >
                  {stat}
                </div>
                <div className="data-value" style={{ fontSize: "1.5rem" }}>
                  {String(val)}
                </div>
              </div>
            ))}
        </div>

        {char.bio && (
          <div
            style={{
              marginTop: "15px",
              padding: "15px",
              background: "rgba(255,255,255,0.02)",
              borderRadius: "4px",
            }}
          >
            <label
              className="data-label"
              style={{ color: "var(--accent-gold)" }}
            >
              BIOGRAPHY
            </label>
            <p
              className="data-value"
              style={{ textTransform: "none", opacity: 0.8, lineHeight: "1.5" }}
            >
              {char.bio}
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderFormattedData = (item: any) => {
    const actualData = item.data?.data || item.data || item;
    if (item.type === "CHARACTER") return renderCharacterSheet(actualData);

    const entries = Object.entries(actualData).filter(
      ([k]) =>
        !["id", "isSaved", "type", "timestamp", "_id", "__v"].includes(k),
    );
    return (
      <div className="archive-details">
        {entries.map(([key, value]) => (
          <div key={key} style={{ marginBottom: "20px" }}>
            <span
              className="data-label"
              style={{
                color: "var(--accent-purple)",
                marginBottom: "8px",
                display: "block",
              }}
            >
              {key.replace(/_/g, " ").toUpperCase()}
            </span>
            <div className="data-value" style={{ textTransform: "none" }}>
              {renderValue(value)}
            </div>
          </div>
        ))}
      </div>
    );
  };

  useEffect(() => {
    fetchArchives();
  }, []);

  if (loading)
    return (
      <div
        className="data-label"
        style={{ textAlign: "center", marginTop: "50px" }}
      >
        Unlocking the Archives...
      </div>
    );

  return (
    <div className="tab-panel">
      <h2
        className="data-label"
        style={{
          color: "var(--accent-gold)",
          textAlign: "center",
          marginBottom: "40px",
          fontSize: "2rem",
          letterSpacing: "5px",
        }}
      >
        📜 THE ETERNAL VAULT
      </h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "40px",
          maxWidth: "1000px",
          margin: "0 auto",
          paddingBottom: "100px",
        }}
      >
        <AnimatePresence>
          {savedItems.map((item) => (
            <motion.div
              key={item.id || item._id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{
                opacity: 0,
                x: 100,
                filter: "blur(10px)",
                transition: { duration: 0.4 },
              }}
              className="module-viewer"
              style={{
                padding: "35px",
                position: "relative",
                background: "rgba(10, 10, 10, 0.95)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "15px",
                  right: "20px",
                  opacity: 0.3,
                }}
                className="data-label"
              >
                {item.timestamp}
              </div>
              <div
                style={{
                  marginBottom: "25px",
                  borderBottom: "2px solid var(--accent-purple)",
                  paddingBottom: "10px",
                }}
              >
                <span
                  className="data-label"
                  style={{ color: "var(--accent-purple)", fontSize: "1rem" }}
                >
                  {item.type} MANIFESTATION
                </span>
              </div>

              {renderFormattedData(item)}

              <button
                onClick={() => banishItem(item.id || item._id)}
                className="tab-button"
                style={{
                  marginTop: "30px",
                  width: "100%",
                  borderColor: "#ff4444",
                  color: "#ff4444",
                }}
              >
                BANISH TO THE VOID
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
