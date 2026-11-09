/** The legacy JSON path for a YAML state path (`x.yaml` -> `x.json`). */
export declare function legacyJsonPath(yamlPath: string): string;
/** Serialize one state document; `lineWidth: 0` keeps long URLs on one line. */
export declare function stringifyStateYaml(value: unknown): string;
/** Parse one YAML document. YAML 1.2 is a JSON superset, so old JSON works too. */
export declare function parseStateYaml(text: string): unknown;
/**
 * Read one config file, falling back to (and migrating) its legacy JSON form.
 * `normalize` is applied to BOTH formats so a partial document stays safe.
 */
export declare function readStateYaml<T>(yamlPath: string, normalize: (raw: unknown) => T, fallback: () => T): T;
/** Atomically write one config document as YAML. */
export declare function writeStateYaml(yamlPath: string, value: unknown): void;
/**
 * Convert a legacy home-root JSON config into its YAML successor during the
 * profile migration. Returns false when the source is not parseable, so the
 * caller can fall back to a plain byte copy.
 */
export declare function migrateLegacyStateFile(legacyPath: string, yamlPath: string): boolean;
