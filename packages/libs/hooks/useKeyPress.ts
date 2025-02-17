import { useCallback, useEffect } from "react";

type Key = KeyboardEvent["key"];

export function useKeyPress(callback: (key: Key) => void | undefined, keys: Key[]) {
  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return; // Do nothing if the event is from an input, textarea, or select
      }

      if (keys.some(key => event.key === key)) {
        event.preventDefault();
        if (callback) callback(event.key);
      }
    },
    [callback, keys],
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onKeyDown]);
}
