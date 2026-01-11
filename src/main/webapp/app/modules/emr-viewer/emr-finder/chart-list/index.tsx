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
  Popover,
  IconButton,
  TextField,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DateRangePicker } from 'react-date-range';
import { ko } from 'date-fns/locale';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { useAppSelector } from 'app/config/store';
import EmptyState from '../empty-state';

type DeptFilter = '수진과' | '작성과';
type TypeFilter = '전체' | '외래' | '입원' | '응급';

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
  key: string;
}

interface ChartListHeaderProps {
  dateRange: DateRange[];
  onDateRangeChange: (range: DateRange[]) => void;
  onSearch: () => void;
  disabled?: boolean;
}

export const ChartListHeader: React.FC<ChartListHeaderProps> = ({ dateRange, onDateRangeChange, onSearch, disabled = false }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [startDateInput, setStartDateInput] = useState('');
  const [endDateInput, setEndDateInput] = useState('');

  // dateRange가 변경되면 입력 필드 동기화
  useEffect(() => {
    if (dateRange[0].startDate) {
      const formatted = `${dateRange[0].startDate.getFullYear()}/${String(dateRange[0].startDate.getMonth() + 1).padStart(2, '0')}/${String(
        dateRange[0].startDate.getDate()
      ).padStart(2, '0')}`;
      setStartDateInput(formatted);
    } else {
      setStartDateInput('');
    }
  }, [dateRange[0].startDate]);

  useEffect(() => {
    if (dateRange[0].endDate) {
      const formatted = `${dateRange[0].endDate.getFullYear()}/${String(dateRange[0].endDate.getMonth() + 1).padStart(2, '0')}/${String(
        dateRange[0].endDate.getDate()
      ).padStart(2, '0')}`;
      setEndDateInput(formatted);
    } else {
      setEndDateInput('');
    }
  }, [dateRange[0].endDate]);

  const handleCalendarClick = (event: React.MouseEvent<HTMLElement>) => {
    if (disabled) {
      return;
    }
    setAnchorEl(event.currentTarget);
  };

  const handleCalendarClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const formatDate = (date: Date | null) => {
    if (!date) {
      return '';
    }
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  const dateFieldStyle = {
    width: '180px',
    '& .MuiInput-root': {
      fontSize: '0.75rem',
      cursor: 'pointer',
      '&:before': {
        borderBottom: '1px solid #1976d2',
      },
      '&:hover:not(.Mui-disabled):before': {
        borderBottom: '1px solid #1976d2',
      },
      '&:after': {
        borderBottom: '2px solid #1976d2',
      },
    },
    '& .MuiInput-input': {
      padding: '4px 0',
      fontWeight: 500,
      fontSize: '0.75rem',
      color: '#1976d2',
      cursor: 'pointer',
      textAlign: 'center',
    },
  };

  return (
    <>
      <TextField
        variant="standard"
        value={
          dateRange[0].startDate && dateRange[0].endDate
            ? `${formatDate(dateRange[0].startDate)} ~ ${formatDate(dateRange[0].endDate)}`
            : ''
        }
        placeholder={disabled ? '환자 입력 후 이용 가능' : '차트 검색 기간 선택'}
        sx={dateFieldStyle}
        onClick={handleCalendarClick}
        disabled={disabled}
        InputProps={{
          readOnly: true,
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                size="small"
                edge="end"
                sx={{ color: '#1976d2', padding: '2px' }}
                disabled={disabled}
                onClick={e => {
                  e.stopPropagation();
                  onSearch();
                }}
              >
                <FontAwesomeIcon icon={['fas', 'search']} style={{ fontSize: '1rem' }} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleCalendarClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            '& .rdrDefinedRangesWrapper': {
              display: 'none',
            },
            '& .rdrDateDisplayWrapper': {
              display: 'none',
            },
          }}
        >
          <Box sx={{ p: 2, borderRight: '1px solid #e0e0e0', display: 'flex', flexDirection: 'column', gap: 1.5, minWidth: '160px' }}>
            <Box>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#546e7a', mb: 0.5 }}>직접 입력</Typography>
              <TextField
                type="text"
                size="small"
                placeholder="yyyy/mm/dd"
                value={startDateInput}
                onChange={e => {
                  setStartDateInput(e.target.value);
                }}
                onBlur={e => {
                  const value = e.target.value;
                  // yyyy/mm/dd 형식으로 파싱
                  const match = value.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/);
                  if (match) {
                    const [, year, month, day] = match;
                    const newStartDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                    if (!isNaN(newStartDate.getTime())) {
                      onDateRangeChange([{ startDate: newStartDate, endDate: dateRange[0].endDate, key: 'selection' }]);
                    }
                  } else if (value === '') {
                    onDateRangeChange([{ startDate: null, endDate: dateRange[0].endDate, key: 'selection' }]);
                  }
                }}
                sx={{
                  width: '100%',
                  mb: 1,
                  '& .MuiInputBase-input': { fontSize: '0.75rem', py: 0.5 },
                }}
              />
              <TextField
                type="text"
                size="small"
                placeholder="yyyy/mm/dd"
                value={endDateInput}
                onChange={e => {
                  setEndDateInput(e.target.value);
                }}
                onBlur={e => {
                  const value = e.target.value;
                  // yyyy/mm/dd 형식으로 파싱
                  const match = value.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/);
                  if (match) {
                    const [, year, month, day] = match;
                    const newEndDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                    if (!isNaN(newEndDate.getTime())) {
                      onDateRangeChange([{ startDate: dateRange[0].startDate, endDate: newEndDate, key: 'selection' }]);
                    }
                  } else if (value === '') {
                    onDateRangeChange([{ startDate: dateRange[0].startDate, endDate: null, key: 'selection' }]);
                  }
                }}
                sx={{
                  width: '100%',
                  '& .MuiInputBase-input': { fontSize: '0.75rem', py: 0.5 },
                }}
              />
            </Box>
            <Box sx={{ borderTop: '1px solid #e0e0e0', pt: 1 }}>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#546e7a', mb: 0.5 }}>빠른 선택</Typography>
            </Box>
            <Box
              sx={{
                px: 1.5,
                py: 0.8,
                fontSize: '0.75rem',
                borderRadius: '4px',
                cursor: 'pointer',
                '&:hover': { bgcolor: '#f5f5f5' },
              }}
              onClick={() => {
                const today = new Date();
                onDateRangeChange([{ startDate: today, endDate: today, key: 'selection' }]);
              }}
            >
              오늘
            </Box>
            <Box
              sx={{
                px: 1.5,
                py: 0.8,
                fontSize: '0.75rem',
                borderRadius: '4px',
                cursor: 'pointer',
                '&:hover': { bgcolor: '#f5f5f5' },
              }}
              onClick={() => {
                const today = new Date();
                const weekAgo = new Date(today);
                weekAgo.setDate(today.getDate() - 7);
                onDateRangeChange([{ startDate: weekAgo, endDate: today, key: 'selection' }]);
              }}
            >
              최근 1주일
            </Box>
            <Box
              sx={{
                px: 1.5,
                py: 0.8,
                fontSize: '0.75rem',
                borderRadius: '4px',
                cursor: 'pointer',
                '&:hover': { bgcolor: '#f5f5f5' },
              }}
              onClick={() => {
                const today = new Date();
                const monthAgo = new Date(today);
                monthAgo.setMonth(today.getMonth() - 1);
                onDateRangeChange([{ startDate: monthAgo, endDate: today, key: 'selection' }]);
              }}
            >
              최근 1개월
            </Box>
            <Box
              sx={{
                px: 1.5,
                py: 0.8,
                fontSize: '0.75rem',
                borderRadius: '4px',
                cursor: 'pointer',
                '&:hover': { bgcolor: '#f5f5f5' },
              }}
              onClick={() => {
                const today = new Date();
                const threeMonthsAgo = new Date(today);
                threeMonthsAgo.setMonth(today.getMonth() - 3);
                onDateRangeChange([{ startDate: threeMonthsAgo, endDate: today, key: 'selection' }]);
              }}
            >
              최근 3개월
            </Box>
            <Box
              sx={{
                px: 1.5,
                py: 0.8,
                fontSize: '0.75rem',
                borderRadius: '4px',
                cursor: 'pointer',
                '&:hover': { bgcolor: '#f5f5f5' },
              }}
              onClick={() => {
                const today = new Date();
                const sixMonthsAgo = new Date(today);
                sixMonthsAgo.setMonth(today.getMonth() - 6);
                onDateRangeChange([{ startDate: sixMonthsAgo, endDate: today, key: 'selection' }]);
              }}
            >
              최근 6개월
            </Box>
            <Box
              sx={{
                px: 1.5,
                py: 0.8,
                fontSize: '0.75rem',
                borderRadius: '4px',
                cursor: 'pointer',
                '&:hover': { bgcolor: '#f5f5f5' },
              }}
              onClick={() => {
                const today = new Date();
                const oneYearAgo = new Date(today);
                oneYearAgo.setFullYear(today.getFullYear() - 1);
                onDateRangeChange([{ startDate: oneYearAgo, endDate: today, key: 'selection' }]);
              }}
            >
              최근 1년
            </Box>
            <Box
              sx={{
                px: 1.5,
                py: 0.8,
                fontSize: '0.75rem',
                borderRadius: '4px',
                cursor: 'pointer',
                '&:hover': { bgcolor: '#f5f5f5' },
              }}
              onClick={() => {
                const today = new Date();
                const threeYearsAgo = new Date(today);
                threeYearsAgo.setFullYear(today.getFullYear() - 3);
                onDateRangeChange([{ startDate: threeYearsAgo, endDate: today, key: 'selection' }]);
              }}
            >
              최근 3년
            </Box>
          </Box>
          <DateRangePicker
            ranges={dateRange}
            onChange={(item: any) => onDateRangeChange([item.selection])}
            locale={ko}
            months={2}
            direction="horizontal"
            showMonthAndYearPickers={false}
            staticRanges={[]}
            inputRanges={[]}
          />
        </Box>
      </Popover>
    </>
  );
};

interface ChartListProps {
  onSelectionChange?: (chartNos: number[]) => void;
  selectedChartNos?: number[];
}

const ChartList: React.FC<ChartListProps> = ({ onSelectionChange, selectedChartNos = [] }) => {
  const { charts, loading, patient } = useAppSelector(state => state.emrContent);
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

  // 필터링된 차트 목록
  const filteredCharts = charts.filter(chart => {
    if (!patient?.ptNo || chart.ptNo !== patient.ptNo) {
      return false;
    }
    // 유형 필터
    if (typeFilter !== '전체' && chart.visitType !== typeFilter) {
      return false;
    }
    // 추가 필터링 로직 (수진과/작성과는 현재 데이터에 없으므로 나중에 추가)
    return true;
  });

  const isSelected = (chartNo?: number) => (chartNo ? selectedChartNos.includes(chartNo) : false);

  const updateSelection = (nextSelected: number[]) => {
    onSelectionChange?.(nextSelected);
  };

  const handleRowClick = (chartNo?: number) => {
    if (!chartNo) {
      return;
    }
    const alreadySelected = selectedChartNos.includes(chartNo);
    const nextSelected = alreadySelected ? selectedChartNos.filter(no => no !== chartNo) : [...selectedChartNos, chartNo];
    updateSelection(nextSelected);
  };

  const chartNosInView = filteredCharts.map(chart => chart.chartNo).filter((chartNo): chartNo is number => Boolean(chartNo));

  const handleToggleAll = () => {
    const chartNos = chartNosInView;
    if (chartNos.length === 0) {
      updateSelection([]);
      return;
    }
    const nextSelected = chartNos.every(chartNo => selectedChartNos.includes(chartNo)) ? [] : chartNos;
    updateSelection(nextSelected);
  };

  const selectedInView = chartNosInView.filter(chartNo => selectedChartNos.includes(chartNo));
  const isAllSelected = selectedInView.length > 0 && selectedInView.length === chartNosInView.length;
  const isSomeSelected = selectedInView.length > 0 && selectedInView.length < filteredCharts.length;

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
      {!loading && charts.length > 0 && (
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
              <ToggleButton value="외래" sx={toggleButtonStyle}>
                외래
              </ToggleButton>
              <ToggleButton value="입원" sx={toggleButtonStyle}>
                입원
              </ToggleButton>
              <ToggleButton value="응급" sx={toggleButtonStyle}>
                응급
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>
      )}

      {/* 테이블 영역 */}
      {loading ? (
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
                <TableCell sx={{ bgcolor: '#f8f9fa', py: 0.6, width: '36px' }}>
                  <Checkbox
                    size="small"
                    checked={isAllSelected}
                    indeterminate={isSomeSelected}
                    onChange={handleToggleAll}
                    inputProps={{ 'aria-label': '기록 전체 선택' }}
                  />
                </TableCell>
                <TableCell
                  sx={{ bgcolor: '#f8f9fa', fontWeight: 600, color: '#37474f', py: 0.6, fontSize: '0.7rem', whiteSpace: 'nowrap' }}
                >
                  날짜
                </TableCell>
                <TableCell
                  sx={{ bgcolor: '#f8f9fa', fontWeight: 600, color: '#37474f', py: 0.6, fontSize: '0.7rem', whiteSpace: 'nowrap' }}
                >
                  시간
                </TableCell>
                <TableCell
                  sx={{ bgcolor: '#f8f9fa', fontWeight: 600, color: '#37474f', py: 0.6, fontSize: '0.7rem', whiteSpace: 'nowrap' }}
                >
                  유형
                </TableCell>
                <TableCell
                  sx={{ bgcolor: '#f8f9fa', fontWeight: 600, color: '#37474f', py: 0.6, fontSize: '0.7rem', whiteSpace: 'nowrap' }}
                >
                  진료과
                </TableCell>
                <TableCell
                  sx={{ bgcolor: '#f8f9fa', fontWeight: 600, color: '#37474f', py: 0.6, fontSize: '0.7rem', whiteSpace: 'nowrap' }}
                >
                  담당의
                </TableCell>
                <TableCell
                  sx={{ bgcolor: '#f8f9fa', fontWeight: 600, color: '#37474f', py: 0.6, fontSize: '0.7rem', whiteSpace: 'nowrap' }}
                >
                  내용
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
                      bgcolor: isSelected(chart.chartNo) ? '#e3f2fd' : 'transparent',
                      '&:hover': { bgcolor: isSelected(chart.chartNo) ? '#e3f2fd' : '#f5f5f5' },
                    }}
                    onClick={() => {
                      handleRowClick(chart.chartNo);
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        size="small"
                        checked={isSelected(chart.chartNo)}
                        onClick={event => event.stopPropagation()}
                        onChange={() => handleRowClick(chart.chartNo)}
                        inputProps={{ 'aria-label': `기록 선택 ${chart.chartNo ?? ''}` }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 0.8 }}>{chart.chartDate}</TableCell>
                    <TableCell sx={{ py: 0.8 }}>{chart.chartTime}</TableCell>
                    <TableCell sx={{ py: 0.8 }}>
                      <Chip
                        label={chart.visitType}
                        size="small"
                        sx={{
                          height: '20px',
                          fontSize: '0.7rem',
                          bgcolor: chart.visitType === '외래' ? '#e3f2fd' : chart.visitType === '입원' ? '#fff3e0' : '#ffebee',
                          color: chart.visitType === '외래' ? '#1976d2' : chart.visitType === '입원' ? '#f57c00' : '#d32f2f',
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 0.8 }}>{chart.department}</TableCell>
                    <TableCell sx={{ py: 0.8 }}>{chart.doctorName}</TableCell>
                    <TableCell sx={{ py: 0.8 }}>{chart.content}</TableCell>
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
