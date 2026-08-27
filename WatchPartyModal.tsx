import { useState } from "react";
import type { WatchPartyStep, PartyMember, Movie } from "../../types";
import { INITIAL_PARTY_MEMBERS } from "../../data/friends";
import { MOVIES, getGroupRecommendations } from "../../data/movies";
import GenreStep from "./GenreStep";
import MoviesStep from "./MoviesStep";
import VotingStep from "./VotingStep";
import WatchScreen from "./WatchScreen";
import RecapStep from "./RecapStep";

interface WatchPartyModalProps {
  onClose: () => void;
}

const STEPS: WatchPartyStep[] = ["genre", "movies", "voting", "watch", "recap"];
const STEP_LABELS = ["Genre", "Movies", "Vote", "Watch", "Recap"];

export default function WatchPartyModal({ onClose }: WatchPartyModalProps) {
  const [step, setStep] = useState<WatchPartyStep>("genre");
  const [members, setMembers] = useState<PartyMember[]>(INITIAL_PARTY_MEMBERS);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [userRating, setUserRating] = useState(0);

  const stepIndex = STEPS.indexOf(step);

  const groupMovies = getGroupRecommendations(members.map((m) => m.genres));

  const handleGenreConfirm = (genres: string[]) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === 0 ? { ...m, genres, ready: true } : m))
    );
    setStep("movies");
  };

  const handleMoviesNext = () => setStep("voting");

  const handleVoteComplete = (movie: Movie) => {
    setSelectedMovie(movie);
    setStep("watch");
  };

  const handleWatchEnd = () => setStep("recap");

  const handleNextParty = () => {
    setStep("genre");
    setSelectedMovie(null);
    setUserRating(0);
    setMembers(INITIAL_PARTY_MEMBERS);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(6px)" }}>
      <div
        className="relative flex flex-col w-full mx-4 rounded-2xl overflow-hidden animate-fade-in"
        style={{
          maxWidth: step === "watch" ? "1100px" : "860px",
          maxHeight: "92vh",
          background: "#0f0f0f",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 40px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(229,9,20,0.1)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          <div className="flex items-center gap-4">
            <span className="font-display font-black text-2xl" style={{ color: "#e50914" }}>NETMIX</span>
            <span className="text-nm-muted text-sm font-medium">Watch Party</span>
          </div>

          {/* Step indicator */}
          <div className="hidden sm:flex items-center gap-1">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-1">
                <div
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all"
                  style={{
                    background: i === stepIndex ? "#e50914" : i < stepIndex ? "rgba(229,9,20,0.15)" : "rgba(255,255,255,0.05)",
                    color: i === stepIndex ? "white" : i < stepIndex ? "#e50914" : "#606060",
                  }}
                >
                  {i < stepIndex && <span>✓</span>}
                  {STEP_LABELS[i]}
                </div>
                {i < STEPS.length - 1 && (
                  <div className="w-4 h-px" style={{ background: i < stepIndex ? "#e50914" : "rgba(255,255,255,0.1)" }} />
                )}
              </div>
            ))}
          </div>

          {/* Party members avatars */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {members.map((m) => (
                <img key={m.id} src={m.avatar} alt={m.name} className="w-7 h-7 rounded-full object-cover border-2" style={{ borderColor: "#0f0f0f" }} title={m.name} />
              ))}
            </div>
            <button onClick={onClose} className="text-nm-muted hover:text-white transition-colors p-1">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-hidden">
          {step === "genre" && (
            <GenreStep members={members} onConfirm={handleGenreConfirm} />
          )}
          {step === "movies" && (
            <MoviesStep movies={groupMovies} allMovies={MOVIES} members={members} onNext={handleMoviesNext} />
          )}
          {step === "voting" && (
            <VotingStep movies={groupMovies.slice(0, 6)} members={members} onVoteComplete={handleVoteComplete} />
          )}
          {step === "watch" && selectedMovie && (
            <WatchScreen movie={selectedMovie} members={members} onEnd={handleWatchEnd} />
          )}
          {step === "recap" && selectedMovie && (
            <RecapStep
              movie={selectedMovie}
              members={members}
              nextMovies={MOVIES.filter((m) => m.id !== selectedMovie.id).slice(0, 3)}
              userRating={userRating}
              onRatingChange={setUserRating}
              onNextParty={handleNextParty}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}
