import { ReactNode } from 'react';

export const EmptyScreen = ({ icon, title, subtitle }: { icon: ReactNode; title: string; subtitle: string }) => (
  <div className="flex flex-col items-center justify-center h-64 text-slate-400 text-center space-y-2">
    {icon}
    <p className="text-xl md:text-2xl font-black">{title}</p>
    <p className="max-md:text-sm">{subtitle}</p>
  </div>
);
