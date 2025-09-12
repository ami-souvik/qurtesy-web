import { useChart } from './useChart';

const PieChart = ({ text = '32K', lineWidth = 28 }: { text?: string; lineWidth?: number }) => {
  const renderChart = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    const size = canvas.width < canvas.height ? canvas.width : canvas.height;
    const radius = size / 2 - lineWidth;
    // Chart data (angles in radians)
    const segments = [
      { color: '#dcfd84', start: 62, end: 108 }, // Orange
      { color: '#fecc82', start: 122, end: 168 }, // Yellow-green
      { color: '#3fac92', start: 182, end: 228 }, // Green
      { color: '#8a79f1', start: 242, end: 48 }, // Purple
    ];

    const centerX = size / 2;
    const centerY = size / 2;

    // Draw arcs
    segments.forEach((seg) => {
      const startAngle = (Math.PI / 180) * seg.start;
      const endAngle = (Math.PI / 180) * seg.end;

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle, false);
      ctx.strokeStyle = seg.color;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.stroke();
    });

    // Add text in center
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${size / 3}px Space Grotesk`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, centerX, centerY);
  };
  const { canvasRef, canvasStyle } = useChart(renderChart);
  return <canvas ref={canvasRef} role="img" style={canvasStyle} />;
};

export default PieChart;
