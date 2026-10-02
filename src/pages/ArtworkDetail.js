import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled, { css, keyframes } from 'styled-components';
import { useDetailTransition } from '../components/PageTransition';
import { useArtworks } from '../contexts/ArtworkContext';
import defaultArtworks from '../data/artworks';
import { getGalleryArtworks } from '../utils/indexPrototypeLogic';
import SiteHeader from '../components/SiteHeader';
import './IndexPrototype.css';

const Page = styled.main`
  width: 100%;
  height: 100vh;
  height: 100dvh;
  overflow-y: auto;
  background: var(--site-bg, #fff);
  color: var(--site-text, #111);
  font-family: 'Pretendard Variable', Pretendard, sans-serif;
`;
const Back = styled.button`
  position: absolute;
  top: 70px;
  left: 4vw;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--site-text, #111);
  cursor: pointer;
  transition: transform 220ms ease;
  svg { width: 20px; height: 20px; }
  &:hover, &:focus-visible { transform: translateX(-5px); }
  @media (max-width: 600px) { top: 113px; }
  @media (prefers-reduced-motion: reduce) { transition: none; }
`;
const DETAIL_SLIDE_MS = 760;
const imageLeavesRight = keyframes`
  from { opacity: 1; transform: translateX(0); }
  to { opacity: 0; transform: translateX(48px); }
`;
const imageLeavesLeft = keyframes`
  from { opacity: 1; transform: translateX(0); }
  to { opacity: 0; transform: translateX(-48px); }
`;
const imageEntersLeft = keyframes`
  from { opacity: 0; transform: translateX(-48px); }
  to { opacity: 1; transform: translateX(0); }
`;
const imageEntersRight = keyframes`
  from { opacity: 0; transform: translateX(48px); }
  to { opacity: 1; transform: translateX(0); }
`;
const captionLeaves = keyframes`
  0% { opacity: 1; }
  45%, 100% { opacity: 0; }
`;
const captionEnters = keyframes`
  0%, 40% { opacity: 0; }
  100% { opacity: 1; }
`;
const Artwork = styled.article`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: min(13vh, 96px) 5vw 64px;
  @media (max-width: 600px) {
    min-height: 100dvh;
    padding: 0 5vw;
    justify-content: center;
  }
`;
const ArtworkProgress = styled.div`
  width: 152px;
  height: 4px;
  margin-bottom: 36px;
  overflow: hidden;
  border-radius: 999px;
  background: var(--site-line, #e4e7ed);
  @media (max-width: 600px) {
    position: absolute;
    top: 157px;
    margin-bottom: 0;
  }
`;
const ProgressFill = styled.div`
  width: ${props => props.$percent}%;
  height: 100%;
  border-radius: inherit;
  background: #365d4a;
  transition: width ${DETAIL_SLIDE_MS}ms cubic-bezier(.65,0,.35,1);
  @media (prefers-reduced-motion: reduce) { transition: none; }
`;
const ImageStage = styled.div`
  position: relative;
  width: 90vw;
  display: grid;
  place-items: center;
  overflow: hidden;
`;
const SlideImage = styled.img`
  grid-area: 1 / 1;
  display: block;
  max-width: 100%;
  max-height: 65vh;
  width: auto;
  height: auto;
  object-fit: contain;
  ${props => props.$phase && css`animation: ${props.$phase === 'out' ? props.$direction === 'previous' ? imageLeavesRight : imageLeavesLeft : props.$direction === 'previous' ? imageEntersLeft : imageEntersRight} ${DETAIL_SLIDE_MS}ms cubic-bezier(.65,0,.35,1) both;`}
  @media (max-width: 600px) {
    max-height: max(80px, min(56dvh, calc(100dvh - 360px)));
  }
  @media (prefers-reduced-motion: reduce) { animation: none; }
`;
const DetailControls = styled.div`
  width: min(90vw, 960px);
  margin-top: 26px;
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr) 32px;
  align-items: center;
  @media (max-width: 900px) { width: calc(100vw - 112px); }
  @media (max-width: 600px) {
    position: fixed;
    z-index: 2;
    left: 50%;
    bottom: calc(24px + env(safe-area-inset-bottom, 0px));
    transform: translateX(-50%);
    margin-top: 0;
    padding: 12px 0;
    background: var(--site-bg, #fff);
  }
`;
const ChangeArtwork = styled.button`
  grid-column: ${props => props.$direction === 'previous' ? 1 : 3};
  grid-row: 1;
  position: relative;
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--site-text, #111);
  cursor: pointer;
  visibility: ${props => props.$hidden ? 'hidden' : 'visible'};
  transition: transform 220ms ease;
  svg { width: 17px; height: 17px; }
  span {
    position: absolute;
    bottom: calc(100% + 10px);
    left: 50%;
    padding: 8px 11px;
    border-radius: 10px;
    background: #365d4a;
    box-shadow: 0 5px 16px rgba(25, 45, 34, .18);
    color: #fff;
    font: 400 12px/1.3 'Pretendard Variable', Pretendard, sans-serif;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transform: translate(-50%, 5px);
    transition: opacity 180ms ease, transform 180ms ease, visibility 180ms;
    pointer-events: none;
  }
  span::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 50%;
    width: 8px;
    height: 8px;
    background: inherit;
    transform: translateX(-50%) rotate(45deg);
  }
  &:not(:disabled):hover span, &:not(:disabled):focus-visible span {
    opacity: 1;
    visibility: visible;
    transform: translate(-50%, 0);
  }
  &:hover, &:focus-visible { transform: translateX(${props => props.$direction === 'previous' ? '-5px' : '5px'}); }
  @media (prefers-reduced-motion: reduce) { transition: none; span { transition: none; } }
`;
const Caption = styled.div`
  grid-column: 2;
  grid-row: 1;
  text-align: center;
  ${props => props.$phase && css`animation: ${props.$phase === 'out' ? captionLeaves : captionEnters} ${DETAIL_SLIDE_MS}ms ease both;`}
  h1 { margin: 0 0 4px; font: 500 16px/1.4 'Pretendard Variable', Pretendard, sans-serif; }
  p { margin: 0; font: 300 14px/1.5 'Pretendard Variable', Pretendard, sans-serif; }
  @media (prefers-reduced-motion: reduce) { animation: none; }
`;

export default function ArtworkDetail() {
  const { artworkId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const detailGo = useDetailTransition();
  const { artworks: remoteArtworks, isLoading } = useArtworks();
  const artworks = useMemo(() => getGalleryArtworks(remoteArtworks, defaultArtworks), [remoteArtworks]);
  const artwork = artworks.find(item => item.id === artworkId);
  const selectedYear = location.state?.selectedYear || 'all';
  const fromHome = location.state?.from === '/';
  const yearArtworks = !fromHome && selectedYear !== 'all'
    ? artworks.filter(item => item.year === selectedYear)
    : artworks;
  const sequence = yearArtworks.some(item => item.id === artworkId) ? yearArtworks : artworks;
  const artworkIndex = sequence.findIndex(item => item.id === artworkId);
  const previous = artworkIndex > 0 ? sequence[artworkIndex - 1] : null;
  const next = artworkIndex >= 0 ? sequence[artworkIndex + 1] ?? null : null;
  const previousImage = previous?.image;
  const nextImage = next?.image;
  const [slide, setSlide] = useState(null);
  const slideTimer = useRef(null);
  const activeSlide = slide?.to.id === artworkId ? slide : null;
  useEffect(() => () => window.clearTimeout(slideTimer.current), []);
  useEffect(() => {
    [previousImage, nextImage].forEach(src => {
      if (src) {
        const image = new Image();
        image.src = src;
      }
    });
  }, [previousImage, nextImage]);
  const changeArtwork = (target, direction) => {
    if (!artwork || !target || activeSlide) return;
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!reducedMotion) {
      setSlide({ from: artwork, to: target, direction });
      slideTimer.current = window.setTimeout(() => {
        slideTimer.current = null;
        setSlide(null);
      }, DETAIL_SLIDE_MS);
    }
    navigate(`/works/${encodeURIComponent(target.id)}`, { state: location.state, preventScrollReset: true });
  };
  const returnTo = fromHome ? '/' : '/works';
  const returnState = fromHome ? undefined : { selectedYear };
  const back = () => {
    if (detailGo) detailGo(returnTo, null, returnState);
    else navigate(returnTo, { state: returnState });
  };

  return <Page data-page-transition-source data-artwork-detail-page>
    <SiteHeader />
    <Back type="button" aria-label={fromHome ? 'Home으로 돌아가기' : 'Works로 돌아가기'} onClick={back}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m14 5-7 7 7 7M7 12h13" /></svg>
    </Back>
    {isLoading ? null : artwork ? <Artwork>
      <ArtworkProgress role="progressbar" aria-label="작품 탐색 진행률" aria-valuemin={1} aria-valuemax={sequence.length} aria-valuenow={artworkIndex + 1} aria-valuetext={`총 ${sequence.length}개 중 ${artworkIndex + 1}번째 작품`}>
        <ProgressFill $percent={(artworkIndex + 1) / sequence.length * 100} />
      </ArtworkProgress>
      <ImageStage>
        {activeSlide && <SlideImage src={activeSlide.from.image} alt={activeSlide.from.title} $phase="out" $direction={activeSlide.direction} />}
        <SlideImage src={artwork.image} alt={artwork.title} $phase={activeSlide ? 'in' : undefined} $direction={activeSlide?.direction} />
      </ImageStage>
      <DetailControls>
        <ChangeArtwork type="button" $direction="previous" $hidden={!previous} disabled={!previous || Boolean(activeSlide)} aria-label={previous ? `이전 작품: ${previous.title}` : '이전 작품 없음'} aria-describedby={previous ? 'previous-artwork-count' : undefined} onClick={() => changeArtwork(previous, 'previous')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 5-7 7 7 7" /></svg>
          {previous && <span id="previous-artwork-count" role="tooltip">이전 작품 {artworkIndex}개 남음</span>}
        </ChangeArtwork>
        {activeSlide && <Caption $phase="out" aria-hidden="true">
          <h1>{activeSlide.from.title}</h1>
          <p>{[activeSlide.from.size, activeSlide.from.material, activeSlide.from.year].filter(Boolean).join(', ')}</p>
        </Caption>}
        <Caption $phase={activeSlide ? 'in' : undefined}>
          <h1>{artwork.title}</h1>
          <p>{[artwork.size, artwork.material, artwork.year].filter(Boolean).join(', ')}</p>
        </Caption>
        <ChangeArtwork type="button" $direction="next" $hidden={!next} disabled={!next || Boolean(activeSlide)} aria-label={next ? `다음 작품: ${next.title}` : '다음 작품 없음'} aria-describedby={next ? 'next-artwork-count' : undefined} onClick={() => changeArtwork(next, 'next')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg>
          {next && <span id="next-artwork-count" role="tooltip">다음 작품 {sequence.length - artworkIndex - 1}개 남음</span>}
        </ChangeArtwork>
      </DetailControls>
    </Artwork> : <Artwork><Caption><h1>작품을 찾을 수 없습니다.</h1></Caption></Artwork>}
  </Page>;
}
