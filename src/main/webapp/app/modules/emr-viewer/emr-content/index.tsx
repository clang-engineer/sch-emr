import { Box } from '@mui/material';
import { useAppSelector } from 'app/config/store';
import * as React from 'react';
import ArticleHtmlList from './article-html-list';
import EmrContentEmptyState from './emr-content-empty-state';
import FinderToggleButton from './finder-toggle-button';
import { sampleArticleHtml } from './sample-article-html';

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
            <EmrContentEmptyState />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default EmrContent;
