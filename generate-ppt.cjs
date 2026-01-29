const PptxGenJS = require('pptxgenjs');

const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_16x9';
pptx.author = 'Team G';
pptx.title = 'DRESSENSE';

const W = 10;
const H = 5.625;

const COLORS = {
  black: '000000',
  white: 'FFFFFF',
  white40: '666666',
  white50: '808080',
  white60: '999999',
  white70: 'B3B3B3',
  green400: '4ADE80',
  red400: 'F87171',
};

const GCS = 'https://storage.googleapis.com/team_g_bucket_00310/video';
const CHAERIN = '/Users/ijeong/Desktop/Team_G/ppt_page/public/chaerin.jpeg';

function createSlide() {
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.black };
  return slide;
}

// Slide 1: IntroStorySection
let slide = createSlide();
slide.addText('오늘의 주인공', {
  x: 1, y: 1.4, w: 4, h: 0.4,
  fontSize: 14, color: COLORS.white40, charSpacing: 5,
});
slide.addText('개발자 채린씨', {
  x: 1, y: 1.9, w: 4, h: 0.9,
  fontSize: 48, color: COLORS.white, bold: true,
});
slide.addText('테커로 개발에 처음 입문한 스물 한 살 청춘', {
  x: 1, y: 2.85, w: 4, h: 0.4,
  fontSize: 16, color: COLORS.white40,
});
slide.addText([
  { text: '채린씨는 요즘 ', options: { color: COLORS.white60 } },
  { text: '고민', options: { color: COLORS.white } },
  { text: '이 하나 생겼어요.', options: { color: COLORS.white60 } },
], {
  x: 1, y: 3.35, w: 4, h: 0.5,
  fontSize: 20,
});
slide.addShape(pptx.ShapeType.roundRect, {
  x: 6.2, y: 0.7, w: 2.2, h: 4.2,
  fill: { color: '080808' }, line: { color: '262626', width: 2 }, rectRadius: 0.3,
});
slide.addImage({
  path: CHAERIN,
  x: 6.35, y: 0.9, w: 1.9, h: 3.8,
  rounding: true,
});

// Slide 2: ProblemSection
slide = createSlide();
slide.addText([
  { text: '다음 주가 남자친구와 ', options: { color: COLORS.white } },
  { text: '300일', options: { color: COLORS.white, bold: true } },
  { text: '인데,', options: { color: COLORS.white } },
], {
  x: 0, y: 2.0, w: W, h: 0.8,
  fontSize: 42, bold: true, align: 'center',
});
slide.addText('입을 옷이 없다..!', {
  x: 0, y: 2.9, w: W, h: 0.6,
  fontSize: 32, color: COLORS.white50, align: 'center',
});

// Slide 3: InstagramFeedSection
slide = createSlide();
slide.addText('"이거다!"', {
  x: 0.5, y: 2.2, w: 2, h: 0.4,
  fontSize: 18, color: COLORS.white60, align: 'right',
});
slide.addText('...근데 어디 옷이지?', {
  x: 0.5, y: 2.65, w: 2, h: 0.3,
  fontSize: 11, color: COLORS.white40, align: 'right',
});
slide.addShape(pptx.ShapeType.roundRect, {
  x: 3.5, y: 0.5, w: 2.2, h: 4.5,
  fill: { color: '080808' }, line: { color: '262626', width: 2 }, rectRadius: 0.35,
});
slide.addText('▶ pr1.mp4', {
  x: 3.5, y: 2.3, w: 2.2, h: 0.5,
  fontSize: 12, color: COLORS.white40, align: 'center',
});
slide.addText('댓 글', {
  x: 6.5, y: 0.8, w: 3, h: 0.3,
  fontSize: 10, color: COLORS.white40, charSpacing: 5,
});
const comments = [
  { user: '@chaerin_dev', text: '옷 정보 알려주세요!' },
  { user: '@user_1234', text: '저도 궁금해요ㅠㅠ' },
  { user: '@fashion_lover', text: '브랜드가 어디에요?' },
  { user: '@style_hunter', text: '링크 있나요?' },
];
comments.forEach((c, i) => {
  const y = 1.2 + i * 0.75;
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 6.5, y: y, w: 3, h: 0.65,
    fill: { color: '0a0a0a' }, line: { color: '1a1a1a', width: 1 }, rectRadius: 0.1,
  });
  slide.addText(c.user, {
    x: 6.6, y: y + 0.08, w: 2.8, h: 0.22,
    fontSize: 8, color: COLORS.white40,
  });
  slide.addText(c.text, {
    x: 6.6, y: y + 0.32, w: 2.8, h: 0.25,
    fontSize: 10, color: COLORS.white70,
  });
});
slide.addText('...', {
  x: 6.5, y: 4.3, w: 3, h: 0.2,
  fontSize: 12, color: COLORS.white40, align: 'center',
});
slide.addText('답장 없음', {
  x: 6.5, y: 4.55, w: 3, h: 0.3,
  fontSize: 12, color: COLORS.white50, align: 'center',
});

// Slide 4: TransitionSection
slide = createSlide();
slide.addText('왜 이런 문제가 생기는 걸까?', {
  x: 0, y: 2.3, w: W, h: 0.9,
  fontSize: 44, color: COLORS.white, bold: true, align: 'center',
});

// Slide 5: BrokenChainSection
slide = createSlide();
const chainLabels = ['트렌드 파악', '상품 발견', '구매하기'];
const chainIcons = ['📈', '🔍', '🛍️'];
const boxW = 2.0;
const boxH = 2.0;
const gap = 0.6;
const totalW = boxW * 3 + gap * 2;
const startX = (W - totalW) / 2;

chainLabels.forEach((label, i) => {
  const x = startX + i * (boxW + gap);
  slide.addText(label, {
    x: x, y: 1.0, w: boxW, h: 0.4,
    fontSize: 16, color: COLORS.white50, align: 'center',
  });
  slide.addShape(pptx.ShapeType.roundRect, {
    x: x, y: 1.5, w: boxW, h: boxH,
    fill: { color: '0a0a0a' }, line: { color: '262626', width: 1 }, rectRadius: 0.15,
  });
  slide.addText(chainIcons[i], {
    x: x, y: 2.1, w: boxW, h: 0.9,
    fontSize: 40, align: 'center',
  });
  if (i < 2) {
    slide.addText('✕', {
      x: x + boxW + 0.1, y: 2.2, w: 0.4, h: 0.6,
      fontSize: 28, color: COLORS.red400, bold: true, align: 'center',
    });
  }
});
slide.addText([
  { text: '쇼핑 경험이 ', options: { color: COLORS.white70 } },
  { text: '파편화', options: { color: COLORS.white } },
  { text: '되어있기 때문!', options: { color: COLORS.white70 } },
], {
  x: 0, y: 4.0, w: W, h: 0.7,
  fontSize: 28, align: 'center',
});

// Slide 6: QuestionSection
slide = createSlide();
const scatteredImgs = [
  { url: `${GCS}/landing1.png`, x: 0.8, y: 0.5, w: 1.4, h: 1.9 },
  { url: `${GCS}/landing2.png`, x: 7.8, y: 0.4, w: 1.9, h: 1.4 },
  { url: `${GCS}/landing3.png`, x: 0.6, y: 3.0, w: 1.5, h: 2.0 },
  { url: `${GCS}/landing4.png`, x: 7.6, y: 3.2, w: 1.8, h: 1.4 },
  { url: `${GCS}/landing5.png`, x: 3.2, y: 0.2, w: 1.2, h: 1.7 },
  { url: `${GCS}/landing1.png`, x: 5.6, y: 3.5, w: 1.9, h: 1.5 },
];
scatteredImgs.forEach((img) => {
  slide.addImage({
    path: img.url,
    x: img.x, y: img.y, w: img.w, h: img.h,
    rounding: true,
  });
});
slide.addShape(pptx.ShapeType.roundRect, {
  x: 4.0, y: 1.8, w: 2, h: 2,
  fill: { color: '333333' }, line: { color: '808080', width: 2 }, rectRadius: 0.2,
});
slide.addText('🔗', {
  x: 4.0, y: 2.1, w: 2, h: 1.4,
  fontSize: 50, align: 'center',
});
slide.addText([
  { text: '흩어진 경험을 ', options: { color: COLORS.white } },
  { text: '하나로 이을 수는 없을까?', options: { color: COLORS.white50 } },
], {
  x: 0, y: 4.2, w: W, h: 0.7,
  fontSize: 28, align: 'center',
});

// Slide 7: BrandRevealSection
slide = createSlide();
slide.addText('For your sense,', {
  x: 0, y: 2.0, w: W, h: 0.5,
  fontSize: 18, color: COLORS.white50, align: 'center', charSpacing: 3,
});
slide.addText('DRESSENSE.', {
  x: 0, y: 2.5, w: W, h: 1.2,
  fontSize: 72, color: COLORS.white, bold: true, align: 'center',
});

// Slide 8: VideoHeroSection
slide = createSlide();
slide.addText('▶', {
  x: 0, y: 1.5, w: W, h: 2,
  fontSize: 80, align: 'center', color: COLORS.white60,
});
slide.addText('0121(3).mov', {
  x: 0, y: 3.3, w: W, h: 0.4,
  fontSize: 14, color: COLORS.white40, align: 'center',
});
slide.addText('Scroll', {
  x: 0, y: 4.8, w: W, h: 0.3,
  fontSize: 8, color: COLORS.white40, align: 'center', charSpacing: 5,
});

// Slide 9: WorkflowStepsSection
slide = createSlide();
slide.addText('파편화된 패션 경험을 하나로!', {
  x: 0, y: 0.25, w: W, h: 0.6,
  fontSize: 28, color: COLORS.white, bold: true, align: 'center',
});

const steps = [
  { num: '01', title: '업로드', en: 'Upload', img: `${GCS}/landing1.png` },
  { num: '02', title: 'AI 분석', en: 'Analysis', img: `${GCS}/landing2.png` },
  { num: '03', title: '상품 매칭', en: 'Match', img: `${GCS}/landing3.png` },
  { num: '04', title: '가상 피팅', en: 'Try-On', img: `${GCS}/landing4.png` },
  { num: '05', title: '구매', en: 'Shop', img: `${GCS}/landing5.png` },
];
const cardW = 1.7;
const cardGap = 0.25;
const cardTotalW = cardW * 5 + cardGap * 4;
const cardStartX = (W - cardTotalW) / 2;

steps.forEach((step, i) => {
  const x = cardStartX + i * (cardW + cardGap);
  slide.addImage({
    path: step.img,
    x: x, y: 1.0, w: cardW, h: 2.3,
    rounding: true,
  });
  slide.addText(step.num, {
    x: x, y: 3.4, w: cardW, h: 0.3,
    fontSize: 10, color: COLORS.white40, align: 'center',
  });
  slide.addText(step.title, {
    x: x, y: 3.7, w: cardW, h: 0.4,
    fontSize: 16, color: COLORS.white, bold: true, align: 'center',
  });
  slide.addText(step.en, {
    x: x, y: 4.1, w: cardW, h: 0.3,
    fontSize: 10, color: COLORS.white40, align: 'center',
  });
});

// Slide 10: GetStartedSection
slide = createSlide();
slide.addText('Ready to start?', {
  x: 0, y: 1.4, w: W, h: 0.4,
  fontSize: 14, color: COLORS.white40, align: 'center', charSpacing: 5,
});
slide.addText('당신만의 스타일을 찾아보세요', {
  x: 0, y: 1.9, w: W, h: 0.8,
  fontSize: 40, color: COLORS.white, bold: true, align: 'center',
});
slide.addText('AI 스타일리스트가 기다리고 있습니다', {
  x: 0, y: 2.8, w: W, h: 0.4,
  fontSize: 16, color: COLORS.white40, align: 'center',
});
slide.addShape(pptx.ShapeType.roundRect, {
  x: 3.5, y: 3.5, w: 3, h: 0.8,
  fill: { color: COLORS.white }, rectRadius: 0.4,
});
slide.addText('시작하기', {
  x: 3.5, y: 3.5, w: 3, h: 0.8,
  fontSize: 18, color: COLORS.black, bold: true, align: 'center', valign: 'middle',
});

// Slide 11: DemoSection
slide = createSlide();
const phoneW = 2.6;
const phoneH = 5.0;
slide.addShape(pptx.ShapeType.roundRect, {
  x: (W - phoneW) / 2, y: 0.3, w: phoneW, h: phoneH,
  fill: { color: '0a0a0a' }, line: { color: '262626', width: 2 }, rectRadius: 0.35,
});
slide.addText('▶ 시연영상.mp4', {
  x: (W - phoneW) / 2, y: 2.5, w: phoneW, h: 0.5,
  fontSize: 14, color: COLORS.white40, align: 'center',
});

// Slide 12: AgentIntroSection
slide = createSlide();
slide.addText('드레센스의 기능, 어떠셨나요?', {
  x: 0, y: 1.8, w: W, h: 0.5,
  fontSize: 18, color: COLORS.white60, align: 'center',
});
slide.addText('그런데, 이 에이전트는 어떻게 만들어졌을까요?', {
  x: 0, y: 2.5, w: W, h: 0.8,
  fontSize: 32, color: COLORS.white, bold: true, align: 'center',
});

// Slide 13: FullPipelineSection
slide = createSlide();
const agents = [
  { name: 'Search Agent', desc: '상품 검색', active: true },
  { name: 'Fitting Agent', desc: '가상 피팅', active: false },
  { name: 'Style Agent', desc: '스타일 추천', active: false },
  { name: 'Commerce Agent', desc: '구매 처리', active: false },
];
agents.forEach((agent, i) => {
  const x = 0.5 + (i % 2) * 2.3;
  const y = 0.4 + Math.floor(i / 2) * 1.1;
  slide.addShape(pptx.ShapeType.roundRect, {
    x: x, y: y, w: 2.1, h: 0.95,
    fill: { color: agent.active ? '0d2818' : '0a0a0a' },
    line: { color: agent.active ? COLORS.green400 : '262626', width: 1 }, rectRadius: 0.1,
  });
  slide.addText(agent.name, {
    x: x + 0.1, y: y + 0.15, w: 1.9, h: 0.35,
    fontSize: 11, color: agent.active ? COLORS.green400 : COLORS.white60, bold: true,
  });
  slide.addText(agent.desc, {
    x: x + 0.1, y: y + 0.52, w: 1.9, h: 0.3,
    fontSize: 9, color: COLORS.white40,
  });
  if (agent.active) {
    slide.addText('● 라우팅됨', {
      x: x + 0.1, y: y + 0.75, w: 1.9, h: 0.2,
      fontSize: 8, color: COLORS.green400,
    });
  }
});

const pipeline = [
  { icon: '👁️', name: 'Google Vision' },
  { icon: '🎨', name: 'FashionCLIP' },
  { icon: '🔍', name: 'OpenSearch' },
];
pipeline.forEach((p, i) => {
  const x = 5.5 + i * 1.5;
  slide.addShape(pptx.ShapeType.roundRect, {
    x: x, y: 0.8, w: 1.2, h: 1.2,
    fill: { color: '0a0a0a' }, line: { color: '262626', width: 1 }, rectRadius: 0.12,
  });
  slide.addText(p.icon, {
    x: x, y: 0.95, w: 1.2, h: 0.7,
    fontSize: 24, align: 'center',
  });
  slide.addText(p.name, {
    x: x - 0.15, y: 2.05, w: 1.5, h: 0.3,
    fontSize: 9, color: COLORS.white40, align: 'center',
  });
  if (i < 2) {
    slide.addText('→', {
      x: x + 1.05, y: 1.15, w: 0.45, h: 0.5,
      fontSize: 16, color: COLORS.white40, align: 'center',
    });
  }
});

slide.addShape(pptx.ShapeType.roundRect, {
  x: 2.5, y: 3.0, w: 5, h: 2.2,
  fill: { color: '0a0a0a' }, line: { color: '262626', width: 1 }, rectRadius: 0.15,
});
slide.addText('처리 시간', {
  x: 2.5, y: 3.2, w: 5, h: 0.35,
  fontSize: 12, color: COLORS.white50, align: 'center',
});
slide.addText('1분+', {
  x: 3.2, y: 3.8, w: 1.5, h: 0.6,
  fontSize: 22, color: COLORS.white40, strike: true, align: 'center',
});
slide.addText('기존', {
  x: 3.2, y: 4.4, w: 1.5, h: 0.3,
  fontSize: 10, color: COLORS.white40, align: 'center',
});
slide.addText('→', {
  x: 4.6, y: 3.9, w: 0.5, h: 0.5,
  fontSize: 20, color: COLORS.white40, align: 'center',
});
slide.addText('18초', {
  x: 5.2, y: 3.7, w: 2, h: 0.8,
  fontSize: 36, color: COLORS.green400, bold: true, align: 'center',
});
slide.addText('현재', {
  x: 5.2, y: 4.4, w: 2, h: 0.3,
  fontSize: 10, color: COLORS.green400, align: 'center',
});

// Slide 14: DressenseVideoSection
slide = createSlide();
slide.addText('▶', {
  x: 0, y: 1.5, w: W, h: 2,
  fontSize: 80, align: 'center', color: COLORS.white60,
});
slide.addText('0121(3).mov', {
  x: 0, y: 3.3, w: W, h: 0.4,
  fontSize: 14, color: COLORS.white40, align: 'center',
});

// Slide 15: TeamSection
slide = createSlide();
slide.addText('팀원 소개', {
  x: 0, y: 0.3, w: W, h: 0.7,
  fontSize: 36, color: COLORS.white, bold: true, align: 'center',
});

const members = [
  { name: '팀원 1', role: 'Frontend' },
  { name: '팀원 2', role: 'Backend' },
  { name: '팀원 3', role: 'AI/ML' },
  { name: '팀원 4', role: 'Design' },
  { name: '팀원 5', role: 'PM' },
];
const memCardW = 1.7;
const memGap = 0.25;
const memTotalW = memCardW * 5 + memGap * 4;
const memStartX = (W - memTotalW) / 2;

members.forEach((m, i) => {
  const x = memStartX + i * (memCardW + memGap);
  slide.addShape(pptx.ShapeType.roundRect, {
    x: x, y: 1.1, w: memCardW, h: 3.0,
    fill: { color: '0a0a0a' }, line: { color: '262626', width: 1 }, rectRadius: 0.15,
  });
  slide.addShape(pptx.ShapeType.ellipse, {
    x: x + 0.35, y: 1.5, w: 1.0, h: 1.0,
    fill: { color: '1a1a1a' },
  });
  slide.addText('👤', {
    x: x, y: 1.65, w: memCardW, h: 0.8,
    fontSize: 32, align: 'center',
  });
  slide.addText(m.name, {
    x: x, y: 2.7, w: memCardW, h: 0.4,
    fontSize: 14, color: COLORS.white, bold: true, align: 'center',
  });
  slide.addText(m.role, {
    x: x, y: 3.1, w: memCardW, h: 0.35,
    fontSize: 12, color: COLORS.white50, align: 'center',
  });
});

// Slide 16: Footer
slide = createSlide();
slide.addText('DRESSENSE', {
  x: 0, y: 2.0, w: W, h: 1.0,
  fontSize: 52, color: COLORS.white, bold: true, align: 'center',
});
slide.addText('For your sense.', {
  x: 0, y: 3.0, w: W, h: 0.5,
  fontSize: 16, color: COLORS.white40, align: 'center',
});
slide.addText('Privacy    Terms    Contact', {
  x: 0, y: 4.2, w: W, h: 0.35,
  fontSize: 10, color: COLORS.white40, align: 'center',
});
slide.addText('2026 Dressense', {
  x: 0, y: 4.8, w: W, h: 0.3,
  fontSize: 9, color: '333333', align: 'center',
});

pptx.writeFile({ fileName: '/Users/ijeong/Desktop/DRESSENSE_Presentation.pptx' })
  .then(() => console.log('PPT 생성 완료!'))
  .catch(err => console.error('Error:', err));
