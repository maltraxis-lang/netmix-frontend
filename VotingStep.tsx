import { useState, useEffect } from "react";
import type { Movie, PartyMember } from "../../types";

interface VotingStepProps {
  movies: Movie[];
  members: PartyMember[];
  onVoteComplete: (movie: Movie) => void;
}

export default function VotingStep({ movies, members, onVoteComplete }: VotingStepProps) {
  const [votes, setVotes] = useState<Record<number, number[]>>({});
  const [userVoted, setUserVoted] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(15);
  const [finished, setFinished] = useState(false);

  // Simulate other members voting
  useEffect(() => {
    const otherMembers = members.filter((m) => m.id !== 0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    otherMembers.forEach((member, i) => {
      timers.push(
        setTimeout(() => {
          const randomMovie = movies[Math.floor(Math.random() * movies.length)];
          setVotes((prev) => ({
            ...prev,
            [randomMovie.id]: [...(prev[randomMovie.id] || []), member.id],
          }));
        }, (i + 1) * 1200)
      );
    });
    return () => timers.forEach(clearTimeout);
  }, [members, movies]);

  // Countdown
  useEffect(() => {
    if (finished) return;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [finished]);

  // Finish as soon as everyone has voted, instead of always waiting out
  // the full countdown — this is what was hiding the "next" button.
  useEffect(() => {
    if (finished) return;
    const totalVotesCast = Object.values(votes).reduce((sum, v) => sum + v.length, 0);
    if (totalVotesCast >= members.length) {
      setFinished(true);
    }
  }, [votes, members.length, finished]);

  const handleVote = (movieId: number) => {
    if (userVoted !== null) return;
    setUserVoted(movieId);
    setVotes((prev) => ({
      ...prev,
      [movieId]: [...(prev[movieId] || []), 0],
    }));
  };

  const totalVotes = (movieId: number) => (votes[movieId] || []).length;

  const maxVotes = Math.max(...movies.map((m) => totalVotes(m.id)), 0);

  const winner = finished
    ? movies.reduce((best, m) => (totalVotes(m.id) >= totalVotes(best.id) ? m : best), movies[0])
    : null;

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display font-black text-white text-3xl tracking-tight">VOTE FOR A MOVIE</h2>
            <p className="text-nm-muted text-sm">Each member gets one vote</p>
          </div>
          {!finished ? (
            <div className="flex flex-col items-center">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center font-display font-black text-2xl text-white"
                style={{
                  background: `conic-gradient(#e50914 ${((15 - countdown) / 15) * 360}deg, #2a2a2a 0deg)`,
                  boxShadow: "0 0 15px rgba(229,9,20,0.3)",
                }}
              >
                {countdown}
              </div>
              <span className="text-nm-muted text-xs mt-1">seconds</span>
            </div>
          ) : (
            <div className="px-3 py-1.5 rounded-lg text-sm font-bold text-white animate-fade-in" style={{ background: "#e50914" }}>
              Voting Closed!
            </div>
          )}
        </div>

        {/* Movie voting cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {movies.map((movie) => {
            const voteCount = totalVotes(movie.id);
            const pct = maxVotes > 0 ? (voteCount / maxVotes) * 100 : 0;
            const isUserVote = userVoted === movie.id;
            const isWinner = winner?.id === movie.id;

            return (
              <button
                key={movie.id}
                onClick={() => handleVote(movie.id)}
                disabled={userVoted !== null}
                className="text-left rounded-xl overflow-hidden transition-all duration-300 disabled:cursor-default relative"
                style={{
                  border: isWinner
                    ? "2px solid #c9a84c"
                    : isUserVote
                    ? "2px solid #e50914"
                    : "2px solid rgba(255,255,255,0.07)",
                  boxShadow: isWinner ? "0 0 25px rgba(201,168,76,0.25)" : isUserVote ? "0 0 20px rgba(229,9,20,0.2)" : "none",
                  background: "#1a1a1a",
                  transform: isWinner ? "scale(1.02)" : "scale(1)",
                }}
              >
                {/* Winner crown */}
                {isWinner && (
                  <div className="absolute top-2 right-2 z-10 text-xl animate-fade-in">👑</div>
                )}

                <div className="flex gap-3 p-3">
                  <img src={movie.image} alt={movie.title} className="w-16 h-20 object-cover rounded-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white text-sm leading-tight mb-1">{movie.title}</p>
                    <p className="text-nm-muted text-xs mb-2">{movie.year} · {movie.genres[0]}</p>
                    <div className="flex items-center gap-1 mb-2">
                      <span className="text-nm-gold text-xs">★ {movie.score}</span>
                      <span className="text-nm-muted text-xs">·</span>
                      <span className="text-nm-muted text-xs">{movie.duration}</span>
                    </div>

                    {/* Vote progress bar */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, background: isWinner ? "#c9a84c" : isUserVote ? "#e50914" : "#e50914" }}
                        />
                      </div>
                      <span className="text-xs font-bold" style={{ color: isWinner ? "#c9a84c" : "#e5e5e5" }}>
                        {voteCount}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Who voted */}
                {(votes[movie.id] || []).length > 0 && (
                  <div className="px-3 pb-2 flex items-center gap-1">
                    {members
                      .filter((m) => (votes[movie.id] || []).includes(m.id))
                      .map((m) => (
                        <img key={m.id} src={m.avatar} alt={m.name} title={m.name} className="w-5 h-5 rounded-full object-cover border" style={{ borderColor: "#0f0f0f" }} />
                      ))}
                    <span className="text-nm-muted text-xs ml-1">voted</span>
                    {isUserVote && <span className="text-xs ml-1" style={{ color: "#e50914" }}>(you)</span>}
                  </div>
                )}

                {/* Vote CTA */}
                {userVoted === null && !finished && (
                  <div className="px-3 pb-3">
                    <div className="w-full py-1.5 rounded text-center text-xs font-semibold text-white" style={{ background: "rgba(229,9,20,0.2)", border: "1px solid rgba(229,9,20,0.3)", color: "#e50914" }}>
                      Vote for this
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Result banner */}
        {finished && winner && (
          <div className="animate-fade-in p-4 rounded-xl mb-6" style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.12), rgba(229,9,20,0.08))", border: "1px solid rgba(201,168,76,0.3)" }}>
            <p className="text-nm-gold font-display font-bold text-xl mb-1">👑 Winner: {winner.title}</p>
            <p className="text-nm-muted text-sm">with {totalVotes(winner.id)} vote{totalVotes(winner.id) !== 1 ? "s" : ""}</p>
          </div>
        )}

        {finished && winner && (
          <button
            onClick={() => onVoteComplete(winner)}
            className="w-full py-3.5 rounded-xl font-bold text-white text-lg transition-all hover:opacity-90 animate-fade-in"
            style={{ background: "linear-gradient(135deg, #e50914, #8b0000)", boxShadow: "0 0 20px rgba(229,9,20,0.3)" }}
          >
            ▶ Start Watching — {winner.title}
          </button>
        )}

        {!userVoted && !finished && (
          <p className="text-center text-nm-muted text-sm">Click a movie to cast your vote</p>
        )}
      </div>
    </div>
  );
}
