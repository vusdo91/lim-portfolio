# Process Log

## 2026-10-02 - Add artwork management table view

- Moved the add action beside the year filters and placed card/table view controls immediately to its left; the full registered artwork count appears above the filters.
- Added a text-only table view with an image preview that follows the hovered row's cursor position.
- Verification: targeted Artwork Management tests passed (4 tests); full test suite passed (20 suites, 76 tests); production build succeeded with existing ESLint and Browserslist warnings; `git diff --check` passed.

## 2026-10-02 - Separate home artwork list editing

- Added spacing between the home exhibition information and home artwork sections.
- Changed the home management artwork section to show only registered artworks selected for the home page, and replaced inline selection/save controls with an edit navigation button.
- Added a separate home artwork editor with a year filter and unsaved-change confirmation. Saving artwork IDs now updates only the home artwork field instead of writing exhibition information.
- Verification: full test suite passed (20 suites, 73 tests); production build succeeded with existing ESLint and Browserslist warnings; `git diff --check` passed.

## 2026-10-02 - Separate selection and home exhibition editors

- Changed profile selections to a read-only table with separate add/edit pages; deletion remains an immediate confirmed action.
- Changed Home exhibition details to a read-only summary with a separate edit page. Saving those details no longer writes or overwrites the home artwork selection.
- Moved the home artwork save action into the artwork section header at the top right.
- Verification: full test suite passed (19 suites, 72 tests); production build succeeded with existing warnings in ProfileContext, IndexPrototype, and ArtworkForm; `git diff --check` passed.

## 2026-10-02 - Compact selection editor inputs

- Replaced selection content textareas with single-line inputs and reduced their height to 36px.
- Reused the exhibition list's red X icon button for selection removal.
- Verification: Profile Management tests passed (2 tests).

## 2026-10-02 - Fix page headers and manage profile selections

- Kept public headers fixed and made the shared admin page header fixed with a layout spacer.
- Added all/solo/group filters to Profile Management exhibitions.
- Added editable, addable, removable, explicitly saved selection records with the three existing About entries as legacy/default data; About now reads managed Korean/English records.
- Verification: all 70 tests passed and the production build succeeded; pre-existing lint and Browserslist warnings remain.

## 2026-10-02 - Warn before leaving unsaved admin edits

- Added unsaved-change confirmation and browser unload protection to artwork, exhibition, biography, and home settings forms.
- Wired each form's admin back/cancel controls through the shared confirmation. Successful saves clear the warning; immediate-save management actions remain unchanged.
- Added Home Management regression tests for cancelling navigation and leaving after a successful save.
- Verification: all 67 tests passed and the production build succeeded; existing unrelated lint and Browserslist warnings remain.

## 2026-10-02 - Add year filters to admin artwork lists

- Reused the Works-style year chips in Artwork Management and the Home Management artwork selector.
- Year filtering only narrows visible rows; Home artwork selections remain unchanged when switching years.
- Added regression tests for filtering both lists and preserving selections.
- Verification: 13 targeted tests passed and the production build succeeded; pre-existing lint and Browserslist warnings remain.

## 2026-10-02 - Add admin home management

- Added admin home settings for the exhibition title, date text, venue, and an unlimited artwork selection.
- Kept the existing Home text as defaults and initialized an unset artwork selection to the ten newest registered artworks. Saved settings live on `profile/main`; an empty saved selection remains empty.
- Home now renders these saved settings and selected artworks. Added tests for defaults, unlimited selection, and optional blank text fields.
- Verification: all 61 tests passed and the production build succeeded; existing unrelated lint and outdated Browserslist warnings remain.

## 2026-10-02 - Center admin page titles and add back navigation

- Replaced duplicated admin headers with a shared header that keeps titles centered independently of side controls.
- Dashboard is the admin home without a back button. Other pages show a left back button to the dashboard or their existing parent list.
- Verification: production build passed; all 57 tests passed. Build reported existing lint/dependency warnings.

## 2026-10-02 - Remove artwork skeletons from Works and detail

- Confirmed: remove Works/detail artwork skeletons because they interrupt the animation flow.
- Restore native images and whole-card reveal opacity in Works, and native slide images in detail. Remove their provider-loading skeletons while retaining the initial data wait.
- Home, About, and shared header skeletons remain.
- Verification: 10 Works/detail tests passed.
- Production build passed with existing unrelated warnings.

## 2026-10-02 - Public-site image skeletons

- Confirmed: show skeletons wherever public-site images need loading. Scope: Home artwork gallery, Works cards, detail images, About featured artwork, and shared header logo.
- Added shared SkeletonImage with load/decode readiness, cached-image handling, source-change reset, pending reveal support, and static failure feedback. Reduced motion disables shimmer; defaults use a pale gray 1.6s shimmer and provisional 4:3 ratio when unknown.
- Added provider-loading placeholders to Home/Works/detail and About. Works keeps its viewport/load/stagger rules while displaying skeletons during that wait. Home preserves its existing card/image DOM hierarchy for pointer and scroll behavior.
- Existing 54 tests passed; 3 new image-loading tests passed, covering decode completion/source changes, failure, and gallery reveal gating.
- Final full verification: 11 suites / 57 tests passed; production build passed with existing unrelated warnings. Interactive visual review remains pending.

## 2026-10-02 - About refresh artwork flash

- Confirmed bug: direct About refresh briefly showed a fallback/first artwork before the saved featured artwork.
- Cause: featured-artwork selection ran with the initial empty profile and artwork collection, without checking either provider's loading state.
- Wait for both providers before choosing/rendering an image or starting reveal observation; keep content hidden during this initial wait. Retain the first-artwork default after loading when no valid selection exists.
- Verification: 5 About tests passed, including both profile-first and artwork-first completion orders with no image rendered before both are ready.
- Production build passed with existing unrelated warnings.

## 2026-10-02 - Restrict language reveal to the current viewport

- User clarified: animate only currently visible elements; preserve reveal completion for offscreen elements already visited.
- Removed whole-content exit and global reveal reset. Retain biography paragraph nodes across language changes and animate visible elements directly using the existing 760ms/120ms entrance defaults, accounting for the scroll viewport and fixed header.
- Previously revealed offscreen nodes retain their marker. Newly inserted translated nodes above the viewport are treated as passed; unseen nodes below still use normal scroll reveal. Reduced motion skips animation.
- Verification: 4 About/header tests passed, including viewport-only animation, retained offscreen paragraph nodes/markers, and unseen lower content; build passed with existing unrelated warnings. Browser visual review remains pending.

## 2026-10-02 - Animated language switching

- Confirmed: animate language changes from the header using the existing entrance/reveal behavior.
- Language context waits 220ms before changing language and ignores repeated input while pending. About fades/rises out, resets reveal markers before painting the translated content, and restarts viewport-based reveals without remounting the scroll container.
- Defaults: 220ms exit, existing 760ms entrance/120ms stagger. Reduced-motion changes immediately. Other public pages currently have no language-dependent body content.
- Verification: 4 About/header tests passed, covering delayed language changes and reveal reset; production build passed with existing unrelated warnings. Visual browser review remains pending.

## 2026-10-02 - Toast fade-out and Instagram new window

- Confirmed: keep toast text and box dimensions intact during fade-out by separating visibility from the message. Existing 3-second display and 180ms fade defaults remain.
- Instagram opens in a new browsing context using target="_blank" and rel="noopener noreferrer".
- Verification: Contact tests passed (2), including retained toast text after dismissal and Instagram target/rel. Production build passed with existing unrelated warnings.

## 2026-10-02 - Email copy toast

- Confirmed: display a toast after successful clipboard copy; wording chosen as “메일주소가 복사되었습니다.”.
- Defaults: bottom-center green toast, 3-second duration, 180ms fade, reduced-motion support. Repeated copy results restart dismissal; unmount clears the timer. Copy failures use the same toast with a failure message.
- Verification: both Contact tests passed, including dismissal, repeated-click timer reset, failure feedback, and timer cleanup. Production build passed with existing unrelated warnings.

## 2026-10-02 - Contact greeting and clipboard action

- Confirmed: replace the signature with “Always happy to connect.” in Pretendard 16px, weight 500, keeping the centered placement and existing spacing.
- Replace mailto with a native button that copies vusdo91@gmail.com. Email tooltip: “메일주소 복사”; Instagram tooltip: “작가 인스타그램 채널로 이동”. Instagram destination stays unchanged.
- Reuse existing tooltip appearance/hover/focus behavior. Announce copy success/failure through an accessible status region.
- Contact test passed, covering copied address, copy rejection, tooltip associations, and Instagram destination.
- Production build passed with existing warnings in unrelated files.

## 2026-10-02 - About introduction paragraph reveal

- Confirmed request: reveal the introduction paragraph by paragraph as it enters the viewport, instead of revealing the entire biography together.
- Split Korean/English biography at stored line breaks (including CRLF and blank lines), render separate paragraphs, and observe each paragraph independently. Re-observe when biography content changes; retain page-transition gating and reduced-motion fallback.
- Implementation defaults: 1em paragraph spacing; retain existing 760ms fade/rise, 120ms stagger, and viewport trigger. Visual timing/spacing can be adjusted after review.
- Verification: About tests passed (2 tests), including later paragraphs staying hidden until their own intersection notification.
- Production build passed with existing warnings in unrelated files. Interactive browser appearance has not been reviewed in this session.

## 2026-10-01 - Artwork detail caption handoff and pushed return

- Detail entry now stops the white screen after its 1,600ms arrival. Artwork title and metadata appear together at center, hold for 1,100ms, then move to the final caption position over 1,800ms while the image, header, and back button fade in.
- The white screen no longer slides out. Returning renders Home or Works from the right while a static clone of the outgoing detail page slides left over 1,800ms; Works year state is preserved.

## 2026-10-01 - Slower staged artwork detail transition

- Extended the white artwork-detail entry and return transition from 1,300ms to 4,550ms (3.5×).
- The screen enters from the right through 30%, holds fully covered until 72%, and exits left. On entry, the title animates upward only during the covered hold; return remains title-free. The route changes when the exit begins.

## 2026-10-01 - Shared artwork detail and white slide transition

- Added a shared artwork detail route at `/works/:artworkId`, reachable from Home and Works images. The return button uses the origin in router state and restores the selected Works year.
- Detail entry uses a white right-to-left screen sweep with a brief centered artwork title; return uses the same sweep without title. Reduced-motion navigation is immediate and bypasses the normal black page curtain.
- The detail image is centered and large, with 16px medium title and 14px light metadata below it. Home gallery images are now keyboard-accessible artwork buttons; swipe gestures do not trigger navigation.

## 2026-10-01 - Home, Works, About, Contact navigation and direct year filter

- Renamed public navigation and curtain titles to Home / Works / About / Contact; removed Blog and linked the existing Contact page.
- Promoted the redesigned Works gallery to `/works`, including detail URLs, and redirected the former `/archive-prototype` addresses. The old Works component remains in source but is no longer routed.
- Removed the filter modal and exhibition/series filters. A single-select All / 2021–2026 button row applies the year directly while retaining the list transition and progressive image reveal.

## 2026-10-01 - Full-height blur header and no-filter semantics

- Replaced the header's blurred pseudo-element with a real fixed 64px-high rectangular header (105px on narrow screens); the translucent white background and 14px backdrop blur now cover the header element itself.
- Treating an empty selection in each filter group as unrestricted makes “전체 취소” and removal of the last applied badge show all artworks. Removed the empty-results message and reset button.

## 2026-10-01 - Archive filter spacing, vertical momentum, and blurred header

- Increased the gap between the filter trigger and applied badges from 10px to 20px, and tightened badge-to-badge spacing from 10px to 6px.
- Added velocity-based vertical wheel momentum to the archive scroll container with a 430ms decay. Opposite wheel input reverses promptly; touch, pointer, keyboard scrolling, filter changes, and return-to-top stop the momentum. Reduced-motion mode uses direct wheel distance.
- Added a translucent white, 14px backdrop-blurred fixed header background with a fading lower edge.

## 2026-10-01 - Archive four-column progressive reveal

- Archive prototype now uses four equal-width artwork columns on desktop; the horizontal gap remains 24px. Narrow viewports use three, two, or one column.
- Each card reserves approximate image space, stays hidden until it enters the scroll viewport and its image has loaded and decoded, then rises 28px while fading in. Visible cards reveal in artwork order, left to right and then into the next row, with a 115ms stagger. Filtering remounts the reveal sequence.
- The empty-result message and reset button remain centered in the viewport.

## 2026-10-01 - Archive vertical gallery redesign

- Archive prototype title was centered at 16px regular Pretendard. The filter trigger now sits in its own row, with removable applied-filter badges wrapping from the badge start position.
- Replaced horizontal momentum rail with native vertical scrolling and three equal-width masonry columns. Artwork keeps its original aspect ratio, with 24px column gaps and 40px vertical card gaps; title and details now appear below the image.
- Added a bottom back-to-top button with hover motion and smooth scrolling. Filter modal and result transition remain in place.

## 2026-09-30 - Archive filter button redesign

- 제목 옆 필터 아이콘을 인라인 SVG 슬라이더 아이콘으로 교체하고 버튼 배경을 세컨더리 #2D4278, 호버를 키 컬러 #2050CA로 바꿨다.
- 전체 선택/전체 취소는 채운 버튼으로 분리하고, 실제 필터 선택은 활성 파란 라인/비활성 회색 라인 칩으로 바꿨다. 각 버튼에 호버 색상 변화를 적용했다.
- 모달 하단 취소와 적용 버튼을 동일한 절반 너비로 확장하고 각각 #2D4278/#2050CA를 사용한다. 필터의 선택·적용 동작은 유지했다.

## 2026-09-30 - Lift complete artwork cards and sequence filter results

- 사진에만 적용하던 위로 8px 이동을 제목·제작정보까지 포함한 카드 전체에 적용했다. 카드 위쪽 12px 여유를 두어 상승 시 텍스트 클리핑을 방지한다.
- 필터 변경 시 기존 목록 페이드아웃(220ms) → 적용/스크롤 위치 초기화 → 새 목록 페이드인(320ms) 순서로 처리한다. 동일한 선택을 다시 적용하면 목록을 불필요하게 재생하지 않는다.
- 전환 도중 휠과 작품 클릭을 잠시 막고 모션 감소에서는 즉시 변경한다. 필터 교체 전후 작품 DOM 순서를 확인하는 회귀 테스트를 갱신했다.

## 2026-09-30 - Archive inertia and clickable artwork previews

- Archive 가로 목록의 스크롤바를 숨기고 페이지 전체 휠 입력을 속도 기반 관성으로 바꿨다. 감쇠 320ms, 최대 속도 4px/ms, 입력 가산 delta×1.35/160은 Index의 현재 값을 따른 임시값이다.
- 역방향 휠, 터치 시작, 필터 모달 전환, 컴포넌트 정리 시 관성을 중단하고 모션 감소 설정에서는 추가 이동을 생략한다.
- 작품 이미지 호버/포커스에 8px 상승을 추가하고 클릭 시 최소한의 상세 화면(`/archive-prototype/:artworkId`)으로 이동하게 했다. 필터 버튼 호버는 색상 전환만 남겼다.
- 회귀 테스트에서 휠 입력 후 연속 이동·역방향, 필터 초안 취소, 이미지 클릭/상세/복귀를 확인했다. 실제 휠·트랙패드 감도 및 시각 검수는 후속 확인 대상이다.

## 2026-09-30 - Archive prototype first pass

- `/archive-prototype` 라우트와 독립된 ArchivePrototype 페이지를 추가했다. 기존 `/works`와 GNB 연결은 유지해 리뉴얼 시안을 분리 검토한다.
- 시안의 상단 로고/메뉴, ARCHIVE 제목과 청록 필터 버튼, 하단 고정 높이·가변 너비 작품열을 구현했다. 전체 페이지 휠/트랙패드와 목록 터치로 가로 탐색하며 Index의 XYZ 마우스 효과는 사용하지 않는다.
- 연도는 작품 데이터에서 추출하고 전시/시리즈는 실제 관련 필드에서만 생성한다. 현재 값이 없으면 빈 상태 안내를 표시한다. 시안의 임의 전시·시리즈 항목은 추가하지 않았다.
- 필터는 기본 전체 선택, 초안/적용 상태 분리, 전체 선택·취소, 개별 선택, 적용 수 배지, 결과 없음 안내를 지원한다. 모달은 페이드/상승 전환과 배경 블러, Escape/배경 클릭 닫기를 사용한다.
- 필터 옵션이 실제 데이터 갱신 없이 새 배열로 전달될 때 상태 갱신이 반복되지 않도록 했다. 테스트는 필터 적용/초기화/취소와 가로 휠 입력을 검증한다.

## 2026-09-30 - Promote Exhibition prototype to the home route

- `/`의 기존 Home 화면을 현재 IndexPrototype 화면으로 교체했다. 기존 `/index-prototype` URL은 `/`로 리다이렉트해 책갈피 접근을 유지한다.
- GNB·로고의 Exhibition 목적지를 `/`로 수정하고 페이지 전환의 첫 진입 판정 및 제목도 새 경로에 맞췄다. 이전 테스트 URL에서 직접 들어온 경우 리다이렉트 후에도 첫 방문 인트로를 유지한다.
- 기존 `/works`와 Works 코드에는 손대지 않았다. Archive 리뉴얼은 다음 단계에서 별도 테스트 페이지로 검증할 예정이며 아직 구현하지 않았다.

## 2026-09-30 - Restore gallery input after internal navigation

- GNB 복귀 시 initialIntro=false인데 galleryEnabled가 false로 초기화되어 입력 이벤트가 연결되지 않는 문제를 수정했다. 인트로 생략 초기화 및 생략 분기 모두 탐색 활성화를 보장한다.
- 실제 Router/전환 Provider/IndexPrototype으로 두 차례 왕복하며 인트로 생략, 갤러리 enabled 전달, inert 해제를 확인하는 회귀 테스트를 추가했다.

## 2026-09-30 - GNB curtain transitions and initial-only intro

- Router 내부에 공통 전환 Provider와 TransitionLink를 추가해 전체 새로고침 없이 GNB 경로를 바꾼다. 프로토타입과 기존 헤더/모바일 메뉴에서 공통 전환을 사용한다.
- 검정 커튼 상승/흰색 제목/위로 퇴장 1600ms, 가려진 850ms 시점 navigate를 기본값으로 적용했다. 동일 경로와 전환 중 중복 클릭을 무시한다.
- 첫 진입 경로가 Exhibition일 때만 텍스트 인트로를 허용하고 내부 이동 이후에는 재생하지 않는다. 새로고침은 새 방문으로 취급한다.
- CRA Jest가 Router 7의 exports를 해석하지 못해 테스트 전용 CJS 매핑 및 TextEncoder/TextDecoder를 추가했다. 실제 MemoryRouter로 동일 경로 무반응, 전환 중 경로 변경 시점, 복귀 인트로 생략을 검증한다.

## 2026-09-30 - Reference header and exhibition information

- 사용자 제공 SVG 로고(높이 10px), 상단 중앙 메뉴, 좌측 고정 전시 정보를 추가했다. 전시 정보는 작품 이동 트랙 밖에 있어 스크롤에 따라 움직이지 않는다.
- 시안의 전시제목/장소/기간을 적용하고 Pretendard 16px/700, 14px/300으로 설정했다. 메뉴는 14px/400이며 호버·포커스 외 항목에 투명도 전환을 적용한다.
- 기존 라우트로 Exhibition/Archive/About을 연결했다. Blog는 라우트가 없어 aria-disabled 상태로 표시한다. 모바일은 로고 아래 메뉴 줄로 배치한다.

## 2026-09-30 - Keyboard artwork selection

- 첫 방향키는 가장 가까운 작품을 선택하고 이후 방향키는 선택 인덱스 기준으로 한 장씩 이동한다. 실제 카드 너비·위치를 기준으로 중앙 오프셋을 계산한다.
- 별도 키보드 선택 상태가 컬러·확대·제목 효과를 함께 제어한다. 마우스 변형은 중립으로 초기화하며 리사이즈 시 선택 작품을 다시 중앙에 맞춘다.
- 마우스 이동/휠/터치는 키보드 모드를 해제한다. 전역 방향키 연결은 활성화된 테스트 페이지 수명 안에서만 유지하며 입력 필드는 제외한다.

## 2026-09-30 - Shorter travel and more overlapping intro letters

- 인트로 등장/퇴장 이동 거리를 ±110%에서 ±55%로 절반 줄였다.
- 글자 시작 간격은 45ms에서 25ms, 글자당 재생시간은 500ms에서 750ms로 조정했다. 구체 수치는 요청 방향에 맞춘 임시값이며 유지 시간과 페이지 진입 모션은 그대로다.

## 2026-09-30 - Unclip intro text during entry as well

- 등장 단계에서도 글자 래퍼의 overflow를 visible로 유지해 아래쪽 경계에서 글자가 잘리지 않도록 했다. 등장·퇴장 모두 이동과 투명도만으로 표시를 제어하며 기존 속도와 순서는 유지한다.

## 2026-09-30 - Unclip intro text during upward exit

- 인트로 퇴장 중 글자가 마스크 상단에서 잘리는 문제를 수정했다. 퇴장 단계에만 글자 래퍼의 overflow를 visible로 바꿔 투명도 0까지 글자 전체가 보이게 한다. 등장 마스크와 기존 속도·이동 거리는 유지한다.

## 2026-09-30 - Upward text exit and silhouette cleanup

- STUDIO 뒤 슬래시와 공백을 제거하고 퇴장 방향을 위쪽(-110%)으로 변경했다. 글자 수에 맞춰 전체 재생 시간과 테스트를 갱신했다.
- 미사용 VisitorSilhouette 컴포넌트와 import, 실루엣 설정·테스트를 제거했다. public의 이전 영상/GIF는 docs/walk_animation/legacy-assets로 이동해 배포 대상에서 제외하고 제작 원본으로 보관한다.

## 2026-09-30 - Replace silhouette intro with studio typography

- IndexPrototype에서 VisitorSilhouette 연결과 영상 기반 진입 상태를 제거했다. 중앙 두 줄 STUDIO /, LIM YUN MOOK의 글자별 등장/퇴장으로 대체했다.
- 텍스트 퇴장 완료 후 콘텐츠 페이드인과 작품 열의 48px 상승을 시작하고 1000ms 뒤 탐색을 활성화한다. 글자 500ms/간격 45ms/유지 350ms와 작품 진입 모션은 임시 연출값이다.
- 모션 감소 시 즉시 활성화하고 unmount 시 타이머를 정리한다. 영상 자산 자체는 삭제하지 않고 이 페이지의 재생만 제거했다.

## 2026-09-30 - Prevent TO START wrapping during expansion

- 버튼 글자에 white-space: nowrap과 flex-shrink: 0을 적용해 확장 도중에도 한 줄과 고유 너비를 유지한다. 기존 overflow: hidden으로 아직 펼쳐지지 않은 부분을 가리고 투명도 전환으로 표시한다.

## 2026-09-30 - Stronger return speed contrast

- 복귀의 완급 차이를 키우라는 요청에 따라 cubic에서 quintic ease-in-out으로 변경하고 시간을 2400ms에서 3200ms로 늘렸다.
- 전체 시간의 첫 25%에서 이동 거리 약 1.56%, 가운데 50%에서 약 96.88%, 마지막 25%에서 약 1.56%를 이동한다. 수치는 체감 조정을 위한 구현 기본값이다.

## 2026-09-30 - TO START label and gradual return

- BACK을 목록 처음으로 향하는 의미의 TO START로 바꾸고 캡슐 너비와 화면 끝 여유를 늘렸다.
- 복귀 시간을 900ms에서 2400ms로 변경했다. cubic ease-in-out으로 출발·도착에서는 느리고 중간에서는 빠르게 이동한다. 2400ms는 요청한 2~3배 범위에서 선택한 연출값이다.

## 2026-09-30 - End-of-gallery BACK button

- 스크롤 한계 도달 시 마지막 작품 오른쪽에 원형 화살표 버튼을 표시한다. 화면 밖으로 나가지 않도록 위치에 여유를 둔다.
- 첨부 시안의 검정 원형 → 초록 캡슐/BACK 호버를 적용하고 키보드 포커스에도 같은 효과를 제공한다.
- 클릭 동작은 사용자 확인에 따라 목록 처음으로 복귀한다. 900ms 감속 복귀와 페이드/이동/확대 등장은 임시 연출값이다. 휠·터치·키보드 새 입력으로 복귀를 중단할 수 있다.

## 2026-09-30 - Desktop wheel momentum

- 데스크톱 휠 입력을 속도에 누적해 입력 종료 후에도 지수 감속하며 이동하도록 추가했다. 시간 기반 적분으로 이동 거리를 계산한다.
- 반대 입력은 이전 방향의 속도를 제거하며, 키보드·터치·blur는 관성을 중단한다. 모션 감소 및 모바일 휠 경로는 기존 이동 방식을 유지한다.
- 조정 기본값은 최대 4px/ms, 감쇠 320ms, 입력 가산 delta × sensitivity / 160이다. 트랙패드 자체 관성이 포함된 입력도 받으므로 실제 장치 체감 조정은 후속 확인이 필요하다.
- 자동 회귀 확인에 입력 종료 후 이동, 강도별 거리 차이, 역방향, 포커스 해제 및 범위 제한을 추가했다.

## 2026-09-30 - Equal artwork heights and tighter desktop spacing

- 작품 원본 비율을 유지하며 높이를 min(44.8vh, 448px)로 통일했다. 이 수치는 기존 최대 높이를 재사용한 조정 기본값이다.
- 고정 너비 슬롯을 없애고 이미지 너비에 맞춰 카드가 늘어나게 했다. 데스크톱 기본 간격은 20px, 모바일은 기존 32.4vw다.
- 첫/마지막 작품 너비로 양 끝 여백을 계산하고 카드 크기 변경을 관찰해 이미지 로딩·리사이즈 후 스크롤 범위를 갱신한다.
- 데스크톱 정보도 작품 하단과 화면 하단 사이 세로 중앙에 배치한다. 호버/원근 변형 전 하단을 사용해 위치 흔들림을 피한다. 모바일 위치와 글자 애니메이션은 유지한다.

## 2026-09-29 - Animate mobile artwork captions

- 확정 요구: 모바일 제목·년도에 등장·퇴장 애니메이션을 추가한다. 세로 배치와 기존 위치를 유지한다.
- 구현 기본값: 데스크톱의 글자별 상승·투명도 타임라인 및 1.5배 재생 속도를 재사용한다. 제목 다음 년도 순서로 재생하고 중앙 영역을 벗어나면 현재 지점부터 역재생한다.
- 새로운 중앙 작품은 이전 퇴장을 취소하고 새 등장으로 전환한다. 모션 감소 설정에서는 즉시 표시·제거한다.
- 자동 테스트 26개 통과: 모바일 부분 등장 역재생, 새 작품 전환, 퇴장 완료 제거 및 기존 관성 스와이프 회귀 확인. 실제 기기에서의 시각적 체감은 후속 확인 대상이다.

## 2026-09-29 - Mobile swipe momentum

- 모바일 스와이프 종료 시 최근 이동 속도를 사용해 관성 이동을 시작한다. 손가락이 닿아 있는 동안은 기존 1:1 이동을 유지한다.
- 시간 기반 지수 감쇠를 적분해 화면 주사율에 관계없이 감속하도록 했다. 최대 4px/ms, 시간상수 420ms는 느낌 조정을 위한 임시값이다.
- 재터치·다중 터치·touchcancel·blur에서 중단하고 역방향 입력을 즉시 받는다. 100ms 이상 멈춘 뒤 놓거나 모션 감소 설정에서는 관성을 시작하지 않는다. 휠·키보드 입력도 기존 관성을 중단한다.
- 중앙 색상·정보는 관성 이동에서도 갱신하며 목록 끝을 넘지 않는다. 테스트 25개 통과(빠른/느린 스와이프 거리, 재터치 정지, 역방향, 경계, 정지 후 해제·취소·모션 감소).
- 실제 모바일의 관성 강도 체감은 후속 확인 대상이다.

## 2026-09-29 - Widen mobile selection and reposition information

- 모바일 중앙 판정 반경을 화면 너비의 15%에서 25%로 넓혔다. 25%는 요청에 따라 선택한 조정값이다.
- 모바일 gap은 10.8vw→32.4vw로 3배 확대했다. 데스크톱 간격은 유지한다.
- 선택된 작품의 실제 이미지 하단을 측정해 화면 하단 안전 영역까지 빈 공간의 세로 중앙에 제목·년도 묶음을 배치한다. 작품 교체, 이미지 load, 이미지/페이지 resize에서 갱신한다.

## 2026-09-29 - Mobile center selection and swipe interaction

- 모바일 전용 요구 6개를 구현했다: 기본 흑백, 중앙만 컬러, 중앙 작품 정보, 제목/년도 세로 배치, 터치 스와이프, 마우스 XYZ 이동 없음.
- 중앙 선택은 실제 렌더링된 가로 이동량 기준으로 측정·이동·리사이즈 시 갱신한다. 모바일의 별도 중앙 ID와 데스크톱 호버 ID를 분리했다.
- 모바일 viewport는 빈 공간에서도 터치를 받고, 스와이프는 1:1 이동량으로 즉시 반영한다. touchcancel 및 다중 터치 시작을 처리한다. 인트로 중 입력은 연결하지 않는다.
- 환경 판정 임시값: 768px 이하 또는 hover:none/pointer:coarse. 중앙 판정 좌우 15%와 경계 여유 10px, 제목 24–40px/년도 20px. 스냅 없이 연속 이동하며 중앙이 비면 정보를 숨긴다.
- 모바일에서는 제목·년도를 즉시 교체하고, 데스크톱의 기존 한 줄 등장/역재생은 유지한다. 환경 전환 시 마우스 오프셋을 초기화한다.
- 테스트 21개 통과: 중앙 컬러, 제목/년도 순서, 양방향 스와이프, 중앙 공백, 터치 취소, 인트로 차단, 화면 모드 전환 포함. 실제 모바일 브라우저 검수는 미실시.

## 2026-09-29 - Adopt Z-axis motion and Pretendard

- Z축 포함안을 확정하여 pointerTiltY 10도로 기본 적용하고 비교 토글 및 선택 state/styles를 제거했다.
- 테스트 페이지에 Pretendard Variable을 적용하고 제목의 별도 Noto Sans 지정을 상속으로 바꿨다. 기존 크기·굵기·애니메이션은 유지한다.
- 공식 orioncactus/pretendard v1.3.9의 WOFF2와 SIL OFL 라이선스를 public/fonts에 포함해 자체 호스팅한다. WOFF2 파일 헤더를 확인했다.

## 2026-09-29 - Repair hover targeting in the tilted gallery

- 3D viewport/회전 평면의 투명 영역이 뒤쪽 이미지 판정을 가로막을 수 있어 컨테이너는 pointer-events none, 실제 이미지는 auto로 명시했다.
- 마우스 이동 및 기울기/스크롤 렌더링 후 elementFromPoint로 실제 투영된 이미지의 판정을 갱신한다. 단순 사각형 좌표 비교 대신 브라우저의 원근·클리핑 판정을 사용한다.
- 확대 효과를 CSS :hover에서 컬러·제목과 같은 hoveredArtworkId 상태로 통합하여 효과 간 불일치를 제거했다. 기울기 방식과 비교 토글은 유지한다.
- 회귀 테스트에서 고정 커서 아래 이미지가 움직이는 상황과 휠 이동 후 호버 해제를 확인한다. 실제 브라우저의 3D hit testing 시각 검수는 별도 필요하다.

## 2026-09-29 - Correct depth comparison to a shared tilted artwork plane

- 사용자 설명에 따라 2안의 개별 카드 Z 이동을 폐기하고 작품 열 전체의 Y축 회전으로 교체했다.
- 오른쪽 마우스 위치에서는 rotateY 음수로 오른쪽을 앞으로, 왼쪽을 뒤로 보낸다. 왼쪽에서는 반대로 동작한다. 세로 입력은 기존 반대 방향 이동만 적용한다.
- 화면 너비의 고정 회전 평면과 내부 스크롤 트랙을 분리해 스크롤 중에도 회전 중심을 유지한다. 임시값 perspective 1200px / 최대 ±10도. 1안/2안 토글은 유지한다.
- 테스트 18개 통과: 좌우 회전 방향, 상하 이동과 회전 분리, 이탈 중립 복귀, 기존 모드 복귀 확인. 실제 브라우저 시각 비교는 미실시.

## 2026-09-29 - Compare XY motion with Z-axis depth

- 상단 중앙에 1안(기존 XY)/2안(Z축 추가) 토글을 추가했다. 초기 선택은 1안이며 Z축 채택은 후속 결정이다.
- 임시값: 카드 중심 perspective 1000px, Z 최대 기준 ±120px, 기존 작품별 깊이 계수 및 보간 적용. XY와 호버 확대·컬러 정책은 유지한다.
- 페이지 이탈 시 Z도 중립으로 복귀하고, 모션 감소에서는 이동하지 않는다. 토글 시 진행 중인 스크롤 보간은 이어서 실행한다.

## 2026-09-29 - Revise hover enlargement to 4.5 percent

- 직전 변경 전 확대량 3%를 기준으로 50% 증가하도록 요청받아 scale을 1.036에서 1.045로 수정했다. 마우스 이동량과 전환 시간은 유지한다.

## 2026-09-29 - Increase pointer movement and hover enlargement

- 마우스 반응 이동량을 50% 늘렸다: pointerMoveX 16→24, pointerMoveY 24→36. 기존 보간 속도와 작품별 깊이 계수는 유지한다.
- 호버 확대 비율 20% 증가는 기존 확대량 3%를 기준으로 해석해 3.6%(scale 1.036)로 적용했다.

## 2026-09-29 - Adopt color-first gallery and reduce artwork size

- 1안 채택 확정: 기본 전체 컬러, 호버 시 해당 작품만 컬러/확대, 나머지 연한 흑백. 해제하면 전체 컬러로 복귀한다. 상단 비교 토글과 모드 분기를 제거했다.
- 작품 슬롯 너비와 이미지 최대 높이를 80%로 조정하고 좌우 끝 여백도 새 슬롯 너비에 맞췄다. gap은 데스크톱·모바일 모두 1.2배로 늘렸다.
- 기존 제목·년도 및 전체 페이지 마우스 반응은 유지한다. 컬러 회귀 테스트의 기대값을 확정안으로 갱신했다.

## 2026-09-29 - Color mode comparison toggle

- 상단 중앙에 1안(기본 컬러)/2안(기본 흑백) 비교 토글을 추가했다. 초기 선택은 기존 2안이며 최종안 결정은 보류다.
- 1안은 호버가 없으면 전체 컬러, 호버하면 해당 이미지만 컬러이고 나머지는 기존 연한 흑백이다. 2안은 기존 동작을 유지한다.
- 양쪽 모두 기존 확대·컬러 transition·제목 애니메이션을 사용한다. 작품 배열을 memoize하여 토글 변경으로 스크롤/마우스 효과가 재초기화되지 않도록 했다.

## 2026-09-29 - Match caption exit speed to entry

- 추가 확정 요청에 따라 퇴장도 등장과 동일하게 기존 대비 1.5배로 변경했다. 진행 중 역재생은 현재 위치·투명도를 유지하며 동일 속도로 되감는다.

## 2026-09-29 - Faster caption entry and descender clearance

- 확정 요구: 제목·년도 등장 속도를 기존의 1.5배로 변경하고 y/g 하단 잘림을 수정한다.
- 등장 타임라인 진행량을 1.5배로 높여 이동·투명도·글자 지연 모두 동일 비율로 단축했다. 퇴장은 기존 속도로 현재 시점부터 역재생한다.
- 글자 마스크에 하단 padding 0.2em(80px 기준 16px)을 추가하고 음수 margin으로 기존 배치를 유지했다. 여유 수치는 임시 구현값이다.

## 2026-09-29 - Reverse caption from its current animation position

- 확정 변경: `제목 / 년도` 구분자, 등장·퇴장 투명도 변화, 미완료 등장 시 현재 시점에서 역재생.
- 이전 별도 CSS 퇴장 keyframes와 퇴장 시 DOM 재생성을 제거했다. 하나의 requestAnimationFrame 타임라인에서 글자별 위치·opacity를 함께 계산하고 재생 방향만 뒤집는다.
- 등장 도중 해제해도 현재 위치와 opacity가 유지되며, 지연 중인 글자는 숨김 상태를 유지한다. 완료 후 해제하면 전체 타임라인 끝에서 역재생한다.
- 새 호버는 이전 프레임을 취소하고 새 문자열을 처음부터 재생한다. 모션 감소는 즉시 표시·제거한다.
- 기존 임시 시간값(480ms/글자 간 최대 35ms)은 유지하고 cubic ease-out을 양방향 동일하게 사용한다.
- 테스트 17개 통과: 중간 진행의 위치·opacity 연속성, 아직 등장하지 않은 글자 숨김, 퇴장 중 새 작품 교체 검증. 실제 브라우저 시각 검수는 별도 필요하다.

## 2026-09-29 - Lighter grayscale and interruptible single-line captions

- 확정 변경: 연한 흑백 및 컬러 transition, 80px bold, 제목·년도를 하나의 한 줄 문자열로 글자별 등장·역순 퇴장. 퇴장 중 새 호버는 즉시 이전 애니메이션을 취소하고 새 등장을 시작한다.
- 임시 시각 값: 흑백 opacity 0.55, 호버 opacity 1, filter/opacity 350ms ease. 밝은 페이지 배경과 섞어 이미지를 연하게 만들었다.
- 제목과 년도를 동일한 글자 배열로 처리한다. 퇴장 중 표시 데이터를 유지하고, 종료 타이머는 새 호버 및 unmount 시 취소하며 이전 콜백도 새 제목을 제거할 수 없도록 보호한다.
- 기존 등장 시간 480ms, 글자 간 최대 35ms, 굵기 800은 유지했다. 모션 감소 시 애니메이션 없이 즉시 교체한다.
- 이전 문서 갱신에 남은 깨진 문자열과 구기획을 발견하여 CODEX_HANDOFF.md 본문을 최신 요구로 복구·갱신했다.
- 검증: 테스트 16개 통과. 다른 작품 및 같은 작품으로 퇴장 중 재진입, 이전 타이머의 새 제목 보존, 통합 문자열·역순 지연, 모션 감소를 확인했다.
- 후속 확인: 실제 브라우저 시각 검수, 작은 화면에서 80px 한 줄의 긴 제목 넘침 처리 방식.

## 2026-09-29 - Hover color and large animated artwork information

- 확정 변경: 기본은 모든 작품 흑백, 실제 이미지에 호버한 작품만 컬러. 중앙 작품 정보 표시는 취소하고 호버한 작품의 제목·년도를 표시한다.
- 제목과 년도를 가로로 크게 bold 배치하고, 제목은 글자별로 아래에서 올라오도록 구현했다. 빠른 호버 교체 시 제목과 년도를 함께 교체하며, 해제 시 정보를 제거한다.
- 전체 페이지 마우스 반응과 연속 스크롤은 유지한다. 중앙 판정은 갤러리 실행 경로에서 제거했다.
- 임시 디자인 값: 32–112px 반응형 글씨, 굵기 800, 글자 등장 480ms, 최대 글자 간격 35ms(긴 제목의 전체 지연은 최대 700ms). 긴 제목은 제목 영역 안에서 줄바꿈한다.
- 모션 감소 시 제목을 즉시 표시한다. 터치 전용 정보 탐색 방식은 후속 결정이다.
- CODEX_HANDOFF.md의 기존 컬러·중앙 판정 기획과 체크리스트를 최신 요구로 교체했다.
- 검증: 테스트 14개 통과, production build 성공(기존 다른 파일의 ESLint 및 Browserslist 경고). 실제 브라우저의 글자 크기·배치·애니메이션 시각 검수는 미실시.

## 2026-09-29 - Full-page pointer interaction boundary

- 확정 요구: 상단·하단 여백과 헤더를 포함해 Index 페이지 어느 영역에서든 마우스 이동에 작품 열이 반응한다.
- 기존 갤러리 내부 이벤트 수신을 페이지 최상위 main의 ref로 연결했다. 좌표 계산도 동일한 전체 페이지 영역을 기준으로 한다.
- capture 단계에서 마우스 이동을 받아 위에 겹친 헤더 등에서도 반응한다. 페이지를 벗어날 때만 중립 위치로 복귀한다.
- 이동 강도와 보간 속도는 기존 프로토타입 기본값을 유지했다. 새 디자인 수치는 확정하지 않았다.
- 검증: 전체 테스트 12개 통과. 갤러리 밖 헤더/하단 영역, 이벤트 전파 차단 요소, 페이지 이탈 및 해제 후 이벤트 정리를 회귀 테스트로 확인했다. 실제 브라우저 시각 확인은 별도 필요하다.

## 2026-09-23 - Index prototype start

### 확인한 자료

- `docs/CODEX_HANDOFF.md` 전체
- `docs/reference/index frame 01 - initial . loading complete.png`
- `docs/reference/index frame 02 - artwork focus.png`
- `docs/reference/index frame 03 - transition.png`
- `docs/reference/index frame 04 - continuous scroll.png`
- `docs/reference/new-visitor-walk-turn-preview.gif`
- 기존 React 라우팅, Home, 작품 데이터, public 작품 자산

### 이번 구현 범위

- 기존 `/` Home은 보존하고 `/index-prototype` 경로 추가
- `Bear -> Reflection -> BellFlowers` 고정 순서
- 첫 작품 자동 등장과 중앙 정착
- 오른쪽 휠, `ArrowRight`, 오른쪽 스와이프를 다음 작품 입력으로 연결
- 이동 중 예약은 최대 1회
- 작품 전환 중 정보 숨김, 정착 후 제목·메타데이터 표시
- `prefers-reduced-motion` 대응
- 정착 후 실루엣 유지/사라짐 비교 버튼

### 임시 판단

- Bear, BellFlowers 원본이 저장소에 없어 기존 `Green.jpg`, `flower.jpg`를 임시 이미지로 매핑했다. 제목과 문서 메타데이터는 유지했다.
- 확인한 실루엣 GIF는 `public/reference/new-visitor-walk-turn-preview.gif`로 복사해 사용한다.
- GIF 프레임 구간을 걷기·정지·돌아보기 상태별로 제어할 수 있는 원본 영상이 없으므로 CSS 상태 표현과 GIF 재생을 조합했다. 자연스러운 동작 연결은 검증 완료로 간주하지 않는다.
- 역방향 입력과 셔플 순서는 1차 고정 순서 검증을 위해 구현하지 않았다.

### 폐기하거나 보류한 안

- 기존 `ArtworkContext`/Firestore를 Index fixture에 연결하는 안: 로딩 결과에 따라 3점 고정이 깨질 수 있어 보류.
- 기존 `Home.js`를 직접 확장하는 안: 기존 `/` 화면 보존 요구와 충돌해 별도 페이지로 분리.
- PDF에서 이미지를 추출하는 안: 현재 원본 자산 부재 상태에서는 임시 품질 확인에 그치므로 기존 public 자산 매핑으로 시작.

### 검증

- `npm test -- --watchAll=false`: 통과, 3 tests passed
- `npm run build`: 성공
- production build에서 기존 파일의 ESLint 경고가 출력되지만 이번 Index prototype 파일의 오류는 없음

## 2026-09-23 - Silhouette and transition timing adjustment

### 반영한 수정

- 작품 stage 높이를 줄이고 상단 여백을 확보해 이미지를 더 위쪽에 배치했다.
- 실루엣을 작품 stage 중앙으로 이동하고 초기 크기의 70%로 줄였다.
- 정착/돌아보기 상태에서는 GIF를 숨기고 정적 CSS 실루엣만 표시하도록 변경했다.
- 전환 중에만 GIF를 표시해 걷기 동작과 작품 교체의 시작/종료 구간을 맞췄다.
- 작품 전환 시간을 `1100ms`에서 `2200ms`로 늘렸다.
- GIF 배경이 화면에 섞이는 정도를 줄이기 위해 grayscale/contrast/brightness와 `multiply` 혼합을 적용했다.

### 남은 확인

- GIF 원본 자체의 불투명 배경이 완전히 제거되는지는 실제 브라우저 화면에서 확인 필요
- 2200ms 동안 GIF가 한 번 걷고 멈추는 시각적 타이밍은 원본 GIF 프레임 길이에 따라 추가 조정 필요

## 2026-09-23 - Prototype sample and playback correction

### 반영한 수정

- 정착 상태에서 보이던 CSS fallback 실루엣을 제거했다. 첨부 화면의 검정 반투명 형태는 이 fallback이었다.
- 기존 작품 레이어가 전환 종료 후 오른쪽에서 중앙으로 되돌아오는 것처럼 보이던 transition을 차단했다. transition은 실제 `moving` 상태에서만 활성화한다.
- 테스트용 고정 작품을 3점에서 5점으로 확대했다: `Bear`, `Reflection`, `BellFlowers`, `Mountain`, `October`.
- 실루엣 GIF는 실제 걷는 상태에서만 표시되며, 정착 상태에는 화면에 남지 않는다.

### GIF 제공 권장 형식

- 가장 좋은 형식: 투명 배경이 포함된 WebM(VP9 alpha) 또는 투명 PNG 프레임 묶음.
- GIF를 제공할 경우 배경이 흰색/회색으로 합성되지 않은 투명 GIF여야 한다.
- 걷기, 멈춤/돌아보기, 재걷기 구간을 같은 캔버스 크기와 같은 인물 위치로 제공해야 한다.
- 원본 영상도 함께 제공하면 걷기와 멈춤 타임코드를 분리해 작품 전환 시간과 정확히 맞출 수 있다.

## 2026-09-23 - WebM silhouette integration

### 확인한 설명서

- `docs/walk_animation/README.md`
- 공통 사양: `480 x 640`, `24 fps`, `VP9 + Alpha`, 무음, 투명 배경 검은 실루엣
- 연결 규칙: `walk` 반복, `stop_and_turn` 1회 재생 후 마지막 프레임 유지, `turn_and_walk` 1회 후 `walk` 복귀

### 구현

- `walk.webm`, `stop_and_turn.webm`, `turn_and_walk.webm`을 `public/reference/walk-animation/`에 배치했다.
- 세 비디오를 preload 상태로 유지하고, 기존 GIF와 CSS fallback을 제거했다.
- Index 상태 연결:
	- `entering`: `walk` 재생
	- `moving`: `turn_and_walk` 1회 후 `walk` 반복
	- `turning`: `stop_and_turn` 1회 재생
	- `ready`: `stop_and_turn`의 마지막 프레임 유지
- 영상 요소를 언마운트하지 않고, 활성 레이어만 opacity로 전환한다.

### 검증

- `npm test -- --watchAll=false`: 4 tests passed
- 변경 파일 진단: 오류 없음
- WebM 3개 public 자산 존재 확인
- `npm run build`: 성공. 기존 프로젝트 파일의 ESLint 경고만 출력됨

### 남은 확인

- 실제 Chrome/Safari/iOS에서 VP9 alpha 투명도와 프레임 연결 확인 필요
- 브라우저의 autoplay 정책에 따라 muted/playsInline 재생이 허용되는지 확인 필요

## 2026-09-23 - Silhouette visibility and playback speed

### 반영한 수정

- 실루엣은 `entering` 또는 `moving` 상태에서만 보이도록 변경했다.
- 작품 전환이 끝나 `turning` 또는 `ready`가 되면 마지막 정지 프레임을 유지한 채 컨테이너가 `350ms` 동안 서서히 사라진다.
- WebM 3종 공통 재생 속도를 `indexPrototypeConfig.silhouettePlaybackRate`로 분리했다.
- 현재 기본값은 `1`이며, 예를 들어 `0.8`로 바꾸면 세 WebM이 모두 느려지고 `1.2`로 바꾸면 빨라진다.
- 재생 속도는 `<video>`의 `playbackRate` DOM property로 적용한다.

### 검증

- `npm test -- --watchAll=false`: 5 tests passed
- `npm run build`: 성공. 기존 프로젝트 ESLint 경고만 출력됨

## 2026-09-25 - Earlier details opacity exit

- 상세 y축 이동 거리를 `24px`에서 `15px`로 줄였다.
- 퇴장 시 opacity transition은 `180ms`, y축 이동은 `450ms`로 분리했다.
- 정보·설명·제목은 역순 delay를 유지하면서 이동이 끝나기 전에 먼저 완전히 투명해진다.

## 2026-09-29 - Index continuous gallery revision

### 확인 기준

- 개정 [docs/CODEX_HANDOFF.md](docs/CODEX_HANDOFF.md): 작품 스냅·작품별 queue/lock을 제거하고 wheel/trackpad delta 기반 양방향 연속 갤러리로 변경.
- 참고 `https://experiment.obys.agency/`: 페이지 텍스트 추출로 확인 가능한 범위는 desktop-oriented Experiment Space 사이트 안내였다. 정확한 레이아웃/모션 수치는 추출되지 않아 시각 복제가 아닌 연속 이미지 탐색 아이디어만 참고.
- `docs/walk_animation/README.md`: 현재 `visitor_intro.webm`은 final pose `3.500s`, ended 약 `4.292s`.

### 반영한 수정

- 기존 다섯 작품 step 전환/3D depth/queue 로직과 구형 ArtworkStage를 제거했다.
- Firestore 작품을 우선 표시하고 비어 있으면 기본 작품 카탈로그 41점으로 fallback한다.
- 작품 레일은 아래 wheel/trackpad delta만큼 오른쪽에서 왼쪽으로 연속 이동하고 위 방향 입력은 반대로 이동한다. 중앙 snap, per-item lock, 입력 queue, 끝 순환은 적용하지 않는다.
- 중앙 판정 영역 안에서 가장 가까운 이미지 중심의 제목·제작년도만 하단 고정 영역에 표시한다. 영역에 작품이 없으면 정보를 숨기며 작은 hysteresis를 두어 경계 흔들림을 줄인다.
- 이미지 원본 컬러와 비율을 유지하고 hover는 이미지 scale `1.03`만 적용한다. 슬롯 크기와 배치는 고정해 주변 작품 위치 및 판정이 변하지 않는다.
- intro final-pose `3500ms`에 silhouette fade-out/content reveal을 시작하고, content fade-in 동안 wheel 입력을 막은 뒤 연속 탐색을 활성화한다.

### 검증/미확인

- 순수 로직에서 방향별 delta 비례 이동, 끝 clamp, 휠 deltaMode 정규화, 중앙 작품 선택/히스테리시스, 41점 fallback 테스트.
- 레퍼런스 원 사이트의 구체 배치·곡선은 본 환경의 콘텐츠 추출로 확인 불가. 구현의 간격·카드 크기는 프로토타입 기본값이며 후속 시각 조정 대상.
- 실제 브라우저에서 wheel/trackpad/모바일 touch, 41개 이미지 로딩, desktop/mobile responsive 조작 확인 필요.

## 2026-09-29 - Cursor-reactive artwork columns

### 반영한 수정

- 갤러리 viewport 안에서 마우스가 움직이면 각 작품 카드가 cursor 위치에 반응해 부드럽게 parallax 이동한다.
- 작품별 depth factor를 다르게 적용해 한 열이 통째로 강체처럼 움직이기보다 카드마다 이동량 차이가 난다.
- 기본 최대 반응값은 x `16px`, y `24px`, card transform transition은 `420ms`다.
- requestAnimationFrame으로 pointer update를 프레임 단위 처리하고 viewport를 벗어나면 원위치로 복귀한다.
- pointer 반응은 카드 배치 transform에만 적용한다. 이미지 hover scale, 중앙 활성 판정 기준, 연속 rail scroll offset은 분리되어 있다.
- `prefers-reduced-motion` 설정에서는 pointer parallax를 적용하지 않는다. 터치 입력은 기존 drag-like horizontal pan만 지원하고 hover/parallax를 요구하지 않는다.

### 검증

- pointer offset 방향·상한 단위 테스트 추가
- `npm test -- --watchAll=false`: 7 tests passed
- `npm run build`: 성공. 기존 프로젝트 ESLint 경고만 출력됨
- `/index-prototype` 개발 route HTTP smoke check: 200

### 실행/검증 결과

- 실행 경로: `http://localhost:3001/index-prototype` (`3000` 포트가 이미 사용 중이라 3001로 실행)
- `npm test -- --watchAll=false`: 6 tests passed
- `npm run build`: 성공. 기존 프로젝트 ESLint 경고만 출력됨
- `/index-prototype` HTTP smoke check: 200

## 2026-09-25 - Increase details vertical motion

- 제목·설명·정보의 숨김 위치를 기존 `10px` 아래에서 `24px` 아래로 변경했다.
- 등장 시 아래에서 위로 올라오는 거리가 늘어나 긴 transition에서도 덜컹거리지 않고 움직임이 더 분명하게 보이도록 했다.
- 퇴장 시에도 같은 거리로 위에서 아래로 이동한다.

## 2026-09-25 - Reverse details exit order

- 상세 정보가 사라질 때 등장 순서의 반대로 `정보 → 설명 → 제목` 순서로 퇴장하도록 transition delay를 분리했다.
- 설명이 없는 작품은 `정보 → 제목` 순서로 퇴장한다.

## 2026-09-25 - Fixed centered artwork details

### 반영한 수정

- 제목·설명·재료·크기·연도를 이동하는 `ArtworkLayer` 밖의 고정 `DetailsLayer`로 분리했다.
- 좌우 이동·3D depth transform은 작품 이미지 프레임에만 적용된다.
- 전환 중 상세는 중앙 위치에서 숨겨지고, 새 작품이 정착한 뒤 해당 작품 데이터로 교체된다.
- 제목·설명·정보는 고정 중앙 위치에서 아래에서 위로 opacity/transform transition을 순차 실행한다.

### 검증

- `npm test -- --watchAll=false`: 9 tests passed
- `npm run build`: 성공. 기존 프로젝트 ESLint 경고만 출력됨

## 2026-09-25 - Stable artwork details reveal

### 반영한 수정

- 이미지 하단에 제목·설명·정보를 포함하는 고정 높이 상세 영역을 확보했다.
- 숨김 상태에서도 상세 영역은 DOM과 높이를 유지해 작품이 중앙 도착 후 위로 덜컹 올라가지 않도록 했다.
- 제목, 설명, 정보에 각각 opacity와 `translateY` transition을 적용했다.
- 표시 순서는 제목 → 설명 → 재료·크기·연도이며, 설명이 없으면 설명은 보이지 않고 정보만 다음 순서로 나타난다.
- 제목은 즉시, 설명은 `120ms`, 정보는 설명 유무에 따라 `120ms` 또는 `240ms` 지연 후 나타난다.

### 검증

- `npm test -- --watchAll=false`: 9 tests passed
- `npm run build`: 성공. 기존 프로젝트 ESLint 경고만 출력됨

## 2026-09-25 - Lock back depth and shorten artwork transition

- 작품 깊이 모드를 비교 state/button 없이 `back`으로 고정했다.
- 작품 전환 시간을 `3000ms`에서 `1500ms`로 절반 단축했다.
- 전환 후반 동기화 비율을 유지하기 위해 `turnLeadMs`를 `1342ms`에서 `671ms`로 조정했다.

## 2026-09-25 - Strengthen 3D depth comparison

- 앞/뒤 깊이 이동을 `180px`에서 `360px`로 확대했다.
- 회전량을 `12deg`에서 `24deg`로 확대했다.
- 앞 모드 축소를 `0.88`, 뒤 모드 축소를 `0.82`로 조정해 두 모드의 깊이 차이를 더 명확하게 했다.

## 2026-09-25 - 3D artwork transition comparison

### 반영한 수정

- 작품 stage에 `perspective: 1400px`와 `translate3d`/`rotateY`/`scale` 기반 전환을 추가했다.
- `Depth: front`: 다음 작품은 앞쪽 왼쪽에서 들어오고 현재 작품은 앞쪽 오른쪽으로 빠진다.
- `Depth: back`: 다음 작품은 뒤쪽 왼쪽에서 들어오고 현재 작품은 뒤쪽 오른쪽으로 빠진다.
- Index 상단 Depth 버튼으로 두 모드를 즉시 비교할 수 있다.

### 검증

- `npm test -- --watchAll=false`: 9 tests passed
- `npm run build`: 성공. 기존 프로젝트 ESLint 경고만 출력됨

## 2026-09-25 - Artwork title order and wheel gesture grouping

### 반영한 수정

- 작품 정보 순서를 이미지 하단 기준 `제목 → 설명 → 재료·크기·연도`로 변경했다.
- wheel threshold를 넘은 뒤 `400ms` 동안 같은 물리적 wheel flick의 후속 이벤트를 무시하도록 했다.
- 입력이 `400ms` 이상 끊기면 다음 wheel gesture를 다시 허용한다.
- 키보드와 스와이프 입력, 전환 중 최대 1회 queue 정책은 유지했다.

### 검증

- `npm test -- --watchAll=false`: 8 tests passed
- `npm run build`: 성공. 기존 프로젝트 ESLint 경고만 출력됨

## 2026-09-25 - Ensure queued transition paint frame

- 0ms 후속 타이머만으로는 브라우저가 도착 작품의 중앙 정착 상태를 그리기 전에 다음 전환이 시작될 수 있었다.
- 예약 전환을 시작하기 전에 `32ms` 정착 지연을 추가해 최소 한 번의 paint frame을 확보했다.
- 도착 작품이 중앙에 표시된 뒤 다음 작품 전환이 시작되도록 `queuedTransitionDelayMs` 설정으로 분리했다.

## 2026-09-25 - First-scroll reveal race guard

### 원인과 수정

- 초기 실루엣 fade-out과 Index 콘텐츠 reveal이 끝나기 전에 wheel 입력이 들어오면, 초기 wheel delta가 누적되거나 `introComplete` state 반영 전 첫 작품 전환이 시작될 수 있었다.
- `introCompleteRef`를 추가해 콘텐츠 reveal 완료 순간을 동기적으로 기록했다.
- 초기 reveal이 완전히 끝나기 전의 wheel 입력은 delta를 버리고, 키보드·스와이프를 포함한 작품 전환도 차단한다.
- 이후 첫 전환부터는 기존 최대 1회 queue 정책을 적용한다.

### 검증

- `npm test -- --watchAll=false`: 7 tests passed
- `npm run build`: 성공. 기존 프로젝트 ESLint 경고만 출력됨

## 2026-09-25 - Queued artwork settle-frame fix

### 원인과 수정

- 전환 중 추가 입력이 예약되면 첫 전환의 `currentIndex` 변경과 다음 전환 시작이 같은 렌더에 일어나, 중앙에 도착한 작품이 정착해 보이기 전에 다음 작품 레이어로 교체될 수 있었다.
- 예약 입력을 소비할 때 먼저 `READY`와 중앙 정착 렌더를 만들고, 다음 전환은 0ms 후속 타이머로 시작하도록 변경했다.
- 여러 번의 추가 입력은 기존 정책대로 최대 1회 예약으로 압축한다.

### 검증

- `npm test -- --watchAll=false`: 7 tests passed
- `npm run build`: 성공. 기존 프로젝트 ESLint 경고만 출력됨

## 2026-09-25 - Rapid second-scroll race fix

### 원인과 수정

- 첫 이동 직후 React state가 `MOVING`으로 반영되기 전에 두 번째 wheel 입력이 들어오면, `stateRef`가 아직 `READY`를 가리켜 두 번째 이동이 queue가 아닌 별도 전환으로 시작될 수 있었다.
- `transitionActiveRef`를 추가해 전환 시작 순간부터 동기적으로 활성 상태를 기록했다.
- 전환 중 모든 추가 입력은 즉시 최대 1회 queue로 들어가며, 첫 이동 종료 후 다음 이동 스케줄러가 자동 실행된다.

### 검증

- `npm test -- --watchAll=false`: 7 tests passed
- `npm run build`: 성공. 기존 프로젝트 ESLint 경고만 출력됨

## 2026-09-25 - Queued scroll continuation fix

### 원인과 수정

- 전환 중 추가 스크롤을 받으면 최대 1회를 queue에 저장했지만, 첫 전환 종료 후 `MOVING` 상태만 설정하고 다음 전환 타이머를 생성하지 않아 화면이 멈췄다.
- 이동 타이머 생성 로직을 `scheduleMove`로 분리하고, 예약 입력을 소비할 때 같은 스케줄러를 다시 호출하도록 수정했다.
- 이제 첫 작품 전환이 끝나면 예약된 다음 작품 전환이 자동으로 시작되고, 그 이후에는 정상적으로 `READY`에 정착한다.
- 사용자가 수정한 현재 설정값은 유지했으며, 테스트 기대값만 현재 config와 동기화했다.

### 검증

- `npm test -- --watchAll=false`: 7 tests passed
- `npm run build`: 성공. 기존 프로젝트 ESLint 경고만 출력됨

## 2026-09-25 - Reveal transition at final pose

- `visitor_intro.webm`의 `ended` 시점 약 `4.292초`까지 기다리던 기존 방식을 변경했다.
- README의 최종 정지 시작 시점 `3.500초`를 `silhouetteRevealAtMs`로 사용해, 돌아보기 동작이 끝나고 정지 자세에 들어가는 즉시 fade-out을 시작한다.
- `ended` 이벤트는 중복 방지된 fallback으로 유지해 브라우저 timeupdate 차이에도 콘텐츠가 멈추지 않도록 했다.

## 2026-09-25 - Earlier and longer reveal fade

- WebM 최종 정지 구간의 전환 시작점을 `3500ms`에서 `3200ms`로 앞당겼다.
- 실루엣 fade-out 시간을 `300ms`에서 `600ms`로 늘렸다.
- 나머지 콘텐츠는 `3200ms`부터 시작된 fade-out이 끝나는 시점에 등장한다.

## 2026-09-25 - Reveal timing adjustment

- 페이드아웃 시작점을 `3200ms`에서 `3000ms`로 변경했다.
- 페이드아웃 시간을 `600ms`에서 `1000ms`로 변경했다.

## 2026-09-25 - Updated single intro WebM

### 반영한 수정

- 최신 `docs/walk_animation/README.md`와 `visitor_intro.webm` 기준으로 public 자산을 갱신했다.
- 새 파일 사양: `1920 x 2560`, `VP9 + Alpha`, `24fps`, `103프레임`, 약 `4.292초`.
- 구성: 걷기 4회, `stop_and_turn`, 최종 자세 약 `0.79초` 유지.
- 초기 상태는 단일 WebM의 실제 `ended` 이벤트까지 `entering`으로 유지한다. 이전 버전의 `1.5초` 고정 상태 전환을 제거해 새 영상 중간에 입력이 활성화되지 않게 했다.
- 영상 종료 후 `300ms` fade-out을 거쳐 나머지 Index 콘텐츠를 표시한다.

## 2026-09-23 - Silhouette position comparison

### 반영한 수정

- 실루엣 opacity를 초기값 `0.78`로 원복했다.
- 기본 위치를 작품 정보와 `Scroll to explore` 사이인 `between`으로 변경했다.
- 상단 위치 버튼으로 다음 세 위치를 순환 비교할 수 있다.
	- `Position: info / explore`: 기본 위치
	- `Position: center`: 기존 작품 중앙 위치
	- `Position: above explore`: Explore 문구에 가까운 위치
- 현재 사용자가 조정한 blur `0.833333px`, playbackRate `1.2`, fade timing은 유지했다.

### 검증

- `npm test -- --watchAll=false`: 7 tests passed

## 2026-09-23 - Entrance-only silhouette sequence

### 반영한 수정

- 작품 전환 `moving/turning`에서는 실루엣을 완전히 표시하지 않도록 변경했다.
- Index 최초 진입에서만 중앙 실루엣을 재생한다.
- 진입 순서: `walk` 재생 → `stop_and_turn`으로 돌아보고 멈춤 → 마지막 프레임 유지 → `700ms` 페이드아웃.
- 실루엣 애니메이션과 페이드아웃이 모두 끝난 뒤 Header, 작품, 정보, Explore를 `700ms` 동안 페이드인한다.
- 초기 실루엣 위치는 화면 중앙으로 고정했으며, 기존 위치 비교 버튼은 나머지 콘텐츠가 나타난 뒤에도 유지한다.
- 초기 돌아보기 완료 시점은 고정 타이머가 아니라 `stop_and_turn.webm`의 실제 `ended` 이벤트로 결정한다.

## 2026-09-23 - WebM boundary smoothing

### 반영한 수정

- `walk.webm`의 `loop` 속성을 제거하고 `ended` 이벤트로 반복시켜, 반복 경계에서만 다음 재생을 시작하도록 했다.
- 초기 `turning` 요청이 들어오면 현재 `walk` 반복이 끝날 때까지 기다린 후 `stop_and_turn.webm`으로 전환한다.
- `stop_and_turn.webm`이 실제로 끝난 뒤에만 부모 페이지를 `ready`로 전환하고, 이후 fade-out과 콘텐츠 표시를 시작한다.
- 세 WebM은 계속 preload 상태로 유지하며 활성 레이어만 전환한다.

### 남은 확인

- 실제 Chrome에서 반복 경계의 발 위치와 첫 `stop_and_turn` 프레임이 자연스럽게 이어지는지 확인 필요
- 브라우저별 WebM 디코딩 지연은 `canplay` 대기 방식으로 추가 보완할 수 있음

## 2026-09-23 - Single intro WebM integration

### 반영한 수정

- `docs/walk_animation/visitor_intro.webm`을 `public/reference/walk-animation/visitor_intro.webm`으로 배치했다.
- 기존 `walk`, `stop_and_turn`, `turn_and_walk` 세 파일의 런타임 전환을 제거했다.
- 새 단일 WebM을 처음부터 끝까지 한 번 재생하고 전체 loop는 사용하지 않는다.
- `ended` 이벤트에서 마지막 프레임을 유지한 뒤 기존 fade-out과 Index 콘텐츠 reveal을 시작한다.
- README 기준의 고해상도 `1920 x 2560`, `VP9 + Alpha`, `3.125초` 단일 인트로 자산을 사용한다.

### 검증

- WebM 파일을 public 경로에 복사함
- `npm test -- --watchAll=false`: 7 tests passed
- `npm run build`: 성공. 기존 프로젝트 ESLint 경고만 출력됨

### 검증

- `npm test -- --watchAll=false`: 7 tests passed
- `npm run build`: 성공. 기존 프로젝트 ESLint 경고만 출력됨

## 2026-09-23 - Increase WebM blur for visual comparison

- WebM blur를 `0.35px`에서 `2.5px`로 올려 블러 적용 전후를 화면에서 확실히 비교할 수 있도록 했다.
- opacity `0.55`, playbackRate `1.2`, fade timing은 유지했다.

## 2026-09-23 - Reduce WebM blur

- 사용자 확인 후 WebM blur를 `2.5px`의 1/3인 `0.833333px`로 줄였다.
- opacity, playbackRate, fade timing은 유지했다.

## 2026-09-23 - Remove WebM blur

- Full HD 화질 확인을 위해 WebM blur를 `0.833333px`에서 `0px`로 제거했다.
- opacity `0.78`, playbackRate `1.2`, fade timing은 유지했다.

## 2026-09-23 - Shorter intro silhouette fade-out

- WebM 재생 완료 후 실루엣이 오래 남는 느낌을 줄이기 위해 `silhouetteFadeOutMs`를 `700ms`에서 `300ms`로 줄였다.
- 콘텐츠 reveal 타이밍도 동일하게 앞당겨지며, playbackRate/opacity/blur는 현재 사용자 설정을 유지했다.

## 2026-09-23 - Subtle WebM blur and transparency

### 반영한 수정

- 세 WebM 레이어에 `blur(0.35px)`를 적용해 아주 약한 블러를 추가했다.
- 실루엣 wrapper opacity를 기존 `0.78`에서 `0.55`로 낮췄다.
- 블러와 opacity를 각각 `silhouetteBlurPx`, `silhouetteOpacity` 설정으로 분리했다.
- 사용자 수정값 `silhouettePlaybackRate: 1.2`와 fade timing은 유지했다.

### 검증

- `npm test -- --watchAll=false`: 7 tests passed
- `npm run build`: 성공. 기존 프로젝트 ESLint 경고만 출력됨

## 2026-09-23 - Extended silhouette fade and scale

### 반영한 수정

- 페이드인 시간을 `350ms`에서 `1050ms`로 3배 늘렸다.
- 페이드아웃 시간을 `350ms`에서 `700ms`로 2배 늘렸다.
- 실루엣 크기를 `52 x 118px`에서 `78 x 177px`로 1.5배 확대했다.
- fade 중 위치 고정 규칙은 유지하고 opacity만 변경한다.
- 사용자 수정값 `silhouettePlaybackRate: 1.2`와 작품 전환 타이밍은 유지했다.

### 검증

- `npm test -- --watchAll=false`: 6 tests passed
- `npm run build`: 성공. 기존 프로젝트 ESLint 경고만 출력됨

## 2026-09-23 - Keep silhouette visible through stop-and-turn

### 반영한 수정

- `turning` 상태에서도 실루엣을 유지해 걷기에서 돌아서 멈추는 장면까지 보이게 했다.
- `ready`로 전환되는 순간부터 `350ms` opacity fade-out을 시작해 멈춘 뒤 사라지도록 했다.
- `stop_and_turn.webm`의 약 1.208초 길이와 현재 `playbackRate: 0.9`를 기준으로 `turnLeadMs`를 `1342ms`로 조정했다.
- 작품 전환 `3000ms`의 마지막 `1342ms`가 돌아보기·정지 구간과 겹치며, 사진 중앙 도착과 WebM 마지막 프레임을 맞춘다.

## 2026-09-23 - Initial-entry artwork flash fix

### 원인과 수정

- 첫 진입의 `turning` 상태와 실제 작품 전환의 `turning` 상태를 동일하게 처리해, 입력 전에도 다음 작품 레이어가 잠깐 표시됐다가 원래 작품으로 돌아오는 현상이 있었다.
- 실제 사용자 입력으로 작품 이동을 시작했을 때만 `artworkTransitioning`을 활성화하도록 분리했다.
- 초기 자동 등장과 돌아보기에서는 첫 작품을 유지하고, 작품 전환 후반의 `turning`에서만 다음 작품 레이어가 계속 중앙으로 이동한다.

## 2026-09-23 - Fixed silhouette position and artwork-turn timing

### 반영한 수정

- 실루엣 wrapper에서 fade용 `translateY(10px)`를 제거했다. 이제 fade-in/fade-out 동안 위치와 transform은 고정되고 opacity만 변한다.
- 작품 전환 시간을 `2200ms`에서 `3000ms`로 늘렸다.
- 작품 전환 마지막 `1400ms`에 `turning` 상태를 먼저 시작한다. 이 구간에서 작품은 계속 중앙으로 이동하고 `stop_and_turn.webm`이 동시에 재생된다.
- 전환 완료 시 새 작품을 즉시 정착시키고, 이전 작품 레이어가 되돌아오는 transition이 다시 재생되지 않도록 유지했다.
- 현재 fixture의 사용자 수정값인 `silhouettePlaybackRate: 0.9`는 그대로 존중했다.

### 검증

- `npm test -- --watchAll=false`: 5 tests passed
- `npm run build`: 성공. 기존 프로젝트 ESLint 경고만 출력됨

### 미검증 / 후속 결정

- 실제 브라우저에서 desktop/mobile 휠·키보드·스와이프 조작과 시각적 겹침 확인 필요
- GIF의 걷기·돌아보기·정지 타임라인 제어와 재걷기 연결 미검증
- Bear와 BellFlowers 원본 교체 필요
- 역방향 탐색, 중복 없는 셔플, 실루엣 최종 유지 여부는 후속 결정

## 2026-09-29 - Resume pointer-responsive artwork columns

### Confirmed request and inherited implementation

- Continue the interrupted mouse-responsive gallery work, using https://experiment.obys.agency/ as a reference.
- The existing /index-prototype already had continuous scrolling, catalogue data, the intro, and initial per-card parallax. This change completes that pointer behavior.
- Scope: /index-prototype; the existing Home and Works pages are unchanged.

### Changes

- Listen across the gallery page, including the space above and below the artwork viewport.
- Smooth opposing X/Y motion with a requestAnimationFrame loop; each column uses the existing depth variation. Stop requesting frames after motion settles.
- Ease back to neutral when the pointer leaves the page, is cancelled, or the window loses focus.
- Keep wheel translation independent from pointer motion. Update central artwork information using the actual interpolated card offset; image hover scaling does not affect selection.
- Ignore touch pointers and intro input. Reset offsets and cancel queued work when disabled, unmounted, or switched to reduced motion.
- Restrict hover enlargement to fine pointers that support hover; disable its transition for reduced motion.

### Prototype defaults (not final design decisions)

- Retain pointerMoveX: 16px and pointerMoveY: 24px as maximum amplitudes.
- Retain the existing repeating depth factors (0.42 through 0.98); use a 100ms exponential time constant for pointer smoothing.
- Retain the existing single horizontal track, spacing, and finite scroll bounds.

### Verification and follow-up

- npm test -- --watchAll=false --runInBand: 2 suites, 11 tests passed.
- npm run build: passed; existing warnings in unrelated files and stale Browserslist data remain.
- Added interaction coverage for movement outside the artwork viewport, neutral return, central information, combined wheel/pointer input, intro/touch exclusion, unmount cleanup, and changing reduced-motion preference.
- Reference page was accessible through web text inspection. No interactive browser was available in this session; visual comparison of amplitude/easing with the reference, real-device clipping, and mobile gestures remain to be reviewed.
- Preview: npm start, then /index-prototype. Wait for the intro, move the mouse above/below/across the artworks, scroll in both directions, and leave the page to check neutral return.
