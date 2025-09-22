import { cn } from '../utils/tailwind';

const Box = ({ size, className }: { size?: number; className?: string }) => (
  <div className={cn(`w-${size} h-${size}`, className)} />
);

const Graphic = ({ className }: { className?: string }) => (
  <div className={cn('min-w-80 min-h-80 grid grid-cols-4', className)}>
    <Box className="bg-red-200 rounded-tl-xxl rounded-br-xxl" />
    <Box className="bg-slate-700 rounded-e-xxl" />
    <Box className="bg-teal-400 rounded-s-xxl" />
    <Box className="bg-red-400" />
    <Box className="bg-slate-300 rounded-e-xxl" />
    <Box className="bg-red-400" />
    <Box className="bg-zinc-500 rounded-xxl" />
    <Box className="bg-cyan-300 rounded-xxl" />
    <Box className="bg-teal-700 rounded-bl-xxl" />
    <Box className="bg-teal-400 rounded-br-xxl" />
    <Box className="bg-red-200" />
    <Box className="bg-teal-300 rounded-e-xxl" />
    <Box className="bg-purple-400" />
    <Box className="bg-teal-200 rounded-xxl" />
    <Box className="bg-blue-200 rounded-xxl" />
    <Box className="bg-teal-800" />
  </div>
);

export const LoadingScreen = () => (
  <div className="relative h-screen w-screen overflow-hidden bg-zinc-900">
    {/* 3×3 grid perfectly centered */}
    <div className="absolute top-1/2 left-1/2 min-w-240 min-h-240 grid grid-cols-3 grid-rows-3 -translate-x-1/2 -translate-y-1/2">
      {Array.from({ length: 9 }).map((_, idx) => (
        <Graphic key={idx} className={`${idx === 4 ? 'opacity-100' : 'opacity-15'} flex-shrink-0`} />
      ))}
    </div>
  </div>
);
