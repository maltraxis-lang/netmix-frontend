import { useState, useRef, useEffect } from "react";
import type { Movie, Comment, PartyMember } from "../../types";

interface WatchScreenProps {
  movie: Movie;
  members: PartyMember[];
  onEnd: () => void;
}

const REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🔥", "🎬", "👏"];

const INITIAL_COMMENTS: Comment[] = [
  { id: 1, userId: 1, userName: "Maya", userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format", text: "This opening scene is incredible!", timestamp: "0:12", reaction: "🔥", isSpoiler: false },
  { id: 2, userId: 4, userName: "Alex", userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&auto=format", text: "The cinematography is unreal 😮", timestamp: "0:45", reaction: "😮", isSpoiler: false },
  { id: 3, userId: 1, userName: "Maya", userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format", text: "Wait... [SPOILER: the main character's brother is actually the villain]", timestamp: "1:20", reaction: undefined, isSpoiler: true },
];

const AUTO_COMMENTS = [
  { userId: 4, userName: "Alex", userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&auto=format", text: "No way!! 😂", reaction: "😂", isSpoiler: false },
  { userId: 1, userName: "Maya", userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format", text: "This soundtrack goes hard 🔥", reaction: "🔥", isSpoiler: false },
  { userId: 4, userName: "Alex", userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&auto=format", text: "The plot twist at the end... you'll never guess it", reaction: undefined, isSpoiler: true },
  { userId: 1, userName: "Maya", userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format", text: "Absolutely loving this ❤️", reaction: "❤️", isSpoiler: false },
];

let nextId = 10;

export default function WatchScreen({ movie, members, onEnd }: WatchScreenProps) {
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [input, setInput] = useState("");
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [spoilerHidden, setSpoilerHidden] = useState(true);
  const [revealedSpoilers, setRevealedSpoilers] = useState<Set<number>>(new Set());
  const [floatingReactions, setFloatingReactions] = useState<{ id: number; emoji: string; x: number }[]>([]);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(8);
  const chatRef = useRef<HTMLDivElement>(null);
  const autoIdx = useRef(0);

  // Simulate comments appearing
  useEffect(() => {
    const interval = setInterval(() => {
      if (autoIdx.current < AUTO_COMMENTS.length) {
        const c = AUTO_COMMENTS[autoIdx.current];
        const now = new Date();
        setComments((prev) => [
          ...prev,
          {
            id: nextId++,
            userId: c.userId,
            userName: c.userName,
            userAvatar: c.userAvatar,
            text: c.text,
            timestamp: `${now.getMinutes()}:${String(now.getSeconds()).padStart(2, "0")}`,
            reaction: c.reaction,
            isSpoiler: c.isSpoiler,
          },
        ]);
        autoIdx.current++;
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Progress simulation
  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => setProgress((p) => Math.min(p + 0.3, 100)), 1000);
    return () => clearInterval(interval);
  }, [playing]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [comments]);

  const sendComment = () => {
    if (!input.trim()) return;
    const now = new Date();
    setComments((prev) => [
      ...prev,
      {
        id: nextId++,
        userId: 0,
        userName: "You",
        userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&auto=format",
        text: input.trim(),
        timestamp: `${now.getMinutes()}:${String(now.getSeconds()).padStart(2, "0")}`,
        isSpoiler,
      },
    ]);
    setInput("");
    setIsSpoiler(false);
  };

  const sendReaction = (emoji: string) => {
    const x = 20 + Math.random() * 60;
    const id = nextId++;
    setFloatingReactions((prev) => [...prev, { id, emoji, x }]);
    setTimeout(() => setFloatingReactions((prev) => prev.filter((r) => r.id !== id)), 2000);

    const now = new Date();
    setComments((prev) => [
      ...prev,
      {
        id: nextId++,
        userId: 0,
        userName: "You",
        userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&auto=format",
        text: "",
        timestamp: `${now.getMinutes()}:${String(now.getSeconds()).padStart(2, "0")}`,
        reaction: emoji,
        isSpoiler: false,
      },
    ]);
  };

  const toggleReveal = (id: number) => {
    setRevealedSpoilers((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const formatProgress = (pct: number) => {
    const totalSec = 132 * 60;
    const elapsed = Math.round((pct / 100) * totalSec);
    const m = Math.floor(elapsed / 60);
    const s = elapsed % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div className="flex h-full" style={{ maxHeight: "80vh" }}>
      {/* Video area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Video player */}
        <div className="relative flex-1 bg-black flex items-center justify-center" style={{ minHeight: "280px" }}>
          <img
            src={movie.image}
            alt={movie.title}
            className="w-full h-full object-cover opacity-60"
            style={{ position: "absolute", inset: 0 }}
          />
          <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.5)" }} />

          {/* Floating reactions */}
          {floatingReactions.map((r) => (
            <div
              key={r.id}
              className="absolute bottom-16 text-3xl pointer-events-none"
              style={{
                left: `${r.x}%`,
                animation: "floatUp 2s ease-out forwards",
              }}
            >
              {r.emoji}
            </div>
          ))}

          {/* Movie info overlay */}
          <div className="relative z-10 text-center">
            <div className="mb-4 flex items-center justify-center gap-2">
              <span className="live-dot text-white text-sm font-bold">LIVE </span>
              <span className="text-nm-muted text-sm">Watch Party</span>
            </div>
            <h3 className="font-display font-black text-white text-4xl mb-2">{movie.title.toUpperCase()}</h3>
            <p className="text-nm-muted text-sm">{movie.director} · {movie.year}</p>
          </div>

          {/* Controls overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)" }}>
            {/* Progress */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-nm-muted text-xs">{formatProgress(progress)}</span>
              <div className="flex-1 h-1 rounded-full overflow-hidden cursor-pointer" style={{ background: "rgba(255,255,255,0.2)" }}>
                <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${progress}%`, background: "#e50914" }} />
              </div>
              <span className="text-nm-muted text-xs">{movie.duration}</span>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-4">
              <button onClick={() => setPlaying((p) => !p)} className="text-white hover:text-nm-red transition-colors">
                {playing ? (
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6zM14 4h4v16h-4z"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <polygon points="5,3 19,12 5,21"/>
                  </svg>
                )}
              </button>
              <span className="text-white text-sm font-medium flex-1">{movie.title}</span>
              <div className="flex items-center gap-1 text-nm-muted text-xs">
                <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                {members.length} watching
              </div>
              <button
                onClick={onEnd}
                className="px-3 py-1 rounded text-xs font-semibold text-white hover:opacity-80"
                style={{ background: "rgba(229,9,20,0.3)", border: "1px solid rgba(229,9,20,0.5)" }}
              >
                End Party
              </button>
            </div>
          </div>
        </div>

        {/* Reaction bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-t flex-shrink-0" style={{ background: "#0f0f0f", borderColor: "rgba(255,255,255,0.07)" }}>
          <span className="text-nm-muted text-xs mr-1">React:</span>
          {REACTIONS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => sendReaction(emoji)}
              className="text-xl hover:scale-125 transition-transform active:scale-110 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Chat sidebar */}
      <div className="flex flex-col border-l flex-shrink-0" style={{ width: "300px", borderColor: "rgba(255,255,255,0.07)", background: "#0d0d0d" }}>
        {/* Chat header */}
        <div className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          <div>
            <p className="text-white text-sm font-semibold">Live Chat</p>
            <div className="flex -space-x-1 mt-1">
              {members.map((m) => (
                <img key={m.id} src={m.avatar} alt={m.name} className="w-4 h-4 rounded-full object-cover border" style={{ borderColor: "#0d0d0d" }} />
              ))}
              <span className="text-nm-muted text-xs ml-2">{members.length} watching</span>
            </div>
          </div>
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <div
              onClick={() => setSpoilerHidden((p) => !p)}
              className="relative w-8 h-4 rounded-full transition-colors"
              style={{ background: spoilerHidden ? "#e50914" : "#2a2a2a" }}
            >
              <div
                className="absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all"
                style={{ left: spoilerHidden ? "calc(100% - 14px)" : "2px" }}
              />
            </div>
            <span className="text-xs text-nm-muted">Hide spoilers</span>
          </label>
        </div>

        {/* Messages */}
        <div ref={chatRef} className="flex-1 overflow-y-auto p-3 space-y-2">
          {comments.map((comment) => (
            <CommentBubble
              key={comment.id}
              comment={comment}
              isOwn={comment.userId === 0}
              spoilerHidden={spoilerHidden}
              revealed={revealedSpoilers.has(comment.id)}
              onReveal={() => toggleReveal(comment.id)}
            />
          ))}
        </div>

        {/* Input */}
        <div className="flex flex-col gap-2 p-3 border-t flex-shrink-0" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          {/* Spoiler toggle */}
          <button
            onClick={() => setIsSpoiler((p) => !p)}
            className="flex items-center gap-2 text-xs px-2 py-1 rounded self-start transition-all"
            style={{
              background: isSpoiler ? "rgba(229,9,20,0.15)" : "transparent",
              border: isSpoiler ? "1px solid rgba(229,9,20,0.4)" : "1px solid rgba(255,255,255,0.1)",
              color: isSpoiler ? "#e50914" : "#808080",
            }}
          >
            🚨 {isSpoiler ? "Spoiler tag ON" : "Add spoiler tag"}
          </button>

          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendComment()}
              placeholder="Say something..."
              className="flex-1 bg-nm-card2 text-white text-sm px-3 py-2 rounded-lg outline-none placeholder-nm-muted border border-transparent focus:border-nm-red/40 transition-colors"
              style={{ background: "rgba(255,255,255,0.06)" }}
            />
            <button
              onClick={sendComment}
              disabled={!input.trim()}
              className="px-3 py-2 rounded-lg text-white font-bold text-sm disabled:opacity-30 transition-all hover:opacity-90"
              style={{ background: "#e50914" }}
            >
              →
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-120px) scale(1.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function CommentBubble({
  comment,
  isOwn,
  spoilerHidden,
  revealed,
  onReveal,
}: {
  comment: Comment;
  isOwn: boolean;
  spoilerHidden: boolean;
  revealed: boolean;
  onReveal: () => void;
}) {
  if (!comment.text && comment.reaction) {
    return (
      <div className={`flex items-center gap-1.5 ${isOwn ? "justify-end" : ""}`}>
        <img src={comment.userAvatar} alt={comment.userName} className="w-4 h-4 rounded-full object-cover" />
        <span className="text-xs text-nm-muted">{comment.userName}</span>
        <span className="text-lg">{comment.reaction}</span>
      </div>
    );
  }

  const shouldBlur = comment.isSpoiler && spoilerHidden && !revealed;

  return (
    <div className={`flex gap-2 ${isOwn ? "flex-row-reverse" : ""} animate-fade-in`}>
      <img src={comment.userAvatar} alt={comment.userName} className="w-6 h-6 rounded-full object-cover flex-shrink-0 mt-1" />
      <div className={`max-w-[85%] ${isOwn ? "items-end" : "items-start"} flex flex-col gap-0.5`}>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold" style={{ color: isOwn ? "#e50914" : "#c9a84c" }}>{comment.userName}</span>
          <span className="text-nm-muted" style={{ fontSize: "10px" }}>{comment.timestamp}</span>
          {comment.isSpoiler && (
            <span className="text-xs px-1 rounded" style={{ background: "rgba(229,9,20,0.2)", color: "#e50914", fontSize: "9px" }}>SPOILER</span>
          )}
        </div>
        <div
          className="px-3 py-2 rounded-xl text-sm leading-relaxed transition-all"
          style={{
            background: isOwn ? "rgba(229,9,20,0.18)" : "rgba(255,255,255,0.07)",
            borderRadius: isOwn ? "12px 4px 12px 12px" : "4px 12px 12px 12px",
            filter: shouldBlur ? "blur(4px)" : "none",
            cursor: shouldBlur ? "pointer" : "default",
            userSelect: shouldBlur ? "none" : "auto",
            color: "#e5e5e5",
          }}
          onClick={shouldBlur ? onReveal : undefined}
          title={shouldBlur ? "Click to reveal spoiler" : undefined}
        >
          {comment.text}
          {comment.reaction && <span className="ml-1">{comment.reaction}</span>}
        </div>
        {comment.isSpoiler && spoilerHidden && !revealed && (
          <button onClick={onReveal} className="text-xs text-nm-muted hover:text-white transition-colors mt-0.5">
            👁 Reveal spoiler
          </button>
        )}
      </div>
    </div>
  );
}
