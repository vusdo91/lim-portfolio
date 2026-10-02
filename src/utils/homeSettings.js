export const DEFAULT_HOME_SETTINGS = {
  exhibitionTitle: '늑대, 양, 양배추를 옮기는 방법',
  exhibitionDate: '2026. 09. 30 - 2026. 10. 21',
  galleryName: 'Gallery Daeheung'
};

export const getInitialHomeArtworkIds = artworks => (
  artworks.slice(0, 10).map(artwork => String(artwork.id))
);

export const getHomeArtworkIds = (profile, artworks) => (
  Array.isArray(profile.homeArtworkIds)
    ? profile.homeArtworkIds.map(String).filter(id => artworks.some(artwork => String(artwork.id) === id))
    : getInitialHomeArtworkIds(artworks)
);
