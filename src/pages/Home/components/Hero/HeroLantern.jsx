import { useRef } from "react";
import "./HeroLantern.css";

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

/**
 * Lightweight 2.5D lantern built from the user's visual reference.
 * There is deliberately no GLB, WebGL, React Three Fiber or physics engine.
 * Dragging tilts the same flat image around its chain attachment point.
 */
export default function HeroLantern() {
  const drag = useRef(null);

  const setPose = (node, rotation = 0, depth = 0, shift = 0) => {
    node.style.setProperty("--sib-lantern-angle", rotation + "deg");
    node.style.setProperty("--sib-lantern-depth", depth + "deg");
    node.style.setProperty("--sib-lantern-drop", shift + "px");
  };

  const release = (event) => {
    const node = event.currentTarget;
    if (drag.current && drag.current.pointerId !== event.pointerId) return;

    drag.current = null;
    node.dataset.dragging = "false";
    setPose(node);

    if (node.hasPointerCapture?.(event.pointerId)) {
      node.releasePointerCapture(event.pointerId);
    }
  };

  const handlePointerMove = (event) => {
    const node = event.currentTarget;
    if (drag.current?.pointerId === event.pointerId) {
      const dx = event.clientX - drag.current.x;
      const dy = event.clientY - drag.current.y;
      setPose(
        node,
        clamp(dx * .18, -24, 24),
        clamp(dx * .045, -7, 7),
        clamp(dy * .10, -6, 12),
      );
      return;
    }

    if (event.pointerType === "touch") return;
    const bounds = node.getBoundingClientRect();
    const horizontal = bounds.width > 0
      ? (event.clientX - bounds.left) / bounds.width - .5
      : 0;
    setPose(node, clamp(horizontal * 7, -3.5, 3.5), clamp(horizontal * 5, -2.5, 2.5), 0);
  };

  const handlePointerDown = (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    drag.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    };
    event.currentTarget.dataset.dragging = "true";
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerLeave = (event) => {
    if (!drag.current) setPose(event.currentTarget);
  };

  return (
    <div
      className="sib-hero-lantern"
      aria-hidden="true"
      data-dragging="false"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={release}
      onPointerCancel={release}
      onLostPointerCapture={release}
      onPointerLeave={handlePointerLeave}
    >
      <div className="sib-hero-lantern-arrival">
        <div className="sib-hero-lantern-pivot">
          <div className="sib-hero-lantern-idle">
            <img
              className="sib-hero-lantern-image"
              src="/assets/hero-lantern.webp"
              width="72"
              height="213"
              alt=""
              draggable="false"
              loading="eager"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
