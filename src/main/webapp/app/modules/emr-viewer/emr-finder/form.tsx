import { Box } from '@mui/material';

import * as React from 'react';
import FormList from './form-list';
import PatientInfo, { PatientSearch } from './patient-info';
import ChartList, { ChartListHeader } from './chart-list';
import { AccordionSection, ResizableSection } from './sections/section-panels';
import { useRecordFinderLayout } from './hooks/use-record-finder-layout';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getChartList, getFormList, getPatientInfo } from 'app/modules/emr-viewer/emr-ods.reducer';

const RecordFinder = () => {
  const dispatch = useAppDispatch();

  const patient = useAppSelector(state => state.emrContent.patient);
  const { patientExpanded, setPatientExpanded, patientSectionRef, recordHeight, formHeight, handleRecordResize } = useRecordFinderLayout();

  const [dateRange, setDateRange] = React.useState([
    {
      startDate: null,
      endDate: null,
      key: 'selection',
    },
  ]);
  const [selectedChartNos, setSelectedChartNos] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (!patient?.ptNo) {
      return;
    }
    setDateRange([{ startDate: null, endDate: null, key: 'selection' }]);
    setSelectedChartNos([]);
  }, [patient?.ptNo]);

  const handleChartSearch = () => {
    if (!patient?.ptNo || !dateRange[0].startDate || !dateRange[0].endDate) {
      return;
    }
    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    dispatch(
      getChartList({
        ptNo: patient.ptNo,
        term: '100',
      })
    );
  };

  const handlePatientSearch = (ptNo: string) => {
    dispatch(getPatientInfo(ptNo));
  };

  const handleChartSelectionChange = (chartNos: string[]) => {
    setSelectedChartNos(chartNos);
    if (!chartNos.length) {
      return;
    }
    dispatch(getFormList({ chartNos }));
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
            disabled={!patient?.ptNo}
            disabledMessage="환자 입력 후 이용 가능"
            headerContent={
              <ChartListHeader
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                onSearch={() => {
                  handleChartSearch();
                }}
                disabled={!patient?.ptNo}
              />
            }
          >
            <ChartList onSelectionChange={handleChartSelectionChange} selectedChartNos={selectedChartNos} />
          </ResizableSection>
          <ResizableSection
            title="서식 목록"
            color="#0097a7"
            height={formHeight}
            isLast
            disabled={selectedChartNos.length === 0}
            disabledMessage="기록 선택 후 이용 가능"
          >
            <FormList selectedChartNos={selectedChartNos} />
          </ResizableSection>
        </>
      )}
    </Box>
  );
};

export default RecordFinder;
