import { useRef, useState, useCallback, useEffect, createContext, useContext } from 'react';
import { motion, useInView, useScroll, useTransform, useSpring } from 'framer-motion';
import { AgentOrb } from './AgentOrb';
import { TrendingUp, Search, ShoppingBag, Upload, Scan, Sparkles, Eye, Link2 } from 'lucide-react';

// =============================================
// Props
// =============================================
export interface LandingPageProps {
  /** CTA 버튼 클릭 콜백 */
  onEnter?: () => void;
}

// =============================================
// Scroll Container Context
// =============================================
const ScrollContainerContext = createContext<React.RefObject<HTMLDivElement> | null>(null);

// =============================================
// Jelly Section Wrapper - 젤리처럼 탄성있는 페이지 전환
// =============================================
function JellySection({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useContext(ScrollContainerContext);

  const { scrollYProgress } = useScroll({
    target: ref,
    container: containerRef || undefined,
    offset: ['start end', 'end start'],
  });

  // 스프링 설정 - 젤리같은 탄성
  const springConfig = { stiffness: 80, damping: 15, mass: 0.8 };

  // 스크롤 진행에 따른 변환
  const rawScale = useTransform(scrollYProgress, [0, 0.35, 0.5, 0.65, 1], [0.88, 0.96, 1, 0.96, 0.88]);
  const rawY = useTransform(scrollYProgress, [0, 0.35, 0.5, 0.65, 1], [80, 20, 0, -20, -80]);
  const rawOpacity = useTransform(scrollYProgress, [0, 0.3, 0.5, 0.7, 1], [0.4, 0.9, 1, 0.9, 0.4]);

  // 스프링으로 부드럽게 (더 탄성있게)
  const scale = useSpring(rawScale, springConfig);
  const y = useSpring(rawY, springConfig);
  const opacity = useSpring(rawOpacity, springConfig);

  return (
    <div
      ref={ref}
      data-section
      className="h-screen flex-shrink-0 snap-start snap-always"
    >
      <motion.div
        className="h-full w-full origin-center"
        style={{ scale, y, opacity }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// =============================================
// Main Landing Page Component
// =============================================
export function LandingPage({ onEnter }: LandingPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentSection = useRef(0);
  const isScrolling = useRef(false);

  const handleEnter = useCallback(() => {
    onEnter?.();
  }, [onEnter]);

  const scrollToSection = useCallback((index: number) => {
    const container = containerRef.current;
    const sections = container?.querySelectorAll<HTMLElement>('[data-section]');
    if (!container || !sections || index < 0 || index >= sections.length) return;
    isScrolling.current = true;
    currentSection.current = index;
    container.scrollTo({
      top: sections[index].offsetTop,
      behavior: 'smooth',
    });
    setTimeout(() => { isScrolling.current = false; }, 1000);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleKey = (e: KeyboardEvent) => {
      if (isScrolling.current) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        scrollToSection(currentSection.current + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        scrollToSection(currentSection.current - 1);
      }
    };

    // Sync currentSection on container scroll
    const handleScroll = () => {
      if (isScrolling.current) return;
      const sections = container.querySelectorAll<HTMLElement>('[data-section]');
      if (!sections) return;
      const scrollY = container.scrollTop + window.innerHeight / 3;
      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i].offsetTop <= scrollY) {
          currentSection.current = i;
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKey);
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('keydown', handleKey);
      container.removeEventListener('scroll', handleScroll);
    };
  }, [scrollToSection]);

  return (
    <ScrollContainerContext.Provider value={containerRef}>
      <div
        ref={containerRef}
        className="relative h-screen snap-y snap-mandatory overflow-y-auto overflow-x-hidden bg-black text-white"
        style={{ scrollBehavior: 'smooth', perspective: '1000px' }}
      >
        <JellySection><IntroStorySection /></JellySection>
        <JellySection><ProblemSection /></JellySection>
        <JellySection><InstagramFeedSection /></JellySection>
        <JellySection><TransitionSection /></JellySection>
        <JellySection><BrokenChainSection /></JellySection>
        <JellySection><QuestionSection /></JellySection>
        <JellySection><BrandRevealSection /></JellySection>
        <JellySection><VideoHeroSection /></JellySection>
        {/* 5단계 워크플로우 - 하나의 슬라이드에 모두 표시 */}
        <JellySection><WorkflowStepsSection /></JellySection>
        <JellySection><GetStartedSection onEnter={handleEnter} /></JellySection>
        <JellySection><DemoSection /></JellySection>
        <JellySection><AgentIntroSection /></JellySection>
        <JellySection><FullPipelineSection /></JellySection>
        <JellySection><DressenseVideoSection /></JellySection>
        <JellySection><TeamSection /></JellySection>
        <JellySection><Footer /></JellySection>
      </div>
    </ScrollContainerContext.Provider>
  );
}

// =============================================
// Intro Story Section
// =============================================
function IntroStorySection() {
  return (
    <section className="flex h-screen items-center justify-center px-6 md:px-20">
      <motion.div
        className="flex w-full max-w-6xl flex-col items-center gap-16 md:flex-row md:items-center md:justify-between"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '0px' }}
        transition={{ duration: 0.8 }}
      >
        {/* Left — Story Text */}
        <div className="flex-1">
          <motion.p
            className="mb-8 text-base uppercase tracking-[0.3em] text-white/40 md:text-lg"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            오늘의 주인공
          </motion.p>

          <motion.h2
            className="mb-6 text-[clamp(3rem,7vw,5rem)] font-semibold tracking-tight text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            개발자 채린씨
          </motion.h2>

          <motion.p
            className="mb-6 text-xl text-white/40 md:text-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            테커로 개발에 처음 입문한 스물 한 살 청춘
          </motion.p>

          <motion.div
            className="space-y-4 text-2xl leading-relaxed text-white/60 md:text-3xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            <p>채린씨는 요즘 <span className="text-white">고민</span>이 하나 생겼어요.</p>
          </motion.div>
        </div>

        {/* Right — Phone Mockup */}
        <motion.div
          className="flex flex-shrink-0 items-center justify-center"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="relative h-[600px] w-[300px] rounded-[3rem] border-2 border-white/15 bg-white/[0.03] p-3 md:h-[720px] md:w-[350px]">
            {/* Notch */}
            <div className="absolute left-1/2 top-3 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-black/60" />
            {/* Screen */}
            <div className="h-full w-full overflow-hidden rounded-[2rem]">
              <img
                src="/chaerin.jpeg"
                alt="채린씨"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

// =============================================
// Problem Section - 300일
// =============================================
function ProblemSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.5 });
  const [showSecond, setShowSecond] = useState(false);

  useEffect(() => {
    if (isInView && !showSecond) {
      const timer = setTimeout(() => setShowSecond(true), 800);
      return () => clearTimeout(timer);
    }
  }, [isInView, showSecond]);

  return (
    <section ref={sectionRef} className="flex h-screen items-center justify-center px-6">
      <div className="text-center">
        <motion.p
          className="mb-6 text-[clamp(2.5rem,6vw,4.5rem)] font-semibold leading-tight tracking-tight text-white"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          다음 주가 남자친구와 <span className="text-white">300일</span>인데,
        </motion.p>
        <motion.p
          className="text-[clamp(2rem,5vw,4rem)] font-medium text-white/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: showSecond ? 1 : 0, y: showSecond ? 0 : 20 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          입을 옷이 없다..!
        </motion.p>
      </div>
    </section>
  );
}

// =============================================
// Instagram Feed Section (with comments fade-in animation)
// =============================================
function InstagramFeedSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.5 });
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    if (isInView && !showComments) {
      const timer = setTimeout(() => setShowComments(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [isInView, showComments]);

  const comments = [
    { user: 'chaerin_dev', text: '옷 정보 알려주세요!' },
    { user: 'user_1234', text: '저도 궁금해요ㅠㅠ' },
    { user: 'fashion_lover', text: '브랜드가 어디에요?' },
    { user: 'style_hunter', text: '링크 있나요?' },
  ];

  return (
    <section ref={sectionRef} className="flex h-screen items-center justify-center px-6 md:px-20">
      <div className="relative flex w-full max-w-6xl flex-col items-center">
        {/* Main container with phone + annotations */}
        <div className="relative flex w-full items-center justify-center gap-8 md:gap-12">
          {/* Left annotation - minimal */}
          <motion.div
            className="hidden max-w-[200px] text-right md:block"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-2xl font-light text-white/60">
              "이거다!"
            </p>
            <p className="mt-3 text-sm text-white/30">
              ...근데 어디 옷이지?
            </p>
          </motion.div>

          {/* Center — Phone Mockup with Video */}
          <motion.div
            className="flex-shrink-0"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative h-[600px] w-[300px] rounded-[3rem] border-2 border-white/15 bg-white/[0.03] p-3 md:h-[720px] md:w-[350px]">
              <div className="absolute left-1/2 top-3 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-black/60" />
              <div className="h-full w-full overflow-hidden rounded-[2rem]">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="h-full w-full object-cover"
                >
                  <source
                    src="https://storage.googleapis.com/team_g_bucket_00310/video/pr1.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>
            </div>
          </motion.div>

          {/* Right — Comments Section (fade in) */}
          <motion.div
            className="hidden max-w-[320px] md:block"
            initial={{ opacity: 0, x: 30 }}
            animate={{
              opacity: showComments ? 1 : 0,
              x: showComments ? 0 : 30,
            }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.p
              className="mb-4 text-sm uppercase tracking-[0.3em] text-white/40"
              initial={{ opacity: 0, y: -10 }}
              animate={{
                opacity: showComments ? 1 : 0,
                y: showComments ? 0 : -10,
              }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              댓글
            </motion.p>
            <div className="space-y-3">
              {comments.map((comment, index) => (
                <motion.div
                  key={index}
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: showComments ? 1 : 0,
                    y: showComments ? 0 : 20,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: 0.3 + index * 0.15,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <p className="text-xs text-white/40 mb-1">@{comment.user}</p>
                  <p className="text-sm text-white/70">{comment.text}</p>
                </motion.div>
              ))}
            </div>
            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: showComments ? 1 : 0, scale: showComments ? 1 : 0.9 }}
              transition={{ duration: 0.6, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="text-sm text-white/30">...</p>
              <p className="mt-2 text-base font-medium text-white/50">답장 없음</p>
            </motion.div>
          </motion.div>
        </div>

        {/* Mobile view */}
        <motion.div
          className="mt-8 text-center md:hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: showComments ? 1 : 0,
            y: showComments ? 0 : 20,
          }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="mb-4 text-base leading-relaxed text-white/60">
            댓글에서 상품 정보를 물어보지만...
          </p>
          <p className="text-sm text-white/30">답장 없음...</p>
        </motion.div>
      </div>
    </section>
  );
}

// =============================================
// Transition Section - "왜 이런 문제가 생기는 걸까?"
// =============================================
function TransitionSection() {
  return (
    <section className="flex h-screen items-center justify-center px-6">
      <div className="text-center">
        <motion.p
          className="text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-tight tracking-tight text-white"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          왜 이런 문제가 생기는 걸까?
        </motion.p>
      </div>
    </section>
  );
}

// =============================================
// Broken Chain Section
// =============================================
const CHAIN_STEPS = [
  { icon: TrendingUp, label: '트렌드 파악' },
  { icon: Search, label: '상품 발견' },
  { icon: ShoppingBag, label: '구매하기' },
];

function BrokenChainSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.5 });
  const [hasBroken, setHasBroken] = useState(false);

  useEffect(() => {
    if (isInView && !hasBroken) {
      const timer = setTimeout(() => setHasBroken(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [isInView, hasBroken]);

  return (
    <section ref={sectionRef} className="flex h-screen flex-col items-center justify-center px-6">
      <motion.div
        className="flex w-full max-w-6xl flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: isInView ? 1 : 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Icons + Labels + Arrows Row */}
        <div className="flex items-end">
          {CHAIN_STEPS.map((step, index) => (
            <div key={step.label} className="flex items-end">
              {/* Label + Icon Box */}
              <div className="flex flex-col items-center">
                {/* Label */}
                <motion.span
                  className="mb-4 text-xl font-medium text-white/50 md:text-2xl"
                  initial={{ opacity: 0, y: -10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                >
                  {step.label}
                </motion.span>

                {/* Icon Box */}
                <motion.div
                  className="flex h-36 w-36 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.04] md:h-48 md:w-48"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                >
                  <step.icon className="h-16 w-16 text-white/60 md:h-20 md:w-20" strokeWidth={1.5} />
                </motion.div>
              </div>

              {/* Arrow between boxes */}
              {index < CHAIN_STEPS.length - 1 && (
                <div className="relative mx-4 flex h-36 w-20 items-center justify-center md:mx-6 md:h-48 md:w-28">
                  {/* Normal arrow */}
                  <motion.div
                    className="flex items-center"
                    animate={{ opacity: hasBroken ? 0 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="h-[3px] w-12 bg-white/40 md:w-16" />
                    <div className="border-y-[6px] border-l-[10px] border-y-transparent border-l-white/40" />
                  </motion.div>

                  {/* Breaking effect - 붉은 번쩍임 + 파편 */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hasBroken ? 1 : 0 }}
                  >
                    {/* 붉은 번쩍임 */}
                    <motion.div
                      className="absolute h-16 w-16 rounded-full bg-red-500/60 blur-xl"
                      animate={{
                        opacity: hasBroken ? [0, 1, 0] : 0,
                        scale: hasBroken ? [0.5, 2, 2.5] : 0.5,
                      }}
                      transition={{ duration: 0.8 }}
                    />

                    {/* X 표시 */}
                    <motion.div
                      className="relative z-10 text-4xl font-bold text-red-400 md:text-5xl"
                      animate={{
                        opacity: hasBroken ? [0, 1, 1] : 0,
                        scale: hasBroken ? [0.5, 1.2, 1] : 0.5,
                      }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      ✕
                    </motion.div>
                  </motion.div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom text */}
        <motion.p
          className="mt-20 text-center text-[clamp(2rem,5vw,3.5rem)] font-medium leading-snug tracking-tight text-white/70"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: hasBroken ? 1 : 0,
            y: hasBroken ? 0 : 20,
          }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          쇼핑 경험이 <span className="text-white">파편화</span>되어있기 때문!
        </motion.p>
      </motion.div>
    </section>
  );
}

// =============================================
// Question Section - 흩어진 박스들이 뭉쳐지는 애니메이션
// =============================================
const SCATTERED_BOXES = [
  { x: -380, y: -200, size: 'w-32 h-44 md:w-40 md:h-56', image: 'https://storage.googleapis.com/team_g_bucket_00310/video/landing1.png' },
  { x: 340, y: -170, size: 'w-44 h-32 md:w-56 md:h-40', image: 'https://storage.googleapis.com/team_g_bucket_00310/video/landing2.png' },
  { x: -300, y: 160, size: 'w-36 h-48 md:w-44 md:h-60', image: 'https://storage.googleapis.com/team_g_bucket_00310/video/landing3.png' },
  { x: 380, y: 180, size: 'w-40 h-32 md:w-52 md:h-40', image: 'https://storage.googleapis.com/team_g_bucket_00310/video/landing4.png' },
  { x: -100, y: -280, size: 'w-28 h-40 md:w-36 md:h-52', image: 'https://storage.googleapis.com/team_g_bucket_00310/video/landing5.png' },
  { x: 150, y: 260, size: 'w-44 h-36 md:w-56 md:h-44', image: 'https://storage.googleapis.com/team_g_bucket_00310/video/landing1.png' },
];

function QuestionSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.5 });
  const [isConverged, setIsConverged] = useState(false);

  useEffect(() => {
    if (isInView && !isConverged) {
      const timer = setTimeout(() => setIsConverged(true), 1200);
      return () => clearTimeout(timer);
    }
  }, [isInView, isConverged]);

  return (
    <section ref={sectionRef} className="flex h-screen items-center justify-center px-6">
      <div className="relative flex flex-col items-center justify-center">
        {/* 박스들 애니메이션 */}
        <div className="relative h-[280px] w-[800px] md:h-[300px] md:w-[900px]">
          {SCATTERED_BOXES.map((box, index) => (
            <motion.div
              key={index}
              className={`absolute left-1/2 top-1/2 overflow-hidden rounded-xl border border-white/20 ${box.size}`}
              initial={{
                x: box.x,
                y: box.y,
                opacity: 0,
                scale: 1,
              }}
              animate={{
                x: isConverged ? 0 : box.x,
                y: isConverged ? 0 : box.y,
                opacity: isConverged ? 0 : isInView ? 1 : 0,
                scale: isConverged ? 0.3 : 1,
              }}
              transition={{
                duration: 0.8,
                delay: isConverged ? index * 0.05 : 0.2 + index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{ marginLeft: '-3rem', marginTop: '-3rem' }}
            >
              <img
                src={box.image}
                alt="Fashion"
                className="h-full w-full object-cover"
              />
            </motion.div>
          ))}

          {/* 중앙 합쳐진 박스 - 하얗게 빛나는 효과 */}
          <motion.div
            className="absolute left-1/2 top-1/2 flex h-32 w-32 items-center justify-center rounded-2xl border-2 border-white/50 bg-white/20 md:h-40 md:w-40"
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{
              opacity: isConverged ? 1 : 0,
              scale: isConverged ? 1 : 0.3,
              boxShadow: isConverged
                ? ['0 0 0px rgba(255,255,255,0)', '0 0 60px rgba(255,255,255,0.8)', '0 0 30px rgba(255,255,255,0.4)']
                : '0 0 0px rgba(255,255,255,0)',
            }}
            transition={{
              duration: 0.8,
              delay: 0.4,
              ease: [0.16, 1, 0.3, 1],
              boxShadow: { duration: 1.2, times: [0, 0.5, 1] },
            }}
            style={{ marginLeft: '-4rem', marginTop: '-4rem' }}
          >
            {/* 내부 글로우 */}
            <motion.div
              className="absolute inset-0 rounded-2xl bg-white/30"
              animate={{
                opacity: isConverged ? [0, 0.8, 0.3] : 0,
              }}
              transition={{ duration: 1, delay: 0.5, times: [0, 0.4, 1] }}
            />
            {/* 연결 아이콘 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: isConverged ? 1 : 0,
                scale: isConverged ? 1 : 0.5,
              }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Link2 className="h-12 w-12 text-white md:h-16 md:w-16" strokeWidth={2} />
            </motion.div>
          </motion.div>
        </div>

        {/* 텍스트 - 박스 수렴 후 나타남 */}
        <motion.p
          className="mt-4 text-center text-[clamp(2rem,5vw,3.5rem)] font-medium leading-snug tracking-tight text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: isConverged ? 1 : 0,
            y: isConverged ? 0 : 20,
          }}
          transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          흩어진 경험을 <span className="text-white/50">하나로 이을 수는 없을까?</span>
        </motion.p>
      </div>
    </section>
  );
}

// =============================================
// Brand Reveal Section — "For your sense, / DRESSENSE"
// =============================================
function BrandRevealSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.5 });
  const [showBrand, setShowBrand] = useState(false);

  useEffect(() => {
    if (isInView && !showBrand) {
      const timer = setTimeout(() => setShowBrand(true), 1200);
      return () => clearTimeout(timer);
    }
  }, [isInView, showBrand]);

  return (
    <section ref={sectionRef} className="relative flex h-screen items-center justify-center overflow-hidden">
      <div className="text-center">
        <motion.p
          className="mb-6 text-xl tracking-[0.15em] text-white/50 md:text-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: isInView ? 1 : 0,
            y: isInView ? 0 : 20,
          }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          For your sense,
        </motion.p>

        <motion.h1
          className="text-[clamp(3rem,12vw,10rem)] font-black tracking-[-0.02em] text-white"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
          animate={{
            opacity: showBrand ? 1 : 0,
            scale: showBrand ? 1 : 0.9,
            filter: showBrand ? 'blur(0px)' : 'blur(10px)',
          }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          DRESSENSE.
        </motion.h1>
      </div>
    </section>
  );
}

// =============================================
// Video Hero Section
// =============================================
function VideoHeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <video autoPlay loop muted playsInline className="h-full w-full object-cover">
          <source
            src="https://storage.googleapis.com/team_g_bucket_00310/video/0121(3).mov"
            type="video/quicktime"
          />
          <source
            src="https://storage.googleapis.com/team_g_bucket_00310/video/0121(3).mov"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black" />
      </motion.div>

      <motion.div
        className="absolute bottom-12 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <span className="text-[9px] uppercase tracking-[0.3em] text-white/40">Scroll</span>
        <motion.div
          className="h-12 w-px bg-gradient-to-b from-white/40 to-transparent"
          animate={{ scaleY: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
    </section>
  );
}

// =============================================
// Workflow Steps Data
// =============================================
const WORKFLOW_STEPS = [
  { icon: Upload, number: '01', title: '업로드', titleEn: 'Upload' },
  { icon: Scan, number: '02', title: 'AI 분석', titleEn: 'Analysis' },
  { icon: Sparkles, number: '03', title: '상품 매칭', titleEn: 'Match' },
  { icon: Eye, number: '04', title: '가상 피팅', titleEn: 'Try-On' },
  { icon: ShoppingBag, number: '05', title: '구매', titleEn: 'Shop' },
];

const STEP_IMAGES = [
  'https://storage.googleapis.com/team_g_bucket_00310/video/landing1.png',
  'https://storage.googleapis.com/team_g_bucket_00310/video/landing2.png',
  'https://storage.googleapis.com/team_g_bucket_00310/video/landing3.png',
  'https://storage.googleapis.com/team_g_bucket_00310/video/landing4.png',
  'https://storage.googleapis.com/team_g_bucket_00310/video/landing5.png',
];

// =============================================
// Combined Workflow Steps Section - 모든 스텝을 하나의 슬라이드에
// =============================================
function WorkflowStepsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  return (
    <section ref={sectionRef} className="flex h-screen items-center justify-center px-6">
      <div className="w-full max-w-6xl">
        {/* Title */}
        <motion.h2
          className="mb-12 text-center text-3xl font-semibold text-white md:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ duration: 0.6 }}
        >
          파편화된 패션 경험을 하나로!
        </motion.h2>

        {/* Steps Grid */}
        <div className="grid grid-cols-5 gap-4 md:gap-6">
          {WORKFLOW_STEPS.map((step, index) => (
            <motion.div
              key={step.number}
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{
                opacity: isInView ? 1 : 0,
                y: isInView ? 0 : 30
              }}
              transition={{
                duration: 0.6,
                delay: isInView ? 0.3 + index * 0.2 : 0,
                ease: [0.16, 1, 0.3, 1]
              }}
            >
              {/* Image */}
              <div className="mb-4 w-full overflow-hidden rounded-xl border border-white/10">
                <img
                  src={STEP_IMAGES[index]}
                  alt={step.title}
                  className="aspect-[3/4] w-full object-cover"
                />
              </div>

              {/* Icon + Number */}
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5">
                  <step.icon className="h-5 w-5 text-white/70" strokeWidth={1.5} />
                </div>
                <span className="text-sm font-medium text-white/40">{step.number}</span>
              </div>

              {/* Title */}
              <p className="text-lg font-semibold text-white md:text-xl">{step.title}</p>
              <p className="text-sm text-white/40">{step.titleEn}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =============================================
// Step Slide - 개별 스텝 슬라이드 (심플하게) - 더 이상 사용 안함
// =============================================
function StepSlide({ step, index }: { step: typeof WORKFLOW_STEPS[0]; index: number }) {
  return (
    <section className="flex h-screen items-center justify-center px-6 md:px-16">
      <motion.div
        className="flex flex-col items-center text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* Image */}
        <motion.div
          className="mb-10 w-[250px] md:w-[300px]"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <img
              src={STEP_IMAGES[index]}
              alt={step.title}
              className="h-auto w-full object-cover"
            />
          </div>
        </motion.div>

        {/* Icon + Label */}
        <motion.div
          className="mb-6 flex items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.02]">
            <step.icon size={24} className="text-white/60" />
          </div>
          <span className="text-xs uppercase tracking-[0.3em] text-white/40">
            Step {step.number}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h2
          className="text-[clamp(2rem,6vw,4rem)] font-semibold leading-[1.1] tracking-[-0.02em]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <span className="text-white">{step.title}</span>
          <span className="ml-4 font-light text-white/30">{step.titleEn}</span>
        </motion.h2>
      </motion.div>
    </section>
  );
}

// =============================================
// Get Started Section - CTA 슬라이드
// =============================================
function GetStartedSection({ onEnter }: { onEnter: () => void }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.5 });
  const [hasClicked, setHasClicked] = useState(false);

  useEffect(() => {
    if (isInView && !hasClicked) {
      const timer = setTimeout(() => setHasClicked(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [isInView, hasClicked]);

  return (
    <section ref={sectionRef} className="relative flex h-screen items-center justify-center px-6">
      {/* Decorative circles */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.03]"
        animate={{ rotate: -360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      />

      <motion.div
        className="relative z-10 text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <motion.p
          className="mb-6 text-lg uppercase tracking-[0.3em] text-white/40 md:text-xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Ready to start?
        </motion.p>
        <h2 className="mb-8 text-[clamp(2.5rem,6vw,5rem)] font-semibold tracking-[-0.02em] text-white">
          당신만의 스타일을 찾아보세요
        </h2>
        <p className="mb-12 text-xl text-white/40 md:text-2xl">
          AI 스타일리스트가 기다리고 있습니다
        </p>
        {/* 버튼 - 자동 클릭 연출 */}
        <motion.button
          onClick={onEnter}
          className="rounded-full border-2 border-white/30 bg-white px-16 py-5 text-xl font-medium tracking-wide text-black"
          animate={hasClicked ? {
            scale: [1, 0.92, 1.05, 1],
          } : {}}
          transition={{ duration: 0.5, times: [0, 0.4, 0.7, 1], ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          시작하기
        </motion.button>
      </motion.div>
    </section>
  );
}

// =============================================
// Demo Section - 시연 화면 with Phone Mockups
// =============================================
function DemoSection() {
  return (
    <section className="relative flex h-screen items-center justify-center bg-black">
      {/* Phone Mockup - 크게 중앙 배치 */}
      <motion.div
        className="relative h-[650px] w-[320px] rounded-[3rem] border-2 border-white/15 bg-white/[0.03] p-3 md:h-[750px] md:w-[370px]"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute left-1/2 top-3 z-10 h-6 w-20 -translate-x-1/2 rounded-full bg-black/60" />
        <div className="h-full w-full overflow-hidden rounded-[2.2rem] bg-neutral-900">
          <video
            autoPlay
            muted
            playsInline
            className="h-full w-full object-cover"
          >
            <source src="/시연영상.mp4" type="video/mp4" />
          </video>
        </div>
      </motion.div>
    </section>
  );
}

// =============================================
// Agent Intro Section - "드레센스의 기능, 어떠셨나요?"
// =============================================
function AgentIntroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.5 });
  const [showSecondQuestion, setShowSecondQuestion] = useState(false);

  useEffect(() => {
    if (isInView && !showSecondQuestion) {
      const timer = setTimeout(() => setShowSecondQuestion(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [isInView, showSecondQuestion]);

  return (
    <section ref={sectionRef} className="flex h-screen items-center justify-center px-6">
      <div className="text-center">
        <motion.p
          className="mb-6 text-xl text-white/60 md:text-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: isInView ? 1 : 0,
            y: isInView ? 0 : 20,
          }}
          transition={{ duration: 0.6 }}
        >
          드레센스의 기능, 어떠셨나요?
        </motion.p>

        <motion.p
          className="text-[clamp(2rem,5vw,4rem)] font-semibold leading-snug tracking-tight text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: showSecondQuestion ? 1 : 0,
            y: showSecondQuestion ? 0 : 20,
          }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          그런데, 이 에이전트는 어떻게 만들어졌을까요?
        </motion.p>
      </div>
    </section>
  );
}

// =============================================
// Full Pipeline Section - 전체 파이프라인 통합 애니메이션
// =============================================
const SUB_AGENTS = [
  { name: 'Search Agent', description: '상품 검색' },
  { name: 'Fitting Agent', description: '가상 피팅' },
  { name: 'Style Agent', description: '스타일 추천' },
  { name: 'Commerce Agent', description: '구매 처리' },
];

const PIPELINE_STEPS = [
  { name: 'Google Vision', icon: '👁️' },
  { name: 'FashionCLIP', icon: '🎨' },
  { name: 'OpenSearch', icon: '🔍' },
];

function FullPipelineSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const [phase, setPhase] = useState(0);
  // Phases:
  // 0: Initial
  // 1: Orb appears + input
  // 2: User query submitted, thinking
  // 3: Orchestrator view (sub-agents, Search Agent highlighted)
  // 4: Processing pipeline (Google Vision → FashionCLIP → OpenSearch)
  // 5: Workers (RabbitMQ + Celery)
  // 6: Final result (18초)
  // 7: Thinking again
  // 8: Screen reset
  // 9: Orb returns to center + final greeting

  useEffect(() => {
    if (isInView) {
      const timers = [
        setTimeout(() => setPhase(1), 500),
        setTimeout(() => setPhase(2), 2500),
        setTimeout(() => setPhase(3), 4000),
        setTimeout(() => setPhase(4), 7000),
        setTimeout(() => setPhase(5), 10000),
        setTimeout(() => setPhase(6), 12000),
        setTimeout(() => setPhase(7), 15000),
        setTimeout(() => setPhase(8), 17000),
        setTimeout(() => setPhase(9), 19000),
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [isInView]);

  return (
    <section ref={sectionRef} className="relative flex h-screen items-center justify-center overflow-hidden bg-black px-6">
      <div className="relative flex w-full max-w-6xl flex-col gap-8 md:flex-row">
        {/* Left Panel - Orb + Description */}
        <motion.div
          className="flex flex-1 flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 1 ? 1 : 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Orb */}
          <motion.div
            animate={{
              scale: phase >= 3 && phase < 9 ? 0.5 : 1,
              y: phase >= 3 && phase < 9 ? -50 : 0,
            }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <AgentOrb
              state={phase === 2 || phase === 7 ? 'thinking' : 'idle'}
              size={phase >= 3 && phase < 9 ? 'md' : 'xl'}
            />
          </motion.div>

          {/* Final Greeting - Phase 9 */}
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: phase >= 9 ? 1 : 0,
              y: phase >= 9 ? 0 : 20,
            }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xl font-medium text-white">천만에요!</p>
            <p className="mt-2 text-base text-white/60">그럼 좋은 쇼핑 되세요! 🛍️</p>
          </motion.div>

          {/* Description Box */}
          <motion.div
            className="mt-6 w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: phase >= 1 ? 1 : 0,
              y: phase >= 1 ? 0 : 20,
            }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="mb-3 text-base font-semibold text-white">설명 생성</h3>

            {/* Status text */}
            <motion.p
              className="text-sm text-white/60"
              animate={{
                opacity: phase === 2 || phase === 7 ? [0.5, 1, 0.5] : 1,
              }}
              transition={{
                duration: 1,
                repeat: phase === 2 || phase === 7 ? Infinity : 0,
              }}
            >
              {phase < 2 && '사용자의 요청을 기다리고 있습니다...'}
              {phase === 2 && '생각중...'}
              {phase >= 3 && phase < 7 && '요청을 분석하고 라우팅합니다.'}
              {phase === 7 && '생각중...'}
              {phase === 8 && '화면 초기화...'}
              {phase >= 9 && '완료되었습니다!'}
            </motion.p>

            {/* User Query */}
            <motion.div
              className="mt-4 rounded-xl bg-white/[0.05] px-4 py-3"
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: phase >= 2 && phase < 8 ? 1 : 0,
                height: phase >= 2 && phase < 8 ? 'auto' : 0,
              }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-xs text-white/40">사용자 입력</p>
              <p className="mt-1 text-sm text-white">"청바지 찾아줘"</p>
            </motion.div>
          </motion.div>

          {/* Input */}
          <motion.div
            className="mt-6 w-full max-w-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: (phase >= 1 && phase < 3) || phase >= 9 ? 1 : 0,
              y: phase >= 1 ? 0 : 20,
            }}
            transition={{ duration: 0.5 }}
          >
            <div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-3">
              <span className="text-sm text-white/30">에이전트에게 물어보세요...</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Panel - Dynamic Content */}
        <motion.div
          className="flex flex-[1.5] flex-col items-center justify-center"
          initial={{ opacity: 0, x: 50 }}
          animate={{
            opacity: phase >= 3 && phase < 8 ? 1 : 0,
            x: phase >= 3 && phase < 8 ? 0 : 50,
          }}
          transition={{ duration: 0.8 }}
        >
          {/* Phase 3: Orchestrator + Sub Agents */}
          {phase >= 3 && phase < 4 && (
            <motion.div
              className="w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* AI Logos */}
              <div className="mb-6 flex items-center justify-center gap-6">
                <div className="flex flex-col items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05]">
                    <span className="text-sm font-bold text-white/70">A</span>
                  </div>
                  <span className="text-xs text-white/40">Anthropic</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05]">
                    <span className="text-sm font-bold text-white/70">◐</span>
                  </div>
                  <span className="text-xs text-white/40">OpenAI</span>
                </div>
              </div>

              {/* Sub Agents */}
              <div className="grid grid-cols-2 gap-3">
                {SUB_AGENTS.map((agent, index) => (
                  <motion.div
                    key={agent.name}
                    className={`rounded-xl border p-3 transition-all ${
                      index === 0
                        ? 'border-green-400/50 bg-green-400/10'
                        : 'border-white/10 bg-white/[0.03]'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <p className={`text-sm font-medium ${index === 0 ? 'text-green-400' : 'text-white/70'}`}>
                      {agent.name}
                    </p>
                    <p className="text-xs text-white/40">{agent.description}</p>
                    {index === 0 && (
                      <div className="mt-2 flex items-center gap-1">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
                        <span className="text-xs text-green-400">라우팅됨</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Phase 4: Processing Pipeline */}
          {phase >= 4 && phase < 5 && (
            <motion.div
              className="w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="mb-4 text-center text-sm uppercase tracking-[0.3em] text-white/40">
                이미지 처리 파이프라인
              </p>

              {/* Image placeholder with detected objects */}
              <div className="relative mx-auto mb-6 h-40 w-40 rounded-2xl border border-white/10 bg-white/[0.03]">
                <div className="absolute inset-0 flex items-center justify-center text-white/20">
                  <span className="text-4xl">🖼️</span>
                </div>
                {/* Detection boxes */}
                <motion.div
                  className="absolute left-4 top-4 h-16 w-12 rounded border-2 border-blue-400"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                />
                <motion.div
                  className="absolute bottom-4 right-4 h-20 w-14 rounded border-2 border-purple-400"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 }}
                />
              </div>

              {/* Pipeline steps */}
              <div className="flex items-center justify-center gap-2">
                {PIPELINE_STEPS.map((step, index) => (
                  <motion.div
                    key={step.name}
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.3 }}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05]">
                        <span>{step.icon}</span>
                      </div>
                      <span className="text-xs text-white/40">{step.name}</span>
                    </div>
                    {index < PIPELINE_STEPS.length - 1 && (
                      <motion.div
                        className="mx-2 text-white/30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 + index * 0.3 }}
                      >
                        →
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>

              <motion.p
                className="mt-4 text-center text-xs text-white/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                512차원 벡터 변환 → 유사 상품 검색
              </motion.p>
            </motion.div>
          )}

          {/* Phase 5: Workers */}
          {phase >= 5 && phase < 6 && (
            <motion.div
              className="w-full text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="mb-6 text-sm uppercase tracking-[0.3em] text-white/40">
                비동기 처리
              </p>
              <div className="flex items-center justify-center gap-8">
                <motion.div
                  className="flex flex-col items-center gap-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-400/30 bg-orange-400/10">
                    <span className="text-2xl">🐰</span>
                  </div>
                  <span className="text-xs text-white/50">RabbitMQ</span>
                </motion.div>
                <motion.div
                  className="text-white/30"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  ⚡
                </motion.div>
                <motion.div
                  className="flex flex-col items-center gap-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-green-400/30 bg-green-400/10">
                    <span className="text-2xl">🥬</span>
                  </div>
                  <span className="text-xs text-white/50">Celery Worker</span>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Phase 6: Final Result */}
          {phase >= 6 && (
            <motion.div
              className="w-full text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="mb-4 text-sm text-white/50">처리 시간</p>
                <div className="flex items-center justify-center gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-light text-white/30 line-through">1분+</p>
                    <p className="text-xs text-white/30">기존</p>
                  </div>
                  <motion.div
                    className="text-2xl text-white/30"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    →
                  </motion.div>
                  <div className="text-center">
                    <motion.p
                      className="text-4xl font-bold text-green-400"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                    >
                      18초
                    </motion.p>
                    <p className="text-xs text-green-400/70">현재</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Phase indicator */}
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((p) => (
          <div
            key={p}
            className={`h-1.5 w-1.5 rounded-full transition-all ${
              phase >= p ? 'bg-white/60' : 'bg-white/20'
            }`}
          />
        ))}
      </div>
    </section>
  );
}

// =============================================
// Dressense Video Section - 드레센스 영상
// =============================================
function DressenseVideoSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* 전체화면 비디오 */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source
          src="https://storage.googleapis.com/team_g_bucket_00310/video/0121(3).mov"
          type="video/quicktime"
        />
        <source
          src="https://storage.googleapis.com/team_g_bucket_00310/video/0121(3).mov"
          type="video/mp4"
        />
      </video>

      {/* 그라데이션 오버레이 */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

    </section>
  );
}

// =============================================
// Team Section - 팀원 소개
// =============================================
const TEAM_MEMBERS = [
  { name: '팀원 1', role: 'Frontend' },
  { name: '팀원 2', role: 'Backend' },
  { name: '팀원 3', role: 'AI/ML' },
  { name: '팀원 4', role: 'Design' },
  { name: '팀원 5', role: 'PM' },
];

function TeamSection() {
  return (
    <section className="flex h-screen items-center justify-center bg-black px-6">
      <div className="w-full max-w-7xl">
        <motion.h2
          className="mb-20 text-center text-5xl font-semibold text-white md:text-6xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          팀원 소개
        </motion.h2>

        {/* Team Grid */}
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          {TEAM_MEMBERS.map((member, index) => (
            <motion.div
              key={member.name}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Avatar Placeholder */}
              <div className="mb-6 flex h-48 w-full items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] md:h-56">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/[0.05]">
                  <span className="text-5xl text-white/30">👤</span>
                </div>
              </div>

              {/* Info */}
              <p className="text-xl font-medium text-white md:text-2xl">{member.name}</p>
              <p className="mt-2 text-lg text-white/50 md:text-xl">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =============================================
// Footer
// =============================================
function Footer() {
  return (
    <footer className="border-t border-white/5 px-6 py-12">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 md:flex-row">
        <span className="text-xs tracking-[0.2em] text-white/40">DRESSENSE</span>
        <div className="flex items-center gap-8 text-xs text-white/30">
          <a href="#" className="transition-colors hover:text-white/60">
            Privacy
          </a>
          <a href="#" className="transition-colors hover:text-white/60">
            Terms
          </a>
          <a href="#" className="transition-colors hover:text-white/60">
            Contact
          </a>
        </div>
        <span className="text-xs text-white/20">2026 Dressense</span>
      </div>
    </footer>
  );
}
