import type { Wretch, WretchAddon } from "wretch";

export interface NextCacheAddon {
  next<T extends NextCacheAddon, C, R>(this: T & Wretch<T, C, R>, next: RequestInit["next"]): this;
}

const cache: WretchAddon<NextCacheAddon> = {
  wretch: {
    next(next: RequestInit["next"] = {}) {
      return { ...this, _options: { ...this._options, next } };
    },
  },
};

export default cache;
