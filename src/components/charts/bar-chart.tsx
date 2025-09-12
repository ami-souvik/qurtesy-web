import { useChart } from './useChart';

const BarChart = ({ data = [] }: { data: Array<{ value: number }> }) => {
  const renderChart = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    // Chart padding and scaling
    const count = data.length;
    const padding = 0;
    const barGap = 3;
    const barWidth = (canvas.width - barGap * (count - 1)) / count;
    const maxValue = Math.max(...data.map((d) => d.value)) * 1.1;
    const chartHeight = canvas.height - padding * 2;

    // Draw horizontal grid lines
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 1;
    ctx.font = '14px Arial';
    ctx.fillStyle = '#ccc';
    ctx.textAlign = 'right';

    for (let i = 1; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      // const value = Math.round(maxValue - (maxValue / 5) * i);

      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
      // ctx.fillText(value, padding - 10, y + 5);
    }

    // Draw bars
    data.forEach((d, i) => {
      const x = padding + i * (barWidth + barGap);
      const barHeight = (d.value / maxValue) * chartHeight;
      const y = canvas.height - padding - barHeight;

      // Bar
      ctx.beginPath();
      ctx.fillStyle = '#8B5CF6'; // purple
      ctx.roundRect(x, y, barWidth, barHeight, 6);
      ctx.fill();

      // Top highlight
      ctx.beginPath();
      ctx.fillStyle = '#D9F99D'; // lime-green
      ctx.roundRect(x, y, barWidth, 8, [6, 6, 0, 0]);
      ctx.fill();

      // Value text inside bar
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 28px Space Grotesk';
      ctx.textAlign = 'center';
      ctx.fillText(`${d.value}%`, x + barWidth / 2, barHeight > 60 ? y + 36 : y - 10);
    });
  };
  const { canvasRef, canvasStyle } = useChart(renderChart);
  return <canvas ref={canvasRef} role="img" style={canvasStyle} />;
};

export default BarChart;
