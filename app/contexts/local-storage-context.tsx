import {
  ConfigKey,
  ConfigObject,
  ConfigValue,
  getInitialConfig,
  setConfigValue,
} from "@/lib/local-storage";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type LocalStorageConfigContextValue = {
  config: ConfigObject;
  get: <K extends ConfigKey>(key: K) => ConfigValue<K>;
  set: <K extends ConfigKey>(key: K, value: ConfigValue<K>) => void;
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
    <K extends ConfigKey>(key: K): ConfigValue<K> => config[key],
    [config]
  );

  const set = useCallback(
    <K extends ConfigKey>(key: K, value: ConfigValue<K>) => {
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
