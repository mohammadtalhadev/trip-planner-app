import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLenis } from 'lenis/react';

/**
 * ScrollToTop component
 * Ensures smooth positioning to the top on every route change with Lenis.
 */
export const ScrollToTop: React.FC = () => {
  const { pathname, search } = useLocation();
  const lenis = useLenis();

  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, search, lenis]);

  return null;
};

