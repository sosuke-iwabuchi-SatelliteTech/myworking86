import { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { getSettings, saveSettings } from '../utils/storage';

export interface DrawingCanvasHandle {
  clear: () => void;
}

const PEN_SIZES = [
  { size: 2, label: '細' },
  { size: 5, label: '中' },
  { size: 10, label: '太' }
];

const DrawingCanvas = forwardRef<DrawingCanvasHandle>((_, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDrawingRef = useRef(false);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [penSize, setPenSize] = useState<number>(2);
  const lastPos = useRef<{ x: number, y: number } | null>(null);

  // Keep a ref to access current penSize inside the resize listener closure
  const penSizeRef = useRef(penSize);

  // Load settings on mount
  useEffect(() => {
    const settings = getSettings();
    if (settings.penSize) {
      setPenSize(settings.penSize);
    }
  }, []);

  // Update context lineWidth and ref when penSize changes
  useEffect(() => {
    penSizeRef.current = penSize;
    if (contextRef.current) {
      contextRef.current.lineWidth = penSize;
    }
  }, [penSize]);

  // Initialize canvas context and sizing
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Use alpha: false to potentially improve performance if transparency isn't needed,
    // though here we are drawing on a transparent canvas over a div background.
    // 'desynchronized: true' hints the browser to bypass the compositor to reduce latency
    const ctx = canvas.getContext('2d', { desynchronized: true });
    if (!ctx) return;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = penSizeRef.current;
    contextRef.current = ctx;

    const resizeCanvas = () => {
      const { width, height } = container.getBoundingClientRect();
      // Use floor to avoid subpixel infinite growth issues
      const newWidth = Math.floor(width);
      const newHeight = Math.floor(height);

      if (canvas.width !== newWidth || canvas.height !== newHeight) {
        canvas.width = newWidth;
        canvas.height = newHeight;

        // Re-apply context settings after resize because resizing clears the context state
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = penSizeRef.current; // Use the latest penSize from ref
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const resizeObserver = new ResizeObserver(() => {
      window.requestAnimationFrame(resizeCanvas);
    });
    resizeObserver.observe(container);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      resizeObserver.disconnect();
    };
  }, []); // Run once on mount

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !contextRef.current) return;
    contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
  };

  useImperativeHandle(ref, () => ({
    clear: clearCanvas
  }));

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas || !contextRef.current) return;

    e.currentTarget.setPointerCapture(e.pointerId);

    const { offsetX, offsetY } = getCoordinates(e, canvas);
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    lastPos.current = { x: offsetX, y: offsetY };
    isDrawingRef.current = true;
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !contextRef.current || !canvasRef.current) return;

    // Access coalesced events from nativeEvent if available for higher precision
    const nativeEvent = e.nativeEvent as PointerEvent;
    const events = nativeEvent.getCoalescedEvents ? nativeEvent.getCoalescedEvents() : [e];

    // Cache rect to avoid layout thrashing inside the loop
    const rect = canvasRef.current.getBoundingClientRect();

    events.forEach((event) => {
      // Calculate coordinates manually using cached rect
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;

      if (lastPos.current) {
        contextRef.current!.beginPath();
        contextRef.current!.moveTo(lastPos.current.x, lastPos.current.y);
        contextRef.current!.lineTo(offsetX, offsetY);
        contextRef.current!.stroke();
      }

      lastPos.current = { x: offsetX, y: offsetY };
    });
  };

  const stopDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!contextRef.current) return;
    // We do not closePath() here because it connects the last point to the start point of the subpath
    // which creates a straight line back to start for 'stroke'. We just want to stop adding segments.
    // However, the original code had closePath().
    // If we are just stroking lines continuously, closePath usually isn't needed unless we are filling.
    // But to respect original behavior (or fix it if it was weird), let's see.
    // Original: closePath(). If lineCap is round, closePath might not look different unless fill is used.
    // But typically freehand drawing doesn't use closePath().
    // I will remove closePath() as it is usually incorrect for open strokes.

    isDrawingRef.current = false;

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (err) {
      // ignore
    }
  };

  const getCoordinates = (e: React.PointerEvent | PointerEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    return {
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top
    };
  };

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
      <canvas
        ref={canvasRef}
        className="absolute inset-0 touch-none cursor-crosshair z-0"
        onPointerDown={startDrawing}
        onPointerMove={draw}
        onPointerUp={stopDrawing}
        onPointerLeave={stopDrawing}
        onPointerCancel={stopDrawing}
        onContextMenu={(e) => e.preventDefault()}
      />

      {/* Controls Container */}
      <div className="absolute top-2 right-2 flex items-center gap-2 z-10">
        {/* Pen Size Controls */}
        <div className="flex bg-white/80 rounded-full p-1 shadow-sm border border-slate-200">
          {PEN_SIZES.map((item) => (
            <button
              key={item.size}
              onClick={() => handleChangePenSize(item.size)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${penSize === item.size
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
