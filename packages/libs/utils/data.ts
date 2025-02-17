export const serialize = (data: any) => {
  if (!data) return null;

  return JSON.parse(
    JSON.stringify(
      data,
      (key, value) => (typeof value === "bigint" ? value.toString() : value) // return everything else unchanged
    )
  );
};

export function nonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}
