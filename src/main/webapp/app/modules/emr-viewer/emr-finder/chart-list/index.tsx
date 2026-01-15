import React, { useEffect, useState } from 'react';
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Checkbox,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';
import { useAppSelector } from 'app/config/store';
import EmptyState from '../empty-state';
import { Chart } from 'app/modules/emr-viewer/emr-finder.reducer';

type DeptFilter = '수진과' | '작성과';
type TypeFilter = '전체' | 'O' | 'I' | 'E';

interface ChartListHeaderProps {
  termFilter: number;
  onTermFilterChange: (term: number) => void;
  disabled?: boolean;
}

export const ChartListHeader: React.FC<ChartListHeaderProps> = ({ termFilter, onTermFilterChange, disabled = false }) => {
  const getTermLabel = (term: number) => {
    switch (term) {
      case 100:
        return '📅 전체 기간';
      case 10:
        return '📅 최근 10년';
      case 5:
        return '📅 최근 5년';
      case 3:
        return '📅 최근 3년';
      case 1:
        return '📅 최근 1년';
      default:
        return '📅 전체 기간';
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <FormControl size="small" sx={{ minWidth: 130 }}>
        <Select
          value={termFilter}
          onChange={e => {
            onTermFilterChange(Number(e.target.value));
          }}
          disabled={disabled}
          displayEmpty
          renderValue={value => {
            return getTermLabel(Number(value));
          }}
          sx={{
            height: '32px',
            fontSize: '0.75rem',
            bgcolor: disabled ? 'rgba(255, 255, 255, 0.1)' : '#fff',
            borderRadius: '6px',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: disabled ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.7)',
              borderWidth: '1.5px',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: disabled ? 'rgba(255, 255, 255, 0.3)' : '#fff',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#fff',
              borderWidth: '2px',
            },
            '& .MuiSelect-select': {
              py: 0.7,
              px: 1.5,
              color: disabled ? 'rgba(255, 255, 255, 0.5)' : '#0288d1',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            },
            '& .MuiSelect-icon': {
              color: disabled ? 'rgba(255, 255, 255, 0.3)' : '#0288d1',
            },
          }}
        >
          <MenuItem value={100} sx={{ fontSize: '0.75rem', py: 1 }}>
            📅 전체 기간
          </MenuItem>
          <MenuItem value={10} sx={{ fontSize: '0.75rem', py: 1 }}>
            📅 최근 10년
          </MenuItem>
          <MenuItem value={5} sx={{ fontSize: '0.75rem', py: 1 }}>
            📅 최근 5년
          </MenuItem>
          <MenuItem value={3} sx={{ fontSize: '0.75rem', py: 1 }}>
            📅 최근 3년
          </MenuItem>
          <MenuItem value={1} sx={{ fontSize: '0.75rem', py: 1 }}>
            📅 최근 1년
          </MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

interface ChartListProps {
  onSelectionChange?: (chart: Chart) => void;
  selectedChart?: Chart;
}

const ChartList: React.FC<ChartListProps> = ({ onSelectionChange, selectedChart }) => {
  const { loading: loadingState, patient } = useAppSelector(state => state.emrFinder);
  const chartLoading = loadingState.chart;

  const charts = useAppSelector<Chart[]>(state => state.emrFinder.charts);
  const [deptFilter, setDeptFilter] = useState<DeptFilter>('수진과');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('전체');

  useEffect(() => {
    setDeptFilter('수진과');
    setTypeFilter('전체');
  }, [patient?.ptNo]);

  const handleDeptChange = (_event: React.MouseEvent<HTMLElement>, newValue: DeptFilter | null) => {
    if (newValue !== null) {
      setDeptFilter(newValue);
    }
  };

  const handleTypeChange = (_event: React.MouseEvent<HTMLElement>, newValue: TypeFilter | null) => {
    if (newValue !== null) {
      setTypeFilter(newValue);
    }
  };

  // 필터링된 차트 목록 (기간 필터는 서버에서 처리)
  const filteredCharts = charts.filter(chart => {
    if (!patient?.ptNo || chart.ptNo !== patient.ptNo) {
      return false;
    }
    // 유형 필터
    if (typeFilter !== '전체' && chart.code !== typeFilter) {
      return false;
    }
    // 추가 필터링 로직 (수진과/작성과는 현재 데이터에 없으므로 나중에 추가)
    return true;
  });

  const isSelected = (chart: Chart) => chart?.chartNo === selectedChart?.chartNo;

  const toggleButtonStyle = {
    py: 0.5,
    px: 1.5,
    fontSize: '0.75rem',
    textTransform: 'none',
    fontWeight: 500,
    '&.Mui-selected': {
      bgcolor: '#1976d2',
      color: '#fff',
      '&:hover': {
        bgcolor: '#1565c0',
      },
    },
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* 필터 영역 - 데이터가 있을 때만 표시 */}
      {!chartLoading && charts.length > 0 && (
        <Box sx={{ mb: 1.5, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#546e7a', minWidth: 'fit-content' }}>구분</Typography>
            <ToggleButtonGroup value={deptFilter} exclusive onChange={handleDeptChange} size="small" sx={{ height: '28px' }}>
              <ToggleButton value="수진과" sx={toggleButtonStyle}>
                수진과
              </ToggleButton>
              <ToggleButton value="작성과" sx={toggleButtonStyle}>
                작성과
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#546e7a', minWidth: 'fit-content' }}>유형</Typography>
            <ToggleButtonGroup value={typeFilter} exclusive onChange={handleTypeChange} size="small" sx={{ height: '28px' }}>
              <ToggleButton value="전체" sx={toggleButtonStyle}>
                전체
              </ToggleButton>
              <ToggleButton value="O" sx={toggleButtonStyle}>
                외래
              </ToggleButton>
              <ToggleButton value="I" sx={toggleButtonStyle}>
                입원
              </ToggleButton>
              <ToggleButton value="E" sx={toggleButtonStyle}>
                응급
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>
      )}

      {/* 테이블 영역 */}
      {chartLoading ? (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            bgcolor: '#fff',
          }}
        >
          <CircularProgress size={24} />
        </Box>
      ) : charts.length === 0 ? (
        <EmptyState icon="file-medical" title="조회된 기록 없음" description="날짜를 선택하고 검색해주세요." />
      ) : (
        <TableContainer sx={{ flex: 1, overflow: 'auto', border: '1px solid #e0e0e0', borderRadius: '4px' }}>
          <Table stickyHeader size="small" sx={{ '& .MuiTableCell-root': { fontSize: '0.75rem' } }}>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{ bgcolor: '#f8f9fa', fontWeight: 600, color: '#37474f', py: 0.6, fontSize: '0.7rem', whiteSpace: 'nowrap' }}
                >
                  구분
                </TableCell>
                <TableCell
                  sx={{ bgcolor: '#f8f9fa', fontWeight: 600, color: '#37474f', py: 0.6, fontSize: '0.7rem', whiteSpace: 'nowrap' }}
                >
                  입원일
                </TableCell>
                <TableCell
                  sx={{ bgcolor: '#f8f9fa', fontWeight: 600, color: '#37474f', py: 0.6, fontSize: '0.7rem', whiteSpace: 'nowrap' }}
                >
                  퇴(내)원일
                </TableCell>
                <TableCell
                  sx={{ bgcolor: '#f8f9fa', fontWeight: 600, color: '#37474f', py: 0.6, fontSize: '0.7rem', whiteSpace: 'nowrap' }}
                >
                  진료과
                </TableCell>
                <TableCell
                  sx={{ bgcolor: '#f8f9fa', fontWeight: 600, color: '#37474f', py: 0.6, fontSize: '0.7rem', whiteSpace: 'nowrap' }}
                >
                  주치의
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCharts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ py: 4, textAlign: 'center', color: '#78909c' }}>
                    선택한 조건에 맞는 기록이 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCharts.map((chart, index) => (
                  <TableRow
                    key={index}
                    hover
                    sx={{
                      cursor: 'pointer',
                      bgcolor: isSelected(chart) ? '#e3f2fd' : 'transparent',
                      '&:hover': { bgcolor: isSelected(chart) ? '#e3f2fd' : '#f5f5f5' },
                    }}
                    onClick={() => {
                      onSelectionChange(chart);
                    }}
                  >
                    <TableCell sx={{ py: 0.8 }}>
                      <Chip
                        label={chart.label}
                        size="small"
                        sx={{
                          height: '20px',
                          fontSize: '0.7rem',
                          bgcolor: chart.code === 'O' ? '#e3f2fd' : chart.code === 'I' ? '#fff3e0' : '#ffebee',
                          color: chart.code === 'O' ? '#1976d2' : chart.code === 'I' ? '#f57c00' : '#d32f2f',
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 0.8 }}>{chart.inDate}</TableCell>
                    <TableCell sx={{ py: 0.8 }}>{chart.outDate}</TableCell>
                    <TableCell sx={{ py: 0.8 }}>{chart.department}</TableCell>
                    <TableCell sx={{ py: 0.8 }}>{chart.doctor}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ChartList;
