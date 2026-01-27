import { LandingPage } from '@/components/LandingPage';

export function App() {
  return (
    <LandingPage
      onEnter={() => {
        // 다른 프로젝트에서 사용할 때 이 콜백을 변경하세요
        // 예: window.location.href = '/login';
        window.alert('Get Started!');
      }}
    />
  );
}
