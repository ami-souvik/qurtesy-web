import { Graphic } from './ui/graphic';
export const LoadingScreen = () => (
  <div className="relative h-screen w-screen overflow-hidden bg-zinc-900">
    {/* 3×3 grid perfectly centered */}
    <div className="absolute top-1/2 left-1/2 grid grid-cols-3 grid-rows-3 gap-6 -translate-x-1/2 -translate-y-1/2">
      {Array.from({ length: 9 }).map((_, idx) => (
        <Graphic key={idx} className={`${idx === 4 ? 'opacity-100' : 'opacity-15'} flex-shrink-0`} />
      ))}
    </div>
  </div>
);
