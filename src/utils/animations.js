// src/utils/animations.js
export const fadeIn = (direction = 'up', duration = 0.6, delay = 0) => {
    const directionMap = {
      up: { y: 20 },
      down: { y: -20 },
      left: { x: 20 },
      right: { x: -20 },
      none: { x: 0, y: 0 }
    };
    
    return {
      initial: {
        opacity: 0,
        ...directionMap[direction]
      },
      animate: {
        opacity: 1,
        x: 0,
        y: 0,
        transition: {
          duration,
          delay,
          ease: 'easeOut'
        }
      }
    };
  };
  
  export const staggerContainer = (staggerChildren, delayChildren = 0) => {
    return {
      initial: {},
      animate: {
        transition: {
          staggerChildren,
          delayChildren
        }
      }
    };
  };
  
  export const textVariant = (delay = 0) => {
    return {
      initial: {
        y: 20,
        opacity: 0
      },
      animate: {
        y: 0,
        opacity: 1,
        transition: {
          type: 'spring',
          duration: 1.25,
          delay
        }
      }
    };
  };
  
  export const slideIn = (direction, type, delay, duration) => {
    const directionMap = {
      up: { y: '100%' },
      down: { y: '-100%' },
      left: { x: '100%' },
      right: { x: '-100%' }
    };
    
    return {
      initial: {
        ...directionMap[direction]
      },
      animate: {
        x: 0,
        y: 0,
        transition: {
          type,
          delay,
          duration,
          ease: 'easeOut'
        }
      }
    };
  };
  
  export const zoomIn = (delay, duration) => {
    return {
      initial: {
        scale: 0,
        opacity: 0
      },
      animate: {
        scale: 1,
        opacity: 1,
        transition: {
          type: 'tween',
          delay,
          duration,
          ease: 'easeOut'
        }
      }
    };
  };
  
  export const floatAnimation = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: {
        repeat: Infinity,
        duration: 3,
        ease: 'easeInOut'
      }
    }
  };
  
  export const pulseAnimation = {
    initial: { scale: 1, opacity: 1 },
    animate: {
      scale: [1, 1.05, 1],
      opacity: [1, 0.8, 1],
      transition: {
        repeat: Infinity,
        duration: 2,
        ease: 'easeInOut'
      }
    }
  };
  