export function typedObjectKeys<TKeyType extends string | number>(
  obj: Record<TKeyType, unknown>
): Array<TKeyType> {
  return Object.keys(obj) as Array<TKeyType>;
}

export function typedObjectValues<TValueType>(
  obj: Record<string | number, TValueType>
): Array<TValueType> {
  return Object.values(obj);
}

export function typedObjectEntries<
  TKeyType extends string | number,
  TValueType,
>(obj: Record<TKeyType, TValueType>): Array<[TKeyType, TValueType]> {
  return Object.entries(obj) as Array<[TKeyType, TValueType]>;
}

export function typedObjectFromEntries<
  TKeyType extends string | number,
  TValueType,
>(entries: Array<[TKeyType, TValueType]>): Record<TKeyType, TValueType> {
  return Object.fromEntries(entries) as Record<TKeyType, TValueType>;
}
