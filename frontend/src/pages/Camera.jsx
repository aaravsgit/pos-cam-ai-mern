import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./styles.css";

export default function Camera() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [running, setRunning] = useState(false);
  const [facing, setFacing] = useState("environment"); // "user" or "environment"
  const [error, setError] = useState("");
  const [snapshot, setSnapshot] = useState("");

  const startCamera = async () => {
    setError("");
    try {
      // stop an existing stream first (if any)
      stopCamera(false);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing },
        audio: false,
      });
      const videoEl = videoRef.current;
      videoEl.srcObject = stream;
      await videoEl.play();
      setRunning(true);
    } catch (e) {
      setError(e?.message || "Unable to access camera");
      setRunning(false);
    }
  };

  const stopCamera = (clear = true) => {
    const videoEl = videoRef.current;
    if (videoEl && videoEl.srcObject) {
      const tracks = videoEl.srcObject.getTracks();
      tracks.forEach((t) => t.stop());
      videoEl.srcObject = null;
    }
    setRunning(false);
    if (clear) setSnapshot("");
  };

  const flipCamera = async () => {
    setFacing((prev) => (prev === "user" ? "environment" : "user"));
    if (running) {
      // restart with the new facing mode
      await startCamera();
    }
  };

  const takeSnapshot = () => {
    const videoEl = videoRef.current;
    const canvasEl = canvasRef.current;
    if (!videoEl || !canvasEl) return;

    const w = videoEl.videoWidth;
    const h = videoEl.videoHeight;
    if (!w || !h) return;

    canvasEl.width = w;
    canvasEl.height = h;
    const ctx = canvasEl.getContext("2d");
    ctx.drawImage(videoEl, 0, 0, w, h);
    setSnapshot(canvasEl.toDataURL("image/png"));
  };

  useEffect(() => {
    return () => stopCamera(); // cleanup on unmount
  }, []);

  return (
    <div className="camera-full">
      <div className="camera-box">
        <div className="camera-header">
          <h2>Camera</h2>
          <Link to="/shop" className="link-btn">← Back to Shop</Link>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="camera-toolbar">
          <button className="btn" onClick={startCamera} disabled={running}>
            Start
          </button>
          <button className="btn" onClick={stopCamera} disabled={!running}>
            Stop
          </button>
          <button className="btn" onClick={flipCamera}>
            Flip ({facing === "user" ? "Front" : "Back"})
          </button>
          <button className="btn" onClick={takeSnapshot} disabled={!running}>
            Snapshot
          </button>
        </div>

        <div className="camera-preview">
          <video
            ref={videoRef}
            className="camera-video"
            autoPlay
            playsInline
            muted
          />
          <div className="camera-overlay" />
        </div>

        {snapshot && (
          <div className="snapshot-wrap">
            <div className="snapshot-title">Snapshot</div>
            <img className="snapshot" src={snapshot} alt="snapshot" />
          </div>
        )}

        {/* hidden canvas used for snapshots */}
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>
    </div>
  );
}
