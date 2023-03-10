import { useEffect, useState } from "react";

export default function useObserver(
  callback: (mutations: MutationRecord[]) => any,
  options: MutationObserverInit = {},
  id: string = null
) {
  if (typeof window !== "undefined") {
    const targetNode = id ? document.getElementById(id) : document;
    const config: MutationObserverInit = { ...options };
    const observer = new MutationObserver(callback);

    useEffect(() => {
      if (targetNode) {
        observer.observe(targetNode, config);
        return () => {
          observer.disconnect();
        };
      }
    }, []);
    return observer;
  } else return null;
}
