import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { ConfigKey, ConfigObject, ConfigValue } from "@/lib/local-storage";
import { getInitialConfig, setConfigValue } from "@/lib/local-storage";

import type { ReactNode } from "react";

type LocalStorageConfigContextValue = {
  config: ConfigObject;
  get: <TKeyType extends ConfigKey>(key: TKeyType) => ConfigValue<TKeyType>;
  set: <TKeyType extends ConfigKey>(
    key: TKeyType,
    value: ConfigValue<TKeyType>
  ) => void;
};

const LocalStorageConfigContext = createContext<
  LocalStorageConfigContextValue | undefined
>(undefined);

/**
 * Provider component for LocalStorageConfig context.
 * @param children - React children components.
 */
export function LocalStorageConfigProvider({
  children,
}: {
  children: ReactNode;
}) {
  // Populate the state for the server render
  const [config, setConfig] = useState<ConfigObject>(getInitialConfig);

  //   When the component mounts, get the actual config from localStorage
  useEffect(() => {
    const initialConfig = getInitialConfig();
    setConfig(initialConfig);
  }, []);

  const get = useCallback(
    <TKeyType extends ConfigKey>(key: TKeyType): ConfigValue<TKeyType> =>
      config[key],
    [config]
  );

  const set = useCallback(
    <TKeyType extends ConfigKey>(
      key: TKeyType,
      value: ConfigValue<TKeyType>
    ) => {
      const newConfig = setConfigValue(key, value);
      setConfig(newConfig);
    },
    []
  );

  const contextValue = useMemo(
    () => ({
      config,
      get,
      set,
    }),
    [config, get, set]
  );

  return (
    <LocalStorageConfigContext.Provider value={contextValue}>
      {children}
    </LocalStorageConfigContext.Provider>
  );
}

export function useLocalStorageConfig(): LocalStorageConfigContextValue {
  const context = useContext(LocalStorageConfigContext);
  if (context === undefined) {
    throw new Error(
      "useLocalStorageConfig must be used within a LocalStorageConfigProvider"
    );
  }
  return context;
}
