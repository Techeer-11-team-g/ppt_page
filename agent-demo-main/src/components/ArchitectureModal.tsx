import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useCallback, useEffect } from 'react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ArchitectureModal({ isOpen, onClose }: ArchitectureModalProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const posStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // 모달이 닫히면 zoom/pan 리셋
  useEffect(() => {
    if (!isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen]);

  // 마우스 휠 줌
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.stopPropagation();
    const delta = e.deltaY > 0 ? -0.15 : 0.15;
    setScale((prev) => Math.min(5, Math.max(0.5, prev + delta)));
  }, []);

  // 드래그 시작
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (scale <= 1) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    posStart.current = { ...position };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [scale, position]);

  // 드래그 이동
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setPosition({
      x: posStart.current.x + dx,
      y: posStart.current.y + dy,
    });
  }, [isDragging]);

  // 드래그 종료
  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // 더블클릭으로 줌 토글
  const handleDoubleClick = useCallback(() => {
    if (scale > 1) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    } else {
      setScale(2.5);
    }
  }, [scale]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* 배경 오버레이 */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Orb에서 확장되는 콘텐츠 */}
          <motion.div
            ref={containerRef}
            className="relative overflow-hidden"
            style={{
              cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
            }}
            initial={{
              width: 200,
              height: 200,
              borderRadius: '50%',
              scale: 0.2,
              opacity: 0,
              boxShadow: '0 0 80px rgba(150, 180, 255, 0.6), 0 0 40px rgba(255, 150, 200, 0.4)',
            }}
            animate={{
              width: '90vw',
              height: '85vh',
              borderRadius: '24px',
              scale: 1,
              opacity: 1,
              boxShadow: '0 0 60px rgba(150, 180, 255, 0.2), 0 25px 50px rgba(0, 0, 0, 0.5)',
            }}
            exit={{
              width: 200,
              height: 200,
              borderRadius: '50%',
              scale: 0.2,
              opacity: 0,
              boxShadow: '0 0 80px rgba(150, 180, 255, 0.6), 0 0 40px rgba(255, 150, 200, 0.4)',
            }}
            transition={{
              type: 'spring',
              stiffness: 80,
              damping: 18,
              mass: 0.8,
            }}
            onWheel={handleWheel}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onDoubleClick={handleDoubleClick}
          >
            {/* 배경 */}
            <div
              className="absolute inset-0 rounded-[inherit]"
              style={{
                background: `linear-gradient(135deg,
                  rgba(20, 20, 40, 0.98) 0%,
                  rgba(10, 10, 30, 0.99) 100%)`,
              }}
            />

            {/* 이미지 컨테이너 */}
            <motion.div
              className="relative w-full h-full flex items-center justify-center p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <img
                src="/sys.png"
                alt="System Architecture"
                className="max-w-full max-h-full object-contain select-none"
                draggable={false}
                style={{
                  transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                  transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                }}
              />
            </motion.div>

            {/* 닫기 버튼 */}
            <motion.button
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              whileHover={{ scale: 1.1, background: 'rgba(255, 255, 255, 0.2)' }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <span className="text-white/80 text-lg leading-none">&times;</span>
            </motion.button>

            {/* 줌 안내 */}
            <motion.div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-full"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <p className="text-white/50 text-xs">
                스크롤로 확대 / 더블클릭으로 줌 토글 / 확대 후 드래그로 이동
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
