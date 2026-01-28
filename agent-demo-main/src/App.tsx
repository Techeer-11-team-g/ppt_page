import { useState, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AgentOrb } from '@/components/AgentOrb';
import { MagneticInput } from '@/components/MagneticInput';

// Catmull-Rom 스플라인 보간 (더 부드러운 곡선)
function catmullRom(t: number, p0: number, p1: number, p2: number, p3: number): number {
  const t2 = t * t;
  const t3 = t2 * t;
  return 0.5 * (
    (2 * p1) +
    (-p0 + p2) * t +
    (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
    (-p0 + 3 * p1 - 3 * p2 + p3) * t3
  );
}

function generateSmoothKeyframes(steps: number) {
  const times: number[] = [];
  const x: string[] = [];
  const y: string[] = [];
  const scale: number[] = [];
  const opacity: number[] = [];

  const pathPoints = [
    [-45, -45, 0.15],
    [-42, -35, 0.25],
    [-38, -20, 0.5],
    [-30, 5, 1.2],
    [-15, 25, 2.5],
    [5, 30, 4],
    [20, 25, 3.5],
    [25, 10, 2],
    [15, -5, 1.3],
    [0, -5, 1],
  ];

  const n = pathPoints.length;

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    times.push(t);

    const segmentFloat = t * (n - 1);
    const segmentIndex = Math.min(Math.floor(segmentFloat), n - 2);
    const segmentT = segmentFloat - segmentIndex;

    const p0 = pathPoints[Math.max(0, segmentIndex - 1)];
    const p1 = pathPoints[segmentIndex];
    const p2 = pathPoints[Math.min(n - 1, segmentIndex + 1)];
    const p3 = pathPoints[Math.min(n - 1, segmentIndex + 2)];

    const xVal = catmullRom(segmentT, p0[0], p1[0], p2[0], p3[0]);
    const yVal = catmullRom(segmentT, p0[1], p1[1], p2[1], p3[1]);
    const scaleVal = catmullRom(segmentT, p0[2], p1[2], p2[2], p3[2]);

    x.push(`${xVal}vw`);
    y.push(`${yVal}vh`);
    scale.push(Math.max(0.05, scaleVal));
    opacity.push(Math.min(1, t * 8));
  }

  return { times, x, y, scale, opacity };
}

interface Message {
  id: number;
  role: 'user' | 'agent';
  content: string;
}

type LayoutMode = 'default' | 'architecture';

const archDescription = `저는 Google Cloud Platform 위에 구축되었어요.

프론트엔드는 Vercel에서 호스팅되고, TypeScript + React로 만들어졌어요.

백엔드는 Nginx → Django REST Framework + Gunicorn 조합이고, Google Compute Engine의 Docker 컨테이너에서 돌아가고 있어요.

비동기 작업은 RabbitMQ + Celery로 처리하고, Redis로 캐싱해요.

데이터는 Cloud SQL(MySQL)에 저장하고, OpenSearch로 검색 기능을 제공해요.

외부 API로는 Google Vision, Claude Anthropic, OpenAI, The New Black API를 활용하고 있어요.

모니터링은 Prometheus, Jaeger, Loki + Promtail, Grafana로 하고, 이상 감지 시 Slack으로 알림을 보내요.

배포는 GitHub Actions를 통한 CI/CD 파이프라인으로 자동화되어 있어요.`;

function App() {
  const [textQuery, setTextQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageId, setMessageId] = useState(0);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('default');

  // 이미지 줌/패닝 상태
  const [imgScale, setImgScale] = useState(1);
  const [imgPos, setImgPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const posStart = useRef({ x: 0, y: 0 });

  const entranceKeyframes = useMemo(() => generateSmoothKeyframes(1000), []);

  const handleSubmit = useCallback(() => {
    if (!textQuery.trim()) return;

    const query = textQuery;

    const userMessage: Message = {
      id: messageId,
      role: 'user',
      content: query,
    };
    setMessages((prev) => [...prev, userMessage]);
    setMessageId((prev) => prev + 1);
    setTextQuery('');

    const isArchQuestion = query.includes('어떻게 만들어') || query.includes('어떻게 만들') || query.includes('아키텍처');

    setTimeout(() => {
      const agentMessage: Message = {
        id: messageId + 1,
        role: 'agent',
        content: isArchQuestion
          ? '제 아키텍처를 보여드릴게요! 제 몸속을 들여다보세요 ✨'
          : getAgentResponse(query),
      };
      setMessages((prev) => [...prev, agentMessage]);
      setMessageId((prev) => prev + 2);

      if (isArchQuestion) {
        setTimeout(() => {
          setLayoutMode('architecture');
          setImgScale(1);
          setImgPos({ x: 0, y: 0 });
        }, 600);
      }
    }, 1000);
  }, [textQuery, messageId]);

  // 이미지 인터랙션
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.stopPropagation();
    const delta = e.deltaY > 0 ? -0.15 : 0.15;
    setImgScale((prev) => Math.min(5, Math.max(0.5, prev + delta)));
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (imgScale <= 1) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    posStart.current = { ...imgPos };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [imgScale, imgPos]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    setImgPos({
      x: posStart.current.x + e.clientX - dragStart.current.x,
      y: posStart.current.y + e.clientY - dragStart.current.y,
    });
  }, [isDragging]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDoubleClick = useCallback(() => {
    if (imgScale > 1) {
      setImgScale(1);
      setImgPos({ x: 0, y: 0 });
    } else {
      setImgScale(2.5);
    }
  }, [imgScale]);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">

      <AnimatePresence mode="wait">
        {layoutMode === 'default' ? (
          /* ===== 기본 레이아웃 ===== */
          <motion.div
            key="default"
            className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Agent Orb */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, scale: 0.15, x: '-45vw', y: '-45vh' }}
              animate={{
                opacity: entranceKeyframes.opacity,
                scale: entranceKeyframes.scale,
                x: entranceKeyframes.x,
                y: entranceKeyframes.y,
              }}
              transition={{
                duration: 2.5,
                times: entranceKeyframes.times,
                ease: 'linear',
              }}
              style={{ willChange: 'transform, opacity' }}
            >
              <AgentOrb state="idle" size="xl" />
            </motion.div>

            {/* Messages */}
            <div className="w-full max-w-md mb-8 min-h-[200px] max-h-[300px] overflow-y-auto">
              <AnimatePresence mode="popLayout">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    className={`mb-3 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ type: 'spring', damping: 20 }}
                  >
                    <div
                      className={`inline-block px-4 py-2.5 rounded-2xl max-w-[80%] ${
                        message.role === 'user'
                          ? 'bg-white/15 text-white'
                          : 'bg-gradient-to-br from-purple-500/20 to-blue-500/20 text-white/90 border border-white/10'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Input */}
            <motion.div
              className="w-full max-w-md"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <MagneticInput
                value={textQuery}
                onChange={setTextQuery}
                onSubmit={handleSubmit}
                placeholder="에이전트에게 물어보세요..."
                showImageButton={true}
                showVoiceButton={false}
                disabled={false}
              />
            </motion.div>
          </motion.div>
        ) : (
          /* ===== 아키텍처 레이아웃 ===== */
          <motion.div
            key="architecture"
            className="relative z-10 flex min-h-screen gap-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* 왼쪽: 아키텍처 이미지 */}
            <motion.div
              className="flex-1 relative overflow-hidden"
              style={{
                cursor: imgScale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
              }}
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              transition={{ type: 'spring', stiffness: 60, damping: 18 }}
              onWheel={handleWheel}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onDoubleClick={handleDoubleClick}
            >
              {/* 이미지 배경 */}
              <div
                className="absolute inset-0"
                style={{
                  background: '#000000',
                }}
              />

              {/* 이미지 */}
              <motion.div
                className="relative w-full h-full flex items-center justify-end py-4 pr-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <img
                  src="/sys.png"
                  alt="System Architecture"
                  className="max-w-full max-h-full object-contain select-none"
                  draggable={false}
                  style={{
                    transform: `scale(${imgScale}) translate(${imgPos.x / imgScale}px, ${imgPos.y / imgScale}px)`,
                    transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                  }}
                />
              </motion.div>

              {/* 줌 안내 */}
              <motion.div
                className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full"
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <p className="text-white/40 text-xs">
                  스크롤로 확대 · 더블클릭 줌 토글 · 확대 후 드래그
                </p>
              </motion.div>

              {/* 뒤로가기 버튼 */}
              <motion.button
                className="absolute top-4 left-4 px-4 py-2 rounded-full text-xs text-white/60"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
                onClick={() => setLayoutMode('default')}
                whileHover={{ scale: 1.05, background: 'rgba(255, 255, 255, 0.15)' }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                ← 돌아가기
              </motion.button>
            </motion.div>

            {/* 오른쪽: Orb + 설명 + 인풋 */}
            <motion.div
              className="w-[700px] flex flex-col items-center justify-center py-6 pl-2 pr-16"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              transition={{ type: 'spring', stiffness: 60, damping: 18, delay: 0.1 }}
            >
              {/* Orb */}
              <motion.div
                className="mb-10"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 100, damping: 15 }}
              >
                <AgentOrb state="idle" size="xl" />
              </motion.div>

              {/* 설명 텍스트 */}
              <motion.div
                className="w-full overflow-y-auto max-h-[40vh] mb-12 px-2"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <div
                  className="rounded-2xl p-5"
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  {archDescription.split('\n\n').map((paragraph, i) => (
                    <motion.p
                      key={i}
                      className="text-sm text-white/70 leading-relaxed mb-3 last:mb-0"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + i * 0.15 }}
                    >
                      {paragraph}
                    </motion.p>
                  ))}
                </div>
              </motion.div>

              {/* 인풋 */}
              <motion.div
                className="w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <MagneticInput
                  value={textQuery}
                  onChange={setTextQuery}
                  onSubmit={handleSubmit}
                  placeholder="에이전트에게 물어보세요..."
                  showImageButton={true}
                  showVoiceButton={false}
                  disabled={false}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper function to generate demo responses
function getAgentResponse(query: string): string {
  const responses = [
    '요청하신 스타일을 찾아봤어요! 깔끔한 미니멀 룩 3가지를 추천드려요.',
    '트렌디한 코디를 찾으셨네요. 이번 시즌 인기 아이템들을 모아봤어요!',
    '완벽한 매치를 찾았어요. 이 조합은 어떠세요?',
    '좋은 선택이에요! 비슷한 스타일의 다른 옵션도 보여드릴게요.',
    '검색 결과를 정리했어요. 가격대와 스타일 모두 고려했답니다.',
  ];

  return responses[query.length % responses.length];
}

export default App;
