import { useRef, useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Search, ShoppingBag } from 'lucide-react';

// =============================================
// Props
// =============================================
export interface LandingPageProps {
  /** CTA 버튼 클릭 콜백 */
  onEnter?: () => void;
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
    const sections = containerRef.current?.querySelectorAll<HTMLElement>('[data-section]');
    if (!sections || index < 0 || index >= sections.length) return;
    isScrolling.current = true;
    currentSection.current = index;
    sections[index].scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => { isScrolling.current = false; }, 800);
  }, []);

  useEffect(() => {
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

    // Sync currentSection on manual scroll
    const handleScroll = () => {
      if (isScrolling.current) return;
      const sections = containerRef.current?.querySelectorAll<HTMLElement>('[data-section]');
      if (!sections) return;
      const scrollY = window.scrollY + window.innerHeight / 3;
      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i].offsetTop <= scrollY) {
          currentSection.current = i;
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKey);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollToSection]);

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-x-hidden bg-black text-white">
      <div data-section><IntroStorySection /></div>
      <div data-section><StoryJourneySection /></div>
      <div data-section><TransitionSection /></div>
      <div data-section><BrokenChainSection /></div>
      <div data-section><QuestionSection /></div>
      <div data-section><BrandRevealSection /></div>
      <div data-section><VideoHeroSection /></div>
      <div data-section><CTASection onEnter={handleEnter} /></div>
      <div data-section><Footer /></div>
    </div>
  );
}

// =============================================
// Intro Story Section
// =============================================
function IntroStorySection() {
  return (
    <section className="flex min-h-screen items-center justify-center px-6 md:px-20">
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
            className="mb-8 text-sm uppercase tracking-[0.3em] text-white/30"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Story
          </motion.p>

          <motion.h2
            className="mb-10 text-[clamp(2.5rem,5vw,4rem)] font-semibold tracking-tight text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            개발자 채린 씨
          </motion.h2>

          <motion.div
            className="space-y-5 text-xl leading-relaxed text-white/60 md:text-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p>채린 씨는 요즘 고민이 하나 생겼어요.</p>
            <p>
              다음 주가 남자친구랑 <span className="font-semibold text-white">300일</span>인데,
              {' '}<span className="font-semibold text-white">입을 옷이 없거든요.</span>
            </p>
            <p>옷장을 열어보지만, 마음에 드는 게 없네요.</p>
            <p className="text-white/40">
              "요즘 뭐가 유행이지?"
              <br />
              참고할 겸 인스타그램을 켭니다.
            </p>
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
// Story Journey Section
// =============================================
function StoryJourneySection() {
  return (
    <section className="flex min-h-screen items-center justify-center px-6 md:px-20">
      <div className="relative flex w-full max-w-6xl flex-col items-center">
        {/* Main container with phone + annotations */}
        <div className="relative flex w-full items-center justify-center gap-8 md:gap-12">
          {/* Left annotation */}
          <motion.div
            className="hidden max-w-[240px] text-right md:block"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p className="text-lg leading-relaxed text-white/60">
              인스타 접속해서 피드 돌리는 화면,
              <br />
              <span className="font-semibold text-white">마음에 드는 코디 발견..!</span>
            </p>
            <motion.div
              className="mt-4 ml-auto h-px w-16 bg-gradient-to-r from-transparent to-white/30"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              style={{ transformOrigin: 'left' }}
            />
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

          {/* Right annotation */}
          <motion.div
            className="hidden max-w-[280px] text-left md:block"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <p className="text-lg leading-relaxed text-white/60">
              코디 화면, 그런데 <span className="font-semibold text-white">상품 정보가 없음...</span>
              <br />
              상품 정보를 물어보는 댓글 달기 /
              <br />
              이미 달린 댓글 확인 + <span className="text-white/40">답장 없음..</span>
            </p>
            <motion.div
              className="mt-4 h-px w-16 bg-gradient-to-r from-white/30 to-transparent"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.7 }}
              style={{ transformOrigin: 'left' }}
            />
          </motion.div>
        </div>

        {/* Bottom text */}
        <motion.p
          className="mt-16 text-center text-xl font-medium text-white/40 md:mt-20 md:text-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          결국 이 사이트 저 사이트 돌아다니다 <span className="text-white/70">포기..</span>
        </motion.p>
      </div>
    </section>
  );
}

// =============================================
// Transition Section
// =============================================
function TransitionSection() {
  return (
    <section className="flex min-h-screen items-center justify-center px-6">
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <motion.p
          className="mb-8 text-xl leading-relaxed text-white/50 md:text-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          혹시 이런 경험, 다들 한 번쯤 있지는 않으신가요?
        </motion.p>

        <motion.p
          className="text-[clamp(1.8rem,5vw,3.5rem)] font-semibold leading-tight tracking-tight text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          사실 이건 채린 씨만의 문제가 <span className="text-white/40">아닙</span>니다.
        </motion.p>
      </motion.div>
    </section>
  );
}

// =============================================
// Broken Chain Section
// =============================================
const CHAIN_STEPS = [
  { icon: TrendingUp, label: '트렌드를 파악' },
  { icon: Search, label: '원하는 상품 발견' },
  { icon: ShoppingBag, label: '구매' },
];

function BrokenChainSection() {
  const [hasBroken, setHasBroken] = useState(false);

  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-6 py-24">
      <motion.div
        className="flex w-full max-w-5xl flex-col items-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        onViewportEnter={() => {
          if (!hasBroken) {
            setTimeout(() => setHasBroken(true), 1200);
          }
        }}
      >
        {/* Steps + Arrows */}
        <div className="flex items-center gap-4 md:gap-8">
          {CHAIN_STEPS.map((step, index) => (
            <div key={step.label} className="flex items-center gap-4 md:gap-8">
              {/* Step Card */}
              <motion.div
                className="flex flex-col items-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <span className="mb-2 text-sm font-medium tracking-wide text-white/50 md:text-base">
                  {step.label}
                </span>
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.04] md:h-32 md:w-32">
                  <step.icon size={36} className="text-white/50" />
                </div>
              </motion.div>

              {/* Arrow (between steps) */}
              {index < CHAIN_STEPS.length - 1 && (
                <div className="relative flex h-8 w-12 items-center justify-center md:w-20">
                  {/* Normal arrow — fades out */}
                  <motion.svg
                    viewBox="0 0 60 20"
                    className="absolute h-5 w-full"
                    animate={{
                      opacity: hasBroken ? 0 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <line x1="0" y1="10" x2="48" y2="10" stroke="white" strokeOpacity="0.4" strokeWidth="2" />
                    <polygon points="48,4 60,10 48,16" fill="white" fillOpacity="0.4" />
                  </motion.svg>

                  {/* Broken fragments */}
                  <motion.svg
                    viewBox="0 0 60 20"
                    className="absolute h-5 w-full"
                    animate={{
                      opacity: hasBroken ? 1 : 0,
                    }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                  >
                    {/* Fragment 1 */}
                    <motion.line
                      x1="0" y1="10" x2="15" y2="10"
                      stroke="white" strokeOpacity="0.3" strokeWidth="2"
                      animate={hasBroken ? { y: -8, x: -4, rotate: -25, opacity: 0 } : {}}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                    {/* Fragment 2 */}
                    <motion.line
                      x1="18" y1="10" x2="32" y2="10"
                      stroke="white" strokeOpacity="0.3" strokeWidth="2"
                      animate={hasBroken ? { y: 10, rotate: 15, opacity: 0 } : {}}
                      transition={{ duration: 0.9, ease: 'easeOut', delay: 0.05 }}
                    />
                    {/* Fragment 3 */}
                    <motion.line
                      x1="35" y1="10" x2="48" y2="10"
                      stroke="white" strokeOpacity="0.3" strokeWidth="2"
                      animate={hasBroken ? { y: -6, x: 5, rotate: 30, opacity: 0 } : {}}
                      transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
                    />
                    {/* Arrowhead fragment */}
                    <motion.polygon
                      points="48,4 60,10 48,16"
                      fill="white" fillOpacity="0.3"
                      animate={hasBroken ? { y: 12, x: 8, rotate: 45, opacity: 0 } : {}}
                      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.08 }}
                    />
                  </motion.svg>

                  {/* Crack effect — red flash */}
                  <motion.div
                    className="absolute h-6 w-6 rounded-full bg-red-500/30 blur-md"
                    animate={{
                      opacity: hasBroken ? [0, 1, 0] : 0,
                      scale: hasBroken ? [0.5, 1.5, 2] : 0.5,
                    }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom text */}
        <motion.p
          className="mt-20 text-center text-[clamp(1.5rem,4vw,2.5rem)] font-semibold leading-snug tracking-tight text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: hasBroken ? 1 : 0,
            y: hasBroken ? 0 : 20,
          }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          쇼핑의 전 과정이 완전히 <span className="text-white/40">파편화</span>되어 있다는 겁니다.
        </motion.p>
      </motion.div>
    </section>
  );
}

// =============================================
// Question Section
// =============================================
function QuestionSection() {
  return (
    <section className="flex min-h-screen items-center justify-center px-6">
      <motion.p
        className="text-center text-[clamp(1.5rem,4vw,3rem)] font-medium leading-snug tracking-tight text-white"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        그렇다면, 이 흩어진 경험을
        <br />
        하나로 연결할 수는 없을까요?
      </motion.p>
    </section>
  );
}

// =============================================
// Brand Reveal Section — "for your sense / DRESSENSE"
// =============================================
function BrandRevealSection() {
  const [hasAnimated, setHasAnimated] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);

  return (
    <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden">
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '0px' }}
        onViewportEnter={() => {
          if (hasAnimated) return;
          setHasAnimated(true);
          const timings = [300, 1200];
          timings.forEach((time, index) => {
            setTimeout(() => setAnimationStep(index + 1), time);
          });
        }}
      >
        <motion.p
          className="mb-4 text-lg lowercase tracking-[0.2em] text-white/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: animationStep >= 1 ? 1 : 0,
            y: animationStep >= 1 ? 0 : 20,
          }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          for your sense
        </motion.p>

        <motion.h1
          className="text-[clamp(3rem,15vw,12rem)] font-black tracking-[-0.03em] text-white"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
          animate={{
            opacity: animationStep >= 2 ? 1 : 0,
            scale: animationStep >= 2 ? 1 : 0.8,
            filter: animationStep >= 2 ? 'blur(0px)' : 'blur(10px)',
          }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          DRESSENSE
        </motion.h1>
      </motion.div>
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
// CTA Section
// =============================================
function CTASection({ onEnter }: { onEnter: () => void }) {
  return (
    <section className="relative flex min-h-[60vh] items-center justify-center px-6 py-24">
      <motion.div
        className="absolute h-[300px] w-[300px] rounded-full border border-white/5"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute h-[400px] w-[400px] rounded-full border border-white/[0.03]"
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
          className="mb-4 text-sm uppercase tracking-[0.3em] text-white/40"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Ready to start?
        </motion.p>
        <h2 className="mb-6 text-[clamp(1.5rem,4vw,3rem)] font-light tracking-[-0.02em] text-white">
          당신만의 스타일을 찾아보세요
        </h2>
        <p className="mb-10 text-base text-white/40">AI 스타일리스트가 기다리고 있습니다</p>
        <motion.button
          onClick={onEnter}
          className="rounded-full border border-white/30 bg-white px-12 py-4 text-base font-medium tracking-wide text-black transition-all duration-300 hover:bg-white/90"
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
        <span className="text-xs text-white/20">2025 Dressense</span>
      </div>
    </footer>
  );
}
