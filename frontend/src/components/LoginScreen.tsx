/* frontend/src/components/LoginScreen.tsx */
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

/**
 * LoginScreen: The Gatekeeper Component
 * Handles user authentication with a themed, animated interface.
 */
export const LoginScreen = () => {
  const { login } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const endpoint = isRegistering ? "/api/auth/register" : "/api/auth/login";

    try {
      const response = await axios.post(`http://localhost:5000${endpoint}`, {
        username,
        password,
      });

      if (isRegistering) {
        // After successful registration, flip to login mode
        setIsRegistering(false);
        setError("Account inscribed. You may now unlock the vault.");
      } else {
        // Successful login
        login(response.data.user, response.data.token);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.msg ||
          "The Arcane Gate remains shut. Check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="login-overlay"
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(circle, #1a1a2e 0%, #0f0f0f 100%)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="module-viewer"
        style={{
          width: "400px",
          padding: "40px",
          border: "2px solid var(--accent-purple)",
          boxShadow: "0 0 30px rgba(155, 89, 182, 0.3)",
        }}
      >
        <h2
          className="main-title"
          style={{
            fontSize: "1.5rem",
            textAlign: "center",
            marginBottom: "10px",
          }}
        >
          {isRegistering ? "INSCRIBE YOUR NAME" : "UNLOCK THE VAULT"}
        </h2>
        <p
          className="data-label"
          style={{
            textAlign: "center",
            marginBottom: "30px",
            fontSize: "0.7rem",
          }}
        >
          {isRegistering
            ? "Establish your presence in the Eternal Archives"
            : "Identify yourself to access your manifestations"}
        </p>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          <div>
            <label className="data-label">USERNAME</label>
            <input
              type="text"
              className="character-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ width: "100%", background: "rgba(255,255,255,0.05)" }}
            />
          </div>

          <div>
            <label className="data-label">PASSWORD</label>
            <input
              type="password"
              className="character-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%", background: "rgba(255,255,255,0.05)" }}
            />
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="data-label"
                style={{
                  color: error.includes("Account inscribed")
                    ? "var(--accent-gold)"
                    : "#ff4444",
                  fontSize: "0.7rem",
                  textAlign: "center",
                }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            className="tab-button active"
            disabled={loading}
            style={{ marginTop: "10px", padding: "12px", fontSize: "1rem" }}
          >
            {loading ? "PROCESSING..." : isRegistering ? "REGISTER" : "LOGIN"}
          </button>
        </form>

        <div style={{ marginTop: "25px", textAlign: "center" }}>
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            style={{
              background: "none",
              border: "none",
              color: "var(--accent-purple)",
              cursor: "pointer",
              fontSize: "0.75rem",
              textDecoration: "underline",
            }}
          >
            {isRegistering
              ? "Already have an account? Login here"
              : "New user? Inscribe your account"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
