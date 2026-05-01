import { useEffect, useMemo, useRef, useState } from "react";
import { BookOpen, Camera, CheckCircle, Lightbulb, Scan, Upload, Video, X } from "lucide-react";
import { scanShelf } from "../services/api";
import { useReveal } from "../hooks/useReveal";

const PREVIEW_SPINES = [
  ["#F0A843", "64px"],
  ["#8B5E3C", "52px"],
  ["#C47B28", "76px"],
  ["#E8924A", "58px"],
  ["#6B3F1A", "82px"],
  ["#F5B865", "61px"],
  ["#D4803A", "68px"],
];

const DEFAULT_QUALITY_SIGNALS = [
  ["Frame", "waiting", "Use one wide shelf photo"],
  ["Light", "manual", "Avoid glare and shadows"],
  ["Review", "required", "Confirm titles before ranking"],
];
const ACCEPTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif", "image/heic", "image/heif"]);

const FRAMING_GUIDES = [
  ["11%", "18%", "12%", "46%"],
  ["27%", "21%", "10%", "42%"],
  ["42%", "17%", "14%", "50%"],
  ["61%", "22%", "11%", "40%"],
  ["77%", "19%", "10%", "47%"],
];

function fileSizeMb(file) {
  return file ? file.size / (1024 * 1024) : 0;
}

function inspectImageFile(file) {
  return new Promise((resolve) => {
    if (!file) {
      resolve(null);
      return;
    }

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
        sizeMb: fileSizeMb(file),
      });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ width: 0, height: 0, sizeMb: fileSizeMb(file), error: true });
    };
    img.src = url;
  });
}

function buildQualitySignals(report) {
  if (!report) return DEFAULT_QUALITY_SIGNALS;
  if (report.state === "checking") {
    return [
      ["Frame", "checking", "Reading image dimensions"],
      ["Light", "manual", "Make sure titles are legible"],
      ["Review", "required", "Human confirmation stays on"],
    ];
  }

  const shortEdge = Math.min(report.width || 0, report.height || 0);
  const resolutionStatus = shortEdge >= 900 ? "ready" : shortEdge >= 640 ? "usable" : "low";
  const sizeStatus = report.sizeMb <= 20 ? `${report.sizeMb.toFixed(1)}MB` : "too large";
  const shape = (report.width || 0) >= (report.height || 0) ? "landscape" : "portrait";

  return [
    ["Resolution", resolutionStatus, `${report.width || 0} x ${report.height || 0}px`],
    ["File", sizeStatus, report.sizeMb <= 20 ? "Within upload limit" : "Choose a smaller photo"],
    ["Frame", shape, shape === "landscape" ? "Best for shelf rows" : "Keep all spines visible"],
  ];
}

function readinessLabel(report) {
  if (!report) return "No photo selected";
  if (report.state === "checking") return "Checking photo";
  if (report.error) return "Image needs review";
  const shortEdge = Math.min(report.width || 0, report.height || 0);
  if (report.sizeMb > 20) return "File too large";
  if (shortEdge < 640) return "Low-resolution photo";
  return "Ready to scan";
}

function canUseMotionFeedback() {
  if (typeof window === "undefined") return false;
  return !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

export default function ScannerPage({ setPage, showToast, setResults }) {
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageSource, setImageSource] = useState("upload");
  const [qualityReport, setQualityReport] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [scanStatus, setScanStatus] = useState("Waiting for a shelf photo");
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const fileRef = useRef();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const revealScanner = useReveal();
  const qualitySignals = useMemo(() => buildQualitySignals(qualityReport), [qualityReport]);
  const pipelineStep = scanComplete ? 3 : scanning ? 2 : image ? 1 : 0;
  const photoBlocked = qualityReport?.sizeMb > 20 || qualityReport?.error || (
    qualityReport && qualityReport.state !== "checking" && Math.min(qualityReport.width || 0, qualityReport.height || 0) < 320
  );
  const photoWarning = qualityReport && qualityReport.state !== "checking"
    ? readinessLabel(qualityReport)
    : "";
  const vibrate = (duration) => {
    if (canUseMotionFeedback() && typeof navigator !== "undefined") {
      navigator.vibrate?.(duration);
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  useEffect(() => () => stopCamera(), []);

  useEffect(() => () => {
    if (image?.startsWith("blob:")) {
      URL.revokeObjectURL(image);
    }
  }, [image]);

  const clearImage = () => {
    if (image?.startsWith("blob:")) {
      URL.revokeObjectURL(image);
    }
    setImage(null);
    setImageFile(null);
    setImageSource("upload");
    setQualityReport(null);
    setScanStatus("Waiting for a shelf photo");
    setCameraError("");
    setScanComplete(false);
  };

  const handleImage = async (file, source = "upload", displayUrl = null) => {
    if (!file) return;
    if (!file.type?.startsWith("image/") || (file.type && !ACCEPTED_IMAGE_TYPES.has(file.type))) {
      showToast("Choose an image file before scanning");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      showToast("Choose a shelf photo under 20MB");
      return;
    }
    setScanComplete(false);
    if (image?.startsWith("blob:")) {
      URL.revokeObjectURL(image);
    }
    const nextUrl = displayUrl || URL.createObjectURL(file);
    setImageFile(file);
    setImage(nextUrl);
    setImageSource(source);
    setQualityReport({ state: "checking" });
    setScanStatus(source === "demo" ? "Sample shelf loaded" : "Photo loaded");
    vibrate(12);

    const report = await inspectImageFile(file);
    setQualityReport(report);
  };

  const startCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      const message = "Live camera is not supported in this browser";
      setCameraError(message);
      showToast(message);
      return;
    }

    try {
      setCameraError("");
      setScanStatus("Requesting camera permission");
      clearImage();
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });
      streamRef.current = stream;
      setCameraActive(true);
      setImageSource("camera");
      setScanStatus("Live camera ready");
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play?.();
        }
      });
      navigator.vibrate?.(16);
    } catch (error) {
      const message = error?.name === "NotAllowedError"
        ? "Camera permission denied"
        : "Could not open live camera";
      setCameraError(message);
      setScanStatus(message);
      showToast(message);
    }
  };

  const captureFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !video.videoWidth) {
      showToast("Camera frame is not ready yet");
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(async (blob) => {
      if (!blob) {
        showToast("Could not capture camera frame");
        return;
      }
      const file = new File([blob], `shelf-camera-${Date.now()}.jpg`, { type: "image/jpeg" });
      stopCamera();
      await handleImage(file, "camera");
      setScanStatus("Camera frame captured");
    }, "image/jpeg", 0.92);
  };

  const handleScan = async () => {
    if (!image || !imageFile) {
      showToast("Please select a photo first");
      return;
    }
    if (photoBlocked) {
      showToast(photoWarning || "Choose a clearer shelf photo before scanning");
      return;
    }

    setScanning(true);
    setScanStatus("Scanning shelf image");
    vibrate(18);
    try {
      const scanResult = await scanShelf(imageFile);
      const rawDetections = Array.isArray(scanResult.detections) ? scanResult.detections : [];
      const detectedBooks = (Array.isArray(scanResult.books) ? scanResult.books : []).map((book, index) => ({
        ...book,
        boundingBox: book.boundingBox || rawDetections[index]?.boundingBox || null,
        visibleText: book.visibleText || rawDetections[index]?.visibleText || "",
      }));

      if (!detectedBooks.length) {
        showToast("No books detected. Try a clearer shelf photo.");
        setScanStatus("No titles detected");
        return;
      }

      setResults({
        detected: detectedBooks,
        recommendations: [],
        hasPreferences: false,
        pendingReview: true,
        mode: imageSource === "demo" ? "sample" : "live",
        scanSummary: {
          detectionProvider: scanResult.detectionProvider,
          totalDetected: scanResult.totalDetected,
          usedFallback: scanResult.usedFallback,
          visibleBooks: scanResult.scan?.visible_books || scanResult.totalDetected,
          shelfOrientation: scanResult.scan?.shelf_orientation || "unknown",
          geometryAvailable: Boolean(scanResult.scan?.geometry_available || detectedBooks.some((book) => book.boundingBox)),
          imageQuality: qualityReport,
          imageSource,
        },
      });
      setScanStatus(`Found ${scanResult.totalDetected} possible books`);
      setScanComplete(true);
      showToast(`Found ${scanResult.totalDetected} possible books. Review them first.`);
      window.setTimeout(() => setPage("results"), 420);
    } catch (error) {
      setScanStatus("Scan failed");
      showToast(error.message || "Scan failed. Try again.");
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="page">
      <div className="scanner-wrap scanner-console reveal reveal-stagger" ref={revealScanner}>
        <aside className="scan-sidepanel scan-sidepanel-left" aria-label="Scanner pipeline status">
          <div className="sidepanel-kicker">capture pipeline</div>
          <div className={`pipeline-node${pipelineStep >= 0 ? " active" : ""}`}>
            <span>01</span>
            <strong>Frame shelf</strong>
            <small>wide spine field</small>
          </div>
          <div className={`pipeline-node${pipelineStep >= 1 ? " active" : ""}`}>
            <span>02</span>
            <strong>Read titles</strong>
            <small>vision + OCR pass</small>
          </div>
          <div className={`pipeline-node${pipelineStep >= 2 ? " active" : ""}`}>
            <span>03</span>
            <strong>Open review gate</strong>
            <small>next screen after scan</small>
          </div>
        </aside>

        <div className="scanner-main-deck">
          <div className="scanner-header">
            <div className="scanner-kicker">
              <Scan size={15} /> Neural spine reader
            </div>
            <h2>Scan a bookshelf</h2>
            <p>Upload a shelf photo, confirm the detected books, then rank only the clean list.</p>
            <div className="scan-live-status" aria-live="polite">{scanStatus}</div>
            <div className="scan-status-strip" aria-label="Scanner quality sequence">
              <span><strong>01</strong> Align shelf</span>
              <span><strong>02</strong> Detect spines</span>
              <span><strong>03</strong> Confirm titles</span>
              <span><strong>04</strong> Rank books</span>
            </div>
          </div>

          <div className="mobile-scan-context" aria-label="Mobile scanner context">
            <span><strong>01</strong> Frame shelf</span>
            <span><strong>02</strong> Vision + OCR pass</span>
            <span><strong>03</strong> Human review gate</span>
            <span><strong>Tip</strong> Keep titles readable</span>
            <span><strong>Tip</strong> Avoid cropped spines</span>
            {!image && <span><strong>Action</strong> Upload or open camera</span>}
            {image && <span><strong>Photo</strong> {photoWarning}</span>}
          </div>

          <div
            className={`camera-zone${image ? " has-image" : ""}`}
            role={image ? "group" : "button"}
            tabIndex={image ? -1 : 0}
            aria-busy={scanning}
            aria-label={image ? "Selected shelf photo preview" : "Upload shelf photo"}
            onClick={() => !image && fileRef.current.click()}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && !image && fileRef.current.click()}
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/avif,image/heic,image/heif"
              className="hidden-file-input"
              onChange={(event) => handleImage(event.target.files[0])}
            />

            <div className="scan-diagnostic-grid">
              <span className="scan-box scan-box-a"><strong>SOURCE</strong> {imageSource === "demo" ? "SAMPLE" : "LIVE"}</span>
              <span className="scan-box scan-box-b"><strong>PHOTO</strong> {readinessLabel(qualityReport)}</span>
              <span className="scan-box scan-box-c"><strong>REVIEW</strong> ON</span>
            </div>
            <div className="scan-segment-map" aria-hidden="true">
              {FRAMING_GUIDES.map(([left, top, width, height], index) => (
                <span
                  key={`${left}-${top}`}
                  style={{
                    "--x": left,
                    "--y": top,
                    "--w": width,
                    "--h": height,
                    "--delay": `${index * 0.12}s`,
                  }}
                />
              ))}
            </div>

            {cameraActive ? (
              <div className="live-camera-stage">
                <video ref={videoRef} playsInline muted autoPlay />
                <canvas ref={canvasRef} hidden />
                <div className="live-camera-reticle" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="live-camera-copy">
                  <strong>Frame the full shelf row</strong>
                  <small>Keep titles inside the guide, then capture.</small>
                </div>
              </div>
            ) : image ? (
              <>
                <img
                  src={image}
                  alt="Uploaded shelf photo"
                />
                {scanning && (
                  <div className="scanning-overlay">
                    <div className="scan-line" />
                    <div className="scan-target" />
                    <span className="scanning-text">Identifying books...</span>
                  </div>
                )}
              </>
            ) : (
              <div className="camera-placeholder">
                <div className="lens-stack" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="camera-hud" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
                <div className="camera-icon">
                  <Camera size={56} color="var(--amber)" strokeWidth={1.4} />
                </div>
                <h3>Tap to take or upload a photo</h3>
                <p>Supports common shelf photos up to 20MB. HEIC works when your browser can read it.</p>
                <div className="camera-shelf-preview" aria-hidden="true">
                  {PREVIEW_SPINES.map(([tone, height], index) => (
                    <span key={`${tone}-${index}`} style={{ "--tone": tone, "--height": height, "--delay": `${index * 0.08}s` }} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {cameraError && (
            <div className="camera-error" role="alert">
              <strong>{cameraError}</strong>
              <span>You can still upload an existing photo from your gallery.</span>
              <button className="btn-secondary" onClick={() => fileRef.current.click()}>
                <Upload size={15} /> Upload instead
              </button>
            </div>
          )}

          {image && (
            <div className="camera-quality-bar" aria-label="Selected image quality">
              <span><CheckCircle size={15} /> {readinessLabel(qualityReport)}</span>
              <small>
                {qualityReport?.width
                  ? `${qualityReport.width} x ${qualityReport.height}px, ${qualityReport.sizeMb.toFixed(1)}MB`
                  : "Checking image details"}
              </small>
            </div>
          )}

          <div className="scanner-quality-strip" aria-label="Scanner quality signals">
            {qualitySignals.map(([label, value, caption]) => (
              <div key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
                <small>{caption}</small>
              </div>
            ))}
          </div>

          <div className="scan-actions">
          {cameraActive ? (
            <>
              <button className="btn-secondary" onClick={stopCamera}>
                <X size={16} /> Close camera
              </button>
              <button className="btn-primary" onClick={captureFrame}>
                <Camera size={17} /> Capture frame
              </button>
            </>
          ) : image && (
            <button
              className="btn-secondary"
              onClick={clearImage}
            >
              Choose different photo
            </button>
          )}
          {!cameraActive && (
            <>
              {!image && (
                <button className="btn-secondary" onClick={startCamera}>
                  <Video size={17} /> Open live camera
                </button>
              )}
              <button
                className="btn-primary"
                disabled={scanning || photoBlocked}
                onClick={image ? handleScan : () => fileRef.current.click()}
              >
                <Upload size={17} /> {image ? (scanning ? "Scanning..." : "Analyse shelf") : "Upload a photo"}
              </button>
            </>
          )}
          </div>

          <div className="scan-tip">
          <Lightbulb size={15} />
          <strong>Tip:</strong> Hold your phone parallel to the shelf for best results.
          Make sure the lighting is even and titles are readable.
          </div>

          <div className="capture-checklist" aria-label="Camera capture checklist">
            <span><CheckCircle size={14} /> Shelf edges visible</span>
            <span><CheckCircle size={14} /> Titles not cropped</span>
            <span><CheckCircle size={14} /> Review before ranking</span>
          </div>

          <div className="demo-panel">
          <p>Calibration sample</p>
          <button
            className="btn-secondary"
            onClick={async () => {
              try {
                const url = "/fairy/bookshelf-demo.jpg";
                const response = await fetch(url);
                if (!response.ok) {
                  throw new Error("Demo bookshelf image was not found");
                }
                const contentType = response.headers.get("content-type") || "";
                if (!contentType.startsWith("image/")) {
                  throw new Error("Demo bookshelf asset is not an image");
                }
                const blob = await response.blob();
                const file = new File([blob], "bookshelf-demo.jpg", { type: "image/jpeg" });
                await handleImage(file, "demo", url);
                showToast("Demo shelf loaded!");
              } catch (error) {
                showToast(error.message || "Failed to load demo image");
              }
            }}
          >
            <BookOpen size={16} /> Load demo bookshelf
          </button>
          </div>
        </div>

        <aside className="scan-sidepanel scan-sidepanel-right" aria-label="Scanner quality guide">
          <div className="sidepanel-kicker">quality lock</div>
          {qualitySignals.map(([label, value, caption]) => (
            <div className="quality-meter" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
              <small>{caption}</small>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}
