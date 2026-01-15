import { Box, Grid, Paper } from '@mui/material';
import { useAppSelector } from 'app/config/store';
import * as React from 'react';
import EmrContentEmptyState from './emr-content-empty-state';
import EmrViewModeDial from './emr-view-mode-dail';
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
  const { drawerOpen, viewMode } = useAppSelector(state => state.emrLayout);

  const displayItems = htmlItems.length ? htmlItems : sampleHtmlItems;
  const gridSize = viewMode === 4 ? 3 : viewMode === 2 ? 6 : 12;

  return (
    <Box display={'flex'} justifyContent={'center'}>
      {/* 사이드바 토글 버튼 */}
      <FinderToggleButton />

      {/* 메인 콘텐츠 영역 */}
      <Grid
        key={viewMode}
        container
        spacing={2}
        p={5}
        justifyContent={'center'}
        flexDirection={'row'}
        sx={{
          animation: 'emrViewFadeIn 180ms ease-out',
          '@keyframes emrViewFadeIn': {
            from: { opacity: 0, transform: 'translateY(6px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
          },
        }}
      >
        {displayItems.length > 0 ? (
          displayItems.map((item, index) => (
            <Grid
              key={item.id}
              size={gridSize}
              sx={{
                maxWidth: viewMode === 1 ? (drawerOpen ? '100%' : '60vw') : '100%',
                transition: 'flex-basis 220ms ease, max-width 220ms ease, width 220ms ease',
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  border: '1px solid #e0e0e0',
                  borderRadius: 2,
                  animation: 'emrCardIn 220ms ease-out both',
                  animationDelay: `${index * 30}ms`,
                  '@keyframes emrCardIn': {
                    from: { opacity: 0, transform: 'translateY(6px)' },
                    to: { opacity: 1, transform: 'translateY(0)' },
                  },
                }}
                dangerouslySetInnerHTML={{ __html: item.html }}
              />
            </Grid>
          ))
        ) : (
          <Grid size={12}>
            <EmrContentEmptyState />
          </Grid>
        )}
      </Grid>
      <EmrViewModeDial />
    </Box>
  );
};

export default EmrContent;
