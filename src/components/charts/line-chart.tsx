import { useChart } from './useChart';

const LineChart = ({ data1, data2, labels }: { data1: Array<number>; data2: Array<number>; labels: Array<string> }) => {
  const renderChart = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    const padding = 50;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;

    const maxValue = Math.max(...data1, ...data2) * 1.2;

    // Scale function
    const scaleY = (val: number) => canvas.height - padding - (val / maxValue) * chartHeight;
    const stepX = chartWidth / (labels.length - 1);

    // Draw vertical grid + labels
    ctx.strokeStyle = '#9CA3AF88';
    ctx.lineWidth = 1;
    ctx.font = '14px Arial';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';

    labels.forEach((label, i) => {
      const x = padding + i * stepX;
      ctx.beginPath();
      ctx.setLineDash([6, 6]);
      ctx.moveTo(x, padding);
      ctx.lineTo(x, canvas.height - padding);
      ctx.stroke();

      ctx.fillText(label, x, canvas.height - padding + 20);
    });

    // Draw line function
    const drawLine = (data: Array<number>, color: string, dashed = false) => {
      ctx.beginPath();
      ctx.setLineDash(dashed ? [18, 8] : []);
      ctx.moveTo(padding, scaleY(data[0]));
      data.forEach((val, i) => {
        const x = padding + i * stepX;
        const y = scaleY(val);
        ctx.lineTo(x, y);
      });
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.setLineDash([]); // reset
    };

    // Draw both lines
    drawLine(data1, '#8B5CF6', true); // dashed purple
    drawLine(data2, '#10B981', false); // solid teal

    // Highlight point (e.g., March on 2nd dataset)
    const highlightIndex = 2;
    const x = padding + highlightIndex * stepX;
    const y = scaleY(data2[highlightIndex]);

    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#8B5CF6';
    ctx.fill();

    // Tooltip box
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.fillRect(x - 40, y - 60, 80, 40);
    ctx.strokeRect(x - 40, y - 60, 80, 40);

    ctx.fillStyle = '#000';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(String(data2[highlightIndex]), x, y - 40);
    ctx.font = '12px Arial';
    ctx.fillText('PROF/H', x, y - 25);
  };
  const { canvasRef, canvasStyle } = useChart(renderChart);
  return <canvas ref={canvasRef} style={canvasStyle} />;
};

export default LineChart;
