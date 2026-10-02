import React, { forwardRef, useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
`;
export const ImageSkeleton = styled.div`
  background: linear-gradient(100deg, #eeeeec 25%, #f7f7f5 45%, #eeeeec 65%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.6s ease-in-out infinite;
  @media (prefers-reduced-motion: reduce) { animation: none; }
`;
const Frame = styled.span`
  position: relative;
  display: inline-grid;
  grid-area: 1 / 1;
  max-width: 100%;
  vertical-align: middle;
  > img { grid-area: 1 / 1; }
  > ${ImageSkeleton} { position: absolute; inset: 0; pointer-events: none; }
`;

const SkeletonImage = forwardRef(function SkeletonImage({ src, alt = '', style, onLoad, onError, pending = false, skeletonStyle, bare = false, ...props }, forwardedRef) {
  const imageRef = useRef(null);
  const [result, setResult] = useState({ src: null, ready: false, failed: false });
  const ready = result.src === src && result.ready;
  const failed = result.src === src && result.failed;
  useEffect(() => {
    let active = true;
    const image = imageRef.current;
    if (image?.complete && image.naturalWidth > 0) {
      const done = () => {
        if (active) setResult({ src, ready: true, failed: false });
      };
      if (image.decode) image.decode().catch(() => {}).then(done);
      else done();
    }
    return () => { active = false; };
  }, [src]);
  const loaded = event => {
    const image = event.currentTarget;
    const loadedSrc = src;
    const done = () => {
      if (imageRef.current === image && image.getAttribute('src') === loadedSrc) {
        setResult({ src: loadedSrc, ready: true, failed: false });
        onLoad?.({ ...event, currentTarget: image, target: image });
      }
    };
    if (image.decode) image.decode().catch(() => {}).then(done);
    else done();
  };
  const content = <>
    <img {...props} src={src} alt={alt} ref={node => {
      imageRef.current = node;
      if (typeof forwardedRef === 'function') forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    }} style={{ ...(!ready ? { aspectRatio: '4 / 3', minWidth: 'min(240px, 60vw)' } : {}), ...style, opacity: ready && !pending ? style?.opacity : 0 }} onLoad={loaded} onError={event => {
      setResult({ src, ready: false, failed: true });
      onError?.(event);
    }} />
    {(!ready || pending) && <ImageSkeleton aria-hidden="true" data-image-skeleton style={{ ...(bare ? { position: 'absolute', width: '100%', height: 'min(44.8vh, 448px)', maxHeight: '100%', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' } : {}), ...(failed ? { animation: 'none' } : {}) }} />}
    {failed && <span role="status" style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: 12 }}>이미지를 불러올 수 없습니다.</span>}
  </>;
  return bare ? content : <Frame style={skeletonStyle} aria-busy={!ready && !failed}>{content}</Frame>;
});

export default SkeletonImage;
