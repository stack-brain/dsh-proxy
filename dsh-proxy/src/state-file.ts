/**
 * Unified YAML persistence for the plugin's CONFIG state files.
 *
 * The three config files (runtime settings / transport policy / third-party
 * login) used to be JSON: nested objects, quoted keys and braces everywhere,
 * painful to read or hand-edit. YAML keeps the same data model but is readable
 * and comment-friendly. The append-only audit trail is deliberately NOT part of
 * this module: JSON Lines is the right format for an append-only event stream
 * (one self-contained line per event, torn tail lines are trivially skipped).
 *
 * Reads tolerate both formats and migrate in one direction only:
 *   1. the `.yaml` file exists  -> parse it as YAML;
 *   2. a legacy `.json` file exists -> parse it, normalize, and write the YAML
 *      successor once (the old file is KEPT as a rollback path);
 *   3. neither (or corrupt)     -> the caller's fallback.
 *
 * Every caller passes its own tolerant `normalize`, so a malformed or partial
 * document can never inject an invalid config. Writes are atomic (temp + rename).
 */
import { mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { parse, stringify } from 'yaml'

/** The legacy JSON path for a YAML state path (`x.yaml` -> `x.json`). */
export function legacyJsonPath(yamlPath: string): string {
  return yamlPath.endsWith('.yaml') ? `${yamlPath.slice(0, -'.yaml'.length)}.json` : yamlPath
}

/** Serialize one state document; `lineWidth: 0` keeps long URLs on one line. */
export function stringifyStateYaml(value: unknown): string {
  return stringify(value, { lineWidth: 0 })
}

/** Parse one YAML document. YAML 1.2 is a JSON superset, so old JSON works too. */
export function parseStateYaml(text: string): unknown {
  return parse(text) as unknown
}

/**
 * Read one config file, falling back to (and migrating) its legacy JSON form.
 * `normalize` is applied to BOTH formats so a partial document stays safe.
 */
export function readStateYaml<T>(
  yamlPath: string,
  normalize: (raw: unknown) => T,
  fallback: () => T,
): T {
  try {
    const raw = parseStateYaml(readFileSync(yamlPath, 'utf8'))
    if (raw !== null && raw !== undefined) return normalize(raw)
    return fallback()
  } catch {
    /* missing, unreadable or invalid YAML: try the legacy JSON file */
  }

  try {
    const raw: unknown = JSON.parse(readFileSync(legacyJsonPath(yamlPath), 'utf8'))
    const value = normalize(raw)
    // One-time migration. A read-only home must not break the plugin, and the
    // legacy file is intentionally left in place for rollback.
    try {
      writeStateYaml(yamlPath, value)
    } catch {
      /* best effort */
    }
    return value
  } catch {
    return fallback()
  }
}

/** Atomically write one config document as YAML. */
export function writeStateYaml(yamlPath: string, value: unknown): void {
  mkdirSync(dirname(yamlPath), { recursive: true })
  const temp = `${yamlPath}.tmp`
  writeFileSync(temp, stringifyStateYaml(value), 'utf8')
  renameSync(temp, yamlPath)
}

/**
 * Convert a legacy home-root JSON config into its YAML successor during the
 * profile migration. Returns false when the source is not parseable, so the
 * caller can fall back to a plain byte copy.
 */
export function migrateLegacyStateFile(legacyPath: string, yamlPath: string): boolean {
  let raw: unknown
  try {
    raw = JSON.parse(readFileSync(legacyPath, 'utf8'))
  } catch {
    return false
  }
  try {
    writeStateYaml(yamlPath, raw)
    return true
  } catch {
    return false
  }
}
