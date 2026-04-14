import React, { useState } from "react";
import axios from "axios";
import { useEngine } from "../context/EngineContext";

interface CharacterData {
  id?: string;
  name: string;
  race: string;
  class: string;
  level: number;
  stats: {
    STR: number;
    DEX: number;
    CON: number;
    INT: number;
    WIS: number;
    CHA: number;
  };
  bio: string;
}

export const CharacterCreator = () => {
  const { setHistory } = useEngine();
  const [isEditing, setIsEditing] = useState(false);

  // Initial empty sheet state
  const [char, setChar] = useState<CharacterData>({
    name: "",
    race: "",
    class: "",
    level: 1,
    stats: { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 },
    bio: "",
  });

  const handleStatChange = (
    stat: keyof CharacterData["stats"],
    value: number,
  ) => {
    setChar((prev) => ({
      ...prev,
      stats: { ...prev.stats, [stat]: value },
    }));
  };

  const saveToVault = async (e: React.FormEvent) => {
    e.preventDefault();
    const characterId = char.id || crypto.randomUUID();

    const payload = {
      id: characterId,
      type: "CHARACTER",
      timestamp: new Date().toLocaleTimeString(),
      isSaved: true,
      data: { ...char, id: characterId },
    };

    try {
      // Send to the MongoDB Eternal Vault
      await axios.post("http://localhost:5000/api/favorites", payload);

      // Also add to your session history so it shows up in the sidebar
      setHistory((prev) => [payload, ...prev]);

      alert(`${char.name} has been etched into the Vault!`);
      if (!isEditing) resetForm();
    } catch (err) {
      console.error("Vault rejected the hero:", err);
    }
  };

  const resetForm = () => {
    setChar({
      name: "",
      race: "",
      class: "",
      level: 1,
      stats: { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 },
      bio: "",
    });
    setIsEditing(false);
  };

  return (
    <div className="tab-panel">
      <h2 className="data-label" style={{ color: "var(--accent-gold)" }}>
        {isEditing ? "📝 Edit Hero" : "⚔️ Heroic Registry"}
      </h2>

      <form
        onSubmit={saveToVault}
        className="module-viewer"
        style={{ border: "1px solid var(--accent-purple)" }}
      >
        {/* Basic Info Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 0.5fr",
            gap: "15px",
            marginBottom: "20px",
          }}
        >
          <div>
            <label className="data-label" style={{ fontSize: "0.6rem" }}>
              NAME
            </label>
            <input
              className="data-value"
              style={{
                width: "100%",
                background: "transparent",
                border: "none",
                borderBottom: "1px solid #444",
                color: "white",
              }}
              value={char.name}
              onChange={(e) => setChar({ ...char, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="data-label" style={{ fontSize: "0.6rem" }}>
              RACE
            </label>
            <input
              className="data-value"
              style={{
                width: "100%",
                background: "transparent",
                border: "none",
                borderBottom: "1px solid #444",
                color: "white",
              }}
              value={char.race}
              onChange={(e) => setChar({ ...char, race: e.target.value })}
            />
          </div>
          <div>
            <label className="data-label" style={{ fontSize: "0.6rem" }}>
              CLASS
            </label>
            <input
              className="data-value"
              style={{
                width: "100%",
                background: "transparent",
                border: "none",
                borderBottom: "1px solid #444",
                color: "white",
              }}
              value={char.class}
              onChange={(e) => setChar({ ...char, class: e.target.value })}
            />
          </div>
          <div>
            <label className="data-label" style={{ fontSize: "0.6rem" }}>
              LVL
            </label>
            <input
              type="number"
              className="data-value"
              style={{
                width: "100%",
                background: "transparent",
                border: "none",
                borderBottom: "1px solid #444",
                color: "white",
              }}
              value={char.level}
              onChange={(e) =>
                setChar({ ...char, level: parseInt(e.target.value) })
              }
            />
          </div>
        </div>

        {/* Ability Scores Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          {Object.entries(char.stats).map(([stat, val]) => (
            <div
              key={stat}
              style={{
                textAlign: "center",
                background: "rgba(155, 89, 182, 0.1)",
                padding: "10px",
                borderRadius: "5px",
              }}
            >
              <label
                className="data-label"
                style={{ fontSize: "0.7rem", color: "var(--accent-purple)" }}
              >
                {stat}
              </label>
              <input
                type="number"
                value={val}
                onChange={(e) =>
                  handleStatChange(
                    stat as keyof CharacterData["stats"],
                    parseInt(e.target.value),
                  )
                }
                style={{
                  width: "100%",
                  textAlign: "center",
                  background: "transparent",
                  border: "none",
                  color: "white",
                  fontSize: "1.2rem",
                }}
              />
            </div>
          ))}
        </div>

        {/* Bio/Description Area */}
        <div style={{ marginBottom: "20px" }}>
          <label className="data-label" style={{ fontSize: "0.6rem" }}>
            CHARACTER BIO / NOTES
          </label>
          <textarea
            className="data-value"
            style={{
              width: "100%",
              height: "80px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid #444",
              color: "white",
              marginTop: "5px",
              padding: "10px",
              textTransform: "none",
            }}
            value={char.bio}
            onChange={(e) => setChar({ ...char, bio: e.target.value })}
          />
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="submit"
            className="tab-button"
            style={{
              flex: 2,
              background: "var(--accent-gold)",
              color: "black",
            }}
          >
            {isEditing ? "UPDATE CHARACTER" : "COMMIT TO VAULT"}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="tab-button"
            style={{ flex: 1, border: "1px solid #ff4444", color: "#ff4444" }}
          >
            RESET
          </button>
        </div>
      </form>
    </div>
  );
};
