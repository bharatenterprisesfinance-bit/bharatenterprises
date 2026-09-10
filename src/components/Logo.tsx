import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textColor?: 'dark' | 'light';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  textColor = 'dark',
  className = '',
}) => {
  const imgDimensions = {
    sm: { height: 32 },
    md: { height: 44 },
    lg: { height: 56 },
    xl: { height: 72 },
  }[size];

  const textStyles = {
    sm: { title: 'text-sm font-extrabold tracking-tight', sub: 'text-[9px] tracking-widest font-bold' },
    md: { title: 'text-base sm:text-lg font-extrabold tracking-tight', sub: 'text-[10px] sm:text-xs tracking-wider font-bold' },
    lg: { title: 'text-xl sm:text-2xl font-extrabold tracking-tight', sub: 'text-xs sm:text-sm tracking-widest font-bold' },
    xl: { title: 'text-2xl sm:text-3xl font-extrabold tracking-tight', sub: 'text-sm sm:text-base tracking-widest font-bold' },
  }[size];

  const primaryTextColor = textColor === 'light' ? 'text-white' : 'text-[#0b1f4a]';
  const subTextColor = textColor === 'light' ? 'text-blue-200' : 'text-slate-500';

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {/* Real logo image from public folder */}
      <img
        src="/logo.jpeg"
        alt="Bharat Enterprises Logo"
        style={{ height: imgDimensions.height, width: 'auto' }}
        className="object-contain flex-shrink-0 drop-shadow-sm"
      />

      {showText && (
        <div className="flex flex-col justify-center">
          <span className={`${textStyles.title} ${primaryTextColor} font-black leading-tight uppercase`}>
            BHARAT ENTERPRISES
          </span>
          <span className={`${textStyles.sub} ${subTextColor} uppercase tracking-widest`}>
            FINANCE SERVICES
          </span>
        </div>
      )}
    </div>
  );
};
