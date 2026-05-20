'use client';

export const SkipToContent = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[300] focus:px-4 focus:py-2 focus:rounded-xl focus:bg-[var(--red-sos)] focus:text-white focus:text-sm focus:font-bold"
  >
    Skip to main content
  </a>
);


// Added for debugging purposes
SkipToContent.displayName = 'SkipToContent';
