import { Component, lazy, Suspense, useEffect, useRef, useState } from "react";
import "./HangingLantern.css";

const LanternScene = lazy(() => import("./HangingLanternScene.jsx"));

const PREVIEW = "https://cdn.polyhaven.com/asset_img/primary/brass_diya_lantern.png?height=650&quality=90";

class LanternErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.warn("3D lantern could not load. Showing the licensed still image.", error);
  }

  render() {
    if (this.state.failed) {
      return (
        <img
          className="sib-lantern-still"
          src={PREVIEW}
          alt=""
          loading="lazy"
          decoding="async"
        />
      );
    }
    return this.props.children;
  }
}

export default function HangingLantern() {
  const hostRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(media.matches);
    update();
    media.addEventListener?.("change", update);

    const element = hostRef.current;
    if (!element || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return () => media.removeEventListener?.("change", update);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "320px 0px" },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      media.removeEventListener?.("change", update);
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className={`sib-lantern-host${ready ? " sib-lantern-host-ready" : ""}${reduceMotion ? " sib-lantern-reduced-motion" : ""}`}
      aria-label="3D-Laterne: Mit Maus oder Finger ziehen und schwingen lassen"
      role="img"
    >
      {visible && (
        <LanternErrorBoundary>
          <Suspense fallback={null}>
            <LanternScene onModelReady={() => setReady(true)} reducedMotion={reduceMotion} />
          </Suspense>
        </LanternErrorBoundary>
      )}
    </div>
  );
}
