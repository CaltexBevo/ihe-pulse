import { constants } from 'node:fs';
import { mkdir, open, rename, lstat, realpath } from 'node:fs/promises';
import { resolve } from 'node:path';

export async function ensurePrivateJournalDirectory(directory: string): Promise<void> {
  await mkdir(directory, { recursive: true, mode: 0o700 });
  const info = await lstat(directory);
  if (!info.isDirectory() || (info.mode & 0o777) !== 0o700 || (process.getuid && info.uid !== process.getuid()) || await realpath(directory) !== resolve(directory)) throw new Error('Journal must be an owned, real directory with mode 0700.');
}

export async function readPrivateJournal(path: string): Promise<string> {
  const handle = await open(path, constants.O_RDONLY | constants.O_NOFOLLOW);
  try {
    const info = await handle.stat();
    if (!info.isFile() || info.nlink !== 1 || (info.mode & 0o777) !== 0o600 || (process.getuid && info.uid !== process.getuid())) throw new Error('Journal must be an owned regular file with mode 0600.');
    return await handle.readFile('utf8');
  } finally { await handle.close(); }
}

export async function savePrivateJournal(directory: string, path: string, value: unknown): Promise<void> {
  // Exclusive creation prevents following or truncating a stale/symlink temp file.
  // A leftover pending file requires reconciliation rather than automatic removal.
  const temp = `${path}.pending`;
  const handle = await open(temp, constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | constants.O_NOFOLLOW, 0o600);
  try { await handle.writeFile(JSON.stringify(value, null, 2)); await handle.sync(); } finally { await handle.close(); }
  await rename(temp, path);
  const dir = await open(directory, 'r');
  try { await dir.sync(); } finally { await dir.close(); }
}
