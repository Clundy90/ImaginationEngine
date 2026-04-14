import React, { useState } from "react";
// Context for managing User Login State and JWT Tokens
import { useAuth, AuthProvider } from "./context/AuthContext";
// Component Imports: Ensure these match your actual filename casing exactly
import { CharacterCreator } from "./components/CharacterCreator";
import { MonsterSummoner } from "./components/MonsterSummoner";
import { GenerateWorld } from "./components/GenerateWorld";
import { NPCGenerator } from "./components/NPCGenerator";
import { DiceRoller } from "./components/DiceRoller";
import { SavedArchives } from "./components/SavedArchives";
import { AudioPlayer } from "./components/AudioPlayer";
import { LoginScreen } from "./components/LoginScreen";
// Import for the Sidebar/History logic (Verify this matches your component name)
import { SessionLog } from "./components/SessionLog";
import "./App.css";

/**
 * AppContent: The Internal Engine Core
 * Handles the logic gate for authentication and the main tab-switching navigation.
 */
const AppContent = () => {
  // Destructure auth state. token determines if the user is 'Gatekept'
  const { token, logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState("DICE");

  // AUTH GATE: If the token is missing/expired, redirect to the Arcane Login
  if (!token) {
    return <LoginScreen />;
  }

  return (
    <div className="app-container">
      {/* THE ARCANE HEADER 
        Layout: Left (Title/User) | Center (Navigation) | Right (Music/Auth)
      */}
      <header className="app-header">
        <div className="header-left">
          <h1 className="main-title" style={{ margin: 0, fontSize: "1.8rem" }}>
            IMAGINATION ENGINE
          </h1>
        </div>

        {/* TAB NAVIGATION: Centered for visual balance */}
        <nav
          className="tab-navigation"
          style={{ display: "flex", justifyContent: "center", gap: "10px" }}
        >
          {["DICE", "CHARACTER", "MONSTER", "WORLD", "NPC", "ARCHIVES"].map(
            (tab) => (
              <button
                key={tab}
                className={`tab-button ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ),
          )}
        </nav>

        <div className="header-right">
          {/* AudioPlayer handles the background ambience toggle */}
          <AudioPlayer />
          {/* Logout button triggers the AuthContext logout, wiping the token */}
          <button onClick={logout} className="logout-btn">
            LOGOUT SESSION
          </button>
        </div>
      </header>

      {/* THE ENGINE BODY 
        We use a wrapper to manage the flex-row between the Sidebar and the Content.
      */}
      <div className="main-layout-wrapper" style={{ display: "flex", flex: 1 }}>
        {/* RESTORING SIDEBAR: This houses the roll history and favorites (stars) */}
        <SessionLog />

        <main className="content-area" style={{ flex: 1 }}>
          {/* CONDITIONAL RENDERING: Only the active module is mounted to the DOM */}
          {activeTab === "DICE" && <DiceRoller />}
          {activeTab === "CHARACTER" && <CharacterCreator />}
          {activeTab === "MONSTER" && <MonsterSummoner />}
          {activeTab === "WORLD" && <GenerateWorld />}
          {activeTab === "NPC" && <NPCGenerator />}
          {activeTab === "ARCHIVES" && <SavedArchives />}
        </main>
      </div>
    </div>
  );
};

/**
 * App: The Root Entry Point
 * Wraps the entire application in AuthProvider to ensure 'useAuth' is accessible.
 */
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
