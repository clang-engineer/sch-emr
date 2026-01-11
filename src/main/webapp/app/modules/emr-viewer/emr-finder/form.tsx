import { Box } from '@mui/material';

import * as React from 'react';
import FormList from './form-list';
import PatientInfo, { PatientSearch } from './patient-info';
import RecordList, { RecordListHeader } from './record-list';
import { AccordionSection, ResizableSection } from './sections/section-panels';
import { useRecordFinderLayout } from './hooks/use-record-finder-layout';

const RecordFinder = () => {
  const { patientExpanded, setPatientExpanded, patientSectionRef, recordHeight, formHeight, handleRecordResize } = useRecordFinderLayout();

  const [dateRange, setDateRange] = React.useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);

  const handleSearch = () => {};

  const handlePatientSearch = (patientId: string) => {};

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
