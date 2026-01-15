export const viewModeGridAnimation = {
  animation: 'emrViewFadeIn 180ms ease-out',
  '@keyframes emrViewFadeIn': {
    from: { opacity: 0, transform: 'translateY(6px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
};

export const cardAnimation = (index: number) => ({
  animation: 'emrCardIn 220ms ease-out both',
  animationDelay: `${index * 30}ms`,
  '@keyframes emrCardIn': {
    from: { opacity: 0, transform: 'translateY(6px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
});
