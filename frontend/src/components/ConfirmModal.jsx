import React from 'react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', cancelText = 'Cancel' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative bg-luxury-light-card dark:bg-luxury-dark-card border border-luxury-light-border dark:border-luxury-dark-border w-full max-w-md rounded-2xl p-6 shadow-2xl luxury-jade-glow transform scale-100 transition-all duration-300 animate-fade-in-up">
        {/* Warning Icon Emblem */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 mb-4 shadow-inner">
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        {/* Text Details */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-luxury-light-text-primary dark:text-luxury-dark-text-primary">
            {title}
          </h3>
          <p className="text-sm text-luxury-light-text-secondary dark:text-luxury-dark-text-secondary mt-2">
            {message}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col-reverse sm:flex-row gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-luxury-light-border dark:border-luxury-dark-border text-sm font-semibold text-luxury-light-text-secondary dark:text-luxury-dark-text-secondary hover:bg-luxury-light-card-hover dark:hover:bg-luxury-dark-card-hover transition-colors cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold shadow-md hover:shadow-lg hover:shadow-red-500/20 transition-all cursor-pointer"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
