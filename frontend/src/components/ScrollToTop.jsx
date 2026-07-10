import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      let element = document.getElementById(id);
      
      const scrollToElement = (el) => {
        const y = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: 'smooth' });
      };

      if (element) {
        requestAnimationFrame(() => scrollToElement(element));
      } else {
        const observer = new MutationObserver((mutations, obs) => {
          element = document.getElementById(id);
          if (element) {
            requestAnimationFrame(() => scrollToElement(element));
            obs.disconnect();
          }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        // Failsafe to prevent memory leaks if element never mounts
        setTimeout(() => observer.disconnect(), 5000);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}
