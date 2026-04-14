/* frontend/src/components/AudioPlayer.tsx */
import React, { useState, useRef, useEffect } from "react";
// We import the file directly so Vite handles the pathing/hashing
import ambienceTrack from "../assets/ambience.mp3";

/**
 * AudioPlayer Component
 * Uses explicit Vite imports to bypass "No Supported Sources" errors.
 */
export const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Keep the audio volume in sync with the state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  /**
   * toggleMusic
   * Handles the play/pause logic with browser interaction safety.
   */
  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      // Browsers require a play() call to be triggered by a direct user click
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          console.log("Mana Channeling Successful: Ambience Playing.");
        })
        .catch((err) => {
          console.error("The void remains silent:", err);
          // This alert usually triggers if the browser hasn't registered a click yet
          alert(
            "The weave is stubborn. Click anywhere on the map first, then try again.",
          );
        });
    }
  };

  return (
    <div className="audio-control">
      {/* Vite turns the imported 'ambienceTrack' into a valid URL 
          at build time, which solves the 'No Supported Sources' error.
      */}
      <audio
        ref={audioRef}
        loop
        src={ambienceTrack}
        onCanPlayThrough={() => console.log("Ambience manifest ready.")}
      />

      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        {isPlaying && (
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="volume-slider"
          />
        )}

        <button
          onClick={toggleMusic}
          className={`music-toggle ${isPlaying ? "active" : ""}`}
        >
          {isPlaying ? "✨ MANA ACTIVE" : "🌑 CHANNEL AMBIENCE"}
        </button>
      </div>
    </div>
  );
};
