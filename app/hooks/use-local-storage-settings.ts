import type { ConfigKey, ConfigValue } from "@/lib/local-storage";
import { useLocalStorageConfig } from "@/contexts/local-storage-context";
import { pick } from "@/lib/object";

type MultipleKeyReturnType<TKeyType extends Array<ConfigKey>> = [
  {
    [K in TKeyType[number]]: ConfigValue<K>;
  },
  (key: TKeyType[number], value: ConfigValue<TKeyType[number]>) => void,
];

type SingleKeyReturnType<TKeyType extends ConfigKey> = [
  ConfigValue<TKeyType>,
  (value: ConfigValue<TKeyType>) => void,
];

export function useLocalStorageSettings<
  TKeyType extends ConfigKey | Array<ConfigKey>,
>(
  keyOrKeys: TKeyType
): TKeyType extends Array<ConfigKey>
  ? MultipleKeyReturnType<TKeyType>
  : TKeyType extends ConfigKey
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
    const setValue = (val: ConfigValue<ConfigKey>) => {
      set(keyOrKeys, val);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return [value, setValue] as any;
  }
}
