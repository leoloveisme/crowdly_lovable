
import React, { useEffect, useRef, useState } from 'react';

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
  const [hasError, setHasError] = useState<boolean>(false);
  const scriptLoadedRef = useRef<boolean>(false);

  useEffect(() => {
    // Create script element if it doesn't exist
    if (!document.querySelector('script[src*="recaptcha/api.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        scriptLoadedRef.current = true;
        initializeCaptcha();
      };
      script.onerror = () => {
        console.error("Failed to load reCAPTCHA script");
        setHasError(true);
      };
      document.head.appendChild(script);
    } else if (!scriptLoadedRef.current) {
      scriptLoadedRef.current = true;
      initializeCaptcha();
    }
    
    // Handle script already loaded case
    if (window.grecaptcha && window.grecaptcha.render) {
      scriptLoadedRef.current = true;
      initializeCaptcha();
    }

    function initializeCaptcha() {
      // Only proceed if the script is loaded and the component is still mounted
      if (!scriptLoadedRef.current) return;
      
      const renderCaptcha = () => {
        // Ensure siteKey is not empty
        if (!siteKey || siteKey.trim() === '') {
          console.error("reCAPTCHA site key is empty or invalid");
          setHasError(true);
          return;
        }
        
        if (window.grecaptcha && window.grecaptcha.render && containerRef.current) {
          try {
            // Reset if already rendered
            if (captchaId.current !== null) {
              try {
                window.grecaptcha.reset(captchaId.current);
                setHasError(false);
              } catch (resetError) {
                console.error('Error resetting reCAPTCHA:', resetError);
                // Re-render if reset fails
                captchaId.current = null;
                setTimeout(renderCaptcha, 100);
              }
            } else {
              // Render new captcha
              captchaId.current = window.grecaptcha.render(containerRef.current, {
                sitekey: siteKey,
                callback: (token: string) => {
                  setHasError(false);
                  onChange(token);
                },
                'expired-callback': () => onChange(null),
                'error-callback': () => {
                  console.error("reCAPTCHA encountered an error");
                  setHasError(true);
                  onChange(null);
                }
              });
            }
          } catch (error) {
            console.error('Error rendering reCAPTCHA:', error);
            setHasError(true);
            // Try again after a delay, but limit retries
            setTimeout(renderCaptcha, 500);
          }
        } else if (window.grecaptcha) {
          // If grecaptcha exists but render method is not ready yet
          setTimeout(renderCaptcha, 100);
        } else {
          // If grecaptcha doesn't exist yet
          setTimeout(renderCaptcha, 500);
        }
      };

      // Use grecaptcha.ready if available, otherwise use our custom rendering logic
      if (window.grecaptcha && window.grecaptcha.ready) {
        window.grecaptcha.ready(() => {
          renderCaptcha();
        });
      } else {
        setTimeout(renderCaptcha, 500);
      }
    }

    return () => {
      // Clean up if component unmounts
      if (captchaId.current !== null && window.grecaptcha && window.grecaptcha.reset) {
        try {
          window.grecaptcha.reset(captchaId.current);
        } catch (error) {
          console.error("Error during cleanup:", error);
        }
      }
    };
  }, [siteKey, onChange]);

  return (
    <div className="recaptcha-container">
      <div ref={containerRef}></div>
      {hasError && (
        <div className="mt-2 text-red-500 text-sm">
          There was an error loading reCAPTCHA. Please check your site key and try again.
        </div>
      )}
    </div>
  );
};

export default ReCaptcha;
