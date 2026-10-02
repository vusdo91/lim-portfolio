import {
  clampGalleryOffset,
  getCentralArtworkId,
  getGalleryArtworks,
  getNextGalleryOffset,
  getPointerParallaxOffset,
  getWheelDelta
} from './utils/indexPrototypeLogic';
import { indexPrototypeConfig } from './data/indexPrototypeArtworks';
import defaultArtworks from './data/artworks';

test('maps wheel movement proportionally and supports reverse direction', () => {
  expect(getNextGalleryOffset(100, 20, 500, 2)).toBe(140);
  expect(getNextGalleryOffset(100, -30, 500, 2)).toBe(40);
});

test('clamps the continuous gallery at both ends without wrapping', () => {
  expect(getNextGalleryOffset(0, -100, 500)).toBe(0);
  expect(getNextGalleryOffset(480, 100, 500)).toBe(500);
  expect(clampGalleryOffset(200, 0)).toBe(0);
});

test('normalizes mouse wheel, trackpad, and page-mode deltas', () => {
  expect(getWheelDelta({ deltaX: 0, deltaY: 80, deltaMode: 0 }, 1200, 800)).toBe(80);
  expect(getWheelDelta({ deltaX: 10, deltaY: 4, deltaMode: 0 }, 1200, 800)).toBe(10);
  expect(getWheelDelta({ deltaX: 0, deltaY: 2, deltaMode: 1 }, 1200, 800)).toBe(32);
  expect(getWheelDelta({ deltaX: 0, deltaY: 1, deltaMode: 2 }, 1200, 800)).toBe(800);
});

test('maps pointer movement to bounded opposing column parallax', () => {
  expect(getPointerParallaxOffset(-1, -1)).toEqual({ x: 16, y: 24 });
  expect(getPointerParallaxOffset(0, 0)).toEqual({ x: 0, y: 0 });
  expect(getPointerParallaxOffset(2, -2, 0.5)).toEqual({ x: -8, y: 12 });
});

test('selects the nearest artwork in the center region and applies hysteresis', () => {
  const centers = [
    { id: 'left', center: 390 },
    { id: 'middle', center: 510 },
    { id: 'right', center: 670 }
  ];

  expect(getCentralArtworkId(centers, 500, 100)).toBe('middle');
  expect(getCentralArtworkId(centers, 500, 80, 'left', 40)).toBe('middle');
  expect(getCentralArtworkId([
    { id: 'previous', center: 560 },
    { id: 'candidate', center: 540 }
  ], 500, 50, 'previous', 20)).toBe('previous');
  expect(getCentralArtworkId(centers, 600, 40)).toBe(null);
});

test('uses continuous non-snapping gallery tuning', () => {
  expect(indexPrototypeConfig.scrollSensitivity).toBeGreaterThan(0);
  expect(indexPrototypeConfig.centerZoneRatio).toBe(0.1);
  expect(indexPrototypeConfig.artworkHoverScale).toBe(1.045);
  expect(indexPrototypeConfig.pointerMoveX).toBe(24);
  expect(indexPrototypeConfig.pointerMoveY).toBe(36);
});

test('uses remote artworks when available and falls back to the full local catalogue', () => {
  expect(getGalleryArtworks([], defaultArtworks)).toHaveLength(41);
  expect(getGalleryArtworks([{ id: 9, title: 'Current', image: '/current.jpg', year: 2025 }], defaultArtworks)).toEqual([
    { id: '9', title: 'Current', image: '/current.jpg', year: '2025' }
  ]);
  expect(getGalleryArtworks([], defaultArtworks, false)).toEqual([]);
});
