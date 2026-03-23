/**
 * Animation Variants - Framer Motion
 * Reusable animation configurations for smooth UX
 * 
 * Usage:
 * import { fadeInUp, hoverScale } from '@/utils/animations';
 * <motion.div {...fadeInUp} {...hoverScale}>Content</motion.div>
 */

// ============================================
// FADE ANIMATIONS
// ============================================

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 },
};

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
};

export const fadeInDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
};

export const fadeInLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
};

export const fadeInRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
};

// ============================================
// SCALE ANIMATIONS
// ============================================

export const scaleIn = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.9, opacity: 0 },
  transition: { duration: 0.3 },
};

export const scalePop = {
  initial: { scale: 0 },
  animate: { 
    scale: [0, 1.2, 1],
    transition: {
      duration: 0.6,
      times: [0, 0.6, 1],
      ease: [0.34, 1.56, 0.64, 1],
    },
  },
  exit: { scale: 0, transition: { duration: 0.2 } },
};

export const scaleSpring = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.8, opacity: 0 },
  transition: { type: 'spring', stiffness: 300, damping: 20 },
};

// ============================================
// SLIDE ANIMATIONS
// ============================================

export const slideInRight = {
  initial: { x: '100%' },
  animate: { x: 0 },
  exit: { x: '100%' },
  transition: { type: 'spring', stiffness: 300, damping: 30 },
};

export const slideInLeft = {
  initial: { x: '-100%' },
  animate: { x: 0 },
  exit: { x: '-100%' },
  transition: { type: 'spring', stiffness: 300, damping: 30 },
};

export const slideInBottom = {
  initial: { y: '100%' },
  animate: { y: 0 },
  exit: { y: '100%' },
  transition: { type: 'spring', stiffness: 300, damping: 30 },
};

export const slideInTop = {
  initial: { y: '-100%' },
  animate: { y: 0 },
  exit: { y: '-100%' },
  transition: { type: 'spring', stiffness: 300, damping: 30 },
};

// ============================================
// STAGGER ANIMATIONS (For Lists/Grids)
// ============================================

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerFast = {
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0,
    },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

export const staggerItemScale = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.3,
    },
  },
};

// ============================================
// HOVER ANIMATIONS
// ============================================

export const hoverScale = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
  transition: { type: 'spring', stiffness: 400, damping: 17 },
};

export const hoverScaleSmall = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: { type: 'spring', stiffness: 400, damping: 17 },
};

export const hoverLift = {
  whileHover: { 
    y: -4,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
    transition: { duration: 0.2 },
  },
  transition: { duration: 0.2 },
};

export const hoverGlow = {
  whileHover: { 
    boxShadow: '0 0 30px rgba(255, 122, 0, 0.5)',
    transition: { duration: 0.3 },
  },
  transition: { duration: 0.3 },
};

export const hoverRotate = {
  whileHover: { rotate: 5 },
  whileTap: { rotate: -5 },
  transition: { type: 'spring', stiffness: 300 },
};

// ============================================
// LOADING ANIMATIONS
// ============================================

export const shimmer = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'linear',
  },
};

export const pulse = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut',
  },
};

export const spin = {
  animate: { rotate: 360 },
  transition: {
    duration: 1,
    repeat: Infinity,
    ease: 'linear',
  },
};

export const bounce = {
  animate: {
    y: [0, -10, 0],
  },
  transition: {
    duration: 0.6,
    repeat: Infinity,
    ease: 'easeInOut',
  },
};

// ============================================
// SUCCESS/ERROR ANIMATIONS
// ============================================

export const successPop = {
  initial: { scale: 0, rotate: -180 },
  animate: { 
    scale: [0, 1.3, 1],
    rotate: [0, 10, -10, 0],
  },
  transition: {
    duration: 0.7,
    ease: [0.34, 1.56, 0.64, 1],
  },
};

export const shake = {
  animate: {
    x: [0, -10, 10, -10, 10, 0],
  },
  transition: {
    duration: 0.5,
  },
};

export const errorShake = {
  initial: { x: 0 },
  animate: { 
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.4 }
  },
};

// ============================================
// MODAL/OVERLAY ANIMATIONS
// ============================================

export const modalBackdrop = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 },
};

export const modalContent = {
  initial: { scale: 0.9, opacity: 0, y: 50 },
  animate: { scale: 1, opacity: 1, y: 0 },
  exit: { scale: 0.9, opacity: 0, y: 50 },
  transition: { 
    type: 'spring',
    stiffness: 300,
    damping: 30,
  },
};

export const drawerContent = {
  initial: { x: '100%' },
  animate: { x: 0 },
  exit: { x: '100%' },
  transition: { 
    type: 'spring',
    stiffness: 300,
    damping: 30,
  },
};

export const bottomSheet = {
  initial: { y: '100%' },
  animate: { y: 0 },
  exit: { y: '100%' },
  transition: { 
    type: 'spring',
    stiffness: 300,
    damping: 30,
  },
};

// ============================================
// SWIPE ANIMATIONS (For Feed)
// ============================================

export const swipeVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

export const swipeConfidenceThreshold = 10000;

export const swipePower = (offset, velocity) => {
  return Math.abs(offset) * velocity;
};

// ============================================
// PAGE TRANSITIONS
// ============================================

export const pageTransition = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.3 },
};

export const pageTransitionFade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
};

// ============================================
// NUMBER COUNTER ANIMATION
// ============================================

export const counterAnimation = (from, to, duration = 1) => ({
  initial: { value: from },
  animate: { value: to },
  transition: { 
    duration,
    ease: 'easeOut',
  },
});

// ============================================
// COLLAPSE/EXPAND ANIMATIONS
// ============================================

export const expandCollapse = {
  initial: { height: 0, opacity: 0 },
  animate: { height: 'auto', opacity: 1 },
  exit: { height: 0, opacity: 0 },
  transition: { duration: 0.3 },
};

export const rotate180 = {
  initial: { rotate: 0 },
  animate: { rotate: 180 },
  exit: { rotate: 0 },
  transition: { duration: 0.3 },
};

// ============================================
// DEFAULT EXPORT
// ============================================

export default {
  // Fade
  fadeIn,
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  
  // Scale
  scaleIn,
  scalePop,
  scaleSpring,
  
  // Slide
  slideInRight,
  slideInLeft,
  slideInBottom,
  slideInTop,
  
  // Stagger
  staggerContainer,
  staggerContainerFast,
  staggerItem,
  staggerItemScale,
  
  // Hover
  hoverScale,
  hoverScaleSmall,
  hoverLift,
  hoverGlow,
  hoverRotate,
  
  // Loading
  shimmer,
  pulse,
  spin,
  bounce,
  
  // Success/Error
  successPop,
  shake,
  errorShake,
  
  // Modal/Overlay
  modalBackdrop,
  modalContent,
  drawerContent,
  bottomSheet,
  
  // Swipe
  swipeVariants,
  swipeConfidenceThreshold,
  swipePower,
  
  // Page
  pageTransition,
  pageTransitionFade,
  
  // Counter
  counterAnimation,
  
  // Expand/Collapse
  expandCollapse,
  rotate180,
};