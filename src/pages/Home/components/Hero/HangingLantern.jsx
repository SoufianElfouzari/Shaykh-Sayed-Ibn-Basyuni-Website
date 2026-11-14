import { Component, lazy, Suspense, useEffect, useState } from "react";
import "./HangingLantern.css";

const LanternScene = lazy(() => import("./HangingLanternScene.jsx"));
const PREVIEW = "/assets/brass-diya-lantern-preview.png";

class LanternErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.warn("The interactive lantern is unavailable. Its local preview remains visible.", error);
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

/**
 * The photographic CC0 poster is displayed immediately and animates into place.
 * Only load Three.js, Rapier and the detailed GLB when a visitor interacts with
 * this decorative element. This keeps the entire 3D physics engine out of the
 * critical route, improves LCP and avoids running WebGL before it is needed.
 */
export default function HangingLantern() {
  const [activated, setActivated] = useState(false);
  const [ready, setReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(query.matches);
    sync();
    query.addEventListener?.("change", sync);
    return () => query.removeEventListener?.("change", sync);
  }, []);

  const activate = () => setActivated(true);

  return (
    <div
      className={`sib-lantern-host${ready ? " sib-lantern-host-ready" : ""}${reducedMotion ? " sib-lantern-reduced-motion" : ""}`}
      aria-label="Hängende Messinglaterne, mit Maus oder Finger bewegbar"
      role="img"
      onPointerEnter={activate}
      onPointerDown={activate}
      onTouchStart={activate}
    >
      <div className="sib-lantern-preview-wrap" aria-hidden="true">
        <img
          className="sib-lantern-poster"
          src={PREVIEW}
          alt=""
          loading="lazy"
          fetchPriority="low"
          decoding="async"
          draggable="false"
        />
      </div>

      {activated && (
        <LanternErrorBoundary>
          <Suspense fallback={null}>
            <LanternScene onModelReady={() => setReady(true)} reducedMotion={reducedMotion} />
          </Suspense>
        </LanternErrorBoundary>
      )}
    </div>
  );
}
