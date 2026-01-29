import createCache from "@emotion/cache";

// Create an emotion cache with an optional insertion point element.
export default function createEmotionCache(
  insertionPoint?: HTMLElement | null,
) {
  return createCache({
    key: "mui",
    insertionPoint: insertionPoint || undefined,
  });
}
