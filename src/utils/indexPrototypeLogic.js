export const clampGalleryOffset = (offset, maxOffset) => (
  Math.min(Math.max(offset, 0), Math.max(maxOffset, 0))
);

export const getNextGalleryOffset = (offset, delta, maxOffset, sensitivity = 1) => (
  clampGalleryOffset(offset + delta * sensitivity, maxOffset)
);

export const getWheelDelta = (event, viewportWidth, viewportHeight) => {
  const unit = event.deltaMode === 1
    ? 16
    : event.deltaMode === 2
      ? viewportHeight
      : 1;
  const horizontalDelta = event.deltaX * unit;
  const verticalDelta = event.deltaY * unit;
  return Math.abs(horizontalDelta) > Math.abs(verticalDelta)
    ? horizontalDelta
    : verticalDelta;
};

export const getCentralArtworkId = (
  artworkCenters,
  viewportCenter,
  activeHalfWidth,
  previousId = null,
  hysteresis = 0
) => {
  const previous = artworkCenters.find(item => item.id === previousId);
  const centered = artworkCenters
    .filter(item => Math.abs(item.center - viewportCenter) <= activeHalfWidth)
    .sort((left, right) => (
      Math.abs(left.center - viewportCenter) - Math.abs(right.center - viewportCenter)
    ));
  const nearest = centered[0];

  if (previous) {
    const previousDistance = Math.abs(previous.center - viewportCenter);
    const nearestDistance = nearest
      ? Math.abs(nearest.center - viewportCenter)
      : Number.POSITIVE_INFINITY;
    if (
      previousDistance <= activeHalfWidth + hysteresis &&
      previousDistance <= nearestDistance + hysteresis
    ) {
      return previous.id;
    }
  }

  return nearest?.id ?? null;
};

export const getGalleryArtworks = (remoteArtworks, fallbackArtworks, fallbackWhenEmpty = true) => {
  const source = remoteArtworks.length > 0 || !fallbackWhenEmpty ? remoteArtworks : fallbackArtworks;
  return source
    .filter(artwork => artwork?.image && artwork?.title)
    .map((artwork, index) => ({
      ...artwork,
      id: String(artwork.id ?? index),
      year: artwork.year == null ? '' : String(artwork.year)
    }));
};

export const getPointerParallaxOffset = (
  normalizedX,
  normalizedY,
  depth = 1,
  maxX = 16,
  maxY = 24
) => ({
  x: -Math.max(-1, Math.min(1, normalizedX)) * maxX * depth || 0,
  y: -Math.max(-1, Math.min(1, normalizedY)) * maxY * depth || 0
});
