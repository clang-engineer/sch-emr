import * as React from 'react';
import { Box, IconButton, Tooltip, Paper, Typography, Chip, Avatar } from '@mui/material';
import { IconLayoutSidebarLeftCollapse, IconLayoutSidebarLeftExpand } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { finderWidthNarrow, finderWidthWide } from 'app/modules/emr-viewer/constant';
import { openDrawer, setFinderWidth, setViewMode } from 'app/modules/emr-viewer/emr-layout.reducer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// 환자 기록 카드 컴포넌트
interface RecordCardProps {
  record?: {
    id: string;
    patientName: string;
    patientId: string;
    recordType: string;
    recordDate: string;
    department: string;
    doctor: string;
    status?: string;
  };
}

const RecordCard: React.FC<RecordCardProps> = ({ record }) => {
  if (!record) return null;

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed':
        return '#4caf50';
      case 'pending':
        return '#ff9800';
      case 'review':
        return '#2196f3';
      default:
        return '#9e9e9e';
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'completed':
        return '완료';
      case 'pending':
        return '대기';
      case 'review':
        return '검토중';
      default:
        return '미확인';
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        overflow: 'hidden',
        transition: 'all 0.2s',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          borderColor: '#1976d2',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        {/* 헤더 영역 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ width: 40, height: 40, bgcolor: '#1976d2', fontSize: '0.9rem' }}>{record.patientName.charAt(0)}</Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, color: '#37474f', lineHeight: 1.3 }}>
                {record.patientName}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.75rem', color: '#78909c' }}>
                {record.patientId}
              </Typography>
            </Box>
          </Box>
          {record.status && (
            <Chip
              label={getStatusLabel(record.status)}
              size="small"
              sx={{
                bgcolor: getStatusColor(record.status),
                color: '#fff',
                fontWeight: 600,
                fontSize: '0.7rem',
                height: '22px',
              }}
            />
          )}
        </Box>

        {/* 구분선 */}
        <Box sx={{ height: '1px', bgcolor: '#f0f0f0', my: 1.5 }} />

        {/* 정보 영역 */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FontAwesomeIcon icon={['fas', 'file-medical']} style={{ fontSize: '0.85rem', color: '#0288d1', width: '16px' }} />
            <Typography variant="body2" sx={{ fontSize: '0.85rem', color: '#546e7a', fontWeight: 500 }}>
              {record.recordType}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FontAwesomeIcon icon={['fas', 'calendar-alt']} style={{ fontSize: '0.85rem', color: '#0288d1', width: '16px' }} />
            <Typography variant="body2" sx={{ fontSize: '0.85rem', color: '#546e7a' }}>
              {record.recordDate}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FontAwesomeIcon icon={['fas', 'hospital']} style={{ fontSize: '0.85rem', color: '#0288d1', width: '16px' }} />
            <Typography variant="body2" sx={{ fontSize: '0.85rem', color: '#546e7a' }}>
              {record.department}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FontAwesomeIcon icon={['fas', 'user-md']} style={{ fontSize: '0.85rem', color: '#0288d1', width: '16px' }} />
            <Typography variant="body2" sx={{ fontSize: '0.85rem', color: '#546e7a' }}>
              {record.doctor}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

// 빈 상태 컴포넌트
const EmptyState: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        color: '#90a4ae',
      }}
    >
      <FontAwesomeIcon icon={['fas', 'folder-open']} style={{ fontSize: '4rem', color: '#cfd8dc', marginBottom: '16px' }} />
      <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 500, color: '#78909c', mb: 0.5 }}>
        조회된 기록이 없습니다
      </Typography>
      <Typography variant="body2" sx={{ fontSize: '0.9rem', color: '#90a4ae' }}>
        좌측 검색 조건을 선택하여 환자 기록을 조회하세요
      </Typography>
    </Box>
  );
};

const RecordViewer = () => {
  const dispatch = useAppDispatch();

  const { drawerOpen } = useAppSelector(state => state.emrLayout);
  const { viewMode, finderWidth } = useAppSelector(state => state.emrLayout);

  // 임시 데이터 (나중에 실제 데이터로 교체)
  const [records, setRecords] = React.useState<RecordCardProps['record'][]>([]);

  const getNarrowTooltip = () => {
    if (finderWidth !== finderWidthNarrow) return '기록지 목록 조회 화면을 좁게 표시합니다.';
    if (finderWidth === finderWidthNarrow && drawerOpen) return '기록지 목록 조회 화면을 숨깁니다.';
    return '기록지 목록 조회 화면을 더 이상 좁게 표시할 수 없습니다.';
  };

  const getWideTooltip = () => {
    if (finderWidth === finderWidthNarrow && !drawerOpen) return '기록지 목록 조회 화면을 표시합니다.';
    if (finderWidth === finderWidthNarrow && drawerOpen) return '기록지 목록 조회 화면을 넓게 표시합니다.';
    return '기록지 목록 조회 화면을 더 이상 넓게 표시할 수 없습니다.';
  };

  const resizeToNarrow = () => {
    if (finderWidth === finderWidthWide) setFinderWidth(finderWidthNarrow);
    if (finderWidth === finderWidthNarrow && drawerOpen) dispatch(openDrawer(false));
    setViewMode('double');
  };

  const resizeToWide = () => {
    if (finderWidth === finderWidthNarrow && !drawerOpen) {
      dispatch(openDrawer(true));
    }

    if (finderWidth === finderWidthNarrow && drawerOpen) {
      setFinderWidth(finderWidthWide);
    }

    setViewMode('single');
  };

  const changeViewMode = (mode: string) => {
    dispatch(openDrawer(mode === 'single'));
    setViewMode(mode);
  };

  return (
    <Box display={'flex'} justifyContent={'center'}>
      <Box display={'flex'} width={'100%'} justifyContent={'space-between'}>
        {/* 사이드바 토글 버튼 */}
        <Box
          position={'fixed'}
          top={68}
          left={drawerOpen ? finderWidth + 68 : 68}
          display={'flex'}
          flexDirection={'column'}
          sx={{ zIndex: 10 }}
        >
          <Tooltip title={getNarrowTooltip()} placement={'right'}>
            <span>
              <IconButton onClick={resizeToNarrow} disabled={!drawerOpen}>
                <IconLayoutSidebarLeftCollapse />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title={getWideTooltip()} placement={'right'}>
            <span>
              <IconButton onClick={resizeToWide} disabled={finderWidth === finderWidthWide}>
                <IconLayoutSidebarLeftExpand />
              </IconButton>
            </span>
          </Tooltip>
        </Box>

        {/* 메인 콘텐츠 영역 */}
        <Box
          sx={{
            ml: viewMode === 'single' ? 0 : '-4px',
            width: `100%`,
            padding: `20px 28px`,
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 2,
            flexDirection: viewMode === 'single' ? 'column' : 'row',
            alignItems: viewMode === 'single' ? 'center' : 'stretch',
            maxHeight: 'calc(100vh - 68px)',
            overflowY: 'auto',
          }}
        >
          {records.length === 0 ? (
            <EmptyState />
          ) : (
            records.map(record => (
              <Box
                key={record.id}
                sx={{
                  width: viewMode === 'single' ? '100%' : 'calc(50% - 8px)',
                  maxWidth: viewMode === 'single' ? '800px' : 'none',
                }}
              >
                <RecordCard record={record} />
              </Box>
            ))
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default RecordViewer;
