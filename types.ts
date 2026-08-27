export interface Movie {
  id: number;
  title: string;
  year: number;
  rating: string;
  score: number;
  genres: string[];
  description: string;
  image: string;
  duration: string;
  director: string;
}

export interface Friend {
  id: number;
  name: string;
  avatar: string;
  online: boolean;
  inParty: boolean;
  partyMovie?: string;
  favoriteGenres: string[];
}

export interface Comment {
  id: number;
  userId: number;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: string;
  reaction?: string;
  isSpoiler: boolean;
}

export interface Vote {
  movieId: number;
  votes: number[];
}

export type WatchPartyStep = "invite" | "genre" | "movies" | "voting" | "watch" | "recap";

export interface PartyMember {
  id: number;
  name: string;
  avatar: string;
  genres: string[];
  ready: boolean;
}
