import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import type { Post } from '../types/api';

interface ContentSwiperProps {
  posts: Post[];
  onLoadMore?: () => void;
}

export function ContentSwiper({ posts, onLoadMore }: ContentSwiperProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const currentPost = posts[currentIndex];

  const handleNext = () => {
    if (currentIndex < posts.length - 1) {
      setDirection(1);
      setCurrentIndex(currentIndex + 1);
    } else if (onLoadMore) {
      onLoadMore();
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handleBack,
    trackMouse: true,
  });

  if (!currentPost) return <div className="h-screen flex items-center justify-center bg-black text-white">No content</div>;

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black overflow-hidden" {...swipeHandlers}>
      <AnimatePresence initial={false} custom={direction}>
        <motion.div key={currentPost.id} custom={direction} initial={{ opacity: 0, x: direction > 0 ? 300 : -300 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: direction > 0 ? -300 : 300 }} transition={{ duration: 0.3 }} className="absolute inset-0 w-full h-full">
          {currentPost.content_type === 'video' ? (
            <iframe src={currentPost.content_url} className="w-full h-full" allow="accelerometer; autoplay" allowFullScreen />
          ) : (
            <img src={currentPost.content_url} alt={currentPost.title} className="w-full h-full object-cover" />
          )}
        </motion.div>
      </AnimatePresence>
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/70 to-transparent z-10 pointer-events-none" />
      <div className="absolute top-6 left-0 right-0 z-20 pointer-events-none"><div className="text-white text-sm text-center font-medium drop-shadow-lg">{currentIndex + 1} / {posts.length}</div></div>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent pt-32 pb-32 px-6 z-10 pointer-events-none"><p className="text-white text-center text-xl font-semibold drop-shadow-2xl leading-relaxed">{currentPost.title}</p></div>
      <div className="absolute bottom-8 left-0 right-0 flex justify-between items-center px-8 z-30">
        <button onClick={handleBack} disabled={currentIndex === 0} className="w-16 h-16 rounded-full bg-white/95 hover:bg-white shadow-2xl flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 active:scale-90 border-2 border-white/20" aria-label="Previous">
          <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button onClick={handleNext} className="w-16 h-16 rounded-full bg-white/95 hover:bg-white shadow-2xl flex items-center justify-center transition-all duration-200 active:scale-90 border-2 border-white/20" aria-label="Next">
          <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  );
}
