import React, {
  useEffect,
  useRef,
  useCallback,
} from "react";

interface UseIntersectionObserverProps {
  onIntersect: () => void;
  isLoading: boolean;
  hasMore: boolean;
}

export function useIntersectionObserver({
  onIntersect,
  isLoading,
  hasMore,
}: UseIntersectionObserverProps) {
  const observer = useRef<IntersectionObserver | null>(
    null
  );

  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (isLoading || !hasMore) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            onIntersect();
          }
        }
      );

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, onIntersect]
  );

  return { lastElementRef };
}
