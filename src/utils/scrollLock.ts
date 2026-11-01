/**
 * Global scroll lock manager with reference counting and touch-scrolling prevention.
 * Freezes the underlying body and documentElement without jumping or background scroll bleed.
 */
import { useEffect } from 'react';

let lockCount = 0;
let savedScrollY = 0;

export function lockBodyScroll() {
  if (typeof window === 'undefined') return;
  lockCount++;
  if (lockCount === 1) {
    savedScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    
    document.body.style.position = 'fixed';
    document.body.style.top = `-${savedScrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  }
}

export function unlockBodyScroll() {
  if (typeof window === 'undefined') return;
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    const rawTop = document.body.style.top;
    const scrollY = rawTop ? Math.abs(parseInt(rawTop, 10)) : savedScrollY;
    
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    
    window.scrollTo(0, scrollY);
  }
}

export function useBodyScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return;
    lockBodyScroll();
    return () => {
      unlockBodyScroll();
    };
  }, [isLocked]);
}
