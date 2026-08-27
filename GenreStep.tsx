import { useState } from "react";
import { GENRES } from "../../data/movies";
import type { PartyMember } from "../../types";

interface GenreStepProps {
  members: PartyMember[];
  onConfirm: (genres: string[]) => void;
}

export default function GenreStep({ members, onConfirm }: GenreStepProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (name: string) => {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((g) => g !== name) : [...prev, name]
    );
  };

  // Show other members' genres
  const otherPrefs: Record<string, string[]> = {};
  members.filter((m) => m.id !== 0 && m.genres.length > 0).forEach((m) => {
    m.genres.forEach((g) => {
      otherPrefs[g] = otherPrefs[g] ? [...otherPrefs[g], m.name] : [m.name];
    });
  });

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-2xl mx-auto">
        {/* Party members intro */}
        <div className="flex items-center gap-3 mb-6 p-4 rounded-xl" style={{ background: "rgba(229,9,20,0.07)", border: "1px solid rgba(229,9,20,0.15)" }}>
          <div className="flex -space-x-2">
            {members.map((m) => (
              <img key={m.id} src={m.avatar} alt={m.name} className="w-8 h-8 rounded-full object-cover border-2" style={{ borderColor: "#0f0f0f" }} />
            ))}
          </div>
          <div>
            <p className="text-white text-sm font-semibold">{members.map((m) => m.name).join(", ")}</p>
            <p className="text-nm-muted text-xs">Your watch party · {members.length} members</p>
          </div>
        </div>

        <h2 className="font-display font-black text-white text-3xl mb-1 tracking-tight">
          PICK YOUR GENRES
        </h2>
        <p className="text-nm-muted text-sm mb-6">
          Select what you're in the mood for. We'll find movies that match everyone's taste.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
          {GENRES.map((genre) => {
            const isSelected = selected.includes(genre.name);
            const membersLike = otherPrefs[genre.name] || [];

            return (
              <button
                key={genre.name}
                onClick={() => toggle(genre.name)}
                className="relative flex flex-col items-center gap-2 p-4 rounded-xl text-center transition-all duration-200 hover:scale-105 active:scale-100"
                style={{
                  background: isSelected
                    ? `linear-gradient(135deg, ${genre.color}22 0%, ${genre.color}11 100%)`
                    : "rgba(255,255,255,0.04)",
                  border: isSelected ? `2px solid ${genre.color}` : "2px solid rgba(255,255,255,0.07)",
                  boxShadow: isSelected ? `0 0 20px ${genre.color}30` : "none",
                }}
              >
                <span className="text-3xl">{genre.emoji}</span>
                <span className="text-sm font-semibold" style={{ color: isSelected ? genre.color : "#e5e5e5" }}>
                  {genre.name}
                </span>
                {membersLike.length > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)", color: "#c9a84c" }}>
                    ♥ {membersLike[0].split(" ")[0]}{membersLike.length > 1 ? ` +${membersLike.length - 1}` : ""}
                  </span>
                )}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: genre.color }}>
                    <svg width="10" height="10" fill="white" viewBox="0 0 24 24">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Other members' preferences hint */}
        {Object.keys(otherPrefs).length > 0 && (
          <div className="mb-6 p-3 rounded-lg text-sm" style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)" }}>
            <span className="text-nm-gold font-semibold">💡 Tip: </span>
            <span className="text-nm-muted">
              {members.filter((m) => m.id !== 0).map((m) => `${m.name.split(" ")[0]} likes ${m.genres.join(" & ")}`).join(" · ")}
            </span>
          </div>
        )}

        <button
          onClick={() => onConfirm(selected)}
          disabled={selected.length === 0}
          className="w-full py-3.5 rounded-xl font-bold text-white text-lg transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 active:scale-98"
          style={{ background: selected.length ? "linear-gradient(135deg, #e50914, #8b0000)" : "#333", boxShadow: selected.length ? "0 0 20px rgba(229,9,20,0.3)" : "none" }}
        >
          {selected.length === 0 ? "Select at least one genre" : `Find Movies for ${selected.length} Genre${selected.length > 1 ? "s" : ""} →`}
        </button>
      </div>
    </div>
  );
}
