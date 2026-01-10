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
  defaultExpanded?: boolean;
  headerContent?: React.ReactNode;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({ title, color, children, defaultExpanded = true, headerContent }) => {
  return (
    <Box ml={1.5} mt={0.5} mb={0.5}>
      <Accordion
        defaultExpanded={defaultExpanded}
        elevation={0}
        sx={{
          border: '1px solid #e0e0e0',
          borderRadius: '4px !important',
          '&:before': { display: 'none' },
          '& .MuiAccordionSummary-root': {
            minHeight: 'unset',
            bgcolor: '#f8f9fa',
            borderBottom: '2px solid #1976d2',
            px: 1.5,
            py: 0.8,
          },
          '& .MuiAccordionDetails-root': {
            p: 1.5,
          },
        }}
      >
        <AccordionSummary
          sx={{
            minHeight: 'unset !important',
            '&.Mui-expanded': {
              minHeight: 'unset !important',
            },
            '& .MuiAccordionSummary-content': {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 0.8,
              my: '0 !important',
              '&.Mui-expanded': {
                my: '0 !important',
              },
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
          </Box>
          {headerContent && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }} onClick={e => e.stopPropagation()}>
              {headerContent}
            </Box>
          )}
        </AccordionSummary>
        <AccordionDetails>{children}</AccordionDetails>
      </Accordion>
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
      <Box ml={1.5} mt={0.5} mb={0.5} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
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

  const [containerHeight, setContainerHeight] = React.useState(window.innerHeight - 48);
  const [recordHeight, setRecordHeight] = React.useState(0);
  const [dateRange, setDateRange] = React.useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);

  React.useEffect(() => {
    const availableHeight = window.innerHeight - 48 - 8; // 48(header) + 8(padding)
    setContainerHeight(availableHeight);
    setRecordHeight(Math.floor(availableHeight * 0.45)); // 45% for record list
    // formHeight will be 55%
  }, []);

  const formHeight = containerHeight - recordHeight - 16; // 16 for resizer

  const handleRecordResize = (delta: number) => {
    setRecordHeight(prev => Math.max(200, Math.min(prev + delta, containerHeight - 250)));
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
    <Box sx={{ height: 'calc(100vh - 48px)', bgcolor: '#fafafa', p: 0.5, display: 'flex', flexDirection: 'column' }}>
      <AccordionSection
        title="환자 정보"
        color="#1976d2"
        defaultExpanded={true}
        headerContent={<PatientSearch onSearch={handlePatientSearch} />}
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
