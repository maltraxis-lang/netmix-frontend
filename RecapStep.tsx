import { useState } from "react";
import type { Movie, PartyMember } from "../../types";

interface RecapStepProps {
  movie: Movie;
  members: PartyMember[];
  nextMovies: Movie[];
  userRating: number;
  onRatingChange: (r: number) => void;
  onNextParty: () => void;
  onClose: () => void;
}

interface StatCard {
  emoji: string;
  title: string;
  member: PartyMember;
  value: string;
  color: string;
}

export default function RecapStep({ movie, members, nextMovies, userRating, onRatingChange, onNextParty, onClose }: RecapStepProps) {
  const [hover, setHover] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  // Mock recap stats — deterministic based on member IDs
  const stats: StatCard[] = [
    {
      emoji: "💬",
      title: "Most Active Commenter",
      member: members[1] || members[0],
      value: "34 comments",
      color: "#6366f1",
    },
    {
      emoji: "🚨",
      title: "Biggest Spoiler",
      member: members[2] || members[1] || members[0],
      value: "3 spoiler messages",
      color: "#e50914",
    },
    {
      emoji: "🔥",
      title: "Most Reactions",
      member: members[0],
      value: "You · 18 reactions",
      color: "#c9a84c",
    },
    {
      emoji: "😶",
      title: "Quietest Member",
      member: members[members.length - 1],
      value: "2 comments",
      color: "#808080",
    },
  ];

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-2xl mx-auto">
        {/* Hero */}
        <div className="relative rounded-2xl overflow-hidden mb-6" style={{ height: "180px" }}>
          <img src={movie.image} alt={movie.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.9) 40%, rgba(0,0,0,0.4))" }} />
          <div className="absolute inset-0 flex items-center px-6">
            <div>
              <p className="text-nm-muted text-xs uppercase tracking-widest mb-1">Watch Party Complete!</p>
              <h2 className="font-display font-black text-white text-3xl tracking-tight">{movie.title.toUpperCase()}</h2>
              <p className="text-nm-muted text-sm">{movie.duration} · {movie.year}</p>
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="p-5 rounded-xl mb-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <h3 className="font-display font-bold text-white text-xl mb-1">RATE THIS MOVIE</h3>
          <p className="text-nm-muted text-sm mb-4">How was it? Share your honest rating.</p>
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  disabled={submitted}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => onRatingChange(star)}
                  className="transition-all duration-150 hover:scale-125 active:scale-110 disabled:cursor-default"
                >
                  <svg
                    width="32"
                    height="32"
                    fill={star <= (hover || userRating) ? "#c9a84c" : "none"}
                    stroke="#c9a84c"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                  >
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                  </svg>
                </button>
              ))}
            </div>
            {userRating > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-nm-gold font-bold text-lg">{userRating}/5</span>
                {!submitted && (
                  <button
                    onClick={() => setSubmitted(true)}
                    className="px-4 py-1.5 rounded-lg text-sm font-semibold text-white hover:opacity-90 transition"
                    style={{ background: "#e50914" }}
                  >
                    Submit
                  </button>
                )}
                {submitted && <span className="text-green-400 text-sm">✓ Submitted!</span>}
              </div>
            )}
          </div>
        </div>

        {/* Recap stats */}
        <h3 className="font-display font-bold text-white text-xl mb-3">PARTY RECAP</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {stats.map((stat) => (
            <div key={stat.title} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: `${stat.color}18` }}>
                {stat.emoji}
              </div>
              <div className="min-w-0">
                <p className="text-nm-muted text-xs uppercase tracking-widest mb-0.5">{stat.title}</p>
                <div className="flex items-center gap-2">
                  <img src={stat.member.avatar} alt={stat.member.name} className="w-5 h-5 rounded-full object-cover" />
                  <span className="text-white text-sm font-semibold truncate">{stat.member.name}</span>
                </div>
                <p className="text-xs mt-0.5" style={{ color: stat.color }}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Overall stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Total Comments", value: "58", emoji: "💬" },
            { label: "Total Reactions", value: "142", emoji: "🔥" },
            { label: "Spoiler Count", value: "4", emoji: "🚨" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <span className="text-2xl">{s.emoji}</span>
              <span className="text-white font-bold text-xl">{s.value}</span>
              <span className="text-nm-muted text-xs text-center">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Next watch party */}
        <div className="mb-6">
          <h3 className="font-display font-bold text-white text-xl mb-3">NEXT WATCH PARTY?</h3>
          <div className="grid grid-cols-3 gap-3">
            {nextMovies.map((m) => (
              <div key={m.id} className="rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-all" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="relative" style={{ paddingBottom: "140%" }}>
                  <img src={m.image} alt={m.title} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 p-2" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)" }}>
                    <p className="text-white text-xs font-bold leading-tight">{m.title}</p>
                    <p className="text-nm-gold text-xs">★ {m.score}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={onNextParty}
            className="flex-1 py-3 rounded-xl font-bold text-white text-base transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #e50914, #8b0000)", boxShadow: "0 0 20px rgba(229,9,20,0.3)" }}
          >
            🎬 Start New Watch Party
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl font-medium text-nm-muted transition-all hover:text-white hover:bg-white/10"
            style={{ border: "1px solid rgba(255,255,255,0.1)" }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
