import React, { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import styled from 'styled-components';
import { useLanguage } from '../contexts/LanguageContext';
import { useProfile } from '../contexts/ProfileContext';
import { useArtworks } from '../contexts/ArtworkContext';
import defaultArtworks from '../data/artworks';
import { getGalleryArtworks } from '../utils/indexPrototypeLogic';
import { DEFAULT_AWARD_ITEMS } from '../utils/profileDefaults';
import { usePageTransitionActive } from '../components/PageTransition';
import { t } from '../utils/translations';
import './IndexPrototype.css';
import SkeletonImage, { ImageSkeleton } from '../components/SkeletonImage';

const AboutContainer = styled.div`
  min-height: calc(100vh - 112px);
  background: white;
  font-family: 'Pretendard Variable', Pretendard, sans-serif;
  padding: 4rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  [data-about-reveal] {
    opacity: 0;
    transform: translateY(26px);
    transition: opacity 760ms ease, transform 760ms cubic-bezier(.2,.7,.2,1);
  }
  [data-about-reveal][data-revealed='true'] { opacity: 1; transform: translateY(0); }
  @media (prefers-reduced-motion: reduce) {
    [data-about-reveal] { opacity: 1; transform: none; transition: none; }
  }
  
  @media (max-width: 768px) {
    min-height: calc(100vh - 130px);
    padding: 2rem 1.5rem;
  }
`;

const ContentArea = styled.div`
  max-width: 1240px;
  width: 100%;
  display: flex;
  flex-direction: column;
`;


const ContentWrapper = styled.div`
  width: 100%;
  
  @media (max-width: 768px) {
    padding: 0;
  }
`;
const Introduction = styled.section`
  width: min(56vw, 720px);
  margin: 0 auto 6rem;
  @media (max-width: 768px) { width: 100%; margin-bottom: 4rem; }
`;
const FeaturedArtwork = styled.figure`
  margin: 0 0 46px;
  img { display: block; width: auto; max-width: 100%; max-height: min(65vh, 560px); margin: 0 auto; object-fit: contain; }
  figcaption { margin-top: 12px; text-align: right; }
  strong { display: block; font-size: 13px; font-weight: 500; }
  span { display: block; margin-top: 3px; font-size: 12px; font-weight: 300; color: #505050; }
  @media (max-width: 768px) { margin-bottom: 36px; }
`;
const IntroductionTitle = styled.h1`
  margin: 0 0 20px;
  color: #1a1a1a;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.45;
`;

const Biography = styled.div`
  line-height: 1.7;
  font-size: 1rem;
  color: #505050;
  margin-bottom: 0;
  text-align: justify;
  white-space: pre-line;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin-bottom: 4rem;
  }
`;

const BiographyParagraph = styled.p`
  margin: 0;
  & + & { margin-top: 1em; }
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 2.5rem;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
  }
`;

const ExhibitionSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const ExhibitionYearGroup = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 2rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ExhibitionYear = styled.div`
  font-weight: light;
  color: #b8b8b8;
  font-size: 1rem;
  min-width: 4rem;
  margin-right: 2rem;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
    min-width: 3rem;
    margin-right: 1.5rem;
  }
`;

const ExhibitionListContainer = styled.div`
  h3 {
    font-size: 1rem;
    font-weight: 500;
    color: #333;
    margin-bottom: 1rem;
  }
`;

const ExhibitionContent = styled.div`
  flex: 1;
  
  .exhibition-item {
    margin-bottom: 0.75rem;
    font-size: 1rem;
    color: #505050;
    line-height: 1.5;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    @media (max-width: 768px) {
      font-size: 0.85rem;
      line-height: 1.4;
    }
  }
`;

const SectionDivider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #e0e0e0;
  margin: 4rem 0;
`;

const SectionGroup = styled.div`
  margin-bottom: 0;
  
  &:last-child {
    margin-bottom: 8rem;
  }
`;

const ExhibitionItem = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  
  .year {
    min-width: 4rem;
    color: #b8b8b8;
    font-size: 1rem;
    font-weight: 300;
    margin-right: 2rem;
  }
  
  .content {
    flex: 1;
    color: #505050;
    font-size: 1rem;
    line-height: 1.5;
  }
  
  &:last-child {
    margin-bottom: 0;
  }
  
  @media (max-width: 768px) {
    .year {
      font-size: 0.85rem;
      min-width: 3rem;
      margin-right: 1.5rem;
    }
    
    .content {
      font-size: 0.85rem;
      line-height: 1.4;
    }
  }
`;

function useAboutReveal(containerRef, language, exhibitions, artworkId, introductionTitle, biography, paused) {
  const previousLanguage = useRef(language);
  useLayoutEffect(() => {
    if (previousLanguage.current === language) return undefined;
    previousLanguage.current = language;
    const container = containerRef.current;
    if (!container) return undefined;
    const scroller = container.closest('main');
    const bounds = scroller?.getBoundingClientRect();
    const header = document.querySelector('[data-site-header]')?.getBoundingClientRect();
    const top = Math.max(bounds?.top || 0, header?.bottom || 0);
    const bottom = Math.min(bounds?.bottom || window.innerHeight, window.innerHeight);
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const animations = [];
    let visibleIndex = 0;
    container.querySelectorAll('[data-about-reveal]').forEach(element => {
      const rect = element.getBoundingClientRect();
      // Translated sections inserted above the viewport have already been passed.
      if (rect.bottom <= top) element.dataset.revealed = 'true';
      if (rect.bottom <= top || rect.top >= bottom || rect.height === 0) return;
      element.dataset.revealed = 'true';
      if (!reduced && element.animate) {
        animations.push(element.animate([
          { opacity: 0, transform: 'translateY(26px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 760, delay: visibleIndex++ * 120, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards' }));
      }
    });
    return () => animations.forEach(animation => animation.cancel());
  }, [containerRef, language]);
  useEffect(() => {
    if (paused) return undefined;
    const container = containerRef.current;
    if (!container) return undefined;
    const elements = [...container.querySelectorAll('[data-about-reveal]')]
      .filter(element => element.dataset.revealed !== 'true');
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || !window.IntersectionObserver) {
      elements.forEach(element => { element.dataset.revealed = 'true'; });
      return undefined;
    }
    const queue = [];
    let timer = null;
    const revealNext = () => {
      const element = queue.shift();
      if (!element) { timer = null; return; }
      element.dataset.revealed = 'true';
      timer = window.setTimeout(revealNext, 120);
    };
    const observer = new window.IntersectionObserver(entries => {
      entries.filter(entry => entry.isIntersecting)
        .map(entry => entry.target)
        .sort((left, right) => {
          const a = left.getBoundingClientRect();
          const b = right.getBoundingClientRect();
          return a.top - b.top || a.left - b.left;
        })
        .forEach(element => { observer.unobserve(element); queue.push(element); });
      if (timer === null && queue.length) revealNext();
    }, { threshold: .08, rootMargin: '0px 0px -5% 0px' });
    elements.forEach(element => observer.observe(element));
    return () => { observer.disconnect(); if (timer !== null) window.clearTimeout(timer); };
  }, [containerRef, language, exhibitions, artworkId, introductionTitle, biography, paused]);
}

const About = () => {
  const { language, languageTransitioning } = useLanguage();
  const { profile, isLoading: profileLoading } = useProfile();
  const pageTransitioning = usePageTransitionActive();
  const { artworks: remoteArtworks, isLoading: artworksLoading } = useArtworks();
  const containerRef = useRef(null);
  const artworks = useMemo(() => getGalleryArtworks(remoteArtworks, defaultArtworks), [remoteArtworks]);
  const isLoading = Boolean(profileLoading || artworksLoading);
  const featuredArtwork = isLoading ? null : (artworks.find(artwork => artwork.id === String(profile.aboutArtworkId)) || artworks[0]);
  const introductionTitle = language === 'ko'
    ? profile.biographyTitle
    : (profile.biographyTitle_en || profile.biographyTitle);
  const biography = language === 'ko' ? profile.biography : (profile.biography_en || t('about.biography', language));
  const biographyParagraphs = (biography || '').split(/(?:\r?\n[\t ]*)+/).filter(paragraph => paragraph.trim());
  useAboutReveal(containerRef, language, profile.exhibitions, featuredArtwork?.id, introductionTitle, biography, pageTransitioning || languageTransitioning || isLoading);
  
  // 언어에 따라 전시 데이터 선택 및 연도별 그룹화
  const getExhibitionData = () => {
    if (language === 'ko') {
      // 한국어일 때는 관리자가 입력한 실제 데이터 사용
      const soloData = profile.exhibitions
        .filter(ex => ex.type === 'solo')
        .sort((a, b) => parseInt(b.year) - parseInt(a.year));
      const groupData = profile.exhibitions
        .filter(ex => ex.type === 'group')
        .sort((a, b) => parseInt(b.year) - parseInt(a.year));
      
      return {
        solo: groupByYear(soloData),
        group: groupByYear(groupData)
      };
    } else {
      // 영어일 때는 번역된 정적 데이터 사용
      const soloData = t('about.soloExhibitionItems', language) || [];
      const groupData = t('about.groupExhibitionItems', language) || [];
      
      return {
        solo: groupByYear(soloData),
        group: groupByYear(groupData)
      };
    }
  };
  
  // 연도별로 전시를 그룹화하는 함수
  const groupByYear = (exhibitions) => {
    const grouped = {};
    exhibitions.forEach(exhibition => {
      const year = exhibition.year;
      if (!grouped[year]) {
        grouped[year] = [];
      }
      grouped[year].push(exhibition);
    });
    
    // 연도순으로 정렬된 배열로 변환
    return Object.keys(grouped)
      .sort((a, b) => parseInt(b) - parseInt(a))
      .map(year => ({
        year,
        exhibitions: grouped[year]
      }));
  };
  
  const exhibitionData = getExhibitionData();
  const soloExhibitions = exhibitionData.solo;
  const groupExhibitions = exhibitionData.group;
  const awardItems = profile.awardItems || DEFAULT_AWARD_ITEMS;
  
  return (
    <AboutContainer ref={containerRef} aria-busy={isLoading}>
      <ContentArea>
        {isLoading && <ImageSkeleton aria-label="대표 작품 로딩 중" style={{ width: 'min(56vw, 720px)', maxWidth: '100%', height: 'min(65vh, 560px)', margin: '0 auto 46px' }} />}
        <ContentWrapper style={{ visibility: isLoading ? 'hidden' : undefined }}>
          <Introduction>
            {featuredArtwork && <FeaturedArtwork data-about-reveal>
              <SkeletonImage src={featuredArtwork.image} alt={featuredArtwork.title} skeletonStyle={{ display: 'grid', width: 'fit-content', margin: '0 auto' }} />
              <figcaption>
                <strong>{featuredArtwork.title}</strong>
                <span>{[featuredArtwork.size, featuredArtwork.material, featuredArtwork.year].filter(Boolean).join(', ')}</span>
              </figcaption>
            </FeaturedArtwork>}
            {introductionTitle && <IntroductionTitle data-about-reveal>{introductionTitle}</IntroductionTitle>}
            <Biography>
              {biographyParagraphs.map((paragraph, index) => (
                <BiographyParagraph key={index} data-about-reveal>{paragraph}</BiographyParagraph>
              ))}
            </Biography>
          </Introduction>
          
          <SectionGroup>
            <SectionTitle data-about-reveal>{t('about.education', language)}</SectionTitle>
            {t('about.educationItems', language).map((item, index) => (
              <ExhibitionItem key={index} data-about-reveal>
                <span className="year">{item.year}</span>
                <span className="content">{item.content}</span>
              </ExhibitionItem>
            ))}
          </SectionGroup>
          
          <SectionDivider data-about-reveal />
          
          <SectionGroup>
            <ExhibitionSection>
              <ExhibitionListContainer>
                <SectionTitle data-about-reveal>{t('about.soloExhibitions', language)}</SectionTitle>
                {soloExhibitions.length > 0 ? (
                  soloExhibitions.map((yearGroup, yearIndex) => (
                    <ExhibitionYearGroup key={yearIndex} data-about-reveal>
                      <ExhibitionYear>{yearGroup.year}</ExhibitionYear>
                      <ExhibitionContent>
                        {yearGroup.exhibitions.map((exhibition, exhibitionIndex) => (
                          <div key={exhibitionIndex} className="exhibition-item">
                            {language === 'ko' ? exhibition.name : (exhibition.name_en || exhibition.content)}
                          </div>
                        ))}
                      </ExhibitionContent>
                    </ExhibitionYearGroup>
                  ))
                ) : (
                  <div data-about-reveal style={{ color: '#666', fontStyle: 'italic' }}>
                    {language === 'ko' ? '개인전 기록이 없습니다.' : 'No solo exhibitions recorded.'}
                  </div>
                )}
              </ExhibitionListContainer>
              
              <ExhibitionListContainer>
                <SectionTitle data-about-reveal>{t('about.groupExhibitions', language)}</SectionTitle>
                {groupExhibitions.length > 0 ? (
                  groupExhibitions.map((yearGroup, yearIndex) => (
                    <ExhibitionYearGroup key={yearIndex} data-about-reveal>
                      <ExhibitionYear>{yearGroup.year}</ExhibitionYear>
                      <ExhibitionContent>
                        {yearGroup.exhibitions.map((exhibition, exhibitionIndex) => (
                          <div 
                            key={exhibitionIndex} 
                            className="exhibition-item"
                            dangerouslySetInnerHTML={{ 
                              __html: language === 'ko' ? exhibition.name : (exhibition.name_en || exhibition.content)
                            }}
                          />
                        ))}
                      </ExhibitionContent>
                    </ExhibitionYearGroup>
                  ))
                ) : (
                  <div data-about-reveal style={{ color: '#666', fontStyle: 'italic' }}>
                    {language === 'ko' ? '그룹전 기록이 없습니다.' : 'No group exhibitions recorded.'}
                  </div>
                )}
              </ExhibitionListContainer>
            </ExhibitionSection>
          </SectionGroup>
          
          <SectionDivider data-about-reveal />
          
          <SectionGroup>
            <SectionTitle data-about-reveal>{t('about.awards', language)}</SectionTitle>
            {awardItems.map((item, index) => (
              <ExhibitionItem key={index} data-about-reveal>
                <span className="year">{item.year}</span>
                <span className="content">
                  {language === 'ko' ? item.content : (item.content_en || item.content)}
                </span>
              </ExhibitionItem>
            ))}
          </SectionGroup>
        </ContentWrapper>
      </ContentArea>
    </AboutContainer>
  );
};

export default About;
