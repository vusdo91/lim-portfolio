import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { useDetailTransition } from '../components/PageTransition';
import { useArtworks } from '../contexts/ArtworkContext';
import defaultArtworks from '../data/artworks';
import { getGalleryArtworks } from '../utils/indexPrototypeLogic';
import SiteHeader from '../components/SiteHeader';
import './IndexPrototype.css';

const Page = styled.main`
  position: relative;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  overflow-x: hidden;
  overflow-y: auto;
  background: #fff;
  color: #111;
  font-family: 'Pretendard Variable', Pretendard, sans-serif;
`;
const FilterRow = styled.div`
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 6px;
  margin: 80px 4vw 40px;
  min-height: 26px;
  @media (max-width: 600px) { margin-top: 130px; }
`;
const YearButton = styled.button`
  flex: none;
  min-width: 54px;
  height: 26px;
  padding: 0 11px;
  border: 1px solid ${props => props.$active ? '#000' : '#50614f'};
  border-radius: 999px;
  background: ${props => props.$active ? '#000' : '#fff'};
  color: ${props => props.$active ? '#fff' : '#344633'};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font: 400 11px 'Pretendard Variable', sans-serif;
  cursor: pointer;
  transition: background 180ms ease, border-color 180ms ease, color 180ms ease;
  &:hover, &:focus-visible { border-color: #2050CA; background: ${props => props.$active ? '#2050CA' : '#EAF0FF'}; color: ${props => props.$active ? '#fff' : '#2050CA'}; }
  @media (prefers-reduced-motion: reduce) { transition: none; }
`;
const Rail = styled.section`
  margin: 0 4vw;
`;
const Track = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24px;
  @media (max-width: 900px) { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  @media (max-width: 700px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (max-width: 480px) { grid-template-columns: 1fr; }
`;
const ArtworkColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  min-width: 0;
`;
const FilterResults = styled.div`
  opacity: ${props => props.$phase === 'idle' ? 1 : 0};
  pointer-events: ${props => props.$phase === 'idle' ? 'auto' : 'none'};
  transition: opacity ${props => props.$phase === 'exiting' ? 220 : 320}ms ease;
  @media (prefers-reduced-motion: reduce) { transition: none; }
`;
const Artwork = styled.article`
  min-width: 0;
  opacity: ${props => props.$visible ? 1 : 0};
  transform: translateY(${props => props.$visible ? '0' : '28px'});
  pointer-events: ${props => props.$visible ? 'auto' : 'none'};
  transition: opacity 650ms ease, transform 650ms cubic-bezier(.2,.8,.2,1);
  &:has(a:hover), &:focus-within { transform: translateY(-8px); transition-duration: 220ms; }
  h2 { margin: 8px 0 3px; font-size: 12px; font-weight: 500; line-height: 1.35; }
  p { margin: 0; font-size: 11px; font-weight: 300; line-height: 1.35; }
  a { display: block; width: 100%; cursor: pointer; }
  img { display: block; width: 100%; height: auto; }
  a:focus-visible { outline: 2px solid #075b43; outline-offset: 4px; }
  @media (prefers-reduced-motion: reduce) { transition: none; }
`;
const BackToTop = styled.button`
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  margin: 48px auto 110px;
  border: 0;
  border-radius: 50%;
  background: #000;
  color: #fff;
  cursor: pointer;
  transition: transform 220ms ease, background 220ms ease;
  &:hover, &:focus-visible { transform: translateY(-4px); background: #2050CA; }
  svg { width: 17px; height: 17px; }
  @media (prefers-reduced-motion: reduce) { transition: none; }
`;
const reservedAspectRatio = artwork => {
  const match = String(artwork.size || '').match(/(\d+(?:\.\d+)?)\s*[x×X]\s*(\d+(?:\.\d+)?)/);
  return `auto ${match ? `${match[1]} / ${match[2]}` : '4 / 3'}`;
};

function ArtworkGallery({ artworks, columnCount, rootRef, selectedYear, openDetail }) {
  const [revealed, setRevealed] = useState(() => new Set());
  const cardsRef = useRef([]);
  const imagesRef = useRef([]);
  const sequenceRef = useRef({ visible: new Set(), loaded: new Set(), shown: new Set(), timer: null, flush: null, active: false });

  useEffect(() => {
    const sequence = sequenceRef.current;
    const scrollRoot = rootRef.current;
    sequence.active = true;
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const flush = () => {
      if (sequence.timer !== null) return;
      const pending = [...sequence.visible].filter(index => !sequence.shown.has(index)).sort((a, b) => a - b);
      if (!pending.length || pending.some(index => !sequence.loaded.has(index))) return;
      if (reducedMotion) {
        pending.forEach(index => sequence.shown.add(index));
        setRevealed(new Set(sequence.shown));
        return;
      }
      sequence.shown.add(pending[0]);
      setRevealed(new Set(sequence.shown));
      sequence.timer = window.setTimeout(() => {
        sequence.timer = null;
        flush();
      }, 115);
    };
    sequence.flush = flush;
    const observer = typeof window.IntersectionObserver === 'function'
      ? new window.IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.dataset.artworkIndex);
            sequence.visible.add(index);
            observer.unobserve(entry.target);
          }
        });
        flush();
      }, { root: scrollRoot, rootMargin: '0px 0px 100px 0px' })
      : null;
    const checkVisible = () => {
      const rootBounds = scrollRoot?.getBoundingClientRect();
      cardsRef.current.forEach((card, index) => {
        const bounds = card?.getBoundingClientRect();
        if (bounds && (!rootBounds || (bounds.bottom >= rootBounds.top - 100 && bounds.top <= rootBounds.bottom + 100))) {
          sequence.visible.add(index);
        }
      });
      flush();
    };
    cardsRef.current.forEach((card, index) => {
      if (observer) observer.observe(card);
      const image = imagesRef.current[index];
      if (image?.complete && image.naturalWidth > 0) {
        const done = () => {
          if (sequence.active) { sequence.loaded.add(index); flush(); }
        };
        if (image.decode) image.decode().catch(() => {}).then(done);
        else done();
      }
    });
    if (!observer) {
      scrollRoot?.addEventListener('scroll', checkVisible, { passive: true });
      window.addEventListener('resize', checkVisible);
      checkVisible();
    }
    flush();
    return () => {
      sequence.active = false;
      sequence.flush = null;
      observer?.disconnect();
      scrollRoot?.removeEventListener('scroll', checkVisible);
      window.removeEventListener('resize', checkVisible);
      if (sequence.timer !== null) window.clearTimeout(sequence.timer);
      sequence.timer = null;
    };
  }, [rootRef]);

  const imageReady = (index, image) => {
    const sequence = sequenceRef.current;
    const done = () => {
      if (!sequence.active) return;
      sequence.loaded.add(index);
      sequence.flush?.();
    };
    if (image?.decode) image.decode().catch(() => {}).then(done);
    else done();
  };

  return <Track>{Array.from({ length: columnCount }, (_, column) => <ArtworkColumn key={column}>
    {artworks.map((artwork, index) => ({ artwork, index })).filter(({ index }) => index % columnCount === column).map(({ artwork, index }) =>
      <Artwork key={artwork.id} ref={node => { cardsRef.current[index] = node; }} data-artwork-index={index} data-revealed={revealed.has(index)} $visible={revealed.has(index)}>
        <Link to={`/works/${encodeURIComponent(artwork.id)}`} state={{ from: '/works', selectedYear }} aria-label={`${artwork.title} 상세 보기`} tabIndex={revealed.has(index) ? undefined : -1} onClick={event => {
          if (!openDetail || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
          event.preventDefault();
          openDetail(`/works/${encodeURIComponent(artwork.id)}`, artwork.title, { from: '/works', selectedYear }, [artwork.size, artwork.material, artwork.year].filter(Boolean).join(', '));
        }}>
          <img ref={node => { imagesRef.current[index] = node; }} src={artwork.image} alt={artwork.title} loading="lazy" style={{ aspectRatio: reservedAspectRatio(artwork) }} onLoad={event => imageReady(index, event.currentTarget)} onError={() => imageReady(index)} />
        </Link>
        <h2>{artwork.title}</h2>
        <p>{[artwork.size, artwork.material, artwork.year].filter(Boolean).join(', ')}</p>
      </Artwork>
    )}
  </ArtworkColumn>)}</Track>;
}

export default function ArchivePrototype() {
  const location = useLocation();
  const openDetail = useDetailTransition();
  const { artworks: remoteArtworks, isLoading } = useArtworks();
  const artworks = useMemo(() => getGalleryArtworks(remoteArtworks, defaultArtworks), [remoteArtworks]);
  const yearOptions = useMemo(() => {
    const years = [...new Set(artworks.map(artwork => String(artwork.year || '').trim()).filter(Boolean))];
    return ['all', ...years.sort((left, right) => Number(left) - Number(right))];
  }, [artworks]);
  const [selectedYear, setSelectedYear] = useState(() => yearOptions.includes(location.state?.selectedYear) ? location.state.selectedYear : 'all');
  const [filterPhase, setFilterPhase] = useState('idle');
  const filterTimerRef = useRef(null);
  const filterFrameRef = useRef(null);
  const pageRef = useRef(null);
  const stopMomentumRef = useRef(() => {});
  const [columnCount, setColumnCount] = useState(() => window.innerWidth <= 480 ? 1 : window.innerWidth <= 700 ? 2 : window.innerWidth <= 900 ? 3 : 4);
  useEffect(() => {
    if (!yearOptions.includes(selectedYear)) setSelectedYear('all');
  }, [selectedYear, yearOptions]);
  useEffect(() => () => {
    if (filterTimerRef.current !== null) window.clearTimeout(filterTimerRef.current);
    if (filterFrameRef.current !== null) window.cancelAnimationFrame(filterFrameRef.current);
  }, []);
  useEffect(() => {
    const updateColumns = () => setColumnCount(window.innerWidth <= 480 ? 1 : window.innerWidth <= 700 ? 2 : window.innerWidth <= 900 ? 3 : 4);
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);
  useEffect(() => {
    const page = pageRef.current;
    if (!page) return undefined;
    const motion = { frame: null, velocity: 0, lastTime: null };
    const stop = () => {
      if (motion.frame !== null) window.cancelAnimationFrame(motion.frame);
      motion.frame = null;
      motion.velocity = 0;
      motion.lastTime = null;
    };
    stopMomentumRef.current = stop;
    const coast = timestamp => {
      const max = Math.max(0, page.scrollHeight - page.clientHeight);
      const elapsed = motion.lastTime === null ? 1000 / 60 : Math.min(64, Math.max(0, timestamp - motion.lastTime));
      motion.lastTime = timestamp;
      const decay = Math.exp(-elapsed / 430);
      const next = Math.max(0, Math.min(max, page.scrollTop + motion.velocity * 430 * (1 - decay)));
      page.scrollTop = next;
      motion.velocity *= decay;
      if ((next <= 0 && motion.velocity < 0) || (next >= max && motion.velocity > 0) || Math.abs(motion.velocity) < .02) stop();
      else motion.frame = window.requestAnimationFrame(coast);
    };
    const wheel = event => {
      if (filterPhase !== 'idle' || event.ctrlKey || event.metaKey) return;
      const factor = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? page.clientHeight : 1;
      const delta = event.deltaY * factor;
      const max = Math.max(0, page.scrollHeight - page.clientHeight);
      if (!delta || max <= 0) return;
      if ((delta < 0 && page.scrollTop <= 0 && motion.velocity <= 0) || (delta > 0 && page.scrollTop >= max && motion.velocity >= 0)) return;
      event.preventDefault();
      if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
        stop();
        page.scrollTop = Math.max(0, Math.min(max, page.scrollTop + delta));
        return;
      }
      if (motion.velocity * delta < 0) motion.velocity = 0;
      motion.velocity = Math.max(-3.4, Math.min(3.4, motion.velocity + delta * 1.2 / 160));
      if (motion.frame === null) motion.frame = window.requestAnimationFrame(coast);
    };
    const onKey = event => {
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) stop();
    };
    page.addEventListener('wheel', wheel, { passive: false });
    page.addEventListener('touchstart', stop, { passive: true });
    page.addEventListener('pointerdown', stop, { passive: true });
    window.addEventListener('keydown', onKey);
    return () => {
      stop();
      stopMomentumRef.current = () => {};
      page.removeEventListener('wheel', wheel);
      page.removeEventListener('touchstart', stop);
      page.removeEventListener('pointerdown', stop);
      window.removeEventListener('keydown', onKey);
    };
  }, [filterPhase]);
  const selectYear = next => {
    if (filterPhase !== 'idle' || next === selectedYear) return;
    stopMomentumRef.current();
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      pageRef.current?.scrollTo?.({ top: 0 });
      setSelectedYear(next);
      return;
    }
    setFilterPhase('exiting');
    filterTimerRef.current = window.setTimeout(() => {
      filterTimerRef.current = null;
      if (pageRef.current) pageRef.current.scrollTop = 0;
      setSelectedYear(next);
      setFilterPhase('entering');
      filterFrameRef.current = window.requestAnimationFrame(() => {
        filterFrameRef.current = null;
        setFilterPhase('idle');
      });
    }, 220);
  };
  const matching = selectedYear === 'all' ? artworks : artworks.filter(artwork => String(artwork.year || '') === selectedYear);

  return <Page ref={pageRef} data-page-transition-source>
    <SiteHeader />
    <FilterRow aria-label="작품 연도 필터">{yearOptions.map(year =>
      <YearButton key={year} type="button" aria-pressed={selectedYear === year} $active={selectedYear === year} disabled={filterPhase !== 'idle'} onClick={() => selectYear(year)}>{year === 'all' ? 'All' : year}</YearButton>
    )}
    </FilterRow>
    <Rail aria-label="작품 목록" aria-busy={filterPhase !== 'idle'}>
      <FilterResults $phase={filterPhase}>
      {!isLoading && matching.length > 0 && <ArtworkGallery key={`${columnCount}:${selectedYear}:${matching.map(artwork => artwork.id).join(',')}`} artworks={matching} columnCount={columnCount} rootRef={pageRef} selectedYear={selectedYear} openDetail={openDetail} />}
      </FilterResults>
    </Rail>
    {matching.length > 0 && <BackToTop type="button" aria-label="맨 위로" title="맨 위로" onClick={() => { stopMomentumRef.current(); pageRef.current?.scrollTo({ top: 0, behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); }}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="m5 14 7-7 7 7" /></svg>
    </BackToTop>}
  </Page>;
}
