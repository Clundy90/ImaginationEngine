import React, { createContext, useContext, useState, ReactNode } from "react";
import axios from "axios";

/**
 * HistoryItem Interface
 * Defines the structure for everything stored in the sidebar and MongoDB.
 */
export interface HistoryItem {
  id: string; // Unique ID for React keys and DB lookups
  type: string; // WORLD, NPC, MONSTER, DICE
  timestamp: string;
  isSaved: boolean; // Tracks if it has been starred/sent to MongoDB
  name?: string; // Display name for the log
  [key: string]: any; // Flexible container for all nested Python data
}

interface EngineContextType {
  world: any;
  monster: any;
  npc: any;
  roll: any;
  history: HistoryItem[];
  loading: boolean;
  setHistory: React.Dispatch<React.SetStateAction<HistoryItem[]>>; // Needed for UI "Star" toggles
  generateWorld: () => Promise<void>;
  summonMonster: () => Promise<void>;
  generateNPC: () => Promise<void>;
  rollDice: (count?: number, sides?: number) => Promise<void>;
}

const EngineContext = createContext<EngineContextType | undefined>(undefined);

export const EngineProvider = ({ children }: { children: ReactNode }) => {
  // --- CORE STATE ---
  const [world, setWorld] = useState<any>(null);
  const [monster, setMonster] = useState<any>(null);
  const [npc, setNpc] = useState<any>(null);
  const [roll, setRoll] = useState<any>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  /**
   * addToHistory
   * Refined to correctly accept the 'type' string from API functions.
   */
  const addToHistory = (newData: any, type: string) => {
    const entry: HistoryItem = {
      ...newData,
      // Fallback ID if crypto.randomUUID() fails in some browsers
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      type: type,
      timestamp: new Date().toLocaleTimeString(),
      isSaved: false,
    };

    // We add the new entry to the top of the history list
    setHistory((prev) => [entry, ...prev]);
  };

  // --- API FUNCTIONS ---

  // 1. World Generator
  const generateWorld = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/generate");
      setWorld(response.data);
      // Fixed: Passing both data and type string
      addToHistory(response.data, "WORLD");
    } catch (err) {
      console.error("World Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Monster Summoner
  const summonMonster = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/monster");
      setMonster(response.data);
      // Fixed: Passing both data and type string
      addToHistory(response.data, "MONSTER");
    } catch (err) {
      console.error("Monster Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 3. NPC Architect
  const generateNPC = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/npc");
      setNpc(response.data);
      // Fixed: Passing both data and type string
      addToHistory(response.data, "NPC");
    } catch (err) {
      console.error("NPC Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 4. Dice Roller
  const rollDice = async (count: number = 1, sides: number = 20) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/roll?count=${count}&sides=${sides}`,
      );
      setRoll(response.data);

      // Dice is a bit unique, so we structure a "cleaner" data object for the log
      addToHistory(
        {
          name: `${count}d${sides} Roll`,
          total: response.data.total,
          rolls: response.data.rolls,
        },
        "DICE",
      );
    } catch (err) {
      console.error("Dice Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <EngineContext.Provider
      value={{
        world,
        monster,
        npc,
        roll,
        history,
        loading,
        setHistory, // Exposed so the Star button can update the isSaved state
        generateWorld,
        summonMonster,
        generateNPC,
        rollDice,
      }}
    >
      {children}
    </EngineContext.Provider>
  );
};

export const useEngine = () => {
  const context = useContext(EngineContext);
  if (!context) {
    throw new Error("useEngine must be used within an EngineProvider");
  }
  return context;
};
