import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../utils/translations';

const ProfileContext = createContext();

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState({
    biography: '',
    biography_en: '',
    exhibitions: []
  });
  const [isLoading, setIsLoading] = useState(true);

  // 기존 데이터에 영문 필드 추가하는 마이그레이션 함수
  const migrateProfileData = (profileData) => {
    let needsMigration = false;
    const migratedData = { ...profileData };

    // 영문 소개문이 없으면 translations에서 가져오기
    if (!migratedData.biography_en) {
      migratedData.biography_en = translations.en.about.biography;
      needsMigration = true;
    }

    // 전시 목록에 영문명이 없으면 translations에서 가져오기
    if (migratedData.exhibitions) {
      migratedData.exhibitions = migratedData.exhibitions.map(exhibition => {
        if (!exhibition.name_en) {
          needsMigration = true;
          
          // Solo exhibitions 매칭
          if (exhibition.type === 'solo') {
            const matchingSolo = translations.en.about.soloExhibitionItems.find(
              item => item.year === exhibition.year
            );
            return {
              ...exhibition,
              name_en: matchingSolo ? matchingSolo.content : exhibition.name
            };
          }
          
          // Group exhibitions 매칭 - 개별 전시명과 정확히 매칭
          if (exhibition.type === 'group') {
            // 한국어 전시명을 기준으로 영문명 매핑
            const exhibitionMapping = {
              '의미를 갖는 순간, 에브리아트, 서울': 'The Moment of Meaning, EveryArt, Seoul',
              '무늬를 삼킨 문, 윤진약국(소현문 주관), 용인': 'The Door That Swallowed Patterns, Yunjin Pharmacy (curated by So Hyun Moon), Yongin',
              '페리지 윈터쇼, 페리지갤러리, 서울': 'Perigee Winter Show, Perigee Gallery, Seoul',
              '회화 유니버스, 예술의전당 한가람디자인미술관, 서울': 'Painting Universe, Hangaram Design Museum, Seoul Arts Center, Seoul',
              '가위가위바위바위보보, 오픈스페이스배, 부산': 'Rock Paper Scissors Scissors Rock Rock, Open Space BAE, Busan',
              '거의 정보가 없는 전시, 부산현대미술관, 부산': 'Exhibition with Almost No Information, Busan Museum of Contemporary Art, Busan',
              '일상이라는 몸, 쉐마미술관, 청주': 'Daily Life as a Body, Schema Museum, Cheongju',
              '머리 위 파도 가슴 밑 구름, 이목화랑 서울': 'Waves Above Head, Clouds Under Heart, Lee Mok Gallery, Seoul',
              'P는 그림을 걸었다, d/p, 서울': 'P Hung the Painting, d/p, Seoul',
              '사각의 사각, 예술공간 의식주, 서울': 'Rectangle of Rectangle, Art Space UiSikJu, Seoul'
            };
            
            return {
              ...exhibition,
              name_en: exhibitionMapping[exhibition.name] || exhibition.name
            };
          }
          
          return {
            ...exhibition,
            name_en: exhibition.name // 매칭되지 않으면 한국어명 사용
          };
        }
        return exhibition;
      });
    }

    // 마이그레이션이 필요하면 저장
    if (needsMigration) {
      localStorage.setItem('profile', JSON.stringify(migratedData));
    }

    return migratedData;
  };

  useEffect(() => {
    // localStorage에서 프로필 데이터 로드
    const savedProfile = localStorage.getItem('profile');
    if (savedProfile) {
      const profileData = JSON.parse(savedProfile);
      const migratedProfile = migrateProfileData(profileData);
      setProfile(migratedProfile);
    } else {
      // 기본 데이터 설정
      const defaultProfile = {
        biography: `한 신문기자의 칼럼을 읽었다. 그 내용은,중동지역을 여행하던 중 문득 젊은 시절에 감영 깊게 읽은 한 소설이 떠올라 어느 상점에 들러 양탄자를 구매한 일에 대한 감상이었다. 그는 구매한 양탄자를 집으로 가져와바닥에 두는 대신 벽에 걸어 장식했다. 작업을 하면서 한동안 나는 어떤 그림을 그려야 할지 몰라 어려움을 겪었다. 어떤 그림은 쉽게 그려지기도했지만, 어떤 그림은 그렇지 않았다.버려지는 캔버스 천과 물감을 보며 원인이 무엇인지 파악하려고 애썼지만, 그저 막막할 뿐이었다.그러던 중 최근 자신을 깊이 들여다볼 기회가 있었다. 몇 가지 크고 작은 일들이 계기가 되어 상황을 그렇게 만들었다. 무심코 지나친 과거의 기억을 되짚어보고,사진첩을 훑으며 이전과는 다른관점으로,마음에 와닿 는 이미지를 선별해보았다.기자에게 감명을 준 소설도 읽어보았다. 소설에서 양탄자는 주인공이 어느 나이 든 시인에게 인생이 무엇이냐고 물었을 때 대답 대신 받은 선물이었다. 주인공은 여러 인생의 굴레를 경험한 후에 양탄자의 의미를 깨닫는다. 양탄자는 인생의 무목적성을 긍정한다. 직조공이 양탄자를 짜면서 자신의 심미감을 충족시키려는 목적 외 다른 목적을 갖지 않았듯이, 살아가면서 마주하게 되는 온갖 일들에 하나하나 집착하기보다, 나름의 무늬가 완성되어 가고 있음을 인정하면 된다는 것이다. 소설의 내용을 되뇌어 보며, 마음이 한결 편해짐을 느꼈다. 직조공이 양탄자를 짜듯이, 기자가 그것을 바닥에두지 않고 벽에 장식했듯이 나도 캔버스 프레임 없이 천을 벽에 고정하고, 양탄자의 날실을 연상하며 기름기없는 짧은 붓 터치로 천의 표면을 더듬었다. 이러한 작업 방식이 자연스럽게 느껴졌다. 서걱거리는 붓질의느낌에 집중하다 보니 어느새 그림은 나름의 무늬를 띄기 시작했다.`,
        biography_en: `I read a newspaper columnist's article. The content was about his impressions of buying a carpet at a shop while traveling in the Middle East, when a novel he had read deeply in his youth came to mind. When he brought the purchased carpet home, instead of placing it on the floor, he hung it on the wall as decoration. While working, for a while I struggled with not knowing what kind of picture to draw. Some paintings were easily drawn, but others were not. Looking at discarded canvas cloth and paint, I tried to figure out what the cause was, but I was just frustrated. Then recently, I had an opportunity to look deeply into myself. Several large and small events created this situation. I reflected on past memories that I had carelessly passed by, and while flipping through photo albums, I selected images that touched my heart from a different perspective than before. I also read the novel that impressed the journalist. In the novel, the carpet was a gift the protagonist received instead of an answer when he asked an aged poet what life was. The protagonist realizes the meaning of the carpet after experiencing various life struggles. The carpet affirms life's purposelessness. Just as the weaver had no purpose other than to satisfy his aesthetic sense while weaving the carpet, rather than obsessing over each of the various things encountered in life, one should acknowledge that one's own pattern is being completed. Reflecting on the novel's content, I felt my heart become much more at ease. Like a weaver weaving a carpet, like the journalist who decorated it on the wall instead of placing it on the floor, I too fixed cloth to the wall without a canvas frame, and reminiscing about the warp threads of a carpet, I felt the surface of the cloth with short brush strokes without oil. This way of working felt natural. As I concentrated on the feeling of the scraping brushstrokes, before I knew it, the painting began to take on its own pattern.`,
        exhibitions: [
          { id: 1, type: 'solo', year: '2024', name: '중요한 것은 마지막에 쓰여있다, 갤러리인, 서울', name_en: 'The Important Thing is Written at the End, Gallery In, Seoul' },
          { id: 2, type: 'solo', year: '2023', name: '양탄자 무늬, 청주미술창작스튜디오, 청주', name_en: 'Carpet Pattern, Cheongju Art Studio, Cheongju' },
          { id: 3, type: 'solo', year: '2019', name: 'Curtaincall, 갤러리 그리다, 서울', name_en: 'Curtaincall, Gallery Grida, Seoul' },
          { id: 4, type: 'solo', year: '2018', name: '시간의 흐름 속에서, 대안공간 눈, 수원', name_en: 'In the Flow of Time, Alternative Space Eye, Suwon' },
          { id: 5, type: 'group', year: '2024', name: '의미를 갖는 순간, 에브리아트, 서울', name_en: 'The Moment of Meaning, EveryArt, Seoul' },
          { id: 6, type: 'group', year: '2024', name: '무늬를 삼킨 문, 윤진약국(소현문 주관), 용인', name_en: 'Door that Swallowed the Pattern, Yunjin Pharmacy (curated by So Hyeon-mun), Yongin' },
          { id: 7, type: 'group', year: '2023', name: '페리지 윈터쇼, 페리지갤러리, 서울', name_en: 'Perigee Winter Show, Perigee Gallery, Seoul' },
          { id: 8, type: 'group', year: '2023', name: '회화 유니버스, 예술의전당 한가람디자인미술관, 서울', name_en: 'Painting Universe, Hangaram Design Museum, Seoul Arts Center, Seoul' },
          { id: 9, type: 'group', year: '2022', name: '가위가위바위바위보보, 오픈스페이스배, 부산', name_en: 'Rock Paper Scissors, Open Space Bae, Busan' },
          { id: 10, type: 'group', year: '2022', name: '거의 정보가 없는 전시, 부산현대미술관, 부산', name_en: 'Exhibition with Almost No Information, Museum of Contemporary Art Busan, Busan' },
          { id: 11, type: 'group', year: '2022', name: '일상이라는 몸, 쉐마미술관, 청주', name_en: 'The Body Called Daily Life, Cheongju Museum of Art, Cheongju' },
          { id: 12, type: 'group', year: '2021', name: '머리 위 파도 가슴 밑 구름, 이목화랑 서울', name_en: 'Waves Above the Head, Clouds Below the Chest, Leemok Gallery, Seoul' },
          { id: 13, type: 'group', year: '2021', name: 'P는 그림을 걸었다, d/p, 서울', name_en: 'P Hung a Painting, d/p, Seoul' },
          { id: 14, type: 'group', year: '2020', name: '사각의 사각, 예술공간 의식주, 서울', name_en: 'Square of Squares, Art Space Euisikju, Seoul' }
        ]
      };
      setProfile(defaultProfile);
      localStorage.setItem('profile', JSON.stringify(defaultProfile));
    }
    setIsLoading(false);
  }, []);

  const saveProfile = (newProfile) => {
    setProfile(newProfile);
    localStorage.setItem('profile', JSON.stringify(newProfile));
  };

  const updateBiography = (newBiography, newBiographyEn) => {
    const updatedProfile = {
      ...profile,
      biography: newBiography,
      biography_en: newBiographyEn || profile.biography_en
    };
    saveProfile(updatedProfile);
  };

  const addExhibition = (exhibition) => {
    const newExhibition = {
      ...exhibition,
      id: Date.now()
    };
    const updatedProfile = {
      ...profile,
      exhibitions: [...profile.exhibitions, newExhibition]
    };
    saveProfile(updatedProfile);
  };

  const updateExhibition = (id, updatedExhibition) => {
    const updatedProfile = {
      ...profile,
      exhibitions: profile.exhibitions.map(exhibition =>
        exhibition.id === id ? { ...exhibition, ...updatedExhibition } : exhibition
      )
    };
    saveProfile(updatedProfile);
  };

  const deleteExhibition = (id) => {
    const updatedProfile = {
      ...profile,
      exhibitions: profile.exhibitions.filter(exhibition => exhibition.id !== id)
    };
    saveProfile(updatedProfile);
  };

  const getExhibitionById = (id) => {
    return profile.exhibitions.find(exhibition => exhibition.id === parseInt(id));
  };

  return (
    <ProfileContext.Provider value={{
      profile,
      isLoading,
      updateBiography,
      addExhibition,
      updateExhibition,
      deleteExhibition,
      getExhibitionById
    }}>
      {children}
    </ProfileContext.Provider>
  );
};