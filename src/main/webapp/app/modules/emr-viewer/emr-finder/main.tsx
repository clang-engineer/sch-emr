import { Box } from '@mui/material';

import * as React from 'react';
import FormList from './form-list';
import PatientInfo, { PatientSearch } from './patient-info';
import ChartList, { ChartListHeader } from './chart-list';
import { AccordionSection, ResizableSection } from './sections/section-panels';
import { useRecordFinderLayout } from './hooks/use-record-finder-layout';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { Chart, fetchCategoryForms, getChartList, getPatientInfo } from 'app/modules/emr-viewer/emr-finder.reducer';
import FinderToggleButton from './finder-toggle-button';

const EmrFinderMainBody = () => {
  const dispatch = useAppDispatch();

  const patient = useAppSelector(state => state.emrFinder.patient);
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

    syncCategoryForm(chart);
  };

  const syncCategoryForm = async (c: Chart) => {
    if (!patient?.ptNo) {
      return;
    }

    await dispatch(fetchCategoryForms({ chart: c, ptNo: patient.ptNo }));
  };

  return (
    <Box
      sx={{
        height: '100%',
        flex: 1,
        pt: 0.5,
        px: 0.5,
        pb: 1.5,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        background: 'linear-gradient(180deg, #f9fbff 0%, #f3f6ff 100%)',
      }}
    >
      <FinderToggleButton />
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
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
    </Box>
  );
};

export default EmrFinderMainBody;
