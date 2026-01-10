import { Box, Grid, Paper, Typography, useTheme, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
// import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

import * as React from 'react';
import FormList from './form-list';
import PatientInfo, { PatientSearch } from './patient-info';
import RecordList, { RecordListHeader } from './record-list';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface AccordionSectionProps {
  title: string;
  color: string;
  children: React.ReactNode;
  expanded: boolean;
  onChange: () => void;
  headerContent?: React.ReactNode;
  contentHeight?: number;
}

const AccordionSection = React.forwardRef<HTMLDivElement, AccordionSectionProps>(
  ({ title, color, children, expanded, onChange, headerContent, contentHeight }, ref) => {
    return (
      <Box ref={ref} ml={1.5} mt={0.5} mb={0} sx={{ display: 'flex', flexDirection: 'column' }}>
        <Paper
          elevation={0}
          sx={{
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <Box
            onClick={onChange}
            sx={{
              bgcolor: '#f8f9fa',
              borderBottom: expanded ? '2px solid #1976d2' : 'none',
              px: 1.5,
              py: 0.8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 0.8,
              cursor: 'pointer',
              '&:hover': {
                bgcolor: '#f0f0f0',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <Box sx={{ width: 3, height: 14, bgcolor: color, borderRadius: '2px' }} />
              <Typography
                variant="body2"
                fontWeight="600"
                sx={{
                  fontSize: '0.8rem',
                  color: '#37474f',
                  letterSpacing: '0.3px',
                  textTransform: 'uppercase',
                }}
              >
                {title}
              </Typography>
              <FontAwesomeIcon
                icon={['fas', expanded ? 'chevron-up' : 'chevron-down']}
                style={{ fontSize: '0.75rem', color: '#546e7a', marginLeft: '4px' }}
              />
            </Box>
            {headerContent && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }} onClick={e => e.stopPropagation()}>
                {headerContent}
              </Box>
            )}
          </Box>
          {expanded && <Box sx={{ p: 1.5, height: contentHeight ? `${contentHeight}px` : 'auto', overflow: 'auto' }}>{children}</Box>}
        </Paper>
      </Box>
    );
  }
);

interface ResizableSectionProps {
  title: string;
  color: string;
  children: React.ReactNode;
  height: number;
  isLast?: boolean;
  isFirst?: boolean;
  onResize?: (delta: number) => void;
  headerContent?: React.ReactNode;
}

const ResizableSection: React.FC<ResizableSectionProps> = ({
  title,
  color,
  children,
  height,
  isLast = false,
  isFirst = false,
  onResize,
  headerContent,
}) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const startYRef = React.useRef<number>(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isLast) return;
    setIsDragging(true);
    startYRef.current = e.clientY;
    e.preventDefault();
  };

  React.useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.clientY - startYRef.current;
      startYRef.current = e.clientY;
      onResize?.(delta);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, onResize]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box ml={1.5} mt={isFirst ? 1.5 : 0.5} mb={0} sx={{ height: `${height}px`, display: 'flex', flexDirection: 'column' }}>
        <Paper
          elevation={0}
          sx={{
            border: '1px solid',
            borderColor: '#e0e0e0',
            borderRadius: '4px',
            bgcolor: '#fff',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              bgcolor: '#f8f9fa',
              borderBottom: '2px solid #1976d2',
              px: 1.5,
              py: 0.8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 0.8,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <Box
                sx={{
                  width: 3,
                  height: 14,
                  bgcolor: color,
                  borderRadius: '2px',
                }}
              />
              <Typography
                variant="body2"
                fontWeight="600"
                sx={{
                  fontSize: '0.8rem',
                  color: '#37474f',
                  letterSpacing: '0.3px',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {title}
              </Typography>
            </Box>
            {headerContent && <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>{headerContent}</Box>}
          </Box>
          <Box sx={{ p: 1.5, flex: 1, overflow: 'auto' }}>{children}</Box>
        </Paper>
      </Box>
      {!isLast && (
        <Box
          onMouseDown={handleMouseDown}
          sx={{
            height: '12px',
            cursor: 'ns-resize',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: isDragging ? '#90caf9' : 'transparent',
            transition: 'background-color 0.2s',
            '&:hover': {
              bgcolor: '#e3f2fd',
            },
          }}
        >
          {/* <DragIndicatorIcon */}
          {/*   className="drag-icon" */}
          {/*   sx={{ */}
          {/*     fontSize: '1rem', */}
          {/*     color: '#90a4ae', */}
          {/*     opacity: 0, */}
          {/*     transition: 'opacity 0.2s', */}
          {/*   }} */}
          {/* /> */}
          <FontAwesomeIcon icon={['fas', 'grip-lines']} className="drag-icon" style={{ fontSize: '0.7rem', color: '#90a4ae' }} />
        </Box>
      )}
    </Box>
  );
};

// const RecordFinder = () => {
//     const [currentIrb, setCurrentIrb] = React.useState<string | null>(null);
//     const [currentRid, setCurrentRid] = React.useState<string | null>(null);
//
//     return (
//         <Box sx={{ pl: 2, pr: 0, pb: 2, width: '100%', height: '100%' }}>
//             <Box sx={{ width: '100%', height: '52px', mb: 2.5 }}>
//                 <RecordSearchPanel setCurrentIrb={setCurrentIrb} setCurrentRid={setCurrentRid} />
//             </Box>
//             <ConditionFinder currentIrb={currentIrb} currentRid={currentRid} />
//         </Box>
//     );
// };
//
// export default RecordFinder;
const RecordFinder = () => {
  const [currentIrb, setCurrentIrb] = React.useState<string | null>(null);
  const [currentRid, setCurrentRid] = React.useState<string | null>(null);
  const theme = useTheme();

  const [patientExpanded, setPatientExpanded] = React.useState(true);
  const [containerHeight, setContainerHeight] = React.useState(window.innerHeight - 48);
  const [recordHeight, setRecordHeight] = React.useState(0);
  const [patientSectionHeight, setPatientSectionHeight] = React.useState(0);

  const patientSectionRef = React.useRef<HTMLDivElement>(null);

  const [dateRange, setDateRange] = React.useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);

  React.useLayoutEffect(() => {
    const TOP_PADDING = 4; // pt: 0.5 = 4px
    const BOTTOM_PADDING = 0; // pb: 0 = 0px
    const availableHeight = window.innerHeight - 48 - TOP_PADDING - BOTTOM_PADDING; // 48(header) + paddings
    setContainerHeight(availableHeight);

    // Measure actual patient section height after render
    const measureHeight = () => {
      if (patientSectionRef.current) {
        const actualHeight = patientSectionRef.current.offsetHeight;
        setPatientSectionHeight(actualHeight);

        const RECORD_MARGIN_TOP = 12; // mt: 1.5 = 12px (first section)
        const FORM_MARGIN_TOP = 4; // mt: 0.5 = 4px
        const RESIZER_HEIGHT = 12;
        const totalSpacing = RECORD_MARGIN_TOP + FORM_MARGIN_TOP + RESIZER_HEIGHT;
        const remainingHeight = availableHeight - actualHeight - totalSpacing;
        setRecordHeight(Math.floor(remainingHeight * 0.45)); // 45% of remaining
      }
    };

    measureHeight();
    // Small delay to ensure DOM is fully rendered
    const timeoutId = setTimeout(measureHeight, 0);
    return () => clearTimeout(timeoutId);
  }, [patientExpanded]);

  const remainingHeight = containerHeight - patientSectionHeight;

  // Calculate form height: total - patient - record - all margins - resizer
  const RECORD_MARGIN_TOP = 12; // mt: 1.5 = 12px (first section)
  const FORM_MARGIN_TOP = 4;
  const RESIZER_HEIGHT = 12;
  const formHeight = containerHeight - patientSectionHeight - recordHeight - RECORD_MARGIN_TOP - FORM_MARGIN_TOP - RESIZER_HEIGHT;

  const handleRecordResize = (delta: number) => {
    setRecordHeight(prev => Math.max(150, Math.min(prev + delta, remainingHeight - 150 - 16)));
  };

  const handleSearch = () => {
    console.log('조회:', dateRange);
  };

  const handlePatientSearch = (patientId: string) => {
    console.log('환자 검색:', patientId);
  };

  return (
    <Box
      sx={{
        height: 'calc(100vh - 48px)',
        pt: 0.5,
        px: 0.5,
        pb: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <AccordionSection
        ref={patientSectionRef}
        title="환자 정보"
        color="#1976d2"
        expanded={patientExpanded}
        onChange={() => setPatientExpanded(prev => !prev)}
        headerContent={<PatientSearch onSearch={handlePatientSearch} />}
        contentHeight={140}
      >
        <PatientInfo />
      </AccordionSection>
      {recordHeight > 0 && (
        <>
          <ResizableSection
            title="기록 목록"
            color="#0288d1"
            height={recordHeight}
            isFirst
            onResize={handleRecordResize}
            headerContent={<RecordListHeader dateRange={dateRange} onDateRangeChange={setDateRange} onSearch={handleSearch} />}
          >
            <RecordList />
          </ResizableSection>
          <ResizableSection title="서식 목록" color="#0097a7" height={formHeight} isLast>
            <FormList />
          </ResizableSection>
        </>
      )}
    </Box>
  );
};

export default RecordFinder;
