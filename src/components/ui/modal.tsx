import { ReactNode, useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end';
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 10); // Small delay for smooth animation
    } else {
      setIsAnimating(false);
      setTimeout(() => setIsVisible(false), 50); // Wait for animation to complete
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);
  if (!isVisible) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  };

  return (
    <div
      className={`h-screen fixed overflow-hidden inset-0 flex flex-col justify-center items-center z-50 sm:p-4 transition-all duration-200 backdrop-blur-xs ${
        isAnimating ? 'backdrop-blur-xs' : ''
      }`}
      onClick={onClose}
    >
      <div
        className={`glass-modal sm:rounded-xl w-full ${sizeClasses[size]} transition-all duration-200 transform ${
          isAnimating ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-20'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-2 border-b border-slate-700/50">
          <h2 className="text-sm font-semibold text-white">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto sm:max-h-[calc(90vh-120px)]">{children}</div>
      </div>
    </div>
  );
}
