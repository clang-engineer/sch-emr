import * as React from 'react';

const HEADER_HEIGHT = 48;
const TOP_PADDING = 4;
const BOTTOM_PADDING = 12;
const RECORD_MARGIN_TOP = 12;
const FORM_MARGIN_TOP = 4;
const RESIZER_HEIGHT = 12;
const MIN_SECTION_HEIGHT = 150;

const computeAvailableHeight = () => window.innerHeight - HEADER_HEIGHT - TOP_PADDING - BOTTOM_PADDING;

export const useRecordFinderLayout = () => {
  const [patientExpanded, setPatientExpanded] = React.useState(true);
  const [containerHeight, setContainerHeight] = React.useState(computeAvailableHeight());
  const [recordHeight, setRecordHeight] = React.useState(0);
  const [patientSectionHeight, setPatientSectionHeight] = React.useState(0);

  const patientSectionRef = React.useRef<HTMLDivElement>(null);

  const spacingTotal = RECORD_MARGIN_TOP + FORM_MARGIN_TOP + RESIZER_HEIGHT;

  React.useLayoutEffect(() => {
    const measureHeight = () => {
      const availableHeight = computeAvailableHeight();
      setContainerHeight(availableHeight);

      if (!patientSectionRef.current) return;
      const actualHeight = patientSectionRef.current.offsetHeight;
      setPatientSectionHeight(actualHeight);

      const remainingHeight = availableHeight - actualHeight - spacingTotal;
      setRecordHeight(prev => {
        if (prev === 0) {
          return Math.floor(remainingHeight * 0.45);
        }
        const maxHeight = Math.max(MIN_SECTION_HEIGHT, remainingHeight - MIN_SECTION_HEIGHT - 16);
        return Math.min(Math.max(prev, MIN_SECTION_HEIGHT), maxHeight);
      });
    };

    measureHeight();
    const timeoutId = window.setTimeout(measureHeight, 0);
    window.addEventListener('resize', measureHeight);
    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener('resize', measureHeight);
    };
  }, [patientExpanded, spacingTotal]);

  const remainingHeight = containerHeight - patientSectionHeight;

  const formHeight = containerHeight - patientSectionHeight - recordHeight - spacingTotal;

  const handleRecordResize = (delta: number) => {
    setRecordHeight(prev => Math.max(MIN_SECTION_HEIGHT, Math.min(prev + delta, remainingHeight - MIN_SECTION_HEIGHT - 16)));
  };

  return {
    patientExpanded,
    setPatientExpanded,
    patientSectionRef,
    recordHeight,
    formHeight,
    handleRecordResize,
  };
};
