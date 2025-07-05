import { useLocalStorageConfig } from "@/contexts/local-storage-context";
import { ConfigKey, ConfigValue } from "@/lib/local-storage";
import { pick } from "@/lib/object";

export function useLocalStorageSettings<
  KeyType extends ConfigKey | ConfigKey[],
>(
  keyOrKeys: KeyType
): KeyType extends any[]
  ? [
      {
        [K in KeyType[number]]: ConfigValue<K>;
      },
      (key: KeyType[number], value: ConfigValue<KeyType[number]>) => void,
    ]
  : KeyType extends ConfigKey
    ? [ConfigValue<KeyType>, (value: ConfigValue<KeyType>) => void]
    : never {
  const { config, get, set } = useLocalStorageConfig();

  if (Array.isArray(keyOrKeys)) {
    const setValues = (key: ConfigKey, value: ConfigValue<any>) => {
      set(key, value);
    };

    return [pick(config, keyOrKeys), setValues] as any;
  } else {
    const value = get(keyOrKeys);
    const setValue = (value: ConfigValue<ConfigKey>) => {
      set(keyOrKeys, value);
    };
    return [value, setValue] as any;
  }
}
