import React from 'react';

interface MPesaLogoProps {
  className?: string;
}

export const MPesaLogo: React.FC<MPesaLogoProps> = ({ className = 'h-6 w-auto' }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 76 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="M-Pesa"
    >
      {/* Green Container */}
      <rect width="76" height="26" rx="4.5" fill="#009A44" />
      {/* Red Left Accent Curve */}
      <path
        d="M5 2C3.343 2 2 3.343 2 5V21C2 22.657 3.343 24 5 24H21C21 24 17.5 19.5 17.5 13C17.5 6.5 21 2 21 2H5Z"
        fill="#E21818"
      />
      {/* "M" in White */}
      <path
        d="M7.5 18V8H9.5L11.8 12.8L14.1 8H16V18H14.4V11.2L12.5 15H11.1L9.2 11.2V18H7.5Z"
        fill="#FFFFFF"
      />
      {/* Hyphen "-" */}
      <rect x="20.5" y="11.8" width="3" height="2.2" rx="0.4" fill="#FFFFFF" />
      {/* "P" */}
      <path
        d="M27 8H31.8C33.5 8 34.8 9 34.8 10.6C34.8 12.2 33.5 13.2 31.8 13.2H29V18H27V8ZM29 11.5H31.5C32.4 11.5 32.9 11.1 32.9 10.6C32.9 10.1 32.4 9.7 31.5 9.7H29V11.5Z"
        fill="#FFFFFF"
      />
      {/* "E" */}
      <path
        d="M37 8H43.5V9.7H39V11.5H42.8V13.1H39V16.3H43.5V18H37V8Z"
        fill="#FFFFFF"
      />
      {/* "S" */}
      <path
        d="M45.5 16.3L47 15.3C47.6 16.2 48.4 16.6 49.4 16.6C50.4 16.6 50.9 16.1 50.9 15.5C50.9 14.9 50.4 14.5 49 14.1C47.1 13.5 45.9 12.8 45.9 11.1C45.9 9.6 47.3 8.7 49.1 8.7C50.7 8.7 51.9 9.5 52.6 10.6L51.2 11.5C50.7 10.7 50 10.2 49.1 10.2C48.2 10.2 47.8 10.6 47.8 11.1C47.8 11.6 48.2 11.9 49.6 12.3C51.6 13 52.8 13.7 52.8 15.4C52.8 17 51.4 18.1 49.3 18.1C47.4 18.1 46.1 17.3 45.5 16.3Z"
        fill="#FFFFFF"
      />
      {/* "A" */}
      <path
        d="M57.5 8H59.6L63.5 18H61.3L60.5 16.2H56.5L55.7 18H53.6L57.5 8ZM59.9 14.6L58.5 11L57.1 14.6H59.9Z"
        fill="#FFFFFF"
      />
    </svg>
  );
};
