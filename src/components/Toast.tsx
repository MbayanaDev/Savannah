import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Toast: React.FC = () => {
  const { toast } = useStore();

  if (!toast) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-50 animate-in slide-in-from-bottom-5 duration-200">
      <div className={`px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs sm:text-sm font-medium border ${
        toast.type === 'warning'
          ? 'bg-amber-50 text-amber-900 border-amber-200'
          : toast.type === 'info'
          ? 'bg-stone-900 text-white border-stone-800'
          : 'bg-[#173b28] text-white border-[#122e20]'
      }`}>
        {toast.type === 'warning' ? (
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
        ) : toast.type === 'info' ? (
          <Info className="w-4 h-4 text-[#8de29b] shrink-0" />
        ) : (
          <CheckCircle2 className="w-4 h-4 text-[#8de29b] shrink-0" />
        )}
        <span>{toast.text}</span>
      </div>
    </div>
  );
};
