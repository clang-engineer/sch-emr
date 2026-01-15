import * as React from 'react';
import { Box, IconButton, Tooltip, Paper, Typography, Chip, Avatar } from '@mui/material';
import { IconLayoutSidebarLeftCollapse, IconLayoutSidebarLeftExpand } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { finderWidthCollapsed, finderWidthNarrow } from 'app/modules/emr-viewer/constant';
import { openDrawer } from 'app/modules/emr-viewer/emr-layout.reducer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ArticleHtmlList from './article-html-list';

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
  const finderWidth = drawerOpen ? finderWidthNarrow : finderWidthCollapsed;
  const htmlItems = useAppSelector(state => state.emrContent.items);

  const isCollapsed = !drawerOpen;

  const toggleSidebar = () => {
    dispatch(openDrawer(isCollapsed));
  };

  return (
    <Box display={'flex'} justifyContent={'center'}>
      <Box display={'flex'} width={'100%'} justifyContent={'space-between'}>
        {/* 사이드바 토글 버튼 */}
        <Box position={'fixed'} top={68} left={finderWidth + 68} display={'flex'} flexDirection={'column'} sx={{ zIndex: 10 }}>
          <Tooltip title={isCollapsed ? '기록지 목록 조회 화면을 펼칩니다.' : '기록지 목록 조회 화면을 접습니다.'} placement={'right'}>
            <IconButton onClick={toggleSidebar}>
              {isCollapsed ? <IconLayoutSidebarLeftExpand /> : <IconLayoutSidebarLeftCollapse />}
            </IconButton>
          </Tooltip>
        </Box>

        {/* 메인 콘텐츠 영역 */}
        <Box
          sx={{
            ml: 0,
            width: `100%`,
            padding: `20px 28px`,
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 2,
            flexDirection: 'column',
            alignItems: 'center',
            maxHeight: 'calc(100vh - 68px)',
            overflowY: 'auto',
          }}
        >
          {htmlItems.length > 0 ? (
            <Box sx={{ width: '100%', maxWidth: '800px' }}>
              <ArticleHtmlList items={htmlItems} emptyMessage="표시할 기사가 없습니다." />
            </Box>
          ) : (
            <EmptyState />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default RecordViewer;
