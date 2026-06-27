import { useEffect, useRef } from "react";

export default function InsightOrb({ variant = "hero" }) {
  const orbRef = useRef(null);

  useEffect(() => {
    const orb = orbRef.current;
    if (!orb) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      currentX += (mouseX - currentX) * 0.04;
      currentY += (mouseY - currentY) * 0.04;

      if (variant === "floating") {
        orb.style.transform = `translate(${currentX * 0.025}px, ${currentY * 0.025}px)`;
      }

      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [variant]);

  return (
    <div ref={orbRef} className={`insight-orb insight-orb-${variant}`}>
      <div className="orb-core" />
      <div className="orb-line line-1" />
      <div className="orb-line line-2" />
      <div className="orb-line line-3" />
      <span className="orb-node node-1" />
      <span className="orb-node node-2" />
      <span className="orb-node node-3" />
      <span className="orb-node node-4" />
    </div>
  );
}