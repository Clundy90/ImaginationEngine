import { useEngine } from "../context/EngineContext";

/**
 * MonsterSummoner Component
 * Connects to the D&D 5e API via the Python backend to bring a creature into the app.
 */
export const MonsterSummoner = () => {
  // Destructuring the monster data, loading state, and the summon function
  const { monster, loading, summonMonster } = useEngine();

  return (
    <section className="manifest-card border-red-900/50">
      <h2 className="text-xl font-bold text-red-500 uppercase tracking-widest mb-4">
        Bestiary Summoner
      </h2>

      <button
        onClick={summonMonster}
        disabled={loading}
        className="bg-red-900/40 border border-red-500 text-red-100 px-6 py-2 hover:bg-red-500 hover:text-black transition-all font-bold"
      >
        {loading ? "TEARING THE VEIL..." : "SUMMON CREATURE"}
      </button>

      {/* Data Mapping:
          'monster.stats' contains the STR, DEX, and CON logic.
          'monster.description' provides the flavor text or ability snippet.
      */}
      {monster && !loading && (
        <div className="mt-6 p-6 border-2 border-red-900 bg-black/40 rounded-lg">
          <header className="mb-4">
            <h3 className="text-3xl font-bold text-red-500 uppercase">
              {monster.name}
            </h3>
            <p className="text-gray-400 text-xs tracking-widest">
              {monster.size} {monster.type} • {monster.alignment}
            </p>
          </header>

          {/* Narrative description snippet fetched from API special_abilities */}
          <p className="text-white italic text-sm mb-6 bg-red-950/20 p-4 border-l-4 border-red-600">
            "{monster.description}"
          </p>

          {/* Stat Block: Mapping the nested monster.stats object */}
          <div className="grid grid-cols-3 gap-2 text-center mb-6">
            <div className="bg-red-900/20 p-2 rounded">
              <span className="text-[10px] text-gray-500 block font-bold uppercase">
                Str
              </span>
              <span className="text-white font-mono text-lg">
                {monster.stats.str}
              </span>
            </div>
            <div className="bg-red-900/20 p-2 rounded">
              <span className="text-[10px] text-gray-500 block font-bold uppercase">
                Dex
              </span>
              <span className="text-white font-mono text-lg">
                {monster.stats.dex}
              </span>
            </div>
            <div className="bg-red-900/20 p-2 rounded">
              <span className="text-[10px] text-gray-500 block font-bold uppercase">
                Con
              </span>
              <span className="text-white font-mono text-lg">
                {monster.stats.con}
              </span>
            </div>
          </div>

          {/* Combat Essentials */}
          <div className="flex justify-between border-t border-red-900/30 pt-4">
            <div className="text-left">
              <p className="text-[10px] text-gray-500 uppercase">Armor Class</p>
              <p className="text-xl font-mono text-white">{monster.ac}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-500 uppercase">Hit Points</p>
              <p className="text-xl font-mono text-white">{monster.hp}</p>
            </div>
          </div>

          <div className="mt-4 text-[9px] text-gray-700 font-mono uppercase text-center">
            Challenge Rating: {monster.cr}
          </div>
        </div>
      )}
    </section>
  );
};
