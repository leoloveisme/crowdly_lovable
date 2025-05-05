
import React, { useEffect, useRef } from 'react';

interface ReCaptchaProps {
  siteKey: string;
  onChange: (token: string | null) => void;
}

declare global {
  interface Window {
    grecaptcha: {
      render: (
        container: HTMLElement | string,
        parameters: {
          sitekey: string;
          callback?: (token: string) => void;
          'expired-callback'?: () => void;
          'error-callback'?: () => void;
          theme?: 'light' | 'dark';
          size?: 'normal' | 'compact' | 'invisible';
        }
      ) => number;
      reset: (widgetId?: number) => void;
      execute: (widgetId?: number) => void;
      ready: (callback: () => void) => void;
    };
  }
}

const ReCaptcha: React.FC<ReCaptchaProps> = ({ siteKey, onChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const captchaId = useRef<number | null>(null);

  useEffect(() => {
    // Create script element if it doesn't exist
    if (!document.querySelector('script[src="https://www.google.com/recaptcha/api.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
    
    // Wait for the reCAPTCHA API to load
    const renderCaptcha = () => {
      if (window.grecaptcha && window.grecaptcha.render && containerRef.current) {
        try {
          // Reset if already rendered
          if (captchaId.current !== null) {
            window.grecaptcha.reset(captchaId.current);
          } else {
            // Render new captcha
            captchaId.current = window.grecaptcha.render(containerRef.current, {
              sitekey: siteKey,
              callback: onChange,
              'expired-callback': () => onChange(null),
              'error-callback': () => onChange(null)
            });
          }
        } catch (error) {
          console.error('Error rendering reCAPTCHA:', error);
        }
      } else {
        // If not loaded yet, try again after a delay
        setTimeout(renderCaptcha, 100);
      }
    };

    // Use grecaptcha.ready if available, otherwise use our custom rendering logic
    if (window.grecaptcha && window.grecaptcha.ready) {
      window.grecaptcha.ready(renderCaptcha);
    } else {
      setTimeout(renderCaptcha, 500);
    }

    return () => {
      // Cleanup if needed
    };
  }, [siteKey, onChange]);

  return <div ref={containerRef} className="recaptcha-container"></div>;
};

export default ReCaptcha;
