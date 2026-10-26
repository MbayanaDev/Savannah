import React from 'react';

interface MajesticDoorIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
}

export const MajesticDoorIcon: React.FC<MajesticDoorIconProps> = ({
  size = 20,
  className = '',
  ...props
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Outer Grand Archway / Portal Frame */}
      <path d="M3 21h18" strokeWidth="2" />
      <path d="M4 21V10C4 5.58 7.58 2 12 2s8 3.58 8 8v11" strokeWidth="1.8" />
      
      {/* Inner Door Arch Contour */}
      <path d="M6.5 21V10.5C6.5 7.46 8.96 5 12 5s5.5 2.46 5.5 5.5V21" strokeWidth="1.4" opacity="0.85" />
      
      {/* Center Door Split (Double Doors) */}
      <path d="M12 5v16" strokeWidth="1.5" />

      {/* Majestic Door Panels (Upper Arched & Lower Rectangles) */}
      <rect x="8" y="14" width="2.5" height="5" rx="0.5" strokeWidth="1.2" opacity="0.7" />
      <rect x="13.5" y="14" width="2.5" height="5" rx="0.5" strokeWidth="1.2" opacity="0.7" />
      
      {/* Exclusive Majestic Door Handles / Escutcheons */}
      <circle cx="10.8" cy="12.5" r="0.65" fill="currentColor" />
      <circle cx="13.2" cy="12.5" r="0.65" fill="currentColor" />
      
      {/* Keystone at Arch Apex */}
      <path d="M11 2h2l0.5 2.5h-3L11 2z" strokeWidth="1.2" fill="currentColor" fillOpacity="0.15" />
    </svg>
  );
};
