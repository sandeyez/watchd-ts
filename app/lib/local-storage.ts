import * as z from "zod/v4";

const STORAGE_KEY = "app-config";

/**
 * Configuration schema mapping keys to their Zod validators.
 * Add new config items here with their corresponding Zod schema.
 */
export const configSchema = {
  defaultSelectedWatchProvidertab: z.literal(["all", "my"]).default("my"),
} as const;

export type ConfigKey = keyof typeof configSchema;
export type ConfigValue<K extends ConfigKey> = z.infer<
  (typeof configSchema)[K]
>;
export type ConfigObject = {
  [K in ConfigKey]: ConfigValue<K>;
};

function getDefaultConfig(): ConfigObject {
  return Object.fromEntries(
    Object.entries(configSchema).map(([key, schema]) => [
      key,
      schema.parse(undefined),
    ])
  ) as ConfigObject;
}

export function getInitialConfig(): ConfigObject {
  if (typeof window === "undefined") {
    // If we're not in a browser environment, return defaults
    return getDefaultConfig();
  }

  const localStorageValue = localStorage.getItem(STORAGE_KEY);

  let config: Partial<ConfigObject> = {};

  if (localStorageValue) {
    try {
      const jsonConfig = JSON.parse(localStorageValue);

      for (const keyAsString in configSchema) {
        const key = keyAsString as ConfigKey;
        const schema = configSchema[key];

        if (schema.safeParse(jsonConfig[key]).success) {
          // If the value is
          config[key] = jsonConfig[key];
        } else {
          console.warn(
            `Invalid value for config key "${key}": ${jsonConfig[key]}`
          );
          // Set the default value if the stored value is invalid
          config[key] = schema.parse(undefined);
        }
      }
    } catch (error) {
      console.error("Failed to parse localStorage config:", error);

      // If parsing fails, reset to defaults
      config = getDefaultConfig();
    }
  } else {
    // If no config in localStorage, use defaults
    config = getDefaultConfig();
  }

  // Write the config to localStorage, in a self-correcting way
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));

  return config as ConfigObject;
}

/**
 * Safely sets a value in localStorage with Zod validation.
 * @param key - The config key to set.
 * @param value - The value to set (will be validated).
 *
 * @void
 */
export function setConfigValue<K extends ConfigKey>(
  key: K,
  value: ConfigValue<K>
): ConfigObject {
  if (typeof window === "undefined") {
    throw new Error(
      "setConfigValue can only be called in a browser environment"
    );
  }

  const validatedValue = configSchema[key].parse(value);

  const currentConfig = (() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : getDefaultConfig();
    } catch {
      return getDefaultConfig();
    }
  })();
  currentConfig[key] = validatedValue;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(currentConfig));

  return currentConfig as ConfigObject;
}
