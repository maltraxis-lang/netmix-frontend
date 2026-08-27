import { useRef } from "react";
import type { Movie } from "../types";

interface MovieRowProps {
  title: string;
  movies: Movie[];
}

export default function MovieRow({ title, movies }: MovieRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({ left: dir === "right" ? amount : -amount, behavior: "smooth" });
  };

  return (
    <div className="mb-8">
      <h2 className="font-display font-bold text-xl tracking-wide text-white px-6 lg:px-12 mb-3">
        {title}
      </h2>
      <div className="relative group/row">
        {/* Left arrow */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-all duration-200 hover:scale-110"
          style={{ background: "rgba(0,0,0,0.7)", border: "1px solid rgba(255,255,255,0.2)" }}
          aria-label="Scroll left"
        >
          <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>

        {/* Movie cards */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide px-6 lg:px-12 pb-2"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="movie-card flex-shrink-0 relative rounded-md overflow-hidden cursor-pointer transition-all duration-300"
              style={{ width: "180px", scrollSnapAlign: "start" }}
            >
              <div className="relative" style={{ paddingBottom: "150%" }}>
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Hover overlay */}
                <div
                  className="movie-overlay absolute inset-0 opacity-0 transition-opacity duration-200 flex flex-col justify-end p-3"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)" }}
                >
                  <p className="text-white font-semibold text-sm leading-tight mb-1">{movie.title}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-nm-gold text-xs font-bold">★ {movie.score}</span>
                    <span className="text-nm-muted text-xs">{movie.year}</span>
                    <span className="text-nm-muted text-xs border border-nm-muted/40 px-1 rounded" style={{ fontSize: "10px" }}>{movie.rating}</span>
                  </div>
                  <div className="flex gap-1 flex-wrap mb-2">
                    {movie.genres.slice(0, 2).map((g) => (
                      <span key={g} className="text-nm-muted text-xs">{g}</span>
                    ))}
                  </div>
                  <button className="w-full py-1.5 rounded text-xs font-bold text-black transition-colors" style={{ background: "#e50914", color: "white" }}>
                    ▶ Play
                  </button>
                </div>
              </div>
              {/* Score badge */}
              <div className="absolute top-2 right-2 rounded px-1.5 py-0.5 text-xs font-bold" style={{ background: "rgba(0,0,0,0.8)", color: "#c9a84c" }}>
                ★ {movie.score}
              </div>
            </div>
          ))}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-all duration-200 hover:scale-110"
          style={{ background: "rgba(0,0,0,0.7)", border: "1px solid rgba(255,255,255,0.2)" }}
          aria-label="Scroll right"
        >
          <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
