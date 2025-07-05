import { useLocalStorageConfig } from "@/contexts/local-storage-context";
import { ConfigKey, ConfigValue } from "@/lib/local-storage";
import { pick } from "@/lib/object";

type MultipleKeyReturnType<KeyType extends ConfigKey[]> = [
  {
    [K in KeyType[number]]: ConfigValue<K>;
  },
  (key: KeyType[number], value: ConfigValue<KeyType[number]>) => void,
];

type SingleKeyReturnType<KeyType extends ConfigKey> = [
  ConfigValue<KeyType>,
  (value: ConfigValue<KeyType>) => void,
];

export function useLocalStorageSettings<
  KeyType extends ConfigKey | ConfigKey[],
>(
  keyOrKeys: KeyType
): KeyType extends ConfigKey[]
  ? MultipleKeyReturnType<KeyType>
  : KeyType extends ConfigKey
    ? SingleKeyReturnType<ConfigKey>
    : never {
  const { config, get, set } = useLocalStorageConfig();

  if (Array.isArray(keyOrKeys)) {
    const setValues = (key: ConfigKey, value: ConfigValue<ConfigKey>) => {
      set(key, value);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return [pick(config, keyOrKeys), setValues] as any;
  } else {
    const value = get(keyOrKeys);
    const setValue = (value: ConfigValue<ConfigKey>) => {
      set(keyOrKeys, value);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return [value, setValue] as any;
  }
}
