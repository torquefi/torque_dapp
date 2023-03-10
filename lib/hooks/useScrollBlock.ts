import { useEffect } from "react";

export default function useScrollBlock(
  { rootId, dependencies }: { rootId?: string; dependencies?: any[] } = {
    rootId: "",
    dependencies: [],
  }
) {
  useEffect(() => {
    if (dependencies.filter(Boolean).length < dependencies.length) {
      return;
    }

    let html = document.querySelector("html");

    let scrollTop = html.scrollTop;
    if (html.scrollHeight > window.innerHeight) {
      html.style.top = `-${scrollTop}px`;
      html.classList.add("scroll-block");
    }

    return () => {
      if (rootId && document.getElementById(rootId).childElementCount) return;

      html.classList.remove("scroll-block");
      html.style.removeProperty("top");
      html.scroll(0, scrollTop);
    };
  }, dependencies);
}
