import { useEffect, useRef, useCallback } from "react";

const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const rippleContainerRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const isHovering = useRef(false);
  const rafId = useRef<number>(0);

  const animate = useCallback(() => {
    // Smooth follow for ring
    ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.15;
    ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.15;

    if (dotRef.current) {
      dotRef.current.style.transform = `translate(${mousePos.current.x}px, ${mousePos.current.y}px) translate(-50%, -50%)`;
    }
    if (ringRef.current) {
      ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px) translate(-50%, -50%) scale(${isHovering.current ? 1.8 : 1})`;
      ringRef.current.style.opacity = isHovering.current ? "1" : "0.5";
      ringRef.current.style.borderColor = isHovering.current
        ? "hsl(207 70% 35%)"
        : "hsl(207 70% 35% / 0.4)";
    }

    rafId.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    // Don't show custom cursor on touch devices
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    document.documentElement.classList.add("custom-cursor-active");

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest("a, button, [role='button'], input, textarea, select, label, .cursor-pointer");
      isHovering.current = !!interactive;
    };

    const handleClick = (e: MouseEvent) => {
      if (!rippleContainerRef.current) return;
      const ripple = document.createElement("div");
      ripple.className = "click-ripple";
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;
      rippleContainerRef.current.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    window.addEventListener("click", handleClick);
    rafId.current = requestAnimationFrame(animate);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("click", handleClick);
      cancelAnimationFrame(rafId.current);
    };
  }, [animate]);

  // Don't render on touch devices or reduced motion
  if (typeof window !== "undefined") {
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouchDevice || prefersReducedMotion) return null;
  }

  return (
    <>
      {/* Cursor dot */}
      <div
        ref={dotRef}
        className="cursor-dot"
        aria-hidden="true"
      />
      {/* Cursor ring */}
      <div
        ref={ringRef}
        className="cursor-ring"
        aria-hidden="true"
      />
      {/* Click ripple container */}
      <div ref={rippleContainerRef} className="ripple-container" aria-hidden="true" />
    </>
  );
};

export default CustomCursor;
