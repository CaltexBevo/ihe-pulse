import 'server-only';

export function rankingCacheIdentity(input: { deploymentId?: string; deploymentUrl?: string; project?: string; team?: string }) {
  return {
    deployment: input.deploymentId || input.deploymentUrl || 'local',
    project: input.project || 'ihe-pulse',
    team: input.team || 'brents-projects-eaca52c7',
  };
}

/** Bounded per-process singleflight, including unavailable results. Persistent
 * Next cache handles warm instances; separate cold instances can still overlap. */
export function createRankingMemo<T>(now: () => number = Date.now) {
  const entries = new Map<string, { expires: number; value: Promise<T | null> }>();
  return (key: string, expires: number, load: () => Promise<T | null>): Promise<T | null> => {
    for (const [id, entry] of entries) if (entry.expires <= now()) entries.delete(id);
    const existing = entries.get(key);
    if (existing) return existing.value;
    if (entries.size >= 2) entries.delete(entries.keys().next().value!);
    const value = Promise.resolve().then(load).catch(() => null);
    entries.set(key, { expires, value });
    return value;
  };
}
