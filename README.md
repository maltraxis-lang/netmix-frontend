# Netmix Watch Party — Design Odyssey 2026 Submission

## The Prompt

**Netflix — "Watch Party, Reimagined"**

Streaming is a solo habit that everyone secretly wants to make social. Netflix already
lets you sync playback with friends who are miles apart, but the feature stops at "the
video plays at the same time." Everything around it — deciding what to watch as a
group, feeling like you're actually hanging out, reacting to a scene without breaking
the moment — is still clunky, scattered across separate apps (a group chat for
arguing about the movie, a video call in another tab just to see each other's faces).

**The challenge:** design a Watch Party experience that solves three connected
problems — **deciding together**, **watching together**, and **reacting together** —
while staying recognizably "Netflix" in tone and visual language.

## Concept Document

**Problem.** Group movie night dies in the scrolling phase. Nobody wants to be the
one who picks (and gets blamed for) a bad movie, so groups either default to
whoever's loudest or give up and watch separately.

**Who it's for.** Friend groups who already watch together remotely and want the
"deciding" and "reacting" parts of movie night to feel as easy as the "watching"
part already is.

**Our approach to "deciding together" (the heart of the problem).** Instead of one
person scrolling a shared queue, the flow is a short, low-effort funnel everyone
walks through in parallel:

1. **Genre** — each member picks the genres they're in the mood for; the app
   shows what your friends already like, nudging toward overlap instead of a cold
   blank list.
2. **Movies** — the app cross-references every member's picks and surfaces a
   small, ranked shortlist ("Best Matches for Your Group") instead of the entire
   catalog, so nobody has to scroll.
3. **Vote** — a fast, timed vote on that shortlist. As soon as everyone in the
   party has cast a vote, the group moves on immediately — it doesn't force
   people to sit out a fixed countdown once the decision is already made.

That last point was also the bug this build fixes: the "next step" button was
only appearing after a full 15-second timer, even once every member had already
voted, which made it look like the app had no way to move forward. Voting now
resolves — and the "Start Watching" button appears — the instant the party
finishes voting, with the countdown only as a backstop for stragglers.

**Screens delivered (mapped to the 4 required core screens):**

| Brief's screen | This build |
|---|---|
| Party Entry Screen | `Navbar` / `Hero` "Start Watch Party" entry points |
| "What Are We Watching?" Screen | `GenreStep` → `MoviesStep` → `VotingStep` |
| In-Session Viewing Screen | `WatchScreen` (synced player + reactions + spoiler-aware chat) |
| Session Wrap-Up Screen | `RecapStep` (rating, party recap stats, next-party suggestions) |

**What's unique about the approach:** the decision phase is split into genre →
shortlist → vote instead of one big swipe pile, so the group narrows options
together before voting rather than voting on the entire catalog; and reactions
in `WatchScreen` are spoiler-tagged and blurred by default so people can react
freely without wrecking the movie for others watching at a different pace.

---

## Project Structure

React + Vite + Tailwind CSS v4, running inside Figma Make.

- `src/App.tsx` — top-level layout, owns Watch Party / Friends sidebar open state
- `src/components/` — `Navbar`, `Hero`, `MovieRow`, `FriendsSidebar`
- `src/components/watchparty/` — `WatchPartyModal` (step orchestration) and its
  steps: `GenreStep`, `MoviesStep`, `VotingStep`, `WatchScreen`, `RecapStep`
- `src/data/` — `movies.ts`, `friends.ts`
- `src/types.ts` — shared types (`Movie`, `Friend`, `PartyMember`, `Comment`, ...)

### Fix included in this build
`VotingStep.tsx` now finishes voting (and reveals the "Start Watching →" button)
as soon as every party member has voted, instead of always waiting out the full
15-second countdown. This is what caused the "no button to move to the next
feature" issue when clicking through Watch Party.

### Running locally
```
pnpm install
pnpm dev
```
