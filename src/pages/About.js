import React from 'react';
import styled from 'styled-components';
import { useLanguage } from '../contexts/LanguageContext';
import { useProfile } from '../contexts/ProfileContext';
import { t } from '../utils/translations';

const AboutContainer = styled.div`
  min-height: calc(100vh - 112px);
  background: white;
  padding: 4rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  @media (max-width: 768px) {
    min-height: calc(100vh - 130px);
    padding: 2rem 2.5rem;
  }
`;

const ContentArea = styled.div`
  max-width: 1240px;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const TitleSection = styled.div`
  margin-bottom: 3rem;
  
  h1 {
    font-size: 4rem;
    line-height: 3.2rem;
    color: #333;
    margin: 0 0 0.5rem 0;
    letter-spacing: 0.1rem;
    
    &.name-title {
      color: #32430D;
    }
    
    @media (max-width: 768px) {
      font-size: 3rem;
      margin: 0 0 -0.5rem 0;
    }
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
  
  @media (max-width: 768px) {
    padding: 0;
  }
`;

const Biography = styled.div`
  line-height: 1.7;
  font-size: 1rem;
  color: #505050;
  margin-bottom: 6rem;
  text-align: justify;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1E1E1E;
  margin-bottom: 2.5rem;
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

const ExhibitionList = styled.div`
  h3 {
    font-size: 1rem;
    font-weight: 500;
    color: #333;
    margin-bottom: 1rem;
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
  color: #C8C8C8;
  font-size: 1rem;
  min-width: 4rem;
  margin-right: 2rem;
  flex-shrink: 0;
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
  }
`;

const SectionDivider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #D9D9D9;
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
    color: #C8C8C8;
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
`;

const About = () => {
  const { language } = useLanguage();
  const { profile } = useProfile();
  
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
  
  return (
    <AboutContainer>
      <ContentArea>
        <TitleSection>
          <h1 className="coolvetica">{t('about.title', language)}</h1>
          <h1 className="name-title coolvetica">{t('about.name', language)}</h1>
        </TitleSection>
        
        <ContentWrapper>
          <Biography className="noto-sans">
            {language === 'ko' ? profile.biography : (profile.biography_en || t('about.biography', language))}
          </Biography>
          
          <SectionGroup>
            <SectionTitle>{t('about.education', language)}</SectionTitle>
            {t('about.educationItems', language).map((item, index) => (
              <ExhibitionItem key={index}>
                <span className="year">{item.year}</span>
                <span className="content">{item.content}</span>
              </ExhibitionItem>
            ))}
          </SectionGroup>
          
          <SectionDivider />
          
          <SectionGroup>
            <ExhibitionSection>
              <ExhibitionListContainer>
                <SectionTitle>{t('about.soloExhibitions', language)}</SectionTitle>
                {soloExhibitions.length > 0 ? (
                  soloExhibitions.map((yearGroup, yearIndex) => (
                    <ExhibitionYearGroup key={yearIndex}>
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
                  <div style={{ color: '#666', fontStyle: 'italic' }}>
                    {language === 'ko' ? '개인전 기록이 없습니다.' : 'No solo exhibitions recorded.'}
                  </div>
                )}
              </ExhibitionListContainer>
              
              <ExhibitionListContainer>
                <SectionTitle>{t('about.groupExhibitions', language)}</SectionTitle>
                {groupExhibitions.length > 0 ? (
                  groupExhibitions.map((yearGroup, yearIndex) => (
                    <ExhibitionYearGroup key={yearIndex}>
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
                  <div style={{ color: '#666', fontStyle: 'italic' }}>
                    {language === 'ko' ? '그룹전 기록이 없습니다.' : 'No group exhibitions recorded.'}
                  </div>
                )}
              </ExhibitionListContainer>
            </ExhibitionSection>
          </SectionGroup>
          
          <SectionDivider />
          
          <SectionGroup>
            <SectionTitle>{t('about.awards', language)}</SectionTitle>
            {t('about.awardItems', language).map((item, index) => (
              <ExhibitionItem key={index}>
                <span className="year">{item.year}</span>
                <span className="content">{item.content}</span>
              </ExhibitionItem>
            ))}
          </SectionGroup>
        </ContentWrapper>
      </ContentArea>
    </AboutContainer>
  );
};

export default About;