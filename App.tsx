import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MovieRow from "./components/MovieRow";
import FriendsSidebar from "./components/FriendsSidebar";
import WatchPartyModal from "./components/watchparty/WatchPartyModal";
import { MOVIES } from "./data/movies";
import { FRIENDS } from "./data/friends";

export default function App() {
  const [watchPartyOpen, setWatchPartyOpen] = useState(false);
  const [friendsOpen, setFriendsOpen] = useState(false);

  const trending = MOVIES.slice(0, 8);
  const action = MOVIES.filter((m) => m.genres.includes("Action") || m.genres.includes("Thriller"));
  const scifi = MOVIES.filter((m) => m.genres.includes("Sci-Fi"));
  const drama = MOVIES.filter((m) => m.genres.includes("Drama") || m.genres.includes("Romance"));
  const topRated = [...MOVIES].sort((a, b) => b.score - a.score).slice(0, 8);

  return (
    <div
      className="min-h-full"
      style={{ background: "#141414", fontFamily: "'Inter', sans-serif" }}
    >
      <Navbar
        onWatchPartyOpen={() => setWatchPartyOpen(true)}
        onFriendsToggle={() => setFriendsOpen((p) => !p)}
        friendsOpen={friendsOpen}
        friends={FRIENDS}
      />

      {/* Main content */}
      <main>
        <Hero onWatchPartyOpen={() => setWatchPartyOpen(true)} />

        <div className="pb-16" style={{ marginTop: "-80px", position: "relative", zIndex: 10 }}>
          <MovieRow title="Trending Now" movies={trending} />
          <MovieRow title="Action & Thriller" movies={action} />
          <MovieRow title="Sci-Fi & Fantasy" movies={scifi} />
          <MovieRow title="Drama & Romance" movies={drama} />
          <MovieRow title="Top Rated on Netmix" movies={topRated} />
        </div>
      </main>

      {/* Friends sidebar */}
      {friendsOpen && (
        <FriendsSidebar friends={FRIENDS} onClose={() => setFriendsOpen(false)} />
      )}

      {/* Watch Party modal */}
      {watchPartyOpen && (
        <WatchPartyModal onClose={() => setWatchPartyOpen(false)} />
      )}
    </div>
  );
}
