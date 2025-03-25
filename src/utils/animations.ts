
// Animation timing functions
export const easings = {
  easeOutExpo: (x: number): number => {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
  },
  easeInOutQuad: (x: number): number => {
    return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
  },
  easeOutBack: (x: number): number => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
  }
};

// Animation helper to create smooth transitions
export const animateValue = (
  start: number,
  end: number,
  duration: number,
  easing: (x: number) => number,
  onUpdate: (value: number) => void,
  onComplete?: () => void
): { cancel: () => void } => {
  const startTime = performance.now();
  let animationFrame: number;
  
  const animate = (currentTime: number) => {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1);
    const easedProgress = easing(progress);
    
    const value = start + (end - start) * easedProgress;
    onUpdate(value);
    
    if (progress < 1) {
      animationFrame = requestAnimationFrame(animate);
    } else {
      onComplete?.();
    }
  };
  
  animationFrame = requestAnimationFrame(animate);
  
  return {
    cancel: () => {
      cancelAnimationFrame(animationFrame);
    }
  };
};

// Helper to chain multiple animations
export const sequence = (
  animations: Array<() => Promise<void>>,
  onComplete?: () => void
): { cancel: () => void } => {
  let currentCancel: (() => void) | null = null;
  let isCancelled = false;
  
  const runSequence = async () => {
    for (const anim of animations) {
      if (isCancelled) return;
      
      try {
        await new Promise<void>((resolve) => {
          const { cancel } = anim();
          currentCancel = cancel;
          resolve();
        });
      } catch (e) {
        if (!isCancelled) {
          console.error('Animation sequence error:', e);
        }
        break;
      }
    }
    
    if (!isCancelled) {
      onComplete?.();
    }
  };
  
  runSequence();
  
  return {
    cancel: () => {
      isCancelled = true;
      if (currentCancel) {
        currentCancel();
      }
    }
  };
};
