export function pick<
  TObjectType extends Record<string, unknown>,
  TKeyType extends keyof TObjectType,
>(obj: TObjectType, keys: Array<TKeyType>): Pick<TObjectType, TKeyType> {
  const result: Partial<TObjectType> = {};
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result as Pick<TObjectType, TKeyType>;
}
export function omit<
  TObjectType extends Record<string, unknown>,
  TKeyType extends keyof TObjectType,
>(obj: TObjectType, keys: Array<TKeyType>): Omit<TObjectType, TKeyType> {
  const result: Partial<TObjectType> = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result as Omit<TObjectType, TKeyType>;
}
