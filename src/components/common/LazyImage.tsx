import React, { useState, useRef, useEffect } from 'react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
  placeholder?: string;
  threshold?: number;
  className?: string;
}

/**
 * Lazy loading image component with intersection observer
 * Improves performance by only loading images when they're visible
 */
export default function LazyImage({
  src,
  alt,
  fallback = '/placeholder-image.png',
  placeholder,
  threshold = 0.1,
  className = '',
  ...props
}: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [inView, setInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  const handleLoad = () => {
    setLoaded(true);
  };

  const handleError = () => {
    setError(true);
    setLoaded(true);
  };

  const imageSrc = error ? fallback : src;
  const shouldLoad = inView || loaded;

  return (
    <div className={`lazy-image ${className}`}>
      {/* Placeholder while loading */}
      {!loaded && placeholder && (
        <div className="lazy-image__placeholder">
          <img src={placeholder} alt="" aria-hidden="true" />
        </div>
      )}
      
      {/* Main image */}
      <img
        ref={imgRef}
        src={shouldLoad ? imageSrc : undefined}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={`lazy-image__img ${
          loaded ? 'lazy-image__img--loaded' : 'lazy-image__img--loading'
        }`}
        loading="lazy"
        decoding="async"
        {...props}
      />
    </div>
  );
}