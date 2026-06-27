import React from 'react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#f8fafc]">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0F4C81]/5 rounded-full blur-3xl animate-glow-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#0F4C81]/5 rounded-full blur-3xl animate-glow-pulse pointer-events-none" style={{ animationDelay: '2s' }} />
      <div className="relative flex items-center justify-center mb-8">
        <div className="absolute w-32 h-32 rounded-full border border-[#0F4C81]/20 animate-pulse-ring" />
        <div className="absolute w-32 h-32 rounded-full border border-[#0F4C81]/15 animate-pulse-ring" style={{ animationDelay: '0.5s' }} />
        <div className="absolute w-32 h-32 rounded-full border border-[#0F4C81]/10 animate-pulse-ring" style={{ animationDelay: '1s' }} />
        <div className="relative z-10 w-36 h-36 flex items-center justify-center">
          <img src="/logo.png" alt="Career Solutions" className="w-full h-auto object-contain mix-blend-multiply" />
        </div>
      </div>
      <h1 className="font-display font-bold text-2xl text-slate-800 tracking-widest uppercase mb-1">Career Solutions</h1>
      <p className="text-[#0F4C81] text-sm font-medium tracking-wider mb-10">Loading your portal...</p>
      <div className="w-56 h-1 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-[#0F4C81] rounded-full animate-loading-bar" />
      </div>
    </div>
  );
};
