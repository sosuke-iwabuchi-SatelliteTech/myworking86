import { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';

export interface DrawingCanvasHandle {
  clear: () => void;
}

const DrawingCanvas = forwardRef<DrawingCanvasHandle>((_, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  // Initialize canvas context and sizing
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    contextRef.current = ctx;

    const resizeCanvas = () => {
      const { width, height } = container.getBoundingClientRect();
      // Use floor to avoid subpixel infinite growth issues
      const newWidth = Math.floor(width);
      const newHeight = Math.floor(height);

      if (canvas.width !== newWidth || canvas.height !== newHeight) {
        canvas.width = newWidth;
        canvas.height = newHeight;

        // Re-apply context settings after resize
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // ResizeObserver is causing the infinite loop.
    // Since we are using absolute positioning for the canvas, relying on window resize
    // and initial render should be sufficient for most cases, or we can use a debounced observer if strictly needed.
    // However, given the bug report, the safest immediate fix is to rely on window resize or
    // ensure the canvas itself doesn't affect container size.
    // By making the canvas absolute, it won't push the container.

    const resizeObserver = new ResizeObserver(() => {
       window.requestAnimationFrame(resizeCanvas);
    });
    resizeObserver.observe(container);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      resizeObserver.disconnect();
    };
  }, []);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !contextRef.current) return;
    contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
  };

  useImperativeHandle(ref, () => ({
    clear: clearCanvas
  }));

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || !contextRef.current) return;

    const { offsetX, offsetY } = getCoordinates(e, canvas);
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !contextRef.current || !canvasRef.current) return;
    e.preventDefault(); // Prevent scrolling on touch devices

    const { offsetX, offsetY } = getCoordinates(e, canvasRef.current);
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const stopDrawing = () => {
    if (!contextRef.current) return;
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    if ('touches' in e) {
      const rect = canvas.getBoundingClientRect();
      return {
        offsetX: e.touches[0].clientX - rect.left,
        offsetY: e.touches[0].clientY - rect.top
      };
    } else {
      return {
        offsetX: (e as React.MouseEvent).nativeEvent.offsetX,
        offsetY: (e as React.MouseEvent).nativeEvent.offsetY
      };
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-full bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl overflow-hidden isolate">
      <div className="absolute top-2 left-4 text-slate-400 font-bold select-none pointer-events-none z-10">
        けいさん用紙
      </div>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 touch-none cursor-crosshair z-0"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
      <button
        onClick={clearCanvas}
        className="absolute top-2 right-2 bg-white/80 hover:bg-white text-slate-500 hover:text-red-500 p-2 rounded-full shadow-sm border border-slate-200 transition-colors z-10"
        aria-label="すべて消す"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
      </button>
    </div>
  );
});

DrawingCanvas.displayName = 'DrawingCanvas';

export default DrawingCanvas;
