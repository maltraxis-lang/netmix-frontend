import type { Movie, PartyMember } from "../../types";

interface MoviesStepProps {
  movies: Movie[];
  allMovies: Movie[];
  members: PartyMember[];
  onNext: () => void;
}

export default function MoviesStep({ movies, allMovies, members, onNext }: MoviesStepProps) {
  const allGenres = members.flatMap((m) => m.genres);
  const genreCount: Record<string, number> = {};
  allGenres.forEach((g) => { genreCount[g] = (genreCount[g] || 0) + 1; });
  const topGenres = Object.entries(genreCount).sort((a, b) => b[1] - a[1]).map(([g]) => g);

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display font-black text-white text-3xl mb-1 tracking-tight">MOVIES FOR YOUR PARTY</h2>
        <p className="text-nm-muted text-sm mb-2">
          Based on everyone's taste — top genres: <span className="text-white">{topGenres.slice(0, 3).join(", ")}</span>
        </p>

        {/* Member genre pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {members.map((m) => (
            <div key={m.id} className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <img src={m.avatar} alt={m.name} className="w-4 h-4 rounded-full object-cover" />
              <span className="text-nm-text">{m.name.split(" ")[0]}:</span>
              <span className="text-nm-gold">{m.genres.slice(0, 2).join(", ") || "Any"}</span>
            </div>
          ))}
        </div>

        {/* Best match movies */}
        <h3 className="text-sm font-semibold text-nm-gold uppercase tracking-widest mb-3">Best Matches for Your Group</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} highlight />
          ))}
        </div>

        {/* Other movies */}
        {allMovies.filter((m) => !movies.find((gm) => gm.id === m.id)).length > 0 && (
          <>
            <h3 className="text-sm font-semibold text-nm-muted uppercase tracking-widest mb-3">Other Options</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              {allMovies.filter((m) => !movies.find((gm) => gm.id === m.id)).slice(0, 6).map((movie) => (
                <MovieCard key={movie.id} movie={movie} highlight={false} />
              ))}
            </div>
          </>
        )}

        <button
          onClick={onNext}
          className="w-full py-3.5 rounded-xl font-bold text-white text-lg transition-all hover:opacity-90 active:scale-98"
          style={{ background: "linear-gradient(135deg, #e50914, #8b0000)", boxShadow: "0 0 20px rgba(229,9,20,0.3)" }}
        >
          Start Voting →
        </button>
      </div>
    </div>
  );
}

function MovieCard({ movie, highlight }: { movie: Movie; highlight: boolean }) {
  return (
    <div
      className="rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:scale-105"
      style={{
        border: highlight ? "1px solid rgba(229,9,20,0.3)" : "1px solid rgba(255,255,255,0.07)",
        background: "#1a1a1a",
      }}
    >
      <div className="relative" style={{ paddingBottom: "140%" }}>
        <img src={movie.image} alt={movie.title} className="absolute inset-0 w-full h-full object-cover" />
        {highlight && (
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-bold text-white" style={{ background: "#e50914" }}>
            MATCH
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-3" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.95), transparent)" }}>
          <p className="text-white text-sm font-bold leading-tight">{movie.title}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-nm-gold text-xs">★ {movie.score}</span>
            <span className="text-nm-muted text-xs">{movie.duration}</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            {movie.genres.map((g) => (
              <span key={g} className="text-xs text-nm-muted">{g}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
