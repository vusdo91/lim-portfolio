import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const getKoreaDate = () => new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit'
}).format(new Date());

const VisitorTracker = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith('/admin')) return;
    const today = getKoreaDate();
    const storageKey = 'lim_visit_recorded_on';
    if (sessionStorage.getItem(storageKey) === today) return;
    fetch('/api/visit', { method: 'POST', credentials: 'same-origin' })
      .then((response) => { if (response.ok) sessionStorage.setItem(storageKey, today); })
      .catch(() => {});
  }, [location.pathname]);

  return null;
};

export default VisitorTracker;
