import React from 'react';

interface HeroBannerProps {
  title: React.ReactNode;
  subtitle: string;
  description: React.ReactNode;
  icon?: React.ComponentType<any>;
  badgeText?: string;
  badgeSubText?: string;
  initials?: string;
  showLogoRight?: boolean;
  isCoordinator?: boolean;
  extraContent?: React.ReactNode;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  title,
  subtitle,
  description,
  icon: Icon,
  badgeText,
  badgeSubText,
  initials,
  showLogoRight = true,
  isCoordinator = false,
  extraContent,
}) => {
  return (
    <div
      className="relative rounded-[20px] overflow-hidden mb-6"
      style={{
        background: 'linear-gradient(135deg, #0F4C81 0%, #1B6CA8 55%, #17A2B8 100%)',
        boxShadow: '0 8px 40px rgba(15,76,129,0.35)',
      }}
    >
      {/* Background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full" style={{ border: '1px solid rgba(255,255,255,0.07)' }} />
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-96 h-96 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.025) 0%, transparent 65%)' }} />
        <div className="absolute bottom-5 right-44 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '16px 16px', width: '200px', height: '70px' }} />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center md:items-stretch">
        {/* LEFT: Circular Badge / CS Logo for Coordinator */}
        <div
          className="flex-shrink-0 flex items-center justify-center px-8 py-8 md:py-10 md:w-56"
          style={{ borderRight: '1px solid rgba(255,255,255,0.1)' }}
        >
          <div className="relative">
            {/* Pulsing glow ring */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(126,232,248,0.18) 0%, transparent 70%)',
                transform: 'scale(1.5)',
                animation: 'pulse 3s ease-in-out infinite',
              }}
            />
            {isCoordinator ? (
              /* Center the logo perfectly inside the circle without stretching or distortion */
              <div className="relative h-28 w-28 rounded-full flex items-center justify-center bg-white border-2 border-white/25 shadow-lg p-3.5 overflow-hidden">
                <img
                  src="/logo.png"
                  alt="Career Solutions Logo"
                  className="h-full w-full object-contain scale-110"
                />
              </div>
            ) : (
              <div className="relative h-28 w-28 rounded-full flex items-center justify-center bg-white/10 border-2 border-white/25 shadow-lg">
                <div className="absolute inset-3 rounded-full border border-dashed border-white/20" />
                <div className="text-center z-10">
                  {badgeText && (
                    <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/55 mb-1 leading-none">
                      {badgeText}
                    </div>
                  )}
                  {Icon ? (
                    <Icon className="h-7 w-7 text-white mx-auto my-1 flex-shrink-0" />
                  ) : (
                    <div className="text-2xl font-black font-display text-white leading-none tracking-wide">
                      {initials || 'CS'}
                    </div>
                  )}
                  {badgeSubText && (
                    <div className="text-[8px] font-black uppercase tracking-[0.2em] text-[#7ee8f8] mt-1.5 leading-none">
                      {badgeSubText}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CENTER: Title, Subtitle, Description */}
        <div className="flex-1 px-8 py-8 md:py-10 flex flex-col justify-center text-center md:text-left min-w-0">
          <div className="flex items-center gap-2 justify-center md:justify-start mb-3">
            <div className="h-px w-5 bg-[#7ee8f8]/60" />
            <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#7ee8f8]">
              {subtitle}
            </span>
            <div className="h-px w-5 bg-[#7ee8f8]/60" />
          </div>
          <h1
            className="font-black font-display text-white leading-tight mb-2 text-2xl md:text-3xl lg:text-[2.1rem]"
            style={{ textShadow: '0 2px 16px rgba(0,0,0,0.2)', letterSpacing: '-0.02em' }}
          >
            {title}
          </h1>
          <p className="text-sm leading-relaxed max-w-2xl text-white/70">
            {description}
          </p>
          {extraContent && <div className="mt-4 w-full">{extraContent}</div>}
        </div>

        {/* RIGHT: Logo section (removed for Coordinator) */}
        {!isCoordinator && showLogoRight && (
          <div
            className="flex-shrink-0 flex items-center justify-center p-6 md:p-8 md:w-72"
            style={{ borderLeft: '1px solid rgba(255,255,255,0.1)' }}
          >
            <div className="bg-white shadow-xl rounded-2xl flex items-center justify-center p-5 w-full transition-all duration-300 hover:scale-105">
              <img
                src="/logo.png"
                alt="Career Solutions"
                className="h-20 w-auto object-contain scale-110"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
