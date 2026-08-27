import type { Friend } from "../types";

interface FriendsSidebarProps {
  friends: Friend[];
  onClose: () => void;
}

export default function FriendsSidebar({ friends, onClose }: FriendsSidebarProps) {
  const online = friends.filter((f) => f.online);
  const offline = friends.filter((f) => !f.online);

  return (
    <div
      className="fixed top-0 right-0 bottom-0 z-40 flex flex-col animate-slide-in"
      style={{ width: "300px", background: "rgba(18,18,18,0.97)", backdropFilter: "blur(20px)", borderLeft: "1px solid rgba(255,255,255,0.07)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
        <div>
          <h3 className="font-display font-bold text-white text-lg tracking-wide">FRIENDS</h3>
          <p className="text-nm-muted text-xs">{online.length} online · {friends.length} total</p>
        </div>
        <button onClick={onClose} className="text-nm-muted hover:text-white transition-colors p-1">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-3">
        {/* Online */}
        {online.length > 0 && (
          <div className="mb-4">
            <p className="text-nm-muted text-xs font-semibold uppercase tracking-widest px-5 mb-2">Online</p>
            {online.map((friend) => (
              <FriendRow key={friend.id} friend={friend} />
            ))}
          </div>
        )}

        {/* Offline */}
        {offline.length > 0 && (
          <div>
            <p className="text-nm-muted text-xs font-semibold uppercase tracking-widest px-5 mb-2">Offline</p>
            {offline.map((friend) => (
              <FriendRow key={friend.id} friend={friend} />
            ))}
          </div>
        )}
      </div>

      {/* Invite to party */}
      <div className="px-5 py-4 border-t" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
        <button
          className="w-full py-2.5 rounded font-semibold text-sm text-white transition-all hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #e50914, #8b0000)" }}
        >
          🎬 Start Watch Party
        </button>
      </div>
    </div>
  );
}

function FriendRow({ friend }: { friend: Friend }) {
  return (
    <div className="flex items-center gap-3 px-5 py-2.5 hover:bg-white/5 transition-colors cursor-pointer">
      <div className="relative flex-shrink-0">
        <img src={friend.avatar} alt={friend.name} className="w-9 h-9 rounded-full object-cover" />
        <span
          className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
          style={{
            background: friend.online ? "#22c55e" : "#404040",
            borderColor: "#121212",
          }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{friend.name}</p>
        {friend.inParty ? (
          <div className="flex items-center gap-1">
            <span className="text-nm-red text-xs">● </span>
            <span className="text-nm-muted text-xs truncate">Watching {friend.partyMovie}</span>
          </div>
        ) : friend.online ? (
          <p className="text-nm-muted text-xs">Online</p>
        ) : (
          <p className="text-nm-muted text-xs">Offline</p>
        )}
      </div>
      {friend.online && !friend.inParty && (
        <button
          className="text-xs px-2 py-1 rounded text-white font-medium flex-shrink-0 hover:opacity-80 transition-opacity"
          style={{ background: "rgba(229,9,20,0.2)", border: "1px solid rgba(229,9,20,0.4)", color: "#e50914" }}
        >
          Invite
        </button>
      )}
      {friend.inParty && (
        <span className="text-xs px-2 py-1 rounded text-white font-medium flex-shrink-0" style={{ background: "rgba(229,9,20,0.15)", color: "#e50914", fontSize: "10px" }}>
          IN PARTY
        </span>
      )}
    </div>
  );
}
