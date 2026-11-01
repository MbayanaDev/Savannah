import React, { useState } from 'react';
import { Download, Share, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import savannahIcon from '../assets/images/savannah_icon.png';
import { useBodyScrollLock } from '../utils/scrollLock';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'drawer' | 'header' | 'compact';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'drawer'
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  useBodyScrollLock(showIOSGuide);

  // If already running as an installed standalone PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // If neither installable nor iOS in standard browser, render an ambient install prompt in drawer mode
  // so the user always has clear guidance
  const handleClick = () => {
    if (isInstallable) {
      install();
    } else {
      setShowIOSGuide(true);
    }
  };

  return (
    <>
      {variant === 'drawer' ? (
        <button
          onClick={handleClick}
          className={`w-full px-3 py-2.5 rounded-xl text-left text-xs sm:text-sm font-medium text-stone-800 hover:bg-stone-100 transition-colors flex items-center justify-between cursor-pointer group border border-stone-200/80 bg-[#FBF9F5] shadow-2xs ${className}`}
        >
          <div className="flex items-center gap-2.5">
            <img
              src={savannahIcon}
              alt="Savannah Fresh App Icon"
              className="w-8 h-8 rounded-xl object-contain shadow-xs border border-stone-200 bg-white group-hover:scale-105 transition-transform shrink-0"
            />
            <div className="flex flex-col">
              <span className="font-semibold text-stone-900 leading-tight">Install Savannah App</span>
              <span className="text-[10px] text-stone-500 font-medium">Fast access from your home screen</span>
            </div>
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
              setShowIOSGuide(true);
            }}
            className="flex items-center gap-1 bg-[#173b28] text-white px-2 py-1 rounded-lg text-[11px] font-semibold shadow-2xs group-hover:bg-[#123020] transition-colors"
          >
            <Download className="w-3 h-3 text-white" />
            <span>guide</span>
          </div>
        </button>
      ) : (
        <button
          onClick={handleClick}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#173b28] text-white text-xs font-semibold hover:bg-[#123020] transition-all cursor-pointer shadow-xs ${className}`}
          title="Install Savannah App"
        >
          <img
            src={savannahIcon}
            alt="Savannah App"
            className="w-4 h-4 rounded-sm object-contain"
          />
          <span>Install App</span>
        </button>
      )}

      {/* Guide modal (for iOS or fallback instructions) */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200 overscroll-contain">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={savannahIcon}
                  alt="Savannah App Icon"
                  className="w-12 h-12 rounded-xl object-contain border border-stone-200 shadow-xs"
                />
                <div>
                  <h3 className="text-sm font-bold text-stone-900 font-display">Install Savannah Fresh</h3>
                  <p className="text-[11px] text-stone-500">Add to your Home Screen for instant loading</p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-2.5 text-xs text-stone-700 bg-stone-50 p-3.5 rounded-xl border border-stone-200/80">
              {isIOS ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#173b28] text-white text-[10px] font-bold shrink-0">1</span>
                    <span>Tap the <strong className="text-stone-900">Share</strong> button <Share className="w-3.5 h-3.5 inline text-sky-600" /> in Safari's bottom toolbar.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#173b28] text-white text-[10px] font-bold shrink-0">2</span>
                    <span>Scroll down and tap <strong className="text-stone-900">Add to Home Screen</strong>.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#173b28] text-white text-[10px] font-bold shrink-0">3</span>
                    <span>Confirm by tapping <strong className="text-stone-900">Add</strong> in top right.</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#173b28] text-white text-[10px] font-bold shrink-0">1</span>
                    <span>Click your browser menu (<strong className="text-stone-900">⋮</strong> or <strong className="text-stone-900">Install</strong> icon in the address bar).</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#173b28] text-white text-[10px] font-bold shrink-0">2</span>
                    <span>Select <strong className="text-stone-900">Install Savannah Fresh</strong> or <strong className="text-stone-900">Add to Home Screen</strong>.</span>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-4 w-full rounded-xl bg-[#173b28] py-2 text-xs font-semibold text-white hover:bg-[#123020] transition-colors cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
