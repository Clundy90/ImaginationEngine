import React from "react";
import { useEngine } from "../context/EngineContext";
import axios from "axios";

export const SessionLog = () => {
  const { history, setHistory } = useEngine();

  /**
   * toggleSave
   * Connects the "Star" button to your local MongoDB Vault.
   */
  const toggleSave = async (item: any) => {
    const newSavedStatus = !item.isSaved;

    // 1. Optimistic UI update: Toggle the star visually immediately
    setHistory((prev) =>
      prev.map((h) =>
        h.id === item.id ? { ...h, isSaved: newSavedStatus } : h,
      ),
    );

    // 2. Sync with MongoDB Backend
    try {
      if (newSavedStatus) {
        // Add to MongoDB
        await axios.post("http://localhost:5000/api/favorites", item);
      } else {
        // Remove from MongoDB
        await axios.delete(`http://localhost:5000/api/favorites/${item.id}`);
      }
    } catch (err) {
      console.error("The Vault refused the manifestation:", err);
      // Optional: Revert UI state if the API call fails
      setHistory((prev) =>
        prev.map((h) =>
          h.id === item.id ? { ...h, isSaved: !newSavedStatus } : h,
        ),
      );
    }
  };

  return (
    <aside className="sidebar-container">
      <h2
        className="data-label"
        style={{
          borderBottom: "1px solid var(--accent-purple)",
          paddingBottom: "10px",
        }}
      >
        Recent Manifestations
      </h2>
      <div className="history-list" style={{ marginTop: "15px" }}>
        {history.map((entry) => (
          <div
            key={entry.id}
            className="module-viewer"
            style={{
              position: "relative",
              marginBottom: "15px",
              paddingRight: "40px",
            }}
          >
            {/* The Star/Save Button */}
            <button
              onClick={() => toggleSave(entry)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "1.2rem",
                color: entry.isSaved
                  ? "var(--accent-gold)"
                  : "rgba(255,255,255,0.2)",
                transition: "color 0.2s ease",
              }}
            >
              {entry.isSaved ? "★" : "☆"}
            </button>

            {/* Type Header */}
            <span
              className="data-label"
              style={{
                color: "var(--accent-purple)",
                fontSize: "0.7rem",
                display: "block",
              }}
            >
              {entry.type}
            </span>

            {/* --- RENDERING LOGIC FOR ALL TYPES --- */}

            {/* 1. World Data */}
            {entry.type === "WORLD" && (
              <>
                <div className="data-value">
                  {entry.cosmic?.planet || entry.name}
                </div>
                <div
                  className="data-label"
                  style={{ textTransform: "none", opacity: 0.6 }}
                >
                  {entry.environment?.biome}
                </div>
              </>
            )}

            {/* 2. Beast/Monster Data */}
            {(entry.type === "BEAST" || entry.type === "MONSTER") && (
              <>
                <div className="data-value">{entry.name}</div>
                <div
                  className="data-label"
                  style={{ textTransform: "none", opacity: 0.6 }}
                >
                  CR {entry.meta?.cr || entry.challenge_rating || "???"}
                </div>
              </>
            )}

            {/* 3. NPC Data */}
            {entry.type === "NPC" && (
              <>
                <div className="data-value">{entry.name}</div>
                <div
                  className="data-label"
                  style={{ textTransform: "none", opacity: 0.6 }}
                >
                  {entry.race} {entry.class}
                </div>
              </>
            )}

            {/* 4. Dice Data */}
            {entry.type === "DICE" && (
              <>
                <div
                  className="data-value"
                  style={{ color: "var(--accent-gold)" }}
                >
                  Total: {entry.total}
                </div>
                <div
                  className="data-label"
                  style={{ textTransform: "none", opacity: 0.6 }}
                >
                  {entry.name}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};
