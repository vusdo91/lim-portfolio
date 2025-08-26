// 관리자 페이지에서 변경된 데이터를 번역 파일에도 반영하는 유틸리티

export const syncProfileToTranslations = (profile, translations) => {
  // 소개문은 한국어만 동적으로 업데이트 (영어는 정적 번역 유지)
  translations.ko.about.biography = profile.biography;
  
  // 전시 목록도 필요시 동기화 가능
  const soloExhibitions = profile.exhibitions
    .filter(ex => ex.type === 'solo')
    .sort((a, b) => parseInt(b.year) - parseInt(a.year));
    
  const groupExhibitions = profile.exhibitions
    .filter(ex => ex.type === 'group')
    .sort((a, b) => parseInt(b.year) - parseInt(a.year));

  // 번역 데이터 업데이트 (필요시)
  translations.ko.about.soloExhibitionItems = soloExhibitions.map(ex => ({
    year: ex.year,
    content: ex.name
  }));
  
  translations.ko.about.groupExhibitionItems = groupExhibitions.map(ex => ({
    year: ex.year,
    content: ex.name
  }));
  
  return translations;
};

export const getImageWithFallback = (imageSrc, fallbackSrc = '/assets/images/no-image.jpg') => {
  return imageSrc || fallbackSrc;
};