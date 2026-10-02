import { TransitionLink, useDetailTransition, useInitialIntro } from '../components/PageTransition';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import ContinuousArtworkGallery from '../components/index/ContinuousArtworkGallery';
import { useArtworks } from '../contexts/ArtworkContext';
import { useProfile } from '../contexts/ProfileContext';
import { ImageSkeleton } from '../components/SkeletonImage';
import defaultArtworks from '../data/artworks';
import { indexPrototypeConfig } from '../data/indexPrototypeArtworks';
import { getGalleryArtworks } from '../utils/indexPrototypeLogic';
import { DEFAULT_HOME_SETTINGS, getHomeArtworkIds } from '../utils/homeSettings';
import './IndexPrototype.css';
import SiteHeader from '../components/SiteHeader';

const PrototypePage = styled.main`
  position: relative;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  background: var(--site-bg, #fff);
  color: var(--site-text, #262522);
  font-family: 'Pretendard Variable', Pretendard, sans-serif;
`;

const ContentLayer = styled.div`
  position: absolute;
  inset: 0;
  opacity: ${props => (props.$visible ? 1 : 0)};
  visibility: ${props => props.$visible ? 'visible' : 'hidden'};
  transition: opacity 900ms ease;
  @media (prefers-reduced-motion: reduce) { transition: none; }
`;

const ExhibitionInfo = styled.aside`
  position: absolute;
  z-index: 2;
  left: 4vw;
  top: max(88px, 12vh);
  h2 { margin: 0 0 8px; font-size: 16px; font-weight: 700; line-height: 1.4; }
  p { margin: 0; font-size: 14px; font-weight: 300; line-height: 1.5; }
  @media (max-width: 600px) { top: 80px; }
`;
const HomeCopyright = styled.footer`
  position: absolute;
  z-index: 3;
  left: 50%;
  bottom: 18px;
  width: max-content;
  max-width: 90vw;
  transform: translateX(-50%);
  color: var(--site-subtle, #777);
  font: 300 12px/1.4 'Pretendard Variable', Pretendard, sans-serif;
  text-align: center;
  pointer-events: none;
  @media (max-width: 600px) { bottom: 12px; font-size: 10px; }
`;

const INTRO_LINES = ['STUDIO', 'LIM YUN MOOK'];
const LETTER_MS = 750;
const STAGGER_MS = 25;
const INTRO_DURATION = LETTER_MS + (INTRO_LINES.join('').length - 1) * STAGGER_MS;
const REVEAL_MS = 1000;

const rise = keyframes`
  from { opacity: 0; transform: translateY(55%); }
  to { opacity: 1; transform: translateY(0); }
`;
const fall = keyframes`
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(-55%); }
`;
const IntroLayer = styled.div`
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  pointer-events: none;
  text-align: center;
  font-size: clamp(28px, 5vw, 72px);
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.035em;
  h1 { font: inherit; margin: 0; }
`;
const LetterMask = styled.span`
  display: inline-block;
  overflow: visible;
  vertical-align: bottom;
  padding-bottom: .15em;
  margin-bottom: -.15em;
`;
const IntroLetter = styled.span`
  display: inline-block;
  white-space: pre;
  animation: ${props => props.$exiting ? fall : rise} ${LETTER_MS}ms cubic-bezier(.22,.7,.25,1) both;
  animation-iteration-count: 1;
  animation-delay: ${props => props.$index * STAGGER_MS}ms;
`;
const GalleryEntrance = styled.div`
  position: absolute;
  inset: 0;
  transform: translateY(${props => props.$visible ? '0' : '48px'});
  transition: transform ${REVEAL_MS}ms cubic-bezier(.16,1,.3,1);
  @media (prefers-reduced-motion: reduce) { transition: none; }
`;

const IndexPrototype = () => {
  const navigate = useNavigate();
  const detailGo = useDetailTransition();
  const { artworks: remoteArtworks, isLoading } = useArtworks();
  const { profile } = useProfile();
  const initialIntro = useInitialIntro();
  const [introPhase, setIntroPhase] = useState(initialIntro ? 'entering' : 'done');
  const [contentVisible, setContentVisible] = useState(!initialIntro);
  const [galleryEnabled, setGalleryEnabled] = useState(!initialIntro);
  const pageRef = useRef(null);

  const galleryArtworks = useMemo(() => {
    const availableArtworks = remoteArtworks.length > 0 ? remoteArtworks : defaultArtworks;
    const selectedIds = new Set(getHomeArtworkIds(profile, availableArtworks));
    return getGalleryArtworks(
      availableArtworks.filter(artwork => selectedIds.has(String(artwork.id))),
      defaultArtworks,
      false
    );
  }, [remoteArtworks, profile]);

  useEffect(() => {
    if (!initialIntro) {
      setIntroPhase('done');
      setContentVisible(true);
      setGalleryEnabled(true);
      return undefined;
    }
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const timers = [];
    const showImmediately = () => {
      if (!query.matches) return;
      timers.forEach(window.clearTimeout);
      setIntroPhase('done');
      setContentVisible(true);
      setGalleryEnabled(true);
    };
    if (query.matches) showImmediately();
    else {
      const exitAt = INTRO_DURATION + 350;
      const revealAt = exitAt + INTRO_DURATION;
      timers.push(window.setTimeout(() => setIntroPhase('exiting'), exitAt));
      timers.push(window.setTimeout(() => {
        setIntroPhase('done');
        setContentVisible(true);
      }, revealAt));
      timers.push(window.setTimeout(() => setGalleryEnabled(true), revealAt + REVEAL_MS));
    }
    query.addEventListener?.('change', showImmediately);
    return () => {
      timers.forEach(window.clearTimeout);
      query.removeEventListener?.('change', showImmediately);
    };
  }, []);

  return (
    <PrototypePage ref={pageRef} data-page-transition-source>
      <ContentLayer $visible={contentVisible} aria-hidden={!contentVisible}>
        <SiteHeader />
        <ExhibitionInfo aria-label="전시 정보">
          {(profile.homeExhibitionTitle ?? DEFAULT_HOME_SETTINGS.exhibitionTitle) && (
            <h2>{profile.homeExhibitionTitle ?? DEFAULT_HOME_SETTINGS.exhibitionTitle}</h2>
          )}
          {(profile.homeGalleryName ?? DEFAULT_HOME_SETTINGS.galleryName) && (
            <p>{profile.homeGalleryName ?? DEFAULT_HOME_SETTINGS.galleryName}</p>
          )}
          {(profile.homeExhibitionDate ?? DEFAULT_HOME_SETTINGS.exhibitionDate) && (
            <p>{profile.homeExhibitionDate ?? DEFAULT_HOME_SETTINGS.exhibitionDate}</p>
          )}
        </ExhibitionInfo>
        <GalleryEntrance $visible={contentVisible}>
        {isLoading ? <div style={{ display: 'flex', gap: 20, alignItems: 'center', justifyContent: 'center', height: '100%' }}>{[0, 1, 2].map(index => <ImageSkeleton key={index} aria-label="작품 로딩 중" style={{ width: 'min(30vw, 400px)', height: 'min(44.8vh, 448px)' }} />)}</div> : <ContinuousArtworkGallery
          onArtworkOpen={artwork => {
            const to = `/works/${encodeURIComponent(artwork.id)}`;
            const state = { from: '/' };
            if (detailGo) detailGo(to, artwork.title, state, [artwork.size, artwork.material, artwork.year].filter(Boolean).join(', '));
            else navigate(to, { state });
          }}
          showArtworkInfo={false}
          autoFlow
          autoFlowSpeed={64}
          autoFlowIdleMs={3000}
          pointerAreaRef={pageRef}
          artworks={galleryArtworks}
          enabled={galleryEnabled}
          sensitivity={indexPrototypeConfig.scrollSensitivity}
          damping={indexPrototypeConfig.scrollDamping}
          centerZoneRatio={indexPrototypeConfig.centerZoneRatio}
          centerHysteresisPx={indexPrototypeConfig.centerHysteresisPx}
          hoverScale={indexPrototypeConfig.artworkHoverScale}
          hoverDurationMs={indexPrototypeConfig.artworkHoverDurationMs}
          pointerMoveX={indexPrototypeConfig.pointerMoveX}
          pointerMoveY={indexPrototypeConfig.pointerMoveY}
        />}
        </GalleryEntrance>
        <HomeCopyright>Copyright 2025, Limyunmook All pictures cannot be copied without permission.</HomeCopyright>
      </ContentLayer>
      {introPhase !== 'done' && (
        <IntroLayer>
          <h1 aria-label="STUDIO LIM YUN MOOK">
            {INTRO_LINES.map((line, lineIndex) => (
              <div key={line} aria-hidden="true">
                {Array.from(line).map((letter, index) => (
                  <LetterMask key={index}>
                    <IntroLetter key={introPhase} $exiting={introPhase === 'exiting'}
                      $index={index + (lineIndex === 0 ? 0 : INTRO_LINES[0].length)}>
                      {letter}
                    </IntroLetter>
                  </LetterMask>
                ))}
              </div>
            ))}
          </h1>
        </IntroLayer>
      )}
    </PrototypePage>
  );
};

export default IndexPrototype;
