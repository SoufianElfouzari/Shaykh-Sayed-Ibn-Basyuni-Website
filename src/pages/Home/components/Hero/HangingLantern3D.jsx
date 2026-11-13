import "./HangingLantern3D.css";

/**
 * CSS 3D lantern with a six-sided body, gold latticework and warm interior
 * illumination. No WebGL download or third-party model required.
 */
export default function HangingLantern3D() {
  return (
    <div className="sib-hanging-lantern" aria-hidden="true">
      <div className="sib-hanging-lantern-rope" />
      <div className="sib-hanging-lantern-swing">
        <div className="sib-hanging-lantern-ring" />
        <div className="sib-hanging-lantern-roof">
          <span className="sib-hanging-lantern-finial" />
          <span className="sib-hanging-lantern-dome" />
          <span className="sib-hanging-lantern-crown" />
        </div>
        <div className="sib-hanging-lantern-body">
          <div className="sib-hanging-lantern-flame" />
          {Array.from({ length: 6 }, (_, index) => (
            <div className="sib-hanging-lantern-panel" key={index} style={{ "--panel": index }}>
              <span className="sib-hanging-lantern-window" />
              <span className="sib-hanging-lantern-tracery" />
            </div>
          ))}
        </div>
        <div className="sib-hanging-lantern-base">
          <span className="sib-hanging-lantern-tip" />
        </div>
      </div>
    </div>
  );
}
