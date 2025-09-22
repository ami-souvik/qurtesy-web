import { cn } from '../../utils/tailwind';

export const Graphic = ({ className }: { className?: string }) => (
  <div className={cn('min-w-80 min-h-80 w-80 h-80 grid grid-cols-4', className)}>
    <div className="w-20 h-20 bg-red-200 rounded-tl-xxl rounded-br-xxl" />
    <div className="w-20 h-20 bg-slate-700 rounded-e-xxl" />
    <div className="w-20 h-20 bg-teal-400 rounded-s-xxl" />
    <div className="w-20 h-20 bg-red-400" />
    <div className="w-20 h-20 bg-slate-300 rounded-e-xxl" />
    <div className="w-20 h-20 bg-red-400" />
    <div className="w-20 h-20 bg-zinc-500 rounded-xxl" />
    <div className="w-20 h-20 bg-cyan-300 rounded-xxl" />
    <div className="w-20 h-20 bg-teal-700 rounded-bl-xxl" />
    <div className="w-20 h-20 bg-teal-400 rounded-br-xxl" />
    <div className="w-20 h-20 bg-red-200" />
    <div className="w-20 h-20 bg-teal-300 rounded-e-xxl" />
    <div className="w-20 h-20 bg-purple-400" />
    <div className="w-20 h-20 bg-teal-200 rounded-xxl" />
    <div className="w-20 h-20 bg-blue-200 rounded-xxl" />
    <div className="w-20 h-20 bg-teal-800" />
  </div>
);
