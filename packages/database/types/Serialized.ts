import { FunctionKeys, NonFunctionKeys } from "utility-types";

export type Serialized<T extends object, A extends FunctionKeys<T> = never> = {
  [P in NonFunctionKeys<T>]: T[P] extends bigint ? string : T[P];
} & {
  /* @ts-ignore */
  [Key in A]: Awaited<ReturnType<T[Key]>>;
};
