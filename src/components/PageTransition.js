import React, { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const TransitionContext = createContext(null);
export const useInitialIntro = () => useContext(TransitionContext)?.initialIntro ?? true;
export const usePageTransitionActive = () => useContext(TransitionContext)?.pageTransitioning ?? false;
const DETAIL_PUSH_MS = 1800;
const sweep = keyframes`
  0% { transform: translateY(100%); }
  35%, 65% { transform: translateY(0); }
  100% { transform: translateY(-100%); }
`;
const title = keyframes`
  0%, 30% { opacity: 0; transform: translateY(20px); }
  45%, 65% { opacity: 1; transform: translateY(0); }
  85%, 100% { opacity: 0; transform: translateY(-20px); }
`;
const Curtain = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: var(--site-bg, #fff);
  color: var(--site-text, #000);
  display: grid;
  place-items: center;
  animation: ${sweep} 1600ms cubic-bezier(.65,0,.35,1) both;
  span { font: 600 clamp(32px, 6vw, 80px) 'Pretendard Variable', sans-serif; animation: ${title} 1600ms ease both; }
`;
const slideInRight = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
`;
const slideInLeft = keyframes`
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
`;
const slideOutLeft = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-100%); }
`;
const slideOutRight = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(100%); }
`;
const RouteFrame = styled.div`
  position: relative;
  z-index: ${props => props.$direction ? 10003 : 'auto'};
  animation: ${props => props.$direction === 'forward' ? slideInLeft : props.$direction === 'back' ? slideInRight : 'none'} ${DETAIL_PUSH_MS}ms cubic-bezier(.65,0,.35,1) both;
  ${props => props.$direction && '[data-site-header] { visibility: hidden !important; }'}
`;
const OutgoingView = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10002;
  overflow: hidden;
  pointer-events: none;
  animation: ${props => props.$direction === 'forward' ? slideOutRight : slideOutLeft} ${DETAIL_PUSH_MS}ms cubic-bezier(.65,0,.35,1) both;
  [data-site-header] { visibility: hidden !important; }
`;
const FixedHeader = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  z-index: 10004;
  pointer-events: none;
  background: var(--site-header, rgba(255,255,255,.78));
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  [data-site-header] { background: transparent; backdrop-filter: none; -webkit-backdrop-filter: none; }
  @media (max-width: 600px) { height: 105px; }
`;
function OutgoingSnapshot({ node, direction, scrollTop }) {
  const mountRef = useRef(null);
  useLayoutEffect(() => {
    if (node && mountRef.current) {
      mountRef.current.appendChild(node);
      // Scroll offsets are not reliably retained while the cloned page is detached.
      node.scrollTop = scrollTop;
    }
    return () => node?.remove();
  }, [node, scrollTop]);
  return <OutgoingView ref={mountRef} $direction={direction} data-direction={direction} data-testid="outgoing-page" />;
}
function HeaderSnapshot({ node }) {
  const mountRef = useRef(null);
  useLayoutEffect(() => {
    if (node && mountRef.current) mountRef.current.appendChild(node);
    return () => node?.remove();
  }, [node]);
  return <FixedHeader ref={mountRef} aria-hidden="true" data-testid="fixed-transition-header" />;
}
export const useDetailTransition = () => useContext(TransitionContext)?.detailGo;
const titles = { '/': 'Home', '/works': 'Works', '/archive-prototype': 'Works', '/about': 'About', '/contact': 'Contact' };
const canonicalPath = path => path === '/index-prototype' ? '/' : path;
let initialIntroClaimed = false;

export function PageTransitionProvider({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const initialPath = useRef(canonicalPath(location.pathname));
  const [initialIntro, setInitialIntro] = useState(() => {
    const shouldPlay = initialPath.current === '/' && !initialIntroClaimed;
    if (shouldPlay) initialIntroClaimed = true;
    return shouldPlay;
  });
  const [overlay, setOverlay] = useState(null);
  const [pushTransition, setPushTransition] = useState(null);
  const busy = useRef(false);
  const detailBusy = useRef(false);
  const timers = useRef([]);
  useEffect(() => {
    if (canonicalPath(location.pathname) !== initialPath.current) setInitialIntro(false);
  }, [location.pathname]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const go = (to, label) => {
    if (busy.current || detailBusy.current || canonicalPath(location.pathname) === canonicalPath(to)) return;
    setInitialIntro(false);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { navigate(to); return; }
    busy.current = true;
    setOverlay(label || titles[to] || '');
    timers.current = [
      setTimeout(() => navigate(to), 850),
      setTimeout(() => { setOverlay(null); busy.current = false; }, 1600)
    ];
  };
  const detailGo = (to, artworkTitle, state) => {
    if (busy.current || detailBusy.current) return;
    setInitialIntro(false);
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { navigate(to, { state }); return; }
    detailBusy.current = true;
    const source = document.querySelector('[data-page-transition-source]');
    const snapshot = source?.cloneNode(true) ?? null;
    const header = source?.querySelector('[data-site-header]')?.cloneNode(true) ?? null;
    const scrollTop = source?.scrollTop ?? 0;
    setPushTransition({ node: snapshot, header, scrollTop, direction: artworkTitle ? 'forward' : 'back' });
    navigate(to, { state });
    timers.current = [...timers.current, setTimeout(() => { setPushTransition(null); detailBusy.current = false; }, DETAIL_PUSH_MS)];
  };
  return <TransitionContext.Provider value={{ initialIntro, pageTransitioning: overlay !== null, go, detailGo }}>
    <RouteFrame $direction={pushTransition?.direction} data-direction={pushTransition?.direction} inert={overlay !== null || pushTransition !== null ? true : undefined}>{children}</RouteFrame>
    {overlay !== null && <Curtain role="status" aria-live="polite"><span>{overlay}</span></Curtain>}
    {pushTransition?.node && <OutgoingSnapshot node={pushTransition.node} direction={pushTransition.direction} scrollTop={pushTransition.scrollTop} />}
    {pushTransition?.header && <HeaderSnapshot node={pushTransition.header} />}
  </TransitionContext.Provider>;
}

export function TransitionLink({ to, onClick, children, ...props }) {
  const context = useContext(TransitionContext);
  return <Link to={to} {...props} onClick={event => {
    if (!context || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || props.target === '_blank') return;
    event.preventDefault();
    onClick?.(event);
    context.go(to);
  }}>{children}</Link>;
}
