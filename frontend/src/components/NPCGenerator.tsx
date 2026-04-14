import { useEngine } from "../context/EngineContext";

export const NPCGenerator = () => {
  const { npc, generateNPC, loading } = useEngine();

  return (
    <section className="manifest-card">
      <h2 className="text-xl font-bold uppercase tracking-widest mb-4">
        NPC Architect
      </h2>

      <button
        onClick={generateNPC}
        disabled={loading}
        className="w-full border p-2 mb-4 hover:bg-white hover:text-black transition-all"
      >
        {loading ? "RECRUITING..." : "GENERATE NPC"}
      </button>

      {npc && !loading && (
        <div className="border-t pt-4">
          <h3 className="text-2xl font-bold underline">{npc.name}</h3>
          <p className="text-sm italic text-gray-400">{npc.alignment}</p>

          <div className="grid grid-cols-2 gap-2 my-4">
            <div className="bg-white/10 p-2 text-center">
              <span className="text-[10px] block uppercase">Race</span>
              <span className="font-bold">{npc.race}</span>
            </div>
            <div className="bg-white/10 p-2 text-center">
              <span className="text-[10px] block uppercase">Class</span>
              <span className="font-bold">{npc.class}</span>
            </div>
          </div>

          <p className="text-sm leading-relaxed">{npc.background}</p>
        </div>
      )}
    </section>
  );
};
