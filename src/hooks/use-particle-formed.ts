"use client";

import { useSyncExternalStore } from "react";

/**
 * A tiny external store linking the particle engine to the page.
 *
 * - `status`: `idle` until the background has decided what it is doing,
 *   `engine` while the swarm runs, `off` when it will not (a phone, reduced
 *   motion, the robot form).
 * - `formed[id]`: the swarm has landed on stage `id` (99% of particles on their
 *   targets) — the real image may fade in and the swarm fades out.
 *
 * `useParticleFormed(id)` answers "should the real image of stage `id` be
 * showing?": yes once formed, and always when there is no swarm. While `idle`
 * it answers no, so the image never flashes before the swarm takes over.
 */
type Status = "idle" | "engine" | "off";
interface ParticleState {
  status: Status;
  formed: Readonly<Record<string, boolean>>;
}

let state: ParticleState = { status: "idle", formed: {} };
const listeners = new Set<() => void>();

const emit = (next: ParticleState): void => {
  state = next;
  listeners.forEach((listener) => listener());
};

export const particleStore = {
  setStatus(status: Status): void {
    if (state.status === status && (status !== "idle" || Object.keys(state.formed).length === 0)) return;
    emit({ status, formed: status === "engine" ? state.formed : {} });
  },
  setFormed(id: string, formed: boolean): void {
    if (state.formed[id] === formed) return;
    emit({ ...state, formed: { ...state.formed, [id]: formed } });
  },
};

const subscribe = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const snapshot = (id: string) => (): boolean => state.status === "off" || state.formed[id] === true;

export const useParticleFormed = (id: string): boolean =>
  useSyncExternalStore(subscribe, snapshot(id), () => false);
