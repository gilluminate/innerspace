import { statfs } from "node:fs/promises";
import { getPreferenceValues } from "@raycast/api";

export interface DiskUsage {
  /** Mount path that was measured. */
  path: string;
  /** Total size of the volume in bytes. */
  total: number;
  /** Bytes in use. */
  used: number;
  /** Bytes available to the current user. */
  available: number;
  /** Rounded percentage used, matching the "Capacity" column of `df`. */
  percentUsed: number;
}

interface VolumePreferences {
  volumePath?: string;
}

export const STORAGE_SETTINGS_URL = "x-apple.systempreferences:com.apple.settings.Storage";

/** Path of the volume to measure, from preferences, defaulting to the boot volume. */
export function getVolumePath(): string {
  const { volumePath } = getPreferenceValues<VolumePreferences>();
  const trimmed = volumePath?.trim();
  return trimmed ? trimmed : "/";
}

export async function getDiskUsage(path: string): Promise<DiskUsage> {
  const stats = await statfs(path);
  const total = stats.blocks * stats.bsize;
  const available = stats.bavail * stats.bsize;
  const used = total - stats.bfree * stats.bsize;
  const denominator = used + available;
  const percentUsed = denominator > 0 ? Math.round((used / denominator) * 100) : 0;
  return { path, total, used, available, percentUsed };
}

/** Formats bytes using base-10 units, the same convention Finder and System Settings use. */
export function formatBytes(bytes: number): string {
  const units = ["B", "KB", "MB", "GB", "TB", "PB"];
  let value = bytes;
  let unit = 0;
  while (value >= 1000 && unit < units.length - 1) {
    value /= 1000;
    unit += 1;
  }
  const decimals = unit >= 3 ? 1 : 0;
  return `${value.toFixed(decimals)} ${units[unit]}`;
}

export function summarize(usage: DiskUsage): string {
  return `${usage.percentUsed}% used · ${formatBytes(usage.used)} of ${formatBytes(usage.total)} · ${formatBytes(usage.available)} available`;
}
