// Motion System for Agent Chat Demo

// Spring configurations
export const springs = {
  gentle: { type: 'spring' as const, damping: 20, stiffness: 100 },
  snappy: { type: 'spring' as const, damping: 25, stiffness: 300 },
  bouncy: { type: 'spring' as const, damping: 10, stiffness: 200 },
};

// Haptic feedback patterns (ms)
export const hapticPatterns = {
  tap: [10],
  success: [10, 50, 10],
  error: [50, 30, 50, 30, 50],
  select: [5],
};

// Trigger haptic feedback
export function haptic(pattern: keyof typeof hapticPatterns) {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(hapticPatterns[pattern]);
  }
}
