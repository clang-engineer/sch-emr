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

const AccordionSection: React.FC<AccordionSectionProps> = ({
  title,
  color,
  children,
  expanded,
  onChange,
  headerContent,
  contentHeight,
}) => {
  return (
    <Box ml={1.5} mt={0.5} mb={0} sx={{ display: 'flex', flexDirection: 'column' }}>
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
};

interface ResizableSectionProps {
  title: string;
  color: string;
  children: React.ReactNode;
  height: number;
  isLast?: boolean;
  onResize?: (delta: number) => void;
  headerContent?: React.ReactNode;
}

const ResizableSection: React.FC<ResizableSectionProps> = ({ title, color, children, height, isLast = false, onResize, headerContent }) => {
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
    <Box sx={{ height: `${height}px`, display: 'flex', flexDirection: 'column' }}>
      <Box ml={1.5} mt={0.5} mb={0} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
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
            height: '8px',
            cursor: 'ns-resize',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: isDragging ? '#1976d2' : 'transparent',
            transition: 'background-color 0.2s',
            '&:hover': {
              bgcolor: '#e3f2fd',
            },
            '&:hover .drag-icon': {
              opacity: 1,
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
          <FontAwesomeIcon
            icon={['fas', 'grip-lines']}
            className="drag-icon"
            style={{ fontSize: '1rem', color: '#90a4ae', opacity: 0, transition: 'opacity 0.2s' }}
          />
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

  const [dateRange, setDateRange] = React.useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);

  const PATIENT_HEADER_HEIGHT = 40; // Approximate header height (py: 0.8 * 2 + text + border)
  const PATIENT_CONTENT_HEIGHT = 140; // Content box height (excluding padding)
  const PATIENT_PADDING = 24; // p: 1.5 * 8 * 2 = 24px total padding
  const PATIENT_TOTAL_HEIGHT = PATIENT_HEADER_HEIGHT + PATIENT_CONTENT_HEIGHT + PATIENT_PADDING + 6; // +6 for top margin (mt: 0.5 = 4px) + border
  const patientSectionHeight = patientExpanded ? PATIENT_TOTAL_HEIGHT : PATIENT_HEADER_HEIGHT + 6;

  React.useEffect(() => {
    const TOP_PADDING = 4; // pt: 0.5 = 4px
    const availableHeight = window.innerHeight - 48 - TOP_PADDING; // 48(header) + 4(top padding)
    setContainerHeight(availableHeight);

    const SECTION_TOP_MARGINS = 12; // 3 sections * mt(0.5 = 4px)
    const RESIZER_HEIGHT = 8; // Only one resizer between record and form
    const remainingHeight = availableHeight - patientSectionHeight - SECTION_TOP_MARGINS - RESIZER_HEIGHT;
    setRecordHeight(Math.floor(remainingHeight * 0.45)); // 45% of remaining
  }, [patientExpanded, PATIENT_TOTAL_HEIGHT]);

  const remainingHeight = containerHeight - patientSectionHeight;

  // Calculate form height: total - patient - record - resizer - margins
  // Margins: record mt(4px) + form mt(4px) = 8px
  // Resizer: 8px
  const formHeight = containerHeight - patientSectionHeight - recordHeight - 8 - 8;

  const handleRecordResize = (delta: number) => {
    setRecordHeight(prev => Math.max(150, Math.min(prev + delta, remainingHeight - 150 - 16)));
  };

  const handleSearch = () => {
    console.log('조회:', dateRange);
  };

  const handlePatientSearch = (patientId: string) => {
    console.log('환자 검색:', patientId);
  };

  if (recordHeight === 0) {
    return null; // Wait for initial height calculation
  }

  return (
    <Box sx={{ height: 'calc(100vh - 48px)', bgcolor: '#fafafa', pt: 0.5, px: 0.5, pb: 0, display: 'flex', flexDirection: 'column' }}>
      <AccordionSection
        title="환자 정보"
        color="#1976d2"
        expanded={patientExpanded}
        onChange={() => setPatientExpanded(prev => !prev)}
        headerContent={<PatientSearch onSearch={handlePatientSearch} />}
        contentHeight={PATIENT_CONTENT_HEIGHT}
      >
        <PatientInfo />
      </AccordionSection>
      <ResizableSection
        title="기록 목록"
        color="#0288d1"
        height={recordHeight}
        onResize={handleRecordResize}
        headerContent={<RecordListHeader dateRange={dateRange} onDateRangeChange={setDateRange} onSearch={handleSearch} />}
      >
        <RecordList />
      </ResizableSection>
      <ResizableSection title="서식 목록" color="#0097a7" height={formHeight} isLast>
        <FormList />
      </ResizableSection>
    </Box>
  );
};

export default RecordFinder;
