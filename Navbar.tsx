import { useState, useRef, useEffect } from "react";
import type { Friend } from "../types";

interface NavbarProps {
  onWatchPartyOpen: () => void;
  onFriendsToggle: () => void;
  friendsOpen: boolean;
  friends: Friend[];
}

export default function Navbar({ onWatchPartyOpen, onFriendsToggle, friendsOpen, friends }: NavbarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const onlineFriendsCount = friends.filter((f) => f.online).length;

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? "rgba(10,10,10,0.97)"
          : "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, transparent 100%)",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "none",
      }}
    >
      <div className="flex items-center justify-between px-6 lg:px-12 h-16">
        {/* Left: Logo + Nav Links */}
        <div className="flex items-center gap-8">
          <span
            className="font-display text-3xl font-black tracking-tight select-none"
            style={{ color: "#e50914", letterSpacing: "-0.02em" }}
          >
            NETMIX
          </span>
          <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-nm-text/80">
            <a href="#" className="hover:text-white transition-colors">Home</a>
            <a href="#" className="hover:text-white transition-colors">TV Shows</a>
            <a href="#" className="hover:text-white transition-colors">Movies</a>
            <a href="#" className="hover:text-white transition-colors">New & Popular</a>
            <a href="#" className="hover:text-white transition-colors">My List</a>
            {/* Watch Party - highlighted */}
            <button
              onClick={onWatchPartyOpen}
              className="flex items-center gap-2 px-3 py-1.5 rounded text-white font-semibold transition-all duration-200 hover:scale-105"
              style={{ background: "linear-gradient(135deg, #e50914 0%, #8b0000 100%)", boxShadow: "0 0 12px rgba(229,9,20,0.4)" }}
            >
              <span>🎬</span>
              <span>Watch Party</span>
            </button>
          </div>
        </div>

        {/* Right: Search + Friends + Profile */}
        <div className="flex items-center gap-4">
          {/* Search bar */}
          <div className="flex items-center gap-2">
            {searchOpen ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded border border-white/20 bg-black/60 backdrop-blur">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-nm-muted flex-shrink-0">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  ref={searchRef}
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  onBlur={() => { if (!searchVal) setSearchOpen(false); }}
                  placeholder="Titles, people, genres"
                  className="bg-transparent text-white text-sm outline-none w-44 placeholder-nm-muted"
                />
                <button onClick={() => { setSearchVal(""); setSearchOpen(false); }} className="text-nm-muted hover:text-white transition-colors">
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M18 6 6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="text-nm-text hover:text-white transition-colors p-1"
                aria-label="Search"
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              </button>
            )}
          </div>

          {/* Friends button */}
          <button
            onClick={onFriendsToggle}
            className="relative flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-all duration-200 hover:bg-white/10"
            style={{ color: friendsOpen ? "#c9a84c" : "#e5e5e5", border: friendsOpen ? "1px solid rgba(201,168,76,0.4)" : "1px solid transparent" }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span className="hidden sm:inline">Friends</span>
            {onlineFriendsCount > 0 && (
              <span
                className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full text-xs font-bold text-white"
                style={{ background: "#e50914", fontSize: "10px" }}
              >
                {onlineFriendsCount}
              </span>
            )}
          </button>

          {/* Notifications */}
          <button className="text-nm-text hover:text-white transition-colors p-1 relative">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span className="absolute top-0 right-0 w-2 h-2 rounded-full" style={{ background: "#e50914" }} />
          </button>

          {/* Profile */}
          <div className="flex items-center gap-2 cursor-pointer group">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&auto=format"
              alt="Profile"
              className="w-8 h-8 rounded object-cover border-2 border-transparent group-hover:border-nm-red transition-all"
            />
            <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24" className="text-nm-muted group-hover:text-white transition-colors">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Mobile Watch Party button */}
      <div className="lg:hidden flex px-6 pb-2">
        <button
          onClick={onWatchPartyOpen}
          className="flex items-center gap-2 px-3 py-1.5 rounded text-white text-sm font-semibold"
          style={{ background: "linear-gradient(135deg, #e50914 0%, #8b0000 100%)" }}
        >
          <span>🎬</span>
          <span>Watch Party</span>
        </button>
      </div>
    </nav>
  );
}
