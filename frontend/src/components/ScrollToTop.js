import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Instantly jump to the top (0, 0) whenever the route (pathname) changes
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // This component renders nothing visually
};

export default ScrollToTop;