'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { asset } from '../../lib/asset';

export function FeatureVideoPlayer({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [dark, setDark] = useState(false);

  // Reset and play when src changes (desktop feature switching)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    setDark(false);
    video.currentTime = 0;
    video.play().catch(() => {});
  }, [src]);

  const handleEnded = () => {
    setDark(true);
    setTimeout(() => {
      setDark(false);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }
    }, 1000);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-white/[0.10] bg-black">
      <video
        ref={videoRef}
        src={asset(src)}
        autoPlay
        muted
        playsInline
        onEnded={handleEnded}
        className="block h-auto w-full"
      />
      <AnimatePresence>
        {dark && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
