interface HeroProps {
  onWatchPartyOpen: () => void;
}

export default function Hero({ onWatchPartyOpen }: HeroProps) {
  return (
    <div className="relative w-full" style={{ height: "85vh", minHeight: "520px" }}>
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1627133805103-ce2d34ccdd37?w=1600&h=900&fit=crop&auto=format"
          alt="Featured film"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(10,10,10,0.95) 30%, transparent 70%), linear-gradient(to top, rgba(10,10,10,1) 0%, transparent 50%)" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end h-full pb-24 px-6 lg:px-12 max-w-2xl">
        <div className="animate-fade-in">
          {/* Badge */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-bold tracking-widest uppercase px-2 py-1 rounded" style={{ background: "#e50914", color: "white" }}>
              #1 IN NETMIX TODAY
            </span>
            <span className="text-nm-muted text-sm">2h 12m</span>
            <span className="text-nm-muted text-sm">R</span>
          </div>

          {/* Title */}
          <h1 className="font-display font-black text-white mb-3" style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", lineHeight: 1, letterSpacing: "-0.01em" }}>
            BLOOD &<br />CHROME
          </h1>

          {/* Stars */}
          <div className="flex items-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <svg key={s} width="14" height="14" fill={s <= 4 ? "#c9a84c" : "none"} stroke="#c9a84c" strokeWidth="1.5" viewBox="0 0 24 24">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
              </svg>
            ))}
            <span className="text-nm-muted text-sm ml-1">8.4 / 10</span>
          </div>

          <p className="text-nm-text/80 text-base leading-relaxed mb-6 max-w-lg">
            An elite undercover agent goes rogue to dismantle a criminal empire from the inside — at any cost. Directed by Marcus Webb.
          </p>

          <div className="flex flex-wrap gap-3">
            <button className="flex items-center gap-2 px-6 py-3 rounded font-bold text-black transition-all duration-200 hover:bg-white/90 active:scale-95" style={{ background: "#ffffff" }}>
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <polygon points="5,3 19,12 5,21"/>
              </svg>
              Play
            </button>
            <button className="flex items-center gap-2 px-6 py-3 rounded font-medium text-white transition-all duration-200 hover:bg-white/20 active:scale-95" style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(4px)" }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
              </svg>
              More Info
            </button>
            <button
              onClick={onWatchPartyOpen}
              className="flex items-center gap-2 px-6 py-3 rounded font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95"
              style={{ background: "linear-gradient(135deg, #e50914 0%, #8b0000 100%)", boxShadow: "0 0 20px rgba(229,9,20,0.35)" }}
            >
              🎬 Start Watch Party
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
