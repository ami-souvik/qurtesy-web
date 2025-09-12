import { useEffect, useRef } from 'react';

export const useChart = (fn: (c: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => void) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasStyle = {
    display: 'block',
    width: '100%',
    height: '100%',
  };
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;
    const resizeCanvas = () => {
      // Set canvas dimensions to match the rendered size
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;

      // Redraw canvas content here after resizing
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    // Initial resize
    resizeCanvas();
    // Render Chart
    fn(canvas, ctx);

    // Add event listener for window resize
    window.addEventListener('resize', () => {
      resizeCanvas();
      fn(canvas, ctx);
    });

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', () => {
        resizeCanvas();
        fn(canvas, ctx);
      });
    };
  }, [fn, canvasRef.current?.offsetWidth, canvasRef.current?.offsetHeight]); // Empty dependency array ensures this runs once on mount
  return { canvasRef, canvasStyle };
};
