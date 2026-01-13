import { Box } from '@mui/material';

import * as React from 'react';
import FormList from './form-list';
import PatientInfo, { PatientSearch } from './patient-info';
import ChartList, { ChartListHeader } from './chart-list';
import { AccordionSection, ResizableSection } from './sections/section-panels';
import { useRecordFinderLayout } from './hooks/use-record-finder-layout';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { Chart, getChartList, getFormList, getPatientInfo } from 'app/modules/emr-viewer/emr-ods.reducer';
import axios from 'axios';
import { CATEGORY_QUERY_META, FORM_QUERY_META } from './emr-finder.constant';

const RecordFinder = () => {
  const dispatch = useAppDispatch();

  const patient = useAppSelector(state => state.emrContent.patient);
  const { patientExpanded, setPatientExpanded, patientSectionRef, recordHeight, formHeight, handleRecordResize } = useRecordFinderLayout();

  const [selectedChart, setSelectedChart] = React.useState<Chart | null>(null);
  const [termFilter, setTermFilter] = React.useState<number>(100);

  React.useEffect(() => {
    if (!patient?.ptNo) {
      return;
    }
    setSelectedChart(null);
    setTermFilter(100);
  }, [patient?.ptNo]);

  // 기간 필터가 변경되면 차트 목록 재조회
  React.useEffect(() => {
    if (!patient?.ptNo) {
      return;
    }
    dispatch(
      getChartList({
        ptNo: patient.ptNo,
        term: String(termFilter),
      })
    );
  }, [patient?.ptNo, termFilter, dispatch]);

  const handlePatientSearch = (ptNo: string) => {
    dispatch(getPatientInfo(ptNo));
  };

  const handleChartSelectionChange = (chart: Chart) => {
    setSelectedChart(chart);

    fetchFormData();
  };

  const fetchFormData = () => {
    CATEGORY_QUERY_META.filter(m => m.code.toLowerCase() === selectedChart.code.toLowerCase()).forEach(m => {
      axios
        .post('/api/ods', {
          key: m.query,
          map: {
            ptNo: patient.ptNo,
            inDate: selectedChart.inDate,
            outDate: selectedChart.outDate,
          },
        })
        .then(({ data }) => {
          const obj = data[0];
          const keysWithY = Object.keys(obj).filter(key => obj[key] === 'Y');
          FORM_QUERY_META.filter(fm => keysWithY.includes(fm.code)).forEach(fm => {
            console.log('Fetching form data for query:', fm.query);
          });
        });
    });
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
            headerContent={<ChartListHeader termFilter={termFilter} onTermFilterChange={setTermFilter} disabled={!patient?.ptNo} />}
          >
            <ChartList onSelectionChange={handleChartSelectionChange} selectedChart={selectedChart} />
          </ResizableSection>
          <ResizableSection
            title="서식 목록"
            color="#0097a7"
            height={formHeight}
            isLast
            disabled={!selectedChart}
            disabledMessage="기록 선택 후 이용 가능"
          >
            <FormList selectedChart={selectedChart} />
          </ResizableSection>
        </>
      )}
    </Box>
  );
};

export default RecordFinder;
