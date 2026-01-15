import * as React from 'react';
import { Box, IconButton, Tooltip, Paper, Typography, Chip, Avatar } from '@mui/material';
import { IconLayoutSidebarLeftCollapse, IconLayoutSidebarLeftExpand } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { finderWidthCollapsed, finderWidthNarrow } from 'app/modules/emr-viewer/constant';
import { openDrawer } from 'app/modules/emr-viewer/emr-layout.reducer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ArticleHtmlList from './article-html-list';
import { sampleArticleHtml } from './sample-article-html';
import FinderToggleButton from './finder-toggle-button';

const sampleHtmlItems = [
  {
    id: 'sample-1',
    html: sampleArticleHtml,
    createdAt: '2024-01-12',
  },
  {
    id: 'sample-2',
    html: sampleArticleHtml,
    createdAt: '2024-01-13',
  },
  {
    id: 'sample-3',
    html: sampleArticleHtml,
    createdAt: '2024-01-13',
  },
];

const EmptyState: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
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

const EmrContent = () => {
  const htmlItems = useAppSelector(state => state.emrContent.items);
  const { drawerOpen } = useAppSelector(state => state.emrLayout);

  const displayItems = htmlItems.length ? htmlItems : sampleHtmlItems;
  const contentMaxWidth = drawerOpen ? '800px' : 'none';
  const contentAlign = drawerOpen ? 'center' : 'stretch';

  return (
    <Box display={'flex'} justifyContent={'center'}>
      <Box display={'flex'} width={'100%'} justifyContent={'space-between'}>
        {/* 사이드바 토글 버튼 */}
        <FinderToggleButton />

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
            alignItems: contentAlign,
            maxHeight: 'calc(100vh - 68px)',
            overflowY: 'auto',
          }}
        >
          {displayItems.length > 0 ? (
            <Box sx={{ width: '100%', maxWidth: contentMaxWidth }}>
              <ArticleHtmlList items={displayItems} emptyMessage="No articles available." />
            </Box>
          ) : (
            <EmptyState />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default EmrContent;
