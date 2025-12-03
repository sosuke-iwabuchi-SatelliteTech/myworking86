import { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { getStroke } from 'perfect-freehand';
import { getSettings, saveSettings } from '../../utils/storage';

export interface DrawingCanvasHandle {
  clear: () => void;
}

const PEN_SIZES = [
  { size: 2, label: '細' },
  { size: 5, label: '中' },
  { size: 10, label: '太' }
];

function getSvgPathFromStroke(stroke: number[][]) {
  if (!stroke.length) return "";
  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", ...stroke[0], "Q"] as (string | number)[]
  );
  d.push("Z");
  return d.join(" ");
}

const DrawingCanvas = forwardRef<DrawingCanvasHandle>((_, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Ref for the bottom (persistent) canvas
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const mainContextRef = useRef<CanvasRenderingContext2D | null>(null);

  // Ref for the top (active stroke) canvas
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const overlayContextRef = useRef<CanvasRenderingContext2D | null>(null);

  const [penSize, setPenSize] = useState<number>(2);
  const penSizeRef = useRef(penSize);

  // State to hold the current stroke points
  const pointsRef = useRef<number[][]>([]);

  // Load settings on mount
  useEffect(() => {
    const settings = getSettings();
    if (settings.penSize) {
      setPenSize(settings.penSize);
    }
  }, []);

  // Sync penSizeRef
  useEffect(() => {
    penSizeRef.current = penSize;
  }, [penSize]);

  // --- Drawing Logic ---

  const getCoordinates = (e: PointerEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      pressure: e.pressure
    };
  };

  const renderStrokeToContext = (
    ctx: CanvasRenderingContext2D,
    points: number[][],
    options: any
  ) => {
    const stroke = getStroke(points, options);
    const pathData = getSvgPathFromStroke(stroke);
    const path = new Path2D(pathData);
    ctx.fill(path);
  };

  const startDrawing = (e: PointerEvent) => {
    if (e.cancelable) e.preventDefault();

    const overlayCanvas = overlayCanvasRef.current;
    if (!overlayCanvas) return;

    try {
      overlayCanvas.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    const { x, y, pressure } = getCoordinates(e, overlayCanvas);
    pointsRef.current = [[x, y, pressure]];
  };

  const draw = (e: PointerEvent) => {
    if (e.cancelable) e.preventDefault();

    // Only draw if we have started a stroke
    if (pointsRef.current.length === 0) return;

    const overlayCanvas = overlayCanvasRef.current;
    const overlayCtx = overlayContextRef.current;
    if (!overlayCanvas || !overlayCtx) return;

    const events = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];

    // Add new points
    events.forEach(event => {
        const { x, y, pressure } = getCoordinates(event, overlayCanvas);
        pointsRef.current.push([x, y, pressure]);
    });

    // Clear overlay and draw current stroke
    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

    // perfect-freehand options
    const options = {
      size: penSizeRef.current * 2, // Scale up slightly as perfect-freehand handles pressure dynamically
      thinning: 0.5,
      smoothing: 0.5,
      streamline: 0.5,
      simulatePressure: e.pointerType !== 'pen',
      last: false, // stroke is ongoing
    };

    renderStrokeToContext(overlayCtx, pointsRef.current, options);
  };

  const stopDrawing = (e: PointerEvent) => {
    if (e.cancelable) e.preventDefault();

    if (pointsRef.current.length === 0) return;

    const overlayCanvas = overlayCanvasRef.current;
    const overlayCtx = overlayContextRef.current;
    const mainCanvas = mainCanvasRef.current;
    const mainCtx = mainContextRef.current;

    if (overlayCanvas && overlayCtx && mainCtx && mainCanvas) {
        try {
            overlayCanvas.releasePointerCapture(e.pointerId);
        } catch {
            // ignore
        }

        // Final render of the stroke (simulate 'last: true' if needed, though usually fine as is)
        // We draw the final state from the overlay onto the main canvas
        mainCtx.drawImage(overlayCanvas, 0, 0);

        // Clear the overlay
        overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    }

    // Reset points
    pointsRef.current = [];
  };

  const preventDefaultHandler = (e: Event) => {
      e.preventDefault();
  };

  // --- Initialization & Resizing ---

  useEffect(() => {
    const mainCanvas = mainCanvasRef.current;
    const overlayCanvas = overlayCanvasRef.current;
    const container = containerRef.current;

    if (!mainCanvas || !overlayCanvas || !container) return;

    // Initialize Contexts
    const mainCtx = mainCanvas.getContext('2d', { alpha: true });
    const overlayCtx = overlayCanvas.getContext('2d', { desynchronized: true, alpha: true });

    if (!mainCtx || !overlayCtx) return;

    mainContextRef.current = mainCtx;
    overlayContextRef.current = overlayCtx;

    mainCtx.fillStyle = '#000000';
    overlayCtx.fillStyle = '#000000';

    const resizeCanvas = () => {
      const { width, height } = container.getBoundingClientRect();
      const newWidth = Math.floor(width);
      const newHeight = Math.floor(height);

      // Resize Main Canvas
      if (mainCanvas.width !== newWidth || mainCanvas.height !== newHeight) {
        // Save content
        const savedData = mainCtx.getImageData(0, 0, mainCanvas.width, mainCanvas.height);

        mainCanvas.width = newWidth;
        mainCanvas.height = newHeight;

        // Restore content (naive approach: put at top-left)
        // A better approach would be to scale, but for a scratchpad this is acceptable.
        mainCtx.putImageData(savedData, 0, 0);
        mainCtx.fillStyle = '#000000'; // Reset fillStyle after resize
      }

      // Resize Overlay Canvas (always clear)
      if (overlayCanvas.width !== newWidth || overlayCanvas.height !== newHeight) {
          overlayCanvas.width = newWidth;
          overlayCanvas.height = newHeight;
          overlayCtx.fillStyle = '#000000'; // Reset fillStyle after resize
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const resizeObserver = new ResizeObserver(() => {
       window.requestAnimationFrame(resizeCanvas);
    });
    resizeObserver.observe(container);

    // --- Native Event Listeners on Overlay ---
    const opts = { passive: false };

    // Attach listeners to the OVERLAY canvas which captures input
    overlayCanvas.addEventListener('pointerdown', startDrawing, opts);
    overlayCanvas.addEventListener('pointermove', draw, opts);
    overlayCanvas.addEventListener('pointerup', stopDrawing, opts);
    overlayCanvas.addEventListener('pointerleave', stopDrawing, opts);
    overlayCanvas.addEventListener('pointercancel', stopDrawing, opts);
    overlayCanvas.addEventListener('contextmenu', preventDefaultHandler, opts);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      resizeObserver.disconnect();

      overlayCanvas.removeEventListener('pointerdown', startDrawing);
      overlayCanvas.removeEventListener('pointermove', draw);
      overlayCanvas.removeEventListener('pointerup', stopDrawing);
      overlayCanvas.removeEventListener('pointerleave', stopDrawing);
      overlayCanvas.removeEventListener('pointercancel', stopDrawing);
      overlayCanvas.removeEventListener('contextmenu', preventDefaultHandler);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearCanvas = () => {
    const mainCanvas = mainCanvasRef.current;
    const overlayCanvas = overlayCanvasRef.current;
    if (mainCanvas && mainContextRef.current) {
        mainContextRef.current.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
    }
    if (overlayCanvas && overlayContextRef.current) {
        overlayContextRef.current.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    }
    pointsRef.current = [];
  };

  useImperativeHandle(ref, () => ({
    clear: clearCanvas
  }));

  const handleChangePenSize = (size: number) => {
    setPenSize(size);
    const currentSettings = getSettings();
    saveSettings({ ...currentSettings, penSize: size });
  };

  return (
    <div ref={containerRef} className="relative w-full h-full bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl overflow-hidden isolate select-none">
      <div className="absolute top-2 left-4 text-slate-400 font-bold select-none pointer-events-none z-10">
        けいさん用紙
      </div>

      {/* Main Canvas (Bottom Layer: Committed Strokes) */}
      <canvas
        ref={mainCanvasRef}
        className="absolute inset-0 z-0 pointer-events-none"
      />

      {/* Overlay Canvas (Top Layer: Active Stroke & Input) */}
      <canvas
        ref={overlayCanvasRef}
        className="absolute inset-0 cursor-crosshair z-0"
        style={{ touchAction: 'none' }}
      />

      {/* Controls Container */}
      <div className="absolute top-2 right-2 flex items-center gap-2 z-10">
        {/* Pen Size Controls */}
        <div className="flex bg-white/80 rounded-full p-1 shadow-sm border border-slate-200">
          {PEN_SIZES.map((item) => (
            <button
              key={item.size}
              onClick={() => handleChangePenSize(item.size)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                penSize === item.size
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
              }`}
              aria-label={`ペンサイズ: ${item.label}`}
              title={`${item.label} (${item.size}px)`}
            >
              <div
                className="rounded-full bg-current"
                style={{ width: item.size, height: item.size }}
              />
            </button>
          ))}
        </div>

        {/* Clear Button */}
        <button
          onClick={clearCanvas}
          className="bg-white/80 hover:bg-white text-slate-500 hover:text-red-500 p-2 rounded-full shadow-sm border border-slate-200 transition-colors"
          aria-label="すべて消す"
          title="すべて消す"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </button>
      </div>
    </div>
  );
});

DrawingCanvas.displayName = 'DrawingCanvas';

export default DrawingCanvas;
