import { useEngine } from "../context/EngineContext";

/**
 * GenerateWorld Component
 * Responsible for rendering the high-level narrative of the world.
 * Data is split into 'cosmic' and 'environment' sections from the backend.
 */
export const GenerateWorld = () => {
  // Pulling global state and the trigger function from our EngineContext
  const { world, loading, generateWorld } = useEngine();

  return (
    <section>
      <h2>World Architect</h2>

      <button onClick={generateWorld} disabled={loading}>
        {loading ? "MANIFESTING..." : "GENERATE A WORLD"}
      </button>

      {/* Conditional Rendering: 
          We use Optional Chaining (?.) to ensure that if 'cosmic' or 'environment' 
          is missing for a split second, the app doesn't crash.
      */}
      {world && !loading && world.cosmic && world.environment && (
        <div>
          {/* Section A: Cosmic Scale (The 'Big Picture' attributes) */}
          <div>
            <h3>Cosmic Manifest</h3>
            <p>
              Looking out into the void, we find a{" "}
              <strong>{world.cosmic.planet}</strong>. The pulse of the world is
              dictated by <strong>{world.cosmic.mythology}</strong>, defined by{" "}
              <strong>{world.cosmic.technology}</strong> in an age where magic
              is <strong>{world.cosmic.magic}</strong>.
            </p>
          </div>

          {/* Section B: Regional Scale (The 'Local' geography and life) */}
          <div>
            <h3>Regional Survey</h3>
            <p>
              Upon closer inspection, the land is carved by{" "}
              <strong>{world.environment.drainage}</strong>. The landscape is{" "}
              <strong>{world.environment.vitality}</strong>, witnessing{" "}
              <strong>{world.environment.lifeHealth}</strong> across the{" "}
              <strong>{world.environment.biome}</strong>.
            </p>
          </div>

          <div style={{ marginTop: "10px", opacity: 0.5 }}>
            <small>CHRONOS SEED: {world.seed}</small>
          </div>
        </div>
      )}
    </section>
  );
};
