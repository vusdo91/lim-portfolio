import {
  DEFAULT_HOME_SETTINGS,
  getHomeArtworkIds,
  getInitialHomeArtworkIds
} from './homeSettings';

const artworks = Array.from({ length: 12 }, (_, index) => ({
  id: `art-${index + 1}`
}));

test('uses the current home exhibition information as initial values', () => {
  expect(DEFAULT_HOME_SETTINGS).toEqual({
    exhibitionTitle: '늑대, 양, 양배추를 옮기는 방법',
    exhibitionDate: '2026. 09. 30 - 2026. 10. 21',
    galleryName: 'Gallery Daeheung'
  });
});

test('defaults to the ten newest artworks and preserves an explicitly empty selection', () => {
  expect(getInitialHomeArtworkIds(artworks)).toEqual(
    artworks.slice(0, 10).map(artwork => artwork.id)
  );
  expect(getHomeArtworkIds({}, artworks)).toHaveLength(10);
  expect(getHomeArtworkIds({ homeArtworkIds: [] }, artworks)).toEqual([]);
  expect(getHomeArtworkIds({ homeArtworkIds: ['art-12', 'deleted'] }, artworks)).toEqual(['art-12']);
});
